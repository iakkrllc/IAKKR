"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { EngagementDocument } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Trash2, Upload } from "lucide-react";

function readFileAsDataUri(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function EngagementDocuments({
  engagementId,
  currentUserId,
  canDeleteAny = false,
}: {
  engagementId: string;
  currentUserId: string;
  /** True for the engagement's consultant, who can remove any document on it (matches the API's own rule). */
  canDeleteAny?: boolean;
}) {
  const [documents, setDocuments] = useState<EngagementDocument[] | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const load = () => {
    apiFetch<{ documents: EngagementDocument[] }>(`/api/engagements/${engagementId}/documents`).then((res) =>
      setDocuments(res.documents),
    );
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  const onFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const dataUri = await readFileAsDataUri(file);
      await apiFetch(`/api/engagements/${engagementId}/documents`, {
        method: "POST",
        body: JSON.stringify({ fileName: file.name, contentType: file.type, dataUri }),
      });
      toast.success("Document uploaded");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't upload that file");
    } finally {
      setUploading(false);
    }
  };

  const remove = async (docId: string) => {
    try {
      await apiFetch(`/api/engagements/${engagementId}/documents/${docId}`, { method: "DELETE" });
      toast.success("Document removed");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't remove that document");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Documents</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <input ref={fileInputRef} type="file" className="hidden" onChange={onFileSelected} disabled={uploading} />
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          className="w-fit gap-1.5"
          type="button"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" /> {uploading ? "Uploading…" : "Upload a file"}
        </Button>

        {documents === null ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents shared yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm">
                <a
                  href={d.download_url ?? "#"}
                  className="flex min-w-0 flex-1 items-center gap-2 hover:text-primary"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{d.file_name}</span>
                  <span className="shrink-0 text-xs text-muted-foreground">{formatFileSize(d.file_size)}</span>
                </a>
                {(d.uploaded_by === currentUserId || canDeleteAny) && (
                  <Button variant="ghost" size="icon" onClick={() => remove(d.id)} className="h-7 w-7 shrink-0">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
