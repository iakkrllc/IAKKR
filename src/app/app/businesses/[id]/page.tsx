"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
import type {
  Assessment,
  Business,
  ChecklistTemplate,
  ClientOption,
  EngagementStage,
  EngagementStatus,
} from "@/lib/types";
import { ENGAGEMENT_STAGES, ENGAGEMENT_STAGE_LABELS } from "@/lib/types";
import { useProfile } from "@/lib/use-profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { StageStepper } from "@/components/stage-stepper";
import { EngagementDocuments } from "@/components/engagement-documents";
import { EngagementMessages } from "@/components/engagement-messages";
import { EngagementTasks } from "@/components/engagement-tasks";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STATUS_OPTIONS: EngagementStatus[] = ["active", "paused", "completed"];

export default function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { profile } = useProfile();
  const [business, setBusiness] = useState<Business | null>(null);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [templates, setTemplates] = useState<ChecklistTemplate[]>([]);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [notes, setNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    apiFetch<{ business: Business }>(`/api/businesses/${id}`)
      .then((res) => {
        setBusiness(res.business);
        setNotes(res.business.engagements?.[0]?.notes ?? "");
        const engagementId = res.business.engagements?.[0]?.id;
        if (engagementId) {
          apiFetch<{ assessments: Assessment[] }>(`/api/assessments?engagementId=${engagementId}`).then((r) =>
            setAssessments(r.assessments),
          );
        }
        apiFetch<{ templates: ChecklistTemplate[] }>(
          `/api/checklist-templates?verticalId=${res.business.vertical_id}`,
        ).then((r) => setTemplates(r.templates));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  };

  useEffect(() => {
    load();
    if (profile?.role === "consultant") {
      apiFetch<{ clients: ClientOption[] }>("/api/clients").then((res) => setClients(res.clients));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.role]);

  const engagement = business?.engagements?.[0];

  const updateStatus = async (status: EngagementStatus) => {
    if (!engagement) return;
    try {
      await apiFetch(`/api/engagements/${engagement.id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success("Status updated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update status");
    }
  };

  const updateStage = async (stage: EngagementStage) => {
    if (!engagement) return;
    try {
      await apiFetch(`/api/engagements/${engagement.id}`, {
        method: "PATCH",
        body: JSON.stringify({ stage }),
      });
      toast.success("Stage updated");
      load();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update stage");
    }
  };

  const saveNotes = async () => {
    if (!engagement) return;
    setSavingNotes(true);
    try {
      await apiFetch(`/api/engagements/${engagement.id}`, {
        method: "PATCH",
        body: JSON.stringify({ notes }),
      });
      toast.success("Notes saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't save notes");
    } finally {
      setSavingNotes(false);
    }
  };

  const assignOwner = async (ownerClientId: string) => {
    try {
      const res = await apiFetch<{ business: Business }>(`/api/businesses/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ ownerClientId }),
      });
      setBusiness(res.business);
      toast.success("Owner linked");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't link owner");
    }
  };

  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!business) return <div className="p-8 text-muted-foreground">Loading…</div>;

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link href="/app" className="text-sm text-muted-foreground hover:underline">
            ← Back to clients
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            <Badge variant="secondary">{business.vertical?.name}</Badge>
          </div>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/app/businesses/${id}/team`}>Team</Link>
        </Button>
      </div>

      {engagement && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement stage</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StageStepper stage={engagement.stage} />
            <Select value={engagement.stage} onValueChange={(v) => updateStage(v as EngagementStage)}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ENGAGEMENT_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {ENGAGEMENT_STAGE_LABELS[s]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Select value={engagement?.status} onValueChange={(v) => updateStatus(v as EngagementStatus)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Engagement notes…"
              rows={5}
            />
            <Button size="sm" onClick={saveNotes} disabled={savingNotes} className="self-start">
              {savingNotes ? "Saving…" : "Save notes"}
            </Button>
          </CardContent>
        </Card>

        {business.owner_client_id !== profile?.id && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Business owner</CardTitle>
            </CardHeader>
            <CardContent>
              {business.owner_client_id ? (
                <p className="text-sm text-muted-foreground">Linked to a client account.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-muted-foreground">Not linked to a client account yet.</p>
                  <Select onValueChange={assignOwner}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Link an existing client account" />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} ({c.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessments</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {templates.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No checklist templates exist for {business.vertical?.name} yet.{" "}
              <Link href="/app/templates/new" className="font-medium text-primary hover:underline">
                Create one
              </Link>
              .
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <Button key={t.id} variant="outline" size="sm" asChild>
                  <Link href={`/app/assessments/new?engagementId=${engagement?.id}&templateId=${t.id}&businessId=${id}`}>
                    Run &ldquo;{t.title}&rdquo;
                  </Link>
                </Button>
              ))}
            </div>
          )}

          {assessments === null ? (
            <p className="text-sm text-muted-foreground">Loading past assessments…</p>
          ) : assessments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No assessments run yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {assessments.map((a) => (
                <div key={a.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <span>{a.template?.title ?? "Assessment"}</span>
                  <div className="flex items-center gap-3">
                    {a.score !== null && <Badge variant="secondary">{a.score}%</Badge>}
                    <span className="text-xs text-muted-foreground">
                      {a.completed_at ? new Date(a.completed_at).toLocaleDateString() : ""}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {engagement && profile && (
        <>
          <EngagementTasks
            engagementId={engagement.id}
            currentUserId={profile.id}
            canDeleteAny={profile.id === engagement.consultant_id}
          />
          <EngagementDocuments
            engagementId={engagement.id}
            currentUserId={profile.id}
            canDeleteAny={profile.id === engagement.consultant_id}
          />
          <EngagementMessages engagementId={engagement.id} currentUserId={profile.id} />
        </>
      )}
    </div>
  );
}
