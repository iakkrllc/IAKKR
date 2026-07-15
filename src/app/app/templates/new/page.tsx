"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type { ChecklistQuestion, ChecklistTemplate, QuestionType, Vertical } from "@/lib/types";
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
import { X } from "lucide-react";

function newQuestion(): ChecklistQuestion {
  return { id: crypto.randomUUID(), label: "", type: "yes_no" };
}

export default function NewTemplatePage() {
  const router = useRouter();
  const [verticals, setVerticals] = useState<Vertical[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [verticalId, setVerticalId] = useState("");
  const [questions, setQuestions] = useState<ChecklistQuestion[]>([newQuestion()]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    apiFetch<{ verticals: Vertical[] }>("/api/verticals").then((res) => setVerticals(res.verticals));
  }, []);

  const updateQuestion = (id: string, patch: Partial<ChecklistQuestion>) => {
    setQuestions((qs) => qs.map((q) => (q.id === id ? { ...q, ...patch } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((qs) => qs.filter((q) => q.id !== id));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuestions = questions.filter((q) => q.label.trim());
    if (!title.trim() || !verticalId || cleanQuestions.length === 0) {
      toast.error("Add a title, pick a vertical, and at least one question with a label");
      return;
    }
    setSubmitting(true);
    try {
      const res = await apiFetch<{ template: ChecklistTemplate }>("/api/checklist-templates", {
        method: "POST",
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined,
          verticalId,
          questions: cleanQuestions,
        }),
      });
      toast.success("Template created");
      router.push(`/app/templates`);
      void res;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't create that template");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-1 items-start justify-center p-8">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>New checklist template</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Kitchen safety audit"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label>Vertical</Label>
              <Select value={verticalId} onValueChange={setVerticalId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pick an industry" />
                </SelectTrigger>
                <SelectContent>
                  {verticals.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Questions</Label>
              {questions.map((q, i) => (
                <div key={q.id} className="flex items-center gap-2">
                  <Input
                    value={q.label}
                    onChange={(e) => updateQuestion(q.id, { label: e.target.value })}
                    placeholder={`Question ${i + 1}`}
                    className="flex-1"
                  />
                  <Select
                    value={q.type}
                    onValueChange={(v) => updateQuestion(q.id, { type: v as QuestionType })}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes_no">Yes / No</SelectItem>
                      <SelectItem value="text">Free text</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeQuestion(q.id)}
                    disabled={questions.length === 1}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setQuestions((qs) => [...qs, newQuestion()])} className="self-start">
                Add question
              </Button>
            </div>

            <Button type="submit" disabled={submitting}>
              {submitting ? "Creating…" : "Create template"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
