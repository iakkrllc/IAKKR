"use client";

import { useEffect, useState } from "react";
import { useAuth } from "./auth-context";
import type { Profile } from "./types";

/** Fetches (and lazily creates) the signed-in user's own profile row. */
export function useProfile() {
  const { session, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (authLoading) return;
    let cancelled = false;

    async function run() {
      if (!session) {
        if (!cancelled) {
          setProfile(null);
          setLoading(false);
        }
        return;
      }
      if (!cancelled) setLoading(true);
      try {
        const res = await fetch("/api/profile/me", {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Couldn't load your profile");
        if (!cancelled) {
          setProfile(json.profile as Profile);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [session, authLoading]);

  return { profile, loading: authLoading || loading, error };
}
