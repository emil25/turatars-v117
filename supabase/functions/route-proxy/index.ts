/* V127 routing proxy.
 * The browser never sees ORS_API_KEY. This function accepts only validated
 * coordinates/search text and calls the current HeiGIT ORS v2 endpoint.
 */
const ORS_BASE = "https://api.heigit.org/openrouteservice/v2";
const PELIAS_BASE = "https://api.heigit.org/pelias/v1";
const rateWindow = new Map<string, { started: number; count: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json; charset=utf-8",
  };
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: corsHeaders() });
}

function fail(code: string, message: string, status: number) {
  return json({ error: code, message }, status);
}

function number(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function point(value: unknown) {
  if (!value || typeof value !== "object") return null;
  const candidate = value as { lat?: unknown; lng?: unknown; lon?: unknown };
  const lat = number(candidate.lat);
  const lng = number(candidate.lng ?? candidate.lon);
  if (lat === null || lng === null || lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return { lat, lng };
}

function clientId(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

function allowed(request: Request) {
  const now = Date.now();
  const id = clientId(request);
  const current = rateWindow.get(id);
  if (!current || now - current.started >= WINDOW_MS) {
    rateWindow.set(id, { started: now, count: 1 });
    return true;
  }
  current.count += 1;
  return current.count <= MAX_REQUESTS;
}

function profileFor(value: unknown) {
  return value === "walking" ? "foot-walking" : value === "hiking" ? "foot-hiking" : null;
}

async function provider(request: Request, path: string, body?: unknown) {
  const apiKey = Deno.env.get("ORS_API_KEY") || "";
  if (!apiKey) return fail("routing_not_configured", "Az útvonaltervező szerveroldali kulcsa még nincs beállítva.", 503);
  const response = await fetch(`${ORS_BASE}/${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: { Authorization: apiKey, Accept: "application/geo+json, application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed: unknown = null;
  try { parsed = text ? JSON.parse(text) : null; } catch { parsed = null; }
  if (!response.ok) {
    const upstream = (parsed && typeof parsed === "object" && "error" in parsed) ? String((parsed as { error?: unknown }).error || "") : "";
    const code = response.status === 429 ? "routing_rate_limited" : response.status >= 500 ? "routing_provider_unavailable" : "routing_invalid_request";
    return fail(code, `Az útvonaltervező szolgáltató hibát adott (${response.status}${upstream ? `: ${upstream}` : ""}).`, response.status === 429 ? 429 : 502);
  }
  return json(parsed, 200);
}

async function search(query: string, request: Request) {
  const apiKey = Deno.env.get("ORS_API_KEY") || "";
  if (!apiKey) return fail("routing_not_configured", "A helykeresés szerveroldali kulcsa még nincs beállítva.", 503);
  /* Pelias defaults to global text search.  Without a country boundary a
   * Hungarian name such as “Gyimes” commonly resolves to a Hungarian street.
   * Keep the aliases here as search hints only; all coordinates still come
   * from the real HeiGIT/Pelias response. */
  const aliases: Record<string, { display: string; searches: string[] }> = {
    gyimes: { display: "Gyimes", searches: ["Ghimeș-Făget", "Ghimeș"] },
    gyimesbukk: { display: "Gyimesbükk", searches: ["Ghimeș-Făget", "Ghimeș"] },
    gyimeskozeplok: { display: "Gyimesközéplok", searches: ["Lunca de Jos", "Gyimesközéplok"] },
    csikszereda: { display: "Csíkszereda", searches: ["Miercurea Ciuc", "Csíkszereda"] },
    hargitafurdo: { display: "Hargitafürdő", searches: ["Harghita-Băi", "Băile Harghita"] },
    "szent anna to": { display: "Szent Anna-tó", searches: ["Lacul Sfânta Ana", "Sfânta Ana"] },
    "gyilkos to": { display: "Gyilkos-tó", searches: ["Lacul Roșu", "Lacul Ghilcoș"] },
  };
  const normalize = (value: string) => value.toLocaleLowerCase("hu").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[–—-]/g, " ")
    .replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
  const normalizedQuery = normalize(query);
  const alias = Object.entries(aliases).find(([key]) => normalizedQuery === key || normalizedQuery.startsWith(`${key} `))?.[1];
  const texts = [query, ...(alias?.searches || [])].filter((text, index, arr) => arr.indexOf(text) === index).slice(0, 3);
  type PeliasFeature = { properties?: Record<string, unknown>; geometry?: { coordinates?: unknown } };
  type Candidate = { label: string; providerLabel: string; lat: number; lng: number; score: number; country: string; region: string };
  const all: Candidate[] = [];
  for (const text of texts) {
    const url = new URL(`${PELIAS_BASE}/search`);
    url.searchParams.set("text", text);
    url.searchParams.set("size", "10");
    url.searchParams.set("boundary.country", "ROU");
    url.searchParams.set("lang", "hu");
    const response = await fetch(url, { headers: { Authorization: apiKey, Accept: "application/json" } });
    const responseText = await response.text();
    let parsed: unknown = null;
    try { parsed = responseText ? JSON.parse(responseText) : null; } catch { parsed = null; }
    if (!response.ok) return fail(response.status === 429 ? "routing_rate_limited" : "routing_search_failed", `A helykeresés hibát adott (${response.status}).`, response.status === 429 ? 429 : 502);
    const features = Array.isArray((parsed as { features?: unknown[] } | null)?.features) ? (parsed as { features: unknown[] }).features : [];
    const queryNorm = normalize(text);
    for (const feature of features as PeliasFeature[]) {
      const props = feature.properties || {};
      const coords = Array.isArray(feature.geometry?.coordinates) ? feature.geometry.coordinates : [];
      const lng = number(coords[0]);
      const lat = number(coords[1]);
      if (lat === null || lng === null) continue;
      const providerLabel = String(props.label || props.name || "Helyszín");
      const country = String(props.country || props.country_a || props.country_code || "");
      const region = String(props.region || props.county || props.locality || "");
      const context = normalize(`${providerLabel} ${country} ${region}`);
      const isRomania = /romania|roman\u00eda|rou/.test(normalize(country) + " " + context);
      let score = Number(props.confidence || 0) * 10;
      score += isRomania ? 1000 : -1000;
      if (/harghita|hargita/.test(context)) score += 260;
      if (/covasna|kovaszna/.test(context)) score += 220;
      if (/mures|maros/.test(context)) score += 180;
      if (/bacau|erdely|transylvania/.test(context)) score += 120;
      if (context.includes(queryNorm)) score += 120;
      if (text !== query) score += 45;
      if (/utca|strada|street/.test(context)) score -= 160;
      const display = alias?.display && text !== query ? `${alias.display} · ${providerLabel}` : providerLabel;
      all.push({ label: display, providerLabel, lat, lng, score, country, region });
    }
  }
  const romanian = all.filter((item) => /romania|roman\u00eda|rou/.test(normalize(`${item.country} ${item.providerLabel} ${item.region}`)));
  const pool = romanian.length ? romanian : all;
  const dedup = new Map<string, Candidate>();
  for (const item of pool) {
    const key = `${item.lat.toFixed(5)}|${item.lng.toFixed(5)}`;
    const current = dedup.get(key);
    if (!current || item.score > current.score) dedup.set(key, item);
  }
  const results = [...dedup.values()].sort((a, b) => b.score - a.score).slice(0, 8)
    .map(({ label, lat, lng }) => ({ label, lat, lng }));
  return json({ results });
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") return new Response("ok", { headers: corsHeaders() });
  if (request.method !== "POST") return fail("method_not_allowed", "Csak POST kérés használható.", 405);
  if (!allowed(request)) return fail("routing_rate_limited", "Túl sok útvonaltervezési kérés érkezett. Próbáld újra később.", 429);
  let input: { action?: string; start?: unknown; end?: unknown; profile?: unknown; alternatives?: boolean; query?: string };
  try { input = await request.json(); } catch { return fail("invalid_json", "A kérés formátuma hibás.", 400); }
  if (input.action === "search") {
    const query = String(input.query || "").trim().slice(0, 120);
    if (query.length < 2) return fail("invalid_search", "Adj meg legalább két karaktert a helykereséshez.", 400);
    return search(query, request);
  }
  const start = point(input.start);
  const end = point(input.end);
  const profile = profileFor(input.profile);
  if (!start || !end) return fail("invalid_points", "A kezdő- és végpontnak érvényes koordinátának kell lennie.", 400);
  if (!profile) return fail("invalid_profile", "Csak gyalogos vagy terepi túra profil választható.", 400);
  if (start.lat === end.lat && start.lng === end.lng) return fail("same_points", "A kezdő- és végpont nem lehet azonos.", 400);
  return provider(request, `directions/${profile}/geojson`, {
    coordinates: [[start.lng, start.lat], [end.lng, end.lat]],
    elevation: true,
    instructions: false,
    geometry: true,
    ...(input.alternatives ? { alternative_routes: { target_count: 3, share_factor: 0.6, weight_factor: 1.4 } } : {}),
  });
});
