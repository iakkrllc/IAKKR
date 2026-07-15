import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUSINESS_SELECT = "*, vertical:verticals(id,slug,name), engagements(*, consultant:profiles(id,name))";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const admin = getSupabaseAdmin();
  const { data: business, error } = await admin
    .from("businesses")
    .select(BUSINESS_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allowed =
    (auth.profile.role === "consultant" && business.created_by_consultant_id === auth.profile.id) ||
    (auth.profile.role === "client" && business.owner_client_id === auth.profile.id);
  if (!allowed) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ business });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;

  const admin = getSupabaseAdmin();
  const { data: existing } = await admin
    .from("businesses")
    .select("created_by_consultant_id")
    .eq("id", id)
    .maybeSingle();
  if (!existing || existing.created_by_consultant_id !== auth.profile.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if ("ownerClientId" in body) patch.owner_client_id = body.ownerClientId || null;

  const { data, error } = await admin
    .from("businesses")
    .update(patch)
    .eq("id", id)
    .select(BUSINESS_SELECT)
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ business: data });
}
