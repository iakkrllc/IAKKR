import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

/** Browser client — uses the publishable key, safe to expose to the client. */
export const supabase = createClient(supabaseUrl, publishableKey, {
  auth: { persistSession: true },
});
