"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import { useProfile } from "@/lib/use-profile";
import type { ContentArticle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { profile } = useProfile();
  const [article, setArticle] = useState<ContentArticle | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ article: ContentArticle }>(`/api/content/${id}`)
      .then((res) => setArticle(res.article))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, [id]);

  const remove = async () => {
    if (!confirm("Delete this article?")) return;
    try {
      await apiFetch(`/api/content/${id}`, { method: "DELETE" });
      toast.success("Article deleted");
      router.push("/app/content");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't delete that article");
    }
  };

  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!article) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const isOwner = profile?.id === article.created_by;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-4 p-8">
      <Link href="/app/content" className="text-sm text-muted-foreground hover:underline">
        ← Back to content library
      </Link>
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">{article.title}</h1>
        <Badge variant="secondary">{article.vertical?.name ?? "General"}</Badge>
      </div>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{article.body}</p>
      {isOwner && (
        <Button variant="outline" onClick={remove} className="self-start text-destructive">
          Delete article
        </Button>
      )}
    </div>
  );
}
