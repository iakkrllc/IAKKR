"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import type { Business } from "@/lib/types";
import { useProfile } from "@/lib/use-profile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function ClientDashboard() {
  const { profile } = useProfile();
  const [businesses, setBusinesses] = useState<Business[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch<{ businesses: Business[] }>("/api/businesses")
      .then((res) => setBusinesses(res.businesses))
      .catch((err) => setError(err instanceof Error ? err.message : "Something went wrong"));
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Your businesses</h2>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/app/content">Content library</Link>
          </Button>
          <Button asChild>
            <Link href="/app/businesses/new">Add a business</Link>
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {businesses === null && !error && <p className="text-sm text-muted-foreground">Loading…</p>}

      {businesses?.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-sm text-muted-foreground">
            <p>
              No businesses yet. Create your own to start running it in iakkr — or a consultant can link one to
              your account.
            </p>
            <Button asChild>
              <Link href="/app/businesses/new">Create your business</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {businesses?.map((business) => {
          const engagement = business.engagements?.[0];
          const selfManaged = business.created_by_consultant_id === profile?.id;
          return (
            <Link
              key={business.id}
              href={selfManaged ? `/app/businesses/${business.id}` : `/app/my-business/${business.id}`}
            >
              <Card className="h-full transition-colors hover:border-primary">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between gap-2 text-base">
                    {business.name}
                    {engagement && (
                      <Badge variant={engagement.status === "active" ? "default" : "secondary"}>
                        {engagement.status}
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{business.vertical?.name}</p>
                  {selfManaged ? (
                    <p className="mt-1 text-xs text-muted-foreground">Managed by you</p>
                  ) : (
                    engagement?.consultant && (
                      <p className="mt-1 text-xs text-muted-foreground">Consultant: {engagement.consultant.name}</p>
                    )
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
