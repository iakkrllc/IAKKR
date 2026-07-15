import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";
import type { ChecklistQuestion } from "@/lib/types";

const ASSESSMENT_SELECT = "*, template:checklist_templates(id,title,vertical_id)";

export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const engagementId = req.nextUrl.searchParams.get("engagementId");
  if (!engagementId) {
    return NextResponse.json({ error: "engagementId is required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await admin
    .from("assessments")
    .select(ASSESSMENT_SELECT)
    .eq("engagement_id", engagementId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessments: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const engagementId = typeof body.engagementId === "string" ? body.engagementId : "";
  const templateId = typeof body.templateId === "string" ? body.templateId : "";
  const answers = body.answers && typeof body.answers === "object" ? (body.answers as Record<string, unknown>) : null;

  if (!engagementId || !templateId || !answers) {
    return NextResponse.json({ error: "engagementId, templateId, and answers are required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement || engagement.consultant_id !== auth.profile.id) {
    return NextResponse.json({ error: "Only the engagement's manager can run assessments" }, { status: 403 });
  }

  const { data: template } = await admin
    .from("checklist_templates")
    .select("questions")
    .eq("id", templateId)
    .maybeSingle();
  if (!template) return NextResponse.json({ error: "Checklist template not found" }, { status: 404 });

  // Score = % of yes/no questions answered "yes" — free-text questions are notes, not scored.
  const questions = template.questions as ChecklistQuestion[];
  const scored = questions.filter((q) => q.type === "yes_no");
  const yesCount = scored.filter((q) => answers[q.id] === true).length;
  const score = scored.length > 0 ? Math.round((yesCount / scored.length) * 100) : null;

  const { data, error } = await admin
    .from("assessments")
    .insert({
      engagement_id: engagementId,
      template_id: templateId,
      answers,
      score,
      completed_at: new Date().toISOString(),
      created_by: auth.profile.id,
    })
    .select(ASSESSMENT_SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ assessment: data });
}
