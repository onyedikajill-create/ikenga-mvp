// app/ikenga/page.tsx - IKENGA V2.0 Social Media Command Center
"use client";

import { useState } from "react";
import Link from "next/link";

type Platform = "instagram" | "facebook" | "twitter" | "linkedin" | "tiktok" | "whatsapp" | "youtube" | "threads" | "bluesky" | "pinterest" | "telegram" | "discord" | "slack" | "circle" | "substack" | "medium" | "snapchat" | "mastodon";

const PLATFORMS: { id: Platform; name: string; icon: string; color: string }[] = [
  { id: "instagram", name: "Instagram", icon: "📸", color: "#E4405F" },
  { id: "facebook", name: "Facebook", icon: "👍", color: "#1877F2" },
  { id: "twitter", name: "Twitter/X", icon: "🐦", color: "#1DA1F2" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "#0A66C2" },
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "#000000" },
  { id: "whatsapp", name: "WhatsApp", icon: "💬", color: "#25D366" },
  { id: "youtube", name: "YouTube", icon: "📺", color: "#FF0000" },
  { id: "threads", name: "Threads", icon: "🧵", color: "#000000" },
  { id: "bluesky", name: "Bluesky", icon: "🦋", color: "#0085FF" },
  { id: "pinterest", name: "Pinterest", icon: "📌", color: "#E60023" },
  { id: "telegram", name: "Telegram", icon: "✈️", color: "#26A5E4" },
  { id: "discord", name: "Discord", icon: "🎮", color: "#5865F2" },
  { id: "slack", name: "Slack", icon: "💬", color: "#4A154B" },
  { id: "circle", name: "Circle", icon: "🟢", color: "#1B4D3E" },
  { id: "substack", name: "Substack", icon: "📧", color: "#FF6719" },
  { id: "medium", name: "Medium", icon: "📝", color: "#000000" },
  { id: "snapchat", name: "Snapchat", icon: "👻", color: "#FFFC00" },
  { id: "mastodon", name: "Mastodon", icon: "🐘", color: "#6364FF" },
];

type Post = {
  id: string;
  platform: string;
  day: string;
  scheduledTime: string;
  caption: string;
  hook: string;
  hashtags: string[];
  callToAction: string;
  previewHtml: string;
};

type Tone = "IKENGA" | "JUO" | "OBA" | "OMENALA" | "ICHEOKU";

