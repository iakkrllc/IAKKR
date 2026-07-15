import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const BUSINESS_SELECT = "*, vertical:verticals(id,slug,name), engagements(*, consultant:profiles(id,name))";

export async function GET(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = getSupabaseAdmin();
  const base = admin.from("businesses").select(BUSINESS_SELECT).order("created_at", { ascending: false });
  const { data, error } =
    auth.profile.role === "consultant"
      ? await base.eq("created_by_consultant_id", auth.profile.id)
      : await base.eq("owner_client_id", auth.profile.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ businesses: data });
}

export async function POST(req: NextRequest) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const verticalId = typeof body.verticalId === "string" ? body.verticalId : "";

  if (!name || !verticalId) {
    return NextResponse.json({ error: "Name and vertical are required" }, { status: 400 });
  }

  // Consultants can create a business for any client (or leave it unlinked
  // for now). Business owners signing up as "client" are self-serve: the
  // business is both created by and owned by them — they manage it directly
  // via /app/businesses/[id], same as a consultant manages a client's.
  const ownerClientId =
    auth.profile.role === "consultant"
      ? typeof body.ownerClientId === "string" && body.ownerClientId
        ? body.ownerClientId
        : null
      : auth.profile.id;

  const admin = getSupabaseAdmin();
  const { data: business, error } = await admin
    .from("businesses")
    .insert({
      name,
      vertical_id: verticalId,
      owner_client_id: ownerClientId,
      created_by_consultant_id: auth.profile.id,
    })
    .select(BUSINESS_SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Every new business starts with one active engagement led by its creator.
  const { data: engagement, error: engagementError } = await admin
    .from("engagements")
    .insert({ business_id: business.id, consultant_id: auth.profile.id })
    .select("*")
    .single();

  if (engagementError) {
    return NextResponse.json({ error: engagementError.message }, { status: 500 });
  }

  return NextResponse.json({ business: { ...business, engagements: [engagement] } });
}
