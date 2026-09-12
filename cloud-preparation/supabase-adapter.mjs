/** Supabase snapshot adapter for the existing V54 account boundary.
 * Store, restoreApply and the local vault stay owned by app/js/v54.js.
 */
function fail(code, cause) { return Object.assign(new Error(code), {error:code,cause}); }
function codeOf(error) {
  const raw=String(`${error?.code||''} ${error?.message||error||''}`).trim();
  if (/already.*registered|already.*exist|user.*already/i.test(raw)) return 'email_already_registered';
  if (/invalid.*login|invalid.*credential|user.*exist/i.test(raw)) return 'bad_password';
  if (/password.*short|weak.*password/i.test(raw)) return 'weak_password';
  if (/invalid_snapshot/i.test(raw)) return 'invalid_snapshot';
  if (/invalid_profile/i.test(raw)) return 'invalid_profile';
  if (/credentials_not_allowed/i.test(raw)) return 'credentials_not_allowed';
  if (/email_mismatch/i.test(raw)) return 'email_mismatch';
  if (/email_confirmation_required/i.test(raw)) return 'email_confirmation_required';
  if (/expected_version_required/i.test(raw)) return 'expected_version_required';
  if (/version_conflict|40001/i.test(raw)) return 'version_conflict';
  if (/email/i.test(raw) && /invalid/i.test(raw)) return 'bad_email';
  if (/jwt|session|unauthorized|not authenticated/i.test(raw)) return 'unauthorized';
  if (/fetch|network|load failed|upstream request timeout/i.test(raw)) return 'network';
  return String(error?.message||error?.code||error||'cloud_error');
}
function unwrap(result) {
  if (result?.error) throw fail(codeOf(result.error),result.error);
  return result?.data;
}
export function readCloudConfig(env={}) {
  if (env.VITE_TT_SUPABASE_ENABLED!=='true') return {enabled:false};
  let url;
  try { url=new URL(env.VITE_SUPABASE_URL||''); } catch { throw fail('invalid_public_configuration'); }
  const key=env.VITE_SUPABASE_PUBLISHABLE_KEY||'';
  if (url.protocol!=='https:'||url.username||url.password||url.search||url.hash||
      !key.startsWith('sb_publishable_')) throw fail('invalid_public_configuration');
  if (env.V54_CLOUD_BASE_URL) throw fail('ambiguous_cloud_provider');
  return {enabled:true,url:url.origin,key};
}
export function prepareCloudAdapter({env={},createClient,localAdapter=null}) {
  const config=readCloudConfig(env);
  if (!config.enabled) return {mode:'local',adapter:localAdapter};
  if (typeof createClient!=='function') throw fail('supabase_sdk_not_installed');
  const client=createClient(config.url,config.key,{auth:{
    persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,
    storageKey:'turatars_supabase_auth_v1'
  }});
  const authResult=data=>{
    const user=data?.user||{};
    const out=data?.session?{
      token:data.session.access_token,uid:user.id,email:user.email,
      expiresAt:data.session.expires_at,pending:false,provider:'supabase-snapshot'
    }:{pending:true,token:null,uid:user.id||null,email:user.email||null,
      provider:'supabase-snapshot'};
    if(user.user_metadata?.name) out.name=user.user_metadata.name;
    return out;
  };
  async function session() {
    const data=unwrap(await client.auth.getSession());
    if (!data?.session) throw fail('unauthorized');
    return data.session;
  }
  async function user() {
    const current=await session();
    const data=unwrap(await client.auth.getUser(current.access_token));
    if (!data?.user) throw fail('unauthorized');
    return {user:data.user,session:current};
  }
  const adapter={
    name:'supabase-snapshot',baseUrl:config.url,
    async signup(email,password,name) {
      const existing=await client.auth.signInWithPassword({email,password});
      if (!existing.error) return {...authResult(existing.data),reused:true};
      if (!/invalid.*login|invalid.*credential/i.test(String(existing.error.code||existing.error.message)))
        throw fail(codeOf(existing.error),existing.error);
      const created=unwrap(await client.auth.signUp({email,password,options:{data:{name}}}));
      if (!created?.session && Array.isArray(created?.user?.identities) && !created.user.identities.length)
        throw fail('email_already_registered');
      return authResult(created);
    },
    async login(email,password) {
      return authResult(unwrap(await client.auth.signInWithPassword({email,password})));
    },
    async refresh() { return authResult(unwrap(await client.auth.refreshSession())); },
    async whoami() {
      const current=await user();
      return {uid:current.user.id,email:current.user.email,name:current.user.user_metadata?.name,
        token:current.session.access_token,provider:'supabase-snapshot'};
    },
    async profile() {
      const current=await user();
      const result=await client.from('tt_profiles').select('*').eq('user_id',current.user.id).maybeSingle();
      if (result.error) throw fail(codeOf(result.error),result.error);
      return result.data||null;
    },
    async saveProfile(profile) {
      await user();
      return unwrap(await client.rpc('tt_profile_upsert',{p_profile:profile}));
    },
    async communityList() {
      return unwrap(await client.rpc('tt_community_tours_list')) || [];
    },
    async communityUpsert(tour) {
      await user();
      return unwrap(await client.rpc('tt_community_tour_upsert',{p_tour:tour}));
    },
    async communitySetVisibility(id, visibility, gpxPublic) {
      await user();
      return unwrap(await client.rpc('tt_community_tour_set_visibility',{
        p_tour_id:id,p_visibility:visibility,p_gpx_public:!!gpxPublic
      }));
    },
    async communityReview(id, rating, note) {
      await user();
      return unwrap(await client.rpc('tt_community_review_upsert',{
        p_tour_id:id,p_rating:rating,p_note:note||null
      }));
    },
    async communityFavorite(id) {
      await user();
      return unwrap(await client.rpc('tt_community_favorite_toggle',{p_tour_id:id}));
    },
    async communityReport(id, reason, details) {
      await user();
      return unwrap(await client.rpc('tt_community_report',{
        p_tour_id:id,p_reason:reason,p_details:details||null
      }));
    },
    async load() { await user();return unwrap(await client.rpc('tt_v54_load')); },
    async save(_token,snapshot,expectedVersion) {
      await user();
      if (!Number.isSafeInteger(expectedVersion)||expectedVersion<0) throw fail('expected_version_required');
      return unwrap(await client.rpc('tt_v54_save',{
        p_snapshot:snapshot,p_expected_version:expectedVersion
      }));
    },
    async logout() { unwrap(await client.auth.signOut({scope:'local'}));return true; }
  };
  return {mode:'supabase',adapter,client};
}
