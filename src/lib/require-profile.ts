import type { NextRequest } from "next/server";
import { requireUser } from "./require-user";
import { getSupabaseAdmin } from "./supabase-admin";
import type { Profile } from "./types";

/** Resolves the caller's auth user AND their profile row (role/name) in one call. */
export async function requireProfile(req: NextRequest) {
  const user = await requireUser(req);
  if (!user) return null;

  const admin = getSupabaseAdmin();
  const { data } = await admin.from("profiles").select("*").eq("id", user.id).maybeSingle();
  if (!data) return null;

  return { user, profile: data as Profile };
}
