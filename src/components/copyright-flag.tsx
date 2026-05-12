"use client";

import { useState } from "react";

interface Props {
  contentId?:   string;
  contentType?: string;
  trigger?:     React.ReactNode;  // custom trigger element; defaults to a small flag button
}

export function CopyrightFlagButton({ contentId, contentType = "generated", trigger }: Props) {
  const [open,     setOpen]     = useState(false);
  const [email,    setEmail]    = useState("");
  const [name,     setName]     = useState("");
  const [desc,     setDesc]     = useState("");
  const [proof,    setProof]    = useState("");
  const [sworn,    setSworn]    = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);
  const [error,    setError]    = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sworn) { setError("You must check the sworn statement."); return; }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/copyright-flag", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({
          contentId,
          contentType,
          reporterEmail: email,
          reporterName:  name || null,
          description:   desc,
          proofUrl:      proof || null,
          sworn,
        }),
      });
      const d = await res.json() as { success?: boolean; error?: string; message?: string };
      if (!res.ok) { setError(d.error ?? "Failed to submit."); return; }
      setDone(true);
    } catch { setError("Network error. Try again."); }
    finally { setLoading(false); }
  }

  function reset() { setOpen(false); setDone(false); setEmail(""); setName(""); setDesc(""); setProof(""); setSworn(false); setError(""); }

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box",
    background: "#050505", border: "1px solid #1e1e1e",
    borderRadius: 8, padding: "9px 12px",
    fontSize: 13, color: "#ccc", outline: "none",
  };

  return (
    <>
      {/* Trigger */}
      <span onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
        {trigger ?? (
          <button
            style={{ background: "transparent", border: "1px solid #1a1a1a", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "#333", cursor: "pointer", letterSpacing: "0.04em" }}
            title="Report copyright infringement"
          >
            ⚑ Report
          </button>
        )}
      </span>

      {/* Modal backdrop */}
      {open && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
          onClick={e => { if (e.target === e.currentTarget) reset(); }}
        >
          <div style={{ background: "#0a0a0a", border: "1px solid #222", borderRadius: 16, padding: "28px 28px 24px", maxWidth: 520, width: "100%", maxHeight: "90vh", overflowY: "auto" }}>
            {done ? (
              <>
                <p style={{ fontSize: 18, fontWeight: 700, color: "#4ade80", margin: "0 0 8px" }}>Report received.</p>
                <p style={{ fontSize: 14, color: "#888", margin: "0 0 20px", lineHeight: 1.6 }}>
                  We will review your copyright report within 24 hours. If the content is found to infringe, it will be removed and the account may be suspended.
                </p>
                <button onClick={reset} style={{ background: "#111", border: "1px solid #222", borderRadius: 8, padding: "8px 18px", fontSize: 13, color: "#888", cursor: "pointer" }}>
                  Close
                </button>
              </>
            ) : (
              <form onSubmit={submit}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#FFF4C0" }}>Report Copyright Infringement</p>
                    <p style={{ margin: 0, fontSize: 12, color: "#444" }}>IKENGA responds to all valid copyright complaints within 24 hours.</p>
                  </div>
                  <button type="button" onClick={reset} style={{ background: "transparent", border: "none", color: "#444", fontSize: 18, cursor: "pointer", padding: "0 4px" }}>✕</button>
                </div>

                {/* Copyright notice */}
                <div style={{ background: "#060608", border: "1px solid #1a1a2a", borderRadius: 10, padding: "12px 14px", marginBottom: 18 }}>
                  <p style={{ margin: 0, fontSize: 12, color: "#666", lineHeight: 1.7 }}>
                    IKENGA acts as a platform, not a publisher. Users are solely responsible for the content they generate or upload. We respond to valid copyright complaints under safe harbour principles and will remove infringing content promptly.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { label: "Your email *",    val: email, set: setEmail, ph: "your@email.com",              type: "email", req: true  },
                    { label: "Your name",        val: name,  set: setName,  ph: "Optional",                    type: "text",  req: false },
                    { label: "Proof of ownership URL", val: proof, set: setProof, ph: "Link to original work (optional)", type: "url", req: false },
                  ].map(f => (
                    <div key={f.label}>
                      <label style={{ display: "block", fontSize: 11, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>{f.label}</label>
                      <input type={f.type} value={f.val} onChange={e => f.set(e.target.value)} required={f.req} placeholder={f.ph} style={inputStyle} />
                    </div>
                  ))}

                  <div>
                    <label style={{ display: "block", fontSize: 11, color: "#555", marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.07em" }}>Description of infringement *</label>
                    <textarea
                      value={desc} onChange={e => setDesc(e.target.value)} required
                      rows={4}
                      placeholder="Describe the infringing content and how it violates your copyright..."
                      style={{ ...inputStyle, resize: "vertical" as const }}
                    />
                  </div>

                  <label style={{ display: "flex", gap: 10, alignItems: "flex-start", cursor: "pointer" }}>
                    <input
                      type="checkbox" checked={sworn} onChange={e => setSworn(e.target.checked)}
                      style={{ marginTop: 2, flexShrink: 0 }}
                    />
                    <span style={{ fontSize: 12, color: "#666", lineHeight: 1.6 }}>
                      I swear under penalty of perjury that the information in this report is accurate and that I am the copyright owner or authorised to act on their behalf.
                    </span>
                  </label>
                </div>

                {error && (
                  <p style={{ margin: "12px 0 0", fontSize: 12, color: "#f87171", background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "8px 12px" }}>
                    {error}
                  </p>
                )}

                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button type="button" onClick={reset} style={{ flex: 1, background: "transparent", border: "1px solid #222", borderRadius: 8, padding: "10px", fontSize: 13, color: "#555", cursor: "pointer" }}>
                    Cancel
                  </button>
                  <button type="submit" disabled={loading} style={{ flex: 2, background: loading ? "#111" : "#dc2626", border: "none", borderRadius: 8, padding: "10px", fontSize: 13, fontWeight: 700, color: loading ? "#444" : "#fff", cursor: loading ? "not-allowed" : "pointer" }}>
                    {loading ? "Submitting…" : "Submit Report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
