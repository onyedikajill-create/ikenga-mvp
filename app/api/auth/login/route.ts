// ============================================================
// POST /api/auth/login
// Email login with:
//   - Disposable email blocking
//   - Ban check
//   - IP forensics logging
//   - OTP email verification (requires RESEND_API_KEY)
// ============================================================

import { supabase } from "../../../../src/ikenga/lib/supabase";
import { setSessionCookie } from "../../../../src/ikenga/lib/session";
import { awardPoints } from "../../points/route";
import { isDisposableEmail } from "../../../../src/ikenga/lib/disposableEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_TTL_MINUTES = 15;

// ── Resend helper (inline, no shared dep) ───────────────────
async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) return false; // dev mode — skip verification

  const from = process.env.IKENGA_FROM_EMAIL?.trim() ?? "IKENGA AI <onboarding@resend.dev>";
  const html = `
<!DOCTYPE html><html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#000;font-family:system-ui,-apple-system,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#000;padding:40px 20px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">
        <tr><td style="padding:0 0 28px;text-align:center">
          <p style="margin:0;font-size:22px;font-weight:700;letter-spacing:.18em;color:#FFD700">IKENGA</p>
          <p style="margin:4px 0 0;font-size:10px;text-transform:uppercase;letter-spacing:.22em;color:#666">Chi in Motion</p>
        </td></tr>
        <tr><td style="background:#111;border:1px solid #222;border-radius:16px;padding:40px">
          <h1 style="margin:0 0 12px;font-size:24px;font-weight:700;color:#FFF4C0">Verify your email</h1>
          <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#888">
            Enter this code in the IKENGA tab to complete your login. It expires in ${OTP_TTL_MINUTES} minutes.
          </p>
          <div style="background:#0a0800;border:2px solid #FFD700;border-radius:12px;padding:24px;text-align:center;margin:0 0 28px">
            <p style="margin:0;font-size:42px;font-weight:700;letter-spacing:.3em;color:#FFD700;font-family:monospace">${otp}</p>
          </div>
          <p style="margin:0;font-size:13px;color:#444;line-height:1.6">
            If you did not request this, ignore this email. Your account remains secure.
          </p>
        </td></tr>
        <tr><td style="padding:20px 0 0;text-align:center">
          <p style="margin:0;font-size:12px;color:#333">© 2026 IKENGA AI · Chi in Motion</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`.trim();

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject: `${otp} — your IKENGA verification code`, html }),
  });
  return res.ok;
}

// ── IP helper ────────────────────────────────────────────────
function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  );
}

// ── Forensics: log IP and check ban status ───────────────────
async function checkAndLogForensics(
  email: string,
  ip: string,
): Promise<{ banned: boolean; banReason?: string }> {
  try {
    const { data } = await supabase
      .from("user_forensics")
      .select("ip_addresses, banned_at, ban_reason")
      .eq("email", email)
      .maybeSingle();

    if (data?.banned_at) {
      return { banned: true, banReason: data.ban_reason ?? "Account suspended." };
    }

    // Upsert — append IP if not already in list
    const existing = (data?.ip_addresses as string[] | null) ?? [];
    const ips = existing.includes(ip) ? existing : [...existing.slice(-19), ip]; // keep last 20

    await supabase.from("user_forensics").upsert(
      {
        email,
        ip_addresses: ips,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "email" }
    );
  } catch { /* table may not exist yet */ }

  return { banned: false };
}

// ── Main handler ─────────────────────────────────────────────

export async function POST(request: Request): Promise<Response> {
  let body: Record<string, unknown>;
  try { body = await request.json(); }
  catch { return Response.json({ error: "Invalid JSON body." }, { status: 400 }); }

  const raw = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!raw || !EMAIL_RE.test(raw)) {
    return Response.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  // 1. Block disposable emails
  if (isDisposableEmail(raw)) {
    return Response.json({
      error: "Temporary or disposable email addresses are not accepted. Please use your real email.",
    }, { status: 400 });
  }

  const ip = getClientIp(request);

  // 2. Check ban status + log IP
  const { banned, banReason } = await checkAndLogForensics(raw, ip);
  if (banned) {
    return Response.json({ error: banReason ?? "This account has been suspended." }, { status: 403 });
  }

  const displayName =
    typeof body.displayName === "string" && body.displayName.trim()
      ? body.displayName.trim()
      : null;

  // Upsert waitlist + user_profiles (non-blocking)
  void supabase.from("waitlist_signups").upsert(
    { email: raw, source: "direct-login", status: "active" },
    { onConflict: "email", ignoreDuplicates: true }
  );

  const { error: profileError } = await supabase
    .from("user_profiles")
    .upsert(
      { email: raw, ...(displayName ? { display_name: displayName } : {}) },
      { onConflict: "email", ignoreDuplicates: false }
    );

  if (profileError) {
    console.warn("user_profiles upsert failed:", profileError.message);
  }

  // 3. Check if RESEND is configured — if not, skip verification (dev mode)
  const resendKey = process.env.RESEND_API_KEY?.trim();
  if (!resendKey) {
    // Dev mode: log in directly
    void awardPoints(raw, "signup", { source: "login" }).catch(() => {});
    void supabase.from("generation_logs").insert({ email: raw, label: "Logged in (dev — no OTP)" });
    await setSessionCookie(raw);
    return Response.json({ success: true, email: raw });
  }

  // 4. Check if already verified
  const { data: verRow } = await supabase
    .from("email_verifications")
    .select("verified_at")
    .eq("email", raw)
    .maybeSingle();

  if (verRow?.verified_at) {
    // Already verified — set session immediately
    void awardPoints(raw, "signup", { source: "login" }).catch(() => {});
    void supabase.from("generation_logs").insert({ email: raw, label: "Logged in" });
    await setSessionCookie(raw);
    return Response.json({ success: true, email: raw });
  }

  // 5. Generate OTP and send verification email
  const otp = String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60 * 1000).toISOString();

  await supabase.from("email_verifications").upsert(
    { email: raw, otp, expires_at: expiresAt, attempts: 0 },
    { onConflict: "email" }
  );

  const sent = await sendOtpEmail(raw, otp);
  if (!sent) {
    // Resend failed — fall back to direct login so users aren't locked out
    console.warn("OTP email failed to send for:", raw);
    void awardPoints(raw, "signup", { source: "login" }).catch(() => {});
    await setSessionCookie(raw);
    return Response.json({ success: true, email: raw });
  }

  return Response.json({ requiresVerification: true, email: raw });
}
