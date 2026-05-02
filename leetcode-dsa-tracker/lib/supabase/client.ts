import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browserClient: SupabaseClient | null = null;

/** Supabase dashboard may show “anon” / legacy JWT key or the newer publishable key — both work with the JS client. */
function getSupabasePublicKey(): string | undefined {
  return (
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY
  );
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.SUPABASE_URL && getSupabasePublicKey(),
  );
}

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  const key = getSupabasePublicKey()!;
  if (!browserClient) {
    browserClient = createClient(process.env.SUPABASE_URL!, key);
  }
  return browserClient;
}
