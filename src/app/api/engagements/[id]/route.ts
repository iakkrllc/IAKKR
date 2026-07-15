import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const VALID_STATUSES = ["active", "paused", "completed"];
const VALID_STAGES = ["discovery", "assessment", "recommendations", "implementation", "complete"];

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const admin = getSupabaseAdmin();
  const { data: existing } = await admin
    .from("engagements")
    .select("consultant_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.consultant_id !== auth.profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.status === "string" && VALID_STATUSES.includes(body.status)) {
    patch.status = body.status;
  }
  if (typeof body.stage === "string" && VALID_STAGES.includes(body.stage)) {
    patch.stage = body.stage;
  }
  if (typeof body.notes === "string") patch.notes = body.notes;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await admin.from("engagements").update(patch).eq("id", id).select("*").single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ engagement: data });
}
