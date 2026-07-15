"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import type { Assessment, Business, ContentArticle } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StageStepper } from "@/components/stage-stepper";
import { EngagementDocuments } from "@/components/engagement-documents";
import { EngagementMessages } from "@/components/engagement-messages";
import { EngagementTasks } from "@/components/engagement-tasks";
import { useProfile } from "@/lib/use-profile";

export default function MyBusinessPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { profile } = useProfile();
  const [business, setBusiness] = useState<Business | null>(null);
  const [assessments, setAssessments] = useState<Assessment[] | null>(null);
  const [articles, setArticles] = useState<ContentArticle[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ business: Business }>(`/api/businesses/${id}`)
      .then((res) => {
        setBusiness(res.business);
        const engagementId = res.business.engagements?.[0]?.id;
        if (engagementId) {
          apiFetch<{ assessments: Assessment[] }>(`/api/assessments?engagementId=${engagementId}`).then((r) =>
            setAssessments(r.assessments),
          );
        }
        apiFetch<{ articles: ContentArticle[] }>(`/api/content?verticalId=${res.business.vertical_id}`).then((r) =>
          setArticles(r.articles),
        );
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, [id]);

  if (error) return <div className="p-8 text-destructive">{error}</div>;
  if (!business) return <div className="p-8 text-muted-foreground">Loading…</div>;

  const engagement = business.engagements?.[0];

  return (
    <div className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <Link href="/app" className="text-sm text-muted-foreground hover:underline">
          ← Back
        </Link>
        <div className="mt-1 flex items-center gap-2">
          <h1 className="text-2xl font-bold">{business.name}</h1>
          <Badge variant="secondary">{business.vertical?.name}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Engagement</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {engagement && <StageStepper stage={engagement.stage} />}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant={engagement?.status === "active" ? "default" : "secondary"}>{engagement?.status}</Badge>
          </div>
          {engagement?.consultant && (
            <p className="text-sm text-muted-foreground">Your consultant: {engagement.consultant.name}</p>
          )}
          {engagement?.notes && (
            <p className="whitespace-pre-wrap rounded-md bg-muted/40 p-3 text-sm">{engagement.notes}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Assessment history</CardTitle>
        </CardHeader>
        <CardContent>
          {assessments === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recommended reading</CardTitle>
        </CardHeader>
        <CardContent>
          {articles === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : articles.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nothing published yet.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {articles.map((a) => (
                <Link
                  key={a.id}
                  href={`/app/content/${a.id}`}
                  className="rounded-md border px-3 py-2 text-sm hover:border-primary"
                >
                  {a.title}
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {engagement && profile && (
        <>
          <EngagementTasks engagementId={engagement.id} currentUserId={profile.id} />
          <EngagementDocuments engagementId={engagement.id} currentUserId={profile.id} />
          <EngagementMessages engagementId={engagement.id} currentUserId={profile.id} />
        </>
      )}
    </div>
  );
}
