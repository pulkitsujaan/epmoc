import { createBrowserClient } from "@supabase/ssr";
import { Database } from "@/types/database";

// Typed client — use for reads (select queries)
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Untyped client — use for writes (insert / update / delete)
// This avoids the Supabase generic inference bug with Insert/Update types
export function createUntypedClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
