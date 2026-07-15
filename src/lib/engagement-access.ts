import { getSupabaseAdmin } from "./supabase-admin";

/**
 * Confirms the caller may see/act on this engagement — either as its manager
 * (engagement.consultant_id, regardless of profile role) or as the linked
 * business's owner. Ownership-based rather than role-based: a self-serve
 * business owner is both at once, which is what makes self-serve work
 * without special-casing.
 */
export async function loadEngagementIfAllowed(
  admin: ReturnType<typeof getSupabaseAdmin>,
  engagementId: string,
  callerId: string,
) {
  const { data: engagement } = await admin
    .from("engagements")
    .select("id, business_id, consultant_id")
    .eq("id", engagementId)
    .maybeSingle();
  if (!engagement) return null;

  if (engagement.consultant_id === callerId) return engagement;

  const { data: business } = await admin
    .from("businesses")
    .select("owner_client_id")
    .eq("id", engagement.business_id)
    .maybeSingle();
  return business?.owner_client_id === callerId ? engagement : null;
}
