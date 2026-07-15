import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const ARTICLE_SELECT = "*, vertical:verticals(id,slug,name)";

/** Both roles can browse the library. verticalId filter also includes general (vertical_id null) articles. */
export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const verticalId = req.nextUrl.searchParams.get("verticalId");
  const admin = getSupabaseAdmin();
  let query = admin.from("content_articles").select(ARTICLE_SELECT).order("created_at", { ascending: false });
  if (verticalId) query = query.or(`vertical_id.eq.${verticalId},vertical_id.is.null`);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ articles: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (auth.profile.role !== "consultant") {
    return NextResponse.json({ error: "Only consultants can publish articles" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const articleBody = typeof body.body === "string" ? body.body.trim() : "";
  const verticalId = typeof body.verticalId === "string" && body.verticalId ? body.verticalId : null;

  if (!title || !articleBody) {
    return NextResponse.json({ error: "Title and body are required" }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data, error } = await admin
    .from("content_articles")
    .insert({
      title,
      body: articleBody,
      vertical_id: verticalId,
      published_at: new Date().toISOString(),
      created_by: auth.profile.id,
    })
    .select(ARTICLE_SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}
