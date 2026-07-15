"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { ENGAGEMENT_STAGE_LABELS, type EngagementStage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, MessageSquare, ClipboardCheck } from "lucide-react";

interface ReportOverview {
  totalBusinesses: number;
  stageCounts: { stage: EngagementStage; count: number }[];
  averageScore: number | null;
  activity: { type: "assessment" | "document" | "message"; created_at: string; summary: string }[];
}

const ACTIVITY_ICONS = {
  assessment: ClipboardCheck,
  document: FileText,
  message: MessageSquare,
};

export default function ReportsPage() {
  const [report, setReport] = useState<ReportOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<ReportOverview>("/api/reports/overview")
      .then(setReport)
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, []);

  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!report) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const maxStageCount = Math.max(1, ...report.stageCounts.map((s) => s.count));

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <Link href="/app" className="text-sm text-muted-foreground hover:underline">
          ← Back to clients
        </Link>
        <h1 className="mt-1 text-2xl font-bold">Practice overview</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Total clients</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{report.totalBusinesses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average assessment score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{report.averageScore !== null ? `${report.averageScore}%` : "—"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagements by stage</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {report.stageCounts.every((s) => s.count === 0) ? (
            <p className="text-sm text-muted-foreground">No engagements yet.</p>
          ) : (
            report.stageCounts.map((s) => (
              <div key={s.stage} className="flex items-center gap-3">
                <span className="w-32 shrink-0 text-sm text-muted-foreground">{ENGAGEMENT_STAGE_LABELS[s.stage]}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(s.count / maxStageCount) * 100}%` }}
                  />
                </div>
                <span className="w-6 shrink-0 text-right text-sm font-medium tabular-nums">{s.count}</span>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent activity</CardTitle>
        </CardHeader>
        <CardContent>
          {report.activity.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing yet — activity across your clients will show up here.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {report.activity.map((a, i) => {
                const Icon = ACTIVITY_ICONS[a.type];
                return (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div>
                      <p>{a.summary}</p>
                      <p className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
