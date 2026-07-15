import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

/** Consultant-only: list of client-role accounts, for the "assign owner" picker when creating/editing a business. */
export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (auth.profile.role !== "consultant") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("profiles")
    .select("id,name,email")
    .eq("role", "client")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data });
}
