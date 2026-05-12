"use client";

import { useMemo } from "react";
import { ProfessionalSlides, type Slide } from "@/src/components/professional-slides";

interface Props {
  title:   string;
  body:    string;
  summary: string;
  color:   string;
}

function generateSlides(title: string, summary: string, body: string): Slide[] {
  const slides: Slide[] = [{ headline: title, body: summary }];

  const bulletBlocks = body.split(/\n/).filter(l => l.trim().startsWith("•"));
  if (bulletBlocks.length >= 3) {
    bulletBlocks.slice(0, 5).forEach(line => {
      const clean = line.replace(/^[•·]\s*/, "").trim();
      const dash  = clean.indexOf("—");
      if (dash > 0) {
        slides.push({ headline: clean.slice(0, dash).trim(), body: clean.slice(dash + 1).trim() });
      } else {
        slides.push({ headline: clean.slice(0, 55), body: clean });
      }
    });
  } else {
    const paragraphs = body.split(/\n{2,}/).filter(p => p.trim().length > 20);
    paragraphs.slice(0, 4).forEach((para, i) => {
      const sentences = para.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
      const headline  = sentences[0]?.slice(0, 60).trim() ?? `Key Insight ${i + 1}`;
      const rest      = sentences.slice(1).join(" ").trim() || para.trim();
      slides.push({ headline, body: rest.slice(0, 200) });
    });
  }

  slides.push({ headline: "Your Next Action", body: "Apply this to your brand strategy today." });
  return slides.slice(0, 7);
}

export function StudioSlides({ title, body, summary, color }: Props) {
  const slides = useMemo(() => generateSlides(title, summary, body), [title, body, summary]);

  return (
    <ProfessionalSlides slides={slides} title={title} color={color} />
  );
}
