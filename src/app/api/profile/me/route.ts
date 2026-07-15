import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-user";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { Role } from "@/lib/types";

/**
 * Returns the caller's own profile, creating it on first access if it
 * doesn't exist yet — this is the application-layer equivalent of a
 * post-signup trigger, but it never runs inside the signup transaction, so
 * a failure here can't break signup itself. name/role come from the
 * `options.data` metadata set at `supabase.auth.signUp()` time.
 */
export async function GET(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await admin
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (fetchError) {
    return NextResponse.json({ error: fetchError.message }, { status: 500 });
  }
  if (existing) {
    return NextResponse.json({ profile: existing });
  }

  const metadata = (user.user_metadata ?? {}) as { name?: string; role?: Role };
  const role: Role = metadata.role === "consultant" ? "consultant" : "client";
  const name = metadata.name?.trim() || user.email || "New user";

  const { data: created, error: insertError } = await admin
    .from("profiles")
    .insert({ id: user.id, email: user.email ?? "", name, role })
    .select("*")
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }
  return NextResponse.json({ profile: created });
}
