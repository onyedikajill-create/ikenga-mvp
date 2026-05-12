// ============================================================
// GET /api/debug/session
// Shows what email the session cookie resolves to,
// and whether a user_profiles row exists for that email.
// DELETE THIS FILE once login is confirmed working.
// ============================================================

import { supabase } from "../../../../src/ikenga/lib/supabase";
import { getSessionEmail } from "../../../../src/ikenga/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<Response> {
  const email = await getSessionEmail();

  if (!email) {
    return Response.json({
      sessionEmail: null,
      cookieFound: false,
      profileExists: false,
      message: "No session cookie found. Visit /login first.",
    });
  }

  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("email, tier, gens_used, created_at")
    .eq("email", email)
    .maybeSingle();

  return Response.json({
    sessionEmail:  email,
    cookieFound:   true,
    profileExists: !!profile,
    profileRow:    profile ?? null,
    dbError:       error?.message ?? null,
    message:       profile
      ? "Session and profile both OK."
      : error
        ? `Profile query failed: ${error.message}`
        : "Session OK but no profile row — will be auto-created on next dashboard load.",
  });
}
