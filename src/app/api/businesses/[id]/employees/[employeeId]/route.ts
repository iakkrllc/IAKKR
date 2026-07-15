import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadBusinessIfManager } from "@/lib/business-access";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: businessId, employeeId } = await params;

  const admin = getSupabaseAdmin();
  const business = await loadBusinessIfManager(admin, businessId, auth.profile.id);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const patch: Record<string, unknown> = {};
  if (typeof body.name === "string" && body.name.trim()) patch.name = body.name.trim();
  if ("title" in body) patch.title = typeof body.title === "string" && body.title.trim() ? body.title.trim() : null;
  if ("hourlyRate" in body) {
    patch.hourly_rate = typeof body.hourlyRate === "number" && Number.isFinite(body.hourlyRate) ? body.hourlyRate : null;
  }
  if (typeof body.status === "string" && ["active", "inactive"].includes(body.status)) patch.status = body.status;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const { data, error } = await admin
    .from("employees")
    .update(patch)
    .eq("id", employeeId)
    .eq("business_id", businessId)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ employee: data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: businessId, employeeId } = await params;

  const admin = getSupabaseAdmin();
  const business = await loadBusinessIfManager(admin, businessId, auth.profile.id);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { error } = await admin.from("employees").delete().eq("id", employeeId).eq("business_id", businessId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
