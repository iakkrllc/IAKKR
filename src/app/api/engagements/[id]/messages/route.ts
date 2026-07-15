import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await admin
    .from("engagement_messages")
    .select("*, sender:profiles(id,name)")
    .eq("engagement_id", engagementId)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ messages: data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const messageBody = typeof body.body === "string" ? body.body.trim() : "";
  if (!messageBody) {
    return NextResponse.json({ error: "Message can't be empty" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("engagement_messages")
    .insert({ engagement_id: engagementId, sender_id: auth.profile.id, body: messageBody })
    .select("*, sender:profiles(id,name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ message: data });
}