const TONES: { id: Tone; name: string; color: string; description: string }[] = [
  { id: "IKENGA", name: "IKENGA", color: "#FFD700", description: "Bold, authentic, momentum-driven" },
  { id: "JUO", name: "JUO", color: "#60A5FA", description: "Warm, inclusive, community-first" },
  { id: "OBA", name: "OBA", color: "#c084fc", description: "Authoritative, commanding, premium" },
  { id: "OMENALA", name: "OMENALA", color: "#4ade80", description: "Playful, energetic, culturally rooted" },
  { id: "ICHEOKU", name: "ICHEOKU", color: "#f97316", description: "Analytical, data-driven, investor-grade" },
];

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function IkengaPage() {
  const [brandName, setBrandName] = useState("");
  const [brandNiche, setBrandNiche] = useState("");
  const [selectedTone, setSelectedTone] = useState<Tone>("IKENGA");
  const [primaryGoal, setPrimaryGoal] = useState("brand_awareness");
  const [contentType, setContentType] = useState("educational");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(["instagram", "linkedin"]);
  const [generating, setGenerating] = useState(false);
  const [schedule, setSchedule] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [error, setError] = useState("");

  async function generatePlan() {
    if (!brandName || !brandNiche) {
      setError("Please enter your brand name and niche");
      return;
    }
    if (selectedPlatforms.length === 0) {
      setError("Please select at least one platform");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const weekStarting = getMondayISO();
      const response = await fetch("/api/ikenga/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName,
          brandNiche,
          platforms: selectedPlatforms,
          weekStarting,
          toneId: selectedTone,
          primaryGoal,
          contentType,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Failed to generate content plan");
        return;
      }

      const data = await response.json();
      setSchedule(data.posts || []);
    } catch {
      setError("Failed to generate content plan. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function publishPost(postId: string) {
    try {
      const response = await fetch("/api/ikenga/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId }),
      });
      const data = await response.json();
      if (data.success) {
        alert("✅ Post queued for publishing!");
      } else {
        alert(`❌ Failed: ${data.error}`);
      }
    } catch {
      alert("❌ Failed to publish post");
    }
  }

  async function publishAll() {
    if (!schedule.length) return;
    let success = 0;
    let failed = 0;
    for (const post of schedule) {
      try {
        const response = await fetch("/api/ikenga/publish", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postId: post.id }),
        });
        const data = await response.json();
        if (data.success) success++;
        else failed++;
      } catch {
        failed++;
      }
    }
    alert(`📊 Queued: ${success} | Failed: ${failed}`);
  }

  const pageStyle: React.CSSProperties = { minHeight: "100vh", background: "#0a0800", color: "#fff" };
  const heroStyle: React.CSSProperties = {
    background: "linear-gradient(135deg, #1B4D3E 0%, #0f3328 100%)",
    padding: "3rem 1.25rem 2.5rem",
  };
  const heroInnerStyle: React.CSSProperties = { maxWidth: 1200, margin: "0 auto" };
  const tagStyle: React.CSSProperties = {
    display: "inline-block",
    background: "rgba(212,175,55,0.2)",
    border: "1px solid rgba(212,175,55,0.4)",
    color: "#D4AF37",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    padding: "0.3rem 0.75rem",
    borderRadius: "999px",
    marginBottom: "0.85rem",
  };
  const titleStyle: React.CSSProperties = {
    margin: "0 0 0.6rem",
    fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
    fontWeight: 800,
    color: "#FFFFFF",
    lineHeight: 1.1,
  };
  const subStyle: React.CSSProperties = {
    margin: 0,
    color: "rgba(255,255,255,0.8)",
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: "55ch",
  };
  const contentStyle: React.CSSProperties = {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "2rem 1.25rem 5rem",
  };
  const sectionCardStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1.5px solid #E2E8F0",
    borderRadius: "0.85rem",
    padding: "1.5rem",
    marginBottom: "1.5rem",
  };
  const sectionTitleStyle: React.CSSProperties = {
    margin: "0 0 1rem",
    fontSize: "1rem",
    fontWeight: 800,
    color: "#0A1C2E",
  };
  const setupGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "0.75rem",
  };
  const inputStyle: React.CSSProperties = {
    padding: "0.75rem 1rem",
    borderRadius: "0.5rem",
    border: "1.5px solid #E2E8F0",
    fontSize: "0.88rem",
    fontFamily: "inherit",
    outline: "none",
  };
  const selectStyle: React.CSSProperties = { ...inputStyle, background: "#FFFFFF", cursor: "pointer" };
  const platformGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
    gap: "0.5rem",
  };
  const platformButtonStyle: React.CSSProperties = {
    padding: "0.6rem 0.5rem",
    borderRadius: "0.5rem",
    border: "2px solid",
    cursor: "pointer",
    fontFamily: "inherit",
    fontWeight: 600,
    fontSize: "0.78rem",
    transition: "all 0.15s",
    textAlign: "center" as const,
  };
  const generateButtonStyle: React.CSSProperties = {
    width: "100%",
    padding: "1rem",
    background: "#1B4D3E",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "0.6rem",
    fontWeight: 700,
    fontSize: "1rem",
    cursor: "pointer",
    marginBottom: "1.5rem",
    fontFamily: "inherit",
  };
  const calendarContainerStyle: React.CSSProperties = {
    background: "#FFFFFF",
    border: "1.5px solid #E2E8F0",
    borderRadius: "0.85rem",
    overflow: "hidden",
  };
  const calendarHeaderStyle: React.CSSProperties = {
    padding: "1rem 1.5rem",
    borderBottom: "1px solid #E2E8F0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap" as const,
    gap: "0.5rem",
  };
  const calendarTitleStyle: React.CSSProperties = {
    margin: 0,
    fontSize: "1.1rem",
    fontWeight: 800,
    color: "#0A1C2E",
  };
  const calendarSubStyle: React.CSSProperties = {
    margin: "0.25rem 0 0",
    fontSize: "0.78rem",
    color: "#64748B",
  };
  const publishAllButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "#D4AF37",
    color: "#0A1C2E",
    border: "none",
    borderRadius: "0.45rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  };
  const calendarGridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "1px",
    background: "#E2E8F0",
  };
  const dayColumnStyle: React.CSSProperties = {
    background: "#FFFFFF",
    minHeight: "400px",
  };
  const dayHeaderStyle: React.CSSProperties = {
    margin: 0,
    padding: "0.6rem 0.5rem",
    textAlign: "center" as const,
    fontWeight: 700,
    fontSize: "0.8rem",
    borderBottom: "1px solid #E2E8F0",
    color: "#0A1C2E",
  };
  const postsContainerStyle: React.CSSProperties = {
    padding: "0.5rem",
    display: "flex",
    flexDirection: "column" as const,
    gap: "0.5rem",
  };
  const emptySlotStyle: React.CSSProperties = {
    padding: "1rem 0.5rem",
    textAlign: "center" as const,
    color: "#94A3B8",
    fontSize: "0.7rem",
  };
  const postCardStyle: React.CSSProperties = {
    padding: "0.6rem",
    background: "#F8FAFC",
    borderRadius: "0.45rem",
    border: "1px solid #E2E8F0",
    cursor: "pointer",
  };
  const postPlatformBadge = (color: string): React.CSSProperties => ({
    display: "inline-flex",
    padding: "0.15rem 0.45rem",
    borderRadius: "0.25rem",
    fontSize: "0.6rem",
    fontWeight: 700,
    background: color,
    color: color === "#FFFC00" ? "#0A1C2E" : "#FFFFFF",
    marginBottom: "0.4rem",
  });
  const postHookStyle: React.CSSProperties = {
    margin: "0.3rem 0",
    fontSize: "0.72rem",
    fontWeight: 700,
    color: "#0A1C2E",
    lineHeight: 1.3,
  };
  const postCaptionPreviewStyle: React.CSSProperties = {
    margin: "0.2rem 0",
    fontSize: "0.65rem",
    color: "#64748B",
    lineHeight: 1.4,
  };
  const postHashtagsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.2rem",
    flexWrap: "wrap" as const,
    margin: "0.4rem 0",
  };
  const hashtagStyle: React.CSSProperties = { fontSize: "0.6rem", color: "#D4AF37" };
  const postFooterStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "0.4rem",
  };
  const postTimeStyle: React.CSSProperties = { fontSize: "0.6rem", color: "#64748B" };
  const postPublishButtonStyle: React.CSSProperties = {
    padding: "0.2rem 0.45rem",
    background: "#1B4D3E",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "0.25rem",
    fontSize: "0.6rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  };
  const modalOverlayStyle: React.CSSProperties = {
    position: "fixed" as const,
    inset: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(4px)",
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  };
  const modalContentStyle: React.CSSProperties = {
    background: "#FFFFFF",
    borderRadius: "1rem",
    maxWidth: 600,
    width: "100%",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  };
  const modalCloseStyle: React.CSSProperties = {
    position: "absolute" as const,
    right: 16,
    top: 16,
    background: "none",
    border: "none",
    fontSize: 24,
    cursor: "pointer",
    color: "#64748B",
  };
  const modalPreviewStyle: React.CSSProperties = { padding: "1.5rem" };
  const modalPlatformBadge = (color: string): React.CSSProperties => ({
    display: "inline-flex",
    padding: "0.15rem 0.45rem",
    borderRadius: "0.25rem",
    fontSize: "0.6rem",
    fontWeight: 700,
    background: color,
    color: "#FFFFFF",
    marginBottom: "0.4rem",
  });
  const modalHookStyle: React.CSSProperties = {
    margin: "0.5rem 0",
    fontSize: "1.1rem",
    fontWeight: 700,
    color: "#0A1C2E",
  };
  const modalCaptionStyle: React.CSSProperties = {
    margin: "0.5rem 0",
    fontSize: "0.88rem",
    color: "#64748B",
    lineHeight: 1.7,
  };
  const modalHashtagsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.3rem",
    flexWrap: "wrap" as const,
    margin: "0.5rem 0",
  };
  const modalHashtagStyle: React.CSSProperties = {
    fontSize: "0.7rem",
    color: "#D4AF37",
    background: "rgba(212,175,55,0.1)",
    padding: "0.15rem 0.4rem",
    borderRadius: "0.25rem",
  };
  const modalCTAStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    margin: "0.75rem 0",
    fontSize: "0.88rem",
    color: "#1B4D3E",
    fontWeight: 600,
  };
  const modalActionsStyle: React.CSSProperties = {
    display: "flex",
    gap: "0.5rem",
    padding: "1rem 1.5rem",
    borderTop: "1px solid #E2E8F0",
  };
  const modalPublishButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "#1B4D3E",
    color: "#FFFFFF",
    border: "none",
    borderRadius: "0.45rem",
    fontWeight: 700,
    cursor: "pointer",
    fontFamily: "inherit",
  };
  const modalCopyButtonStyle: React.CSSProperties = {
    padding: "0.5rem 1rem",
    background: "#F8FAFC",
    color: "#0A1C2E",
    border: "1px solid #E2E8F0",
    borderRadius: "0.45rem",
    fontWeight: 600,
    cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <>
      <header style={{ padding: "1rem 1.25rem", borderBottom: "1px solid rgba(255,215,0,0.12)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "#FFD700" }}>
          <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: "0.15em" }}>IKENGA</span>
        </Link>
        <Link href="/dashboard" style={{ color: "#D4AF37", textDecoration: "none", fontSize: 14, fontWeight: 600 }}>
          Dashboard →
        </Link>
      </header>

      <main style={pageStyle}>
        {/* Hero */}
        <div style={heroStyle}>
          <div style={heroInnerStyle}>
            <span style={tagStyle}>🎯 IKENGA™ V2.0 COMMAND CENTER</span>
            <h1 style={titleStyle}>AI-Powered Social Media Command Center</h1>
            <p style={subStyle}>
              Generate, preview, schedule, and publish content across 18 platforms.
              Built for brands that refuse to move small.
            </p>
          </div>
        </div>

        <div style={contentStyle}>
          {/* Brand Setup */}
          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>1. Brand Profile</h2>
            <div style={setupGridStyle}>
              <input
                type="text"
                placeholder="Brand Name *"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                style={inputStyle}
              />
              <input
                type="text"
                placeholder="Brand Niche (e.g. Fashion, Tech, Food) *"
                value={brandNiche}
                onChange={(e) => setBrandNiche(e.target.value)}
                style={inputStyle}
              />
              <select value={selectedTone} onChange={(e) => setSelectedTone(e.target.value as Tone)} style={selectStyle}>
                {TONES.map(t => (
                  <option key={t.id} value={t.id}>{t.name} — {t.description}</option>
                ))}
              </select>
              <select value={primaryGoal} onChange={(e) => setPrimaryGoal(e.target.value)} style={selectStyle}>
                <option value="brand_awareness">Brand Awareness</option>
                <option value="lead_generation">Lead Generation</option>
                <option value="sales">Sales</option>
                <option value="community">Community Building</option>
              </select>
              <select value={contentType} onChange={(e) => setContentType(e.target.value)} style={selectStyle}>
                <option value="educational">Educational</option>
                <option value="inspirational">Inspirational</option>
                <option value="promotional">Promotional</option>
                <option value="entertaining">Entertaining</option>
                <option value="interactive">Interactive</option>
              </select>
            </div>
          </div>

          {/* Platform Selection */}
          <div style={sectionCardStyle}>
            <h2 style={sectionTitleStyle}>
              2. Select Platforms{" "}
              <span style={{ fontWeight: 400, color: "#64748B" }}>
                ({selectedPlatforms.length}/18 selected)
              </span>
            </h2>
            <div style={platformGridStyle}>
              {PLATFORMS.map((platform) => {
                const active = selectedPlatforms.includes(platform.id);
                return (
                  <button
                    key={platform.id}
                    style={{
                      ...platformButtonStyle,
                      background: active ? platform.color : "#F8FAFC",
                      color: active ? "#FFFFFF" : "#0A1C2E",
                      borderColor: platform.color,
                      opacity: platform.id === "snapchat" && active ? 0.85 : 1,
                    }}
                    onClick={() =>
                      setSelectedPlatforms((prev) =>
                        prev.includes(platform.id)
                          ? prev.filter((p) => p !== platform.id)
                          : [...prev, platform.id]
                      )
                    }
                  >
                    {platform.icon} {platform.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ background: "#1a0000", border: "1px solid #3a0000", borderRadius: 8, padding: "10px 13px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontSize: 13, color: "#f87171" }}>{error}</p>
            </div>
          )}

          {/* Generate Button */}
          <button
            style={{
              ...generateButtonStyle,
              opacity: generating || !brandName || !brandNiche || !selectedPlatforms.length ? 0.6 : 1,
              cursor: generating || !brandName || !brandNiche || selectedPlatforms.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={generatePlan}
            disabled={generating || !brandName || !brandNiche || selectedPlatforms.length === 0}
          >
            {generating ? "⏳ Generating Your Content Plan..." : "✨ Generate Weekly Content Plan"}
          </button>

          {/* Calendar — 7-Day View */}
          {schedule.length > 0 && (
            <div style={calendarContainerStyle}>
              <div style={calendarHeaderStyle}>
                <div>
                  <h2 style={calendarTitleStyle}>📅 Week of {getMondayISO()}</h2>
                  <p style={calendarSubStyle}>
                    {schedule.length} posts across {selectedPlatforms.length} platform
                    {selectedPlatforms.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <button style={publishAllButtonStyle} onClick={publishAll}>
                  🚀 Publish All ({schedule.length})
                </button>
              </div>

              <div style={calendarGridStyle}>
                {DAYS.map((day) => {
                  const dayPosts = schedule.filter((p) => p.day === day);
                  return (
                    <div key={day} style={dayColumnStyle}>
                      <p style={dayHeaderStyle}>{day}</p>
                      <div style={postsContainerStyle}>
                        {dayPosts.length === 0 && (
                          <div style={emptySlotStyle}>No posts</div>
                        )}
                        {dayPosts.map((post, idx) => {
                          const platform = PLATFORMS.find((p) => p.id === post.platform);
                          return (
                            <div
                              key={idx}
                              style={postCardStyle}
                              onClick={() => {
                                setSelectedPost(post);
                                setShowPreview(true);
                              }}
                            >
                              <div style={postPlatformBadge(platform?.color || "#1B4D3E")}>
                                {platform?.icon} {platform?.name}
                              </div>
                              <p style={postHookStyle}>"{post.hook}"</p>
                              <p style={postCaptionPreviewStyle}>
                                {post.caption.substring(0, 80)}...
                              </p>
                              <div style={postHashtagsStyle}>
                                {post.hashtags.slice(0, 3).map((tag) => (
                                  <span key={tag} style={hashtagStyle}>
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                              <div style={postFooterStyle}>
                                <span style={postTimeStyle}>⏰ {post.scheduledTime}</span>
                                <button
                                  style={postPublishButtonStyle}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    publishPost(post.id);
                                  }}
                                >
                                  Publish
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Preview */}
      {showPreview && selectedPost && (
        <div style={modalOverlayStyle} onClick={() => setShowPreview(false)}>
          <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
            <button style={modalCloseStyle} onClick={() => setShowPreview(false)}>
              ✕
            </button>
            <div style={modalPreviewStyle}>
              <div
                style={modalPlatformBadge(
                  PLATFORMS.find((p) => p.id === selectedPost.platform)?.color || "#1B4D3E"
                )}
              >
                {PLATFORMS.find((p) => p.id === selectedPost.platform)?.icon}{" "}
                {selectedPost.platform.toUpperCase()} PREVIEW
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={modalHookStyle}>✨ {selectedPost.hook}</p>
                <p style={modalCaptionStyle}>{selectedPost.caption}</p>
                <div style={modalHashtagsStyle}>
                  {selectedPost.hashtags.map((tag) => (
                    <span key={tag} style={modalHashtagStyle}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <div style={modalCTAStyle}>
                  <span>👉 </span>
                  {selectedPost.callToAction}
                </div>
              </div>
            </div>
            <div style={modalActionsStyle}>
              <button
                style={modalPublishButtonStyle}
                onClick={() => {
                  publishPost(selectedPost.id);
                  setShowPreview(false);
                }}
              >
                📤 Publish Now
              </button>
              <button
                style={modalCopyButtonStyle}
                onClick={() => {
                  navigator.clipboard.writeText(selectedPost.caption);
                  alert("Caption copied!");
                }}
              >
                📋 Copy Caption
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .ikenga-calendar-grid { grid-template-columns: repeat(4, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .ikenga-calendar-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .ikenga-platform-grid { grid-template-columns: repeat(3, 1fr) !important; }
        }
      `}</style>
    </>
  );
}

function getMondayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - d.getDay() + 1);
  return d.toISOString().split("T")[0];
}
