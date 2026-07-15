import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadBusinessIfManager } from "@/lib/business-access";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; employeeId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: businessId, employeeId } = await params;

  const admin = getSupabaseAdmin();
  const business = await loadBusinessIfManager(admin, businessId, auth.profile.id);
  if (!business) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: openShift } = await admin
    .from("employee_shifts")
    .select("id")
    .eq("employee_id", employeeId)
    .is("clock_out", null)
    .order("clock_in", { ascending: false })
    .maybeSingle();
  if (!openShift) return NextResponse.json({ error: "Not clocked in" }, { status: 400 });

  const { data, error } = await admin
    .from("employee_shifts")
    .update({ clock_out: new Date().toISOString() })
    .eq("id", openShift.id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shift: data });
}
