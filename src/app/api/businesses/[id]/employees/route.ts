import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadBusinessIfManager } from "@/lib/business-access";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: businessId } = await params;

  const admin = getSupabaseAdmin();
  const business = await loadBusinessIfManager(admin, businessId, auth.profile.id);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data, error } = await admin
    .from("employees")
    .select("*")
    .eq("business_id", businessId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employees: data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: businessId } = await params;

  const admin = getSupabaseAdmin();
  const business = await loadBusinessIfManager(admin, businessId, auth.profile.id);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : null;
  const hourlyRate =
    typeof body.hourlyRate === "number" && Number.isFinite(body.hourlyRate) ? body.hourlyRate : null;

  if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

  const { data, error } = await admin
    .from("employees")
    .insert({ business_id: businessId, name, title, hourly_rate: hourlyRate, created_by: auth.profile.id })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employee: data });
}
