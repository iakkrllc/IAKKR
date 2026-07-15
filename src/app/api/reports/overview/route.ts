import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { ENGAGEMENT_STAGES, type EngagementStage } from "@/lib/types";

interface ActivityItem {
  type: "assessment" | "document" | "message";
  created_at: string;
  summary: string;
}

export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (auth.profile.role !== "consultant") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = getSupabaseAdmin();

  const { data: businesses, error: businessesError } = await admin
    .from("businesses")
    .select("id, name")
    .eq("created_by_consultant_id", auth.profile.id);
  if (businessesError) return NextResponse.json({ error: businessesError.message }, { status: 500 });

  const { data: engagements, error: engagementsError } = await admin
    .from("engagements")
    .select("id, stage, business_id")
    .eq("consultant_id", auth.profile.id);
  if (engagementsError) return NextResponse.json({ error: engagementsError.message }, { status: 500 });

  const engagementIds = (engagements ?? []).map((e) => e.id);
  const businessNameByEngagement = new Map(
    (engagements ?? []).map((e) => [e.id, businesses?.find((b) => b.id === e.business_id)?.name ?? "a client"]),
  );

  const stageCounts: Record<EngagementStage, number> = {
    discovery: 0,
    assessment: 0,
    recommendations: 0,
    implementation: 0,
    complete: 0,
  };
  for (const e of engagements ?? []) {
    if (e.stage in stageCounts) stageCounts[e.stage as EngagementStage]++;
  }

  let averageScore: number | null = null;
  const activity: ActivityItem[] = [];

  if (engagementIds.length > 0) {
    const { data: assessments } = await admin
      .from("assessments")
      .select("id, engagement_id, score, created_at, template:checklist_templates(title)")
      .in("engagement_id", engagementIds)
      .order("created_at", { ascending: false })
      .limit(10);

    const scored = (assessments ?? []).filter((a) => a.score !== null);
    if (scored.length > 0) {
      averageScore = Math.round(scored.reduce((sum, a) => sum + (a.score ?? 0), 0) / scored.length);
    }
    for (const a of assessments ?? []) {
      const templateTitle = (a.template as { title?: string } | null)?.title ?? "an assessment";
      activity.push({
        type: "assessment",
        created_at: a.created_at,
        summary: `Ran "${templateTitle}" for ${businessNameByEngagement.get(a.engagement_id)} (${a.score ?? "—"}%)`,
      });
    }

    const { data: documents } = await admin
      .from("engagement_documents")
      .select("id, engagement_id, file_name, created_at")
      .in("engagement_id", engagementIds)
      .order("created_at", { ascending: false })
      .limit(10);
    for (const d of documents ?? []) {
      activity.push({
        type: "document",
        created_at: d.created_at,
        summary: `${d.file_name} uploaded for ${businessNameByEngagement.get(d.engagement_id)}`,
      });
    }

    const { data: messages } = await admin
      .from("engagement_messages")
      .select("id, engagement_id, body, created_at")
      .in("engagement_id", engagementIds)
      .order("created_at", { ascending: false })
      .limit(10);
    for (const m of messages ?? []) {
      activity.push({
        type: "message",
        created_at: m.created_at,
        summary: `New message on ${businessNameByEngagement.get(m.engagement_id)}`,
      });
    }
  }

  activity.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return NextResponse.json({
    totalBusinesses: businesses?.length ?? 0,
    stageCounts: ENGAGEMENT_STAGES.map((stage) => ({ stage, count: stageCounts[stage] })),
    averageScore,
    activity: activity.slice(0, 10),
  });
}
