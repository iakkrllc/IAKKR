import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import type { ChecklistQuestion } from "@/lib/types";

const TEMPLATE_SELECT = "*, vertical:verticals(id,slug,name)";

export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const verticalId = req.nextUrl.searchParams.get("verticalId");
  const admin = getSupabaseAdmin();
  let query = admin.from("checklist_templates").select(TEMPLATE_SELECT).order("created_at", { ascending: false });
  if (verticalId) query = query.eq("vertical_id", verticalId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ templates: data });
}

function isValidQuestions(value: unknown): value is ChecklistQuestion[] {
  return (
    Array.isArray(value) &&
    value.every(
      (q) =>
        q &&
        typeof q.id === "string" &&
        typeof q.label === "string" &&
        (q.type === "yes_no" || q.type === "text"),
    )
  );
}

export async function POST(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (auth.profile.role !== "consultant") {
    return NextResponse.json({ error: "Only consultants can create checklist templates" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const verticalId = typeof body.verticalId === "string" ? body.verticalId : "";
  const description = typeof body.description === "string" ? body.description.trim() || null : null;
  const questions = body.questions;

  if (!title || !verticalId) {
    return NextResponse.json({ error: "Title and vertical are required" }, { status: 400 });
  }
  if (!isValidQuestions(questions) || questions.length === 0) {
    return NextResponse.json({ error: "Add at least one valid question" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("checklist_templates")
    .insert({
      title,
      description,
      vertical_id: verticalId,
      questions,
      created_by: auth.profile.id,
    })
    .select(TEMPLATE_SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ template: data });
}
