"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { ContentArticle, Vertical } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GENERAL_VALUE = "__general__";

export default function NewArticlePage() {
  const router = useRouter();
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [verticalId, setVerticalId] = useState(GENERAL_VALUE);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<{ verticals: Vertical[] }>("/api/verticals").then((res) => setVerticals(res.verticals));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      toast.error("Add a title and some content");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch<{ article: ContentArticle }>("/api/content", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          body: body.trim(),
          verticalId: verticalId === GENERAL_VALUE ? null : verticalId,
        }),
      });
      toast.success("Article published");
      router.push("/app/content");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't publish that article");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-start justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>New article</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Vertical</Label>
              <Select value={verticalId} onValueChange={setVerticalId}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GENERAL_VALUE}>General (all verticals)</SelectItem>
                  {verticals.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="body">Content</Label>
              <Textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} rows={10} />
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Publishing…" : "Publish article"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
