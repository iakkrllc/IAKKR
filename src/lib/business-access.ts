import { getSupabaseAdmin } from "./supabase-admin";

/** Confirms the caller manages this business (its creator — the consultant, or the owner themself when self-managed). */
export async function loadBusinessIfManager(
  admin: ReturnType<typeof getSupabaseAdmin>,
  businessId: string,
  callerId: string,
) {
  const { data: business } = await admin
    .from("businesses")
    .select("id, created_by_consultant_id")
    .eq("id", businessId)
    .maybeSingle();
  if (!business || business.created_by_consultant_id !== callerId) return null;
  return business;
}
