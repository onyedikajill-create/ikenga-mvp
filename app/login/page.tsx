"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "email" | "otp";

export default function LoginPage() {
  const router = useRouter();

  const [step,    setStep]    = useState<Step>("email");
  const [email,   setEmail]   = useState("");
  const [name,    setName]    = useState("");
  const [otp,     setOtp]     = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [resent,  setResent]  = useState(false);

  // ── Step 1: request login / OTP ─────────────────────────────
  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), displayName: name.trim() }),
      });
      const data = await res.json() as { success?: boolean; requiresVerification?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Login failed. Please try again.");
        return;
      }

      if (data.requiresVerification) {
        setStep("otp");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Step 2: submit OTP ────────────────────────────────────────
  async function handleOtp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), otp: otp.trim() }),
      });
      const data = await res.json() as { success?: boolean; error?: string };

      if (!res.ok) {
        setError(data.error ?? "Verification failed. Please try again.");
        return;
      }

      router.push("/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Resend OTP ────────────────────────────────────────────────
  async function handleResend() {
    setError("");
    setResent(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) setResent(true);
      else {
        const d = await res.json() as { error?: string };
        setError(d.error ?? "Could not resend. Try again.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 440 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 700, letterSpacing: "0.18em", color: "#FFD700" }}>
            IKENGA
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.22em", color: "#555" }}>
            Chi in Motion
          </p>
        </div>

        <div
          style={{
            background: "#111",
            border: "1px solid #222",
            borderRadius: 16,
            padding: "40px 36px",
          }}
        >
          {step === "email" ? (
            <>
              <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#FFF4C0" }}>
                Access your dashboard
              </h1>
              <p style={{ margin: "0 0 32px", fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                Enter the email you used to join the waitlist.
              </p>

              <form onSubmit={handleEmail} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Your name (optional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Jill"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Email address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                    style={inputStyle}
                  />
                </div>

                {error && <ErrorBox message={error} />}

                <button type="submit" disabled={loading} style={btnStyle(loading)}>
                  {loading ? "Sending code…" : "Continue →"}
                </button>
              </form>

              <p style={{ margin: "24px 0 0", fontSize: 13, color: "#444", textAlign: "center" }}>
                Not on the waitlist?{" "}
                <a href="/" style={{ color: "#FFD700", textDecoration: "none" }}>Sign up here →</a>
              </p>
            </>
          ) : (
            <>
              <h1 style={{ margin: "0 0 8px", fontSize: 22, fontWeight: 700, color: "#FFF4C0" }}>
                Check your email
              </h1>
              <p style={{ margin: "0 0 8px", fontSize: 14, color: "#666", lineHeight: 1.6 }}>
                We sent a 6-digit verification code to
              </p>
              <p style={{ margin: "0 0 28px", fontSize: 14, fontWeight: 700, color: "#FFD700" }}>
                {email}
              </p>

              <form onSubmit={handleOtp} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontSize: 12, color: "#777", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Verification code *
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    required
                    placeholder="000000"
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    style={{ ...inputStyle, fontSize: 28, letterSpacing: "0.3em", textAlign: "center", fontFamily: "monospace" }}
                  />
                </div>

                {error && <ErrorBox message={error} />}
                {resent && (
                  <p style={{ margin: 0, fontSize: 13, color: "#4ade80", background: "#001a00", border: "1px solid #003a00", borderRadius: 8, padding: "10px 14px" }}>
                    New code sent. Check your inbox.
                  </p>
                )}

                <button type="submit" disabled={loading || otp.length < 6} style={btnStyle(loading || otp.length < 6)}>
                  {loading ? "Verifying…" : "Verify & Enter Dashboard →"}
                </button>
              </form>

              <div style={{ marginTop: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  onClick={() => { setStep("email"); setOtp(""); setError(""); }}
                  style={{ background: "none", border: "none", color: "#444", fontSize: 13, cursor: "pointer", padding: 0 }}
                >
                  ← Change email
                </button>
                <button
                  onClick={handleResend}
                  disabled={loading}
                  style={{ background: "none", border: "none", color: "#555", fontSize: 13, cursor: loading ? "not-allowed" : "pointer", padding: 0 }}
                >
                  Resend code
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// ── Shared styles ─────────────────────────────────────────────

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0a0a0a",
  border: "1px solid #333",
  borderRadius: 8,
  padding: "12px 14px",
  fontSize: 15,
  color: "#fff",
  boxSizing: "border-box",
  outline: "none",
};

function btnStyle(disabled: boolean): React.CSSProperties {
  return {
    marginTop: 8,
    background: disabled ? "#333" : "#FFD700",
    color: disabled ? "#666" : "#000",
    border: "none",
    borderRadius: 100,
    padding: "14px 32px",
    fontSize: 15,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity 0.2s",
  };
}

function ErrorBox({ message }: { message: string }) {
  return (
    <p style={{ margin: 0, fontSize: 13, color: "#ff6b6b", background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "10px 14px" }}>
      {message}
    </p>
  );
}
