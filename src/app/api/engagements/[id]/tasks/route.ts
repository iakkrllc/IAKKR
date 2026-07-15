import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";
import { TASK_STATUSES } from "@/lib/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await admin
    .from("engagement_tasks")
    .select("*")
    .eq("engagement_id", engagementId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks: data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const dueDate = typeof body.dueDate === "string" && body.dueDate ? body.dueDate : null;
  const status = typeof body.status === "string" && TASK_STATUSES.includes(body.status) ? body.status : "open";

  if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

  const { data, error } = await admin
    .from("engagement_tasks")
    .insert({
      engagement_id: engagementId,
      title,
      status,
      due_date: dueDate,
      created_by: auth.profile.id,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ task: data });
}
