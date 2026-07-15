"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { useProfile } from "@/lib/use-profile";
import type { ContentArticle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContentLibraryPage() {
  const { profile } = useProfile();
  const [articles, setArticles] = useState<ContentArticle[] | null>(null);

  useEffect(() => {
    apiFetch<{ articles: ContentArticle[] }>("/api/content").then((res) => setArticles(res.articles));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Content library</h1>
          <p className="text-sm text-muted-foreground">
            <Link href="/app" className="hover:underline">
              ← Back
            </Link>
          </p>
        </div>
        {profile?.role === "consultant" && (
          <Button asChild>
            <Link href="/app/content/new">New article</Link>
          </Button>
        )}
      </div>

      {articles === null && <p className="text-sm text-muted-foreground">Loading…</p>}

      {articles?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">No articles yet.</CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {articles?.map((a) => (
          <Link key={a.id} href={`/app/content/${a.id}`}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2 text-base">
                  {a.title}
                  <Badge variant="secondary">{a.vertical?.name ?? "General"}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-3 text-sm text-muted-foreground">{a.body}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
