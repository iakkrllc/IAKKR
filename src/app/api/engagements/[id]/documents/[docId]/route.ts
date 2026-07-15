import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";

const BUCKET = "engagement-documents";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; docId: string }> },
) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId, docId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: doc } = await admin
    .from("engagement_documents")
    .select("uploaded_by, storage_path")
    .eq("id", docId)
    .eq("engagement_id", engagementId)
    .maybeSingle();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canDelete = doc.uploaded_by === auth.profile.id || engagement.consultant_id === auth.profile.id;
  if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  await admin.storage.from(BUCKET).remove([doc.storage_path]);
  const { error } = await admin.from("engagement_documents").delete().eq("id", docId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
