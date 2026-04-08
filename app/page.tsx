import { WaitlistForm } from "@/src/components/waitlist-form";

const launchSignals = [
  "Private beta onboarding",
  "Brand-memory setup",
  "Content engine activation",
];

const features = [
  {
    label: "01",
    title: "Chi Engine",
    description:
      "Reads your brand's rhythm, spots inconsistency, and turns dormant periods into deliberate momentum.",
  },
  {
    label: "02",
    title: "AI Content Engine",
    description:
      "Transforms rough ideas, voice notes, and campaign goals into posts, threads, and captions with conviction.",
  },
  {
    label: "03",
    title: "Brand Voice Training",
    description:
      "Captures your tone, boundaries, and language habits so every output feels native to your brand instead of generic.",
  },
  {
    label: "04",
    title: "Multi-Platform Intelligence",
    description:
      "Keeps your publishing rhythm connected across channels so you can learn what resonates and compound it fast.",
  },
];

const audiences = [
  {
    title: "Creators",
    description:
      "Stay visible without sacrificing your voice every time content pressure spikes.",
  },
  {
    title: "Agencies",
    description:
      "Scale client content systems with sharper memory, faster drafts, and less handholding.",
  },
  {
    title: "Founder-led brands",
    description:
      "Turn scattered insight into a repeatable public presence that actually sounds like leadership.",
  },
];

