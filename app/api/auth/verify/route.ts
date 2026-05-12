// ============================================================
// POST /api/auth/verify
// Validates OTP and sets session cookie on success.
// ============================================================

import { supabase } from "../../../../src/ikenga/lib/supabase";
import { setSessionCookie } from "../../../../src/ikenga/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_ATTEMPTS = 5;

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const otp   = typeof body.otp   === "string" ? body.otp.trim()                : "";

  if (!email || !otp) {
    return Response.json({ error: "email and otp are required." }, { status: 400 });
  }

  const { data: row } = await supabase
    .from("email_verifications")
    .select("otp, expires_at, attempts, verified_at")
    .eq("email", email)
    .maybeSingle();

  if (!row) {
    return Response.json({ error: "No verification code found. Request a new one." }, { status: 400 });
  }

  if (row.verified_at) {
    // Already verified — just set session
    await setSessionCookie(email);
    return Response.json({ success: true, email });
  }

  if (row.attempts >= MAX_ATTEMPTS) {
    return Response.json({ error: "Too many attempts. Request a new code." }, { status: 429 });
  }

  if (new Date(row.expires_at) < new Date()) {
    return Response.json({ error: "Code expired. Request a new one." }, { status: 400 });
  }

  // Increment attempt count regardless of outcome (prevent brute force)
  await supabase
    .from("email_verifications")
    .update({ attempts: row.attempts + 1 })
    .eq("email", email);

  if (row.otp !== otp) {
    const remaining = MAX_ATTEMPTS - (row.attempts + 1);
    return Response.json({ error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.` }, { status: 400 });
  }

  // Valid — mark verified, set session
  await supabase
    .from("email_verifications")
    .update({ verified_at: new Date().toISOString() })
    .eq("email", email);

  // Also mark the user_profiles row as verified (column may not exist yet — non-blocking)
  void (async () => {
    try {
      await supabase
        .from("user_profiles")
        .update({ email_verified: true } as Record<string, unknown>)
        .eq("email", email);
    } catch { /* column may not exist yet */ }
  })();

  await setSessionCookie(email);
  return Response.json({ success: true, email });
}
