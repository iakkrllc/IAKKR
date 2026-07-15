import { createClient } from "@supabase/supabase-js";

/**
 * Server-only client using the secret key — bypasses RLS entirely.
 * Never import this from a client component; every table has RLS enabled
 * with no client-facing policies, so all reads/writes go through Next.js
 * API routes using this client.
 */
export function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const secretKey = process.env.SUPABASE_SECRET_KEY!;
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false },
  });
}
