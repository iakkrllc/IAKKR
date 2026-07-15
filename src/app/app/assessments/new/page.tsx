"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { Assessment, ChecklistTemplate } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function RunAssessmentPage() {
  return (
    <Suspense fallback={<div className="p-8 text-muted-foreground">Loading…</div>}>
      <RunAssessmentForm />
    </Suspense>
  );
}

function RunAssessmentForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const engagementId = searchParams.get("engagementId") ?? "";
  const templateId = searchParams.get("templateId") ?? "";
  const businessId = searchParams.get("businessId") ?? "";

  const [template, setTemplate] = useState<ChecklistTemplate | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!templateId) return;
    apiFetch<{ template: ChecklistTemplate }>(`/api/checklist-templates/${templateId}`).then((res) =>
      setTemplate(res.template),
    );
  }, [templateId]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!engagementId || !templateId) {
      toast.error("Missing engagement or template");
      return;
    }
    setSubmitting(true);
    try {
      await apiFetch<{ assessment: Assessment }>("/api/assessments", {
        method: "POST",
        body: JSON.stringify({ engagementId, templateId, answers }),
      });
      toast.success("Assessment saved");
      router.push(businessId ? `/app/businesses/${businessId}` : "/app");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save that assessment");
      setSubmitting(false);
    }
  };

  if (!engagementId || !templateId) {
    return <div className="p-8 text-destructive">Missing engagement or template — go back and try again.</div>;
  }
  if (!template) return <div className="p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="flex flex-1 items-start justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{template.title}</CardTitle>
          {template.description && <p className="text-sm text-muted-foreground">{template.description}</p>}
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-5">
            {template.questions.map((q) => (
              <div key={q.id} className="flex flex-col gap-1.5">
                <Label>{q.label}</Label>
                {q.type === "yes_no" ? (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: true }))}
                      className={cn(
                        "rounded-md border px-4 py-1.5 text-sm font-medium",
                        answers[q.id] === true
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-input text-muted-foreground hover:bg-accent/50",
                      )}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: false }))}
                      className={cn(
                        "rounded-md border px-4 py-1.5 text-sm font-medium",
                        answers[q.id] === false
                          ? "border-primary bg-accent text-accent-foreground"
                          : "border-input text-muted-foreground hover:bg-accent/50",
                      )}
                    >
                      No
                    </button>
                  </div>
                ) : (
                  <Textarea
                    value={typeof answers[q.id] === "string" ? (answers[q.id] as string) : ""}
                    onChange={(e) => setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                    rows={2}
                  />
                )}
              </div>
            ))}
            <Button type="submit" disabled={submitting}>
              {submitting ? "Saving…" : "Submit assessment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