function IkengaSeal({
  sizeClasses,
  textClasses,
  className = "",
}: {
  sizeClasses: string;
  textClasses: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={[
        "flex items-center justify-center rounded-full border border-[#FFD700]/35",
        "bg-[radial-gradient(circle_at_30%_30%,rgba(255,215,0,0.35),rgba(255,215,0,0.08)_45%,rgba(0,0,0,0.85)_100%)]",
        "shadow-[0_0_40px_rgba(255,215,0,0.16)]",
        sizeClasses,
        className,
      ].join(" ")}
    >
      <span
        className={[
          "font-semibold tracking-[0.28em] text-[#FFD700]",
          textClasses,
        ].join(" ")}
      >
        IK
      </span>
    </div>
  );
}

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(234,179,8,0.14),transparent_42%)]" />
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(180deg,rgba(255,215,0,0.06),transparent)]" />
      </div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-20">
        <IkengaSeal
          sizeClasses="h-[340px] w-[340px] sm:h-[500px] sm:w-[500px]"
          textClasses="text-5xl sm:text-7xl"
          className="select-none"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 pb-12 pt-6 sm:px-8 sm:pt-8">
        <header className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <IkengaSeal
              sizeClasses="h-12 w-12 sm:h-[52px] sm:w-[52px]"
              textClasses="pl-1 text-sm sm:text-base"
              className="drop-shadow-[0_0_20px_rgba(255,215,0,0.4)]"
            />
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xl font-semibold tracking-[0.18em] text-[#FFD700] sm:text-2xl">
                IKENGA
              </span>
              <span className="text-[11px] uppercase tracking-[0.22em] text-gray-400">
                Chi in Motion
              </span>
            </div>
          </div>

          <div className="rounded-full border border-amber-300/15 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-amber-100/80 backdrop-blur">
            Private Beta Open
          </div>
        </header>

        <section className="flex flex-1 flex-col justify-center py-16 sm:py-24">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-4xl">
              <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-[#FFD700]/15 bg-white/5 px-4 py-2 text-sm text-amber-100/85 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#FFD700]" />
                Launching the creative operating layer for serious brands
              </div>

              <h1 className="max-w-5xl [font-family:var(--font-display)] text-5xl leading-[0.92] tracking-tight text-[#FFF4C0] sm:text-6xl lg:text-8xl">
                Power your destiny
                <span className="mt-2 block bg-gradient-to-r from-[#FFD700] via-[#FFE89A] to-[#FFD700] bg-clip-text text-transparent">
                  across every platform.
                </span>
              </h1>

              <p className="mt-8 max-w-2xl text-lg leading-8 text-stone-300 sm:text-xl">
                IKENGA AI is the momentum engine for founders, creators, and
                agencies who need consistent output without flattening their
                voice. It remembers your rhythm, sharpens your message, and
                keeps your brand in motion.
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                <a
                  href="#waitlist"
                  className="inline-flex items-center justify-center rounded-full bg-[#FFD700] px-8 py-4 text-base font-semibold text-black transition-all hover:scale-[1.02] hover:bg-yellow-400"
                >
                  Join Early Access
                </a>
                <a
                  href="#launch"
                  className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-medium text-white/90 transition-all hover:border-[#FFD700]/30 hover:bg-white/10"
                >
                  See What Ships
                </a>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                {launchSignals.map((signal) => (
                  <span
                    key={signal}
                    className="rounded-full border border-amber-300/15 bg-black/30 px-4 py-2 text-sm text-amber-100/80"
                  >
                    {signal}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid w-full max-w-xl grid-cols-1 gap-4 sm:grid-cols-3 lg:max-w-md lg:grid-cols-1">
              {[
                ["7 days", "to feel the IKENGA effect"],
                ["1 system", "for memory, tone, and publishing rhythm"],
                ["0 noise", "from generic prompts and bloated workflows"],
              ].map(([value, label]) => (
                <div
                  key={value}
                  className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur"
                >
                  <div className="text-3xl font-semibold text-[#FFD700]">
                    {value}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-300">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="launch"
          className="mx-auto w-full max-w-6xl border-t border-white/8 py-16"
        >
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.3em] text-[#FFD700]/85">
              Launch Scope
            </p>
            <h2 className="mt-4 [font-family:var(--font-display)] text-4xl text-[#FFF4C0] sm:text-5xl">
              What ships with the live MVP
            </h2>
            <p className="mt-4 text-lg leading-8 text-stone-300">
              A focused release that turns IKENGA into a live capture and
              onboarding surface now, while preserving the deeper engine
              scaffolding already built underneath it.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 backdrop-blur"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-[#FFD700]/15 text-sm font-semibold text-[#FFD700]">
                  {feature.label}
                </div>
                <h3 className="text-2xl [font-family:var(--font-display)] text-[#FFF4C0]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-6xl gap-8 border-t border-white/8 py-16 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-[#FFD700]/85">
              Built For
            </p>
            <h2 className="mt-4 [font-family:var(--font-display)] text-4xl text-[#FFF4C0] sm:text-5xl">
              Teams that cannot afford to sound generic
            </h2>
          </div>

          <div className="grid gap-4">
            {audiences.map((audience) => (
              <div
                key={audience.title}
                className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-xl font-semibold text-[#FFD700]">
                  {audience.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-stone-300">
                  {audience.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="waitlist"
          className="mx-auto w-full max-w-6xl border-t border-white/8 py-16"
        >
          <div className="rounded-[36px] border border-[#FFD700]/12 bg-[linear-gradient(135deg,rgba(255,215,0,0.08),rgba(255,255,255,0.03))] p-8 backdrop-blur md:p-10">
            <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-[#FFD700]/85">
                  Early Access
                </p>
                <h2 className="mt-4 [font-family:var(--font-display)] text-4xl text-[#FFF4C0] sm:text-5xl">
                  Be early. Stay ahead.
                </h2>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-stone-300">
                  Join the waitlist to get launch updates, private beta
                  onboarding, and first access when IKENGA opens its creative
                  operating system to selected brands and creators.
                </p>
                <div className="mt-6 flex flex-wrap gap-3 text-sm text-amber-100/80">
                  <span className="rounded-full border border-amber-300/15 px-4 py-2">
                    No spam
                  </span>
                  <span className="rounded-full border border-amber-300/15 px-4 py-2">
                    One-click onboarding updates
                  </span>
                  <span className="rounded-full border border-amber-300/15 px-4 py-2">
                    Invite priority for early signups
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-black/30 p-6">
                <WaitlistForm />
              </div>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-auto flex w-full max-w-6xl flex-col gap-3 border-t border-white/8 py-8 text-sm text-stone-400 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) 2026 IKENGA AI. Chi in Motion.</p>
          <p>Built for brands, agencies, and creators who refuse to move small.</p>
        </footer>
      </div>
    </main>
  );
}
