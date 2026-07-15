"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import type { ChecklistTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<ChecklistTemplate[] | null>(null);

  useEffect(() => {
    apiFetch<{ templates: ChecklistTemplate[] }>("/api/checklist-templates").then((res) =>
      setTemplates(res.templates),
    );
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Checklist templates</h1>
          <p className="text-sm text-muted-foreground">
            <Link href="/app" className="hover:underline">
              ← Back to clients
            </Link>
          </p>
        </div>
        <Button asChild>
          <Link href="/app/templates/new">New template</Link>
        </Button>
      </div>

      {templates === null && <p className="text-sm text-muted-foreground">Loading…</p>}

      {templates?.length === 0 && (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No checklist templates yet. Create one per vertical to start running assessments.
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {templates?.map((t) => (
          <Card key={t.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2 text-base">
                {t.title}
                <Badge variant="secondary">{t.vertical?.name}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {t.description && <p className="text-sm text-muted-foreground">{t.description}</p>}
              <p className="mt-2 text-xs text-muted-foreground">{t.questions.length} questions</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
