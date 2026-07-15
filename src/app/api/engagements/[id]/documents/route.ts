import { NextRequest, NextResponse } from "next/server";
import { requireProfile } from "@/lib/require-profile";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { loadEngagementIfAllowed } from "@/lib/engagement-access";

const BUCKET = "engagement-documents";
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10MB
const SIGNED_URL_TTL = 60 * 10; // 10 minutes

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: docs, error } = await admin
    .from("engagement_documents")
    .select("*, uploader:profiles(id,name)")
    .eq("engagement_id", engagementId)
    .order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const documents = await Promise.all(
    (docs ?? []).map(async (doc) => {
      const { data: signed } = await admin.storage.from(BUCKET).createSignedUrl(doc.storage_path, SIGNED_URL_TTL);
      return { ...doc, download_url: signed?.signedUrl ?? null };
    }),
  );

  return NextResponse.json({ documents });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireProfile(req);
  if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id: engagementId } = await params;

  const admin = getSupabaseAdmin();
  const engagement = await loadEngagementIfAllowed(admin, engagementId, auth.profile.id);
  if (!engagement) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json().catch(() => ({}));
  const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
  const contentType = typeof body.contentType === "string" ? body.contentType : "application/octet-stream";
  const dataUri = typeof body.dataUri === "string" ? body.dataUri : "";

  if (!fileName || !dataUri.startsWith("data:")) {
    return NextResponse.json({ error: "fileName and a data URI are required" }, { status: 400 });
  }

  const base64 = dataUri.split(",")[1] ?? "";
  const buffer = Buffer.from(base64, "base64");
  if (buffer.byteLength === 0) {
    return NextResponse.json({ error: "Couldn't read that file" }, { status: 400 });
  }
  if (buffer.byteLength > MAX_FILE_BYTES) {
    return NextResponse.json({ error: "Files must be under 10MB" }, { status: 400 });
  }

  const storagePath = `${engagementId}/${crypto.randomUUID()}-${fileName}`;
  const { error: uploadError } = await admin.storage.from(BUCKET).upload(storagePath, buffer, { contentType });
  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data, error } = await admin
    .from("engagement_documents")
    .insert({
      engagement_id: engagementId,
      uploaded_by: auth.profile.id,
      file_name: fileName,
      storage_path: storagePath,
      file_size: buffer.byteLength,
      content_type: contentType,
    })
    .select("*, uploader:profiles(id,name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ document: data });
}
