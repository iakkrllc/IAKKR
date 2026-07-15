import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";
import { TASK_STATUSES } from "@/lib/types";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId, taskId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.title === "string" && body.title.trim()) patch.title = body.title.trim();
  if (typeof body.status === "string" && TASK_STATUSES.includes(body.status)) patch.status = body.status;
  if ("dueDate" in body) patch.due_date = typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }
  patch.updated_at = new Date().toISOString();

  const { data, error } = await admin
    .from("engagement_tasks")
    .update(patch)
    .eq("id", taskId)
    .eq("engagement_id", engagementId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; taskId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId, taskId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: task } = await admin
    .from("engagement_tasks")
    .select("created_by")
    .eq("id", taskId)
    .eq("engagement_id", engagementId)
    .maybeSingle();
  if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canDelete = task.created_by === auth.profile.id || engagement.consultant_id === auth.profile.id;
  if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { error } = await admin.from("engagement_tasks").delete().eq("id", taskId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
