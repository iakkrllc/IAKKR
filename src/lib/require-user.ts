import type { NextRequest } from "next/server";
import { getSupabaseAdmin } from "./supabase-admin";

/** Extracts the bearer token from the request and resolves it to a Supabase user, or null. */
export async function requireUser(req: NextRequest) {
  const authHeader = req.headers.get("authorization") ?? "";
  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!token) return null;

  const admin = getSupabaseAdmin();
  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}
