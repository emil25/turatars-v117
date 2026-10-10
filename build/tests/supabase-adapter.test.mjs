import test from "node:test";
import assert from "node:assert/strict";
import { prepareCloudAdapter, readCloudConfig } from "../../cloud-preparation/supabase-adapter.mjs";

test("missing Supabase config preserves local mode", () => {
  const local = { name: "local-vault" };
  const prepared = prepareCloudAdapter({ env: {}, localAdapter: local });
  assert.equal(prepared.mode, "local");
  assert.equal(prepared.adapter, local);
});

test("only an HTTPS URL and publishable key enable cloud mode", () => {
  assert.throws(() => readCloudConfig({
    VITE_TT_SUPABASE_ENABLED: "true",
    VITE_SUPABASE_URL: "http://example.test",
    VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
  }), /invalid_public_configuration/);
});

test("signup exposes email-confirmation pending without inventing a session", async () => {
  const auth = {
    signInWithPassword: async () => ({ error: { message: "Invalid login credentials" } }),
    signUp: async () => ({ data: { user: { id: "u1", email: "a@example.com", identities: [{}] }, session: null } })
  };
  const createClient = () => ({ auth, rpc: async () => ({ data: null, error: null }) });
  const { adapter } = prepareCloudAdapter({
    env: {
      VITE_TT_SUPABASE_ENABLED: "true",
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
    },
    createClient
  });
  const result = await adapter.signup("a@example.com", "password1", "A");
  assert.deepEqual(result, {
    pending: true, token: null, uid: "u1", email: "a@example.com", provider: "supabase-snapshot"
  });
});

test("signup reports an already registered email without creating a session", async () => {
  const auth = {
    signInWithPassword: async () => ({ error: { message: "Invalid login credentials" } }),
    signUp: async () => ({ data: { user: { id: "u1", email: "a@example.com", identities: [] }, session: null } })
  };
  const createClient = () => ({ auth, rpc: async () => ({ data: null, error: null }) });
  const { adapter } = prepareCloudAdapter({
    env: {
      VITE_TT_SUPABASE_ENABLED: "true",
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
    },
    createClient
  });
  await assert.rejects(() => adapter.signup("a@example.com", "password1", "A"), error => error.error === "email_already_registered");
});

test("profile load and save stay bound to the authenticated user", async () => {
  let savedArgs = null;
  const auth = {
    getSession: async () => ({ data: { session: { access_token: "token-a", expires_at: 123 } }, error: null }),
    getUser: async () => ({ data: { user: { id: "user-a", email: "a@example.com", user_metadata: { name: "A" } } }, error: null })
  };
  const createClient = () => ({
    auth,
    from: () => ({ select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: { user_id: "user-a", display_name: "A" }, error: null }) }) }) }),
    rpc: async (name, args) => { savedArgs = { name, args }; return { data: { user_id: "user-a", display_name: "A2" }, error: null }; }
  });
  const { adapter } = prepareCloudAdapter({
    env: {
      VITE_TT_SUPABASE_ENABLED: "true",
      VITE_SUPABASE_URL: "https://example.supabase.co",
      VITE_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
    },
    createClient
  });
  assert.deepEqual(await adapter.profile(), { user_id: "user-a", display_name: "A" });
  const result = await adapter.saveProfile({ display_name: "A2", city: "Gyergyó" });
  assert.deepEqual(result, { user_id: "user-a", display_name: "A2" });
  assert.equal(savedArgs.name, "tt_profile_upsert");
  assert.deepEqual(savedArgs.args, { p_profile: { display_name: "A2", city: "Gyergyó" } });
});
