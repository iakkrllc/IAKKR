"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useProfile } from "@/lib/use-profile";
import { Button } from "@/components/ui/button";
import { ConsultantDashboard } from "@/components/consultant-dashboard";
import { ClientDashboard } from "@/components/client-dashboard";

export default function AppHome() {
  const { user, loading: authLoading, signOut } = useAuth();
  const { profile, loading: profileLoading, error } = useProfile();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  if (authLoading || profileLoading) {
    return <div className="flex flex-1 items-center justify-center text-muted-foreground">Loading…</div>;
  }

  if (!user) return null;

  if (error) {
    return <div className="flex flex-1 items-center justify-center text-destructive">{error}</div>;
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b px-8 py-4">
        <div>
          <h1 className="text-lg font-bold">Welcome, {profile?.name}</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as {profile?.role === "consultant" ? "a consultant" : "a business owner"}
          </p>
        </div>
        <Button variant="outline" onClick={() => signOut()}>
          Sign out
        </Button>
      </div>
      {profile?.role === "consultant" ? <ConsultantDashboard /> : <ClientDashboard />}
    </div>
  );
}
