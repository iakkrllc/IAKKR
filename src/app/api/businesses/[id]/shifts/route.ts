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

  const from = req.nextUrl.searchParams.get("from");
  const to = req.nextUrl.searchParams.get("to");

  let query = admin
    .from("employee_shifts")
    .select("*, employee:employees(id,name)")
    .eq("business_id", businessId)
    .order("clock_in", { ascending: false });
  if (from) query = query.gte("clock_in", from);
  if (to) query = query.lte("clock_in", to);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ shifts: data });
}
