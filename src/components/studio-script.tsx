"use client";

import { useMemo } from "react";
import { ScriptViewer, type VideoScript } from "@/src/components/script-viewer";

interface Props {
  title:   string;
  body:    string;
  summary: string;
  color:   string;
}

function generateScript(title: string, summary: string, body: string): VideoScript {
  const sentences  = body.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 10);
  const paragraphs = body.split(/\n{2,}/).filter(p => p.trim().length > 10);

  const hook = summary.split(/(?<=[.!?])/)[0]?.trim() ?? summary;

  const sceneSource = paragraphs.length >= 2 ? paragraphs : sentences;
  const scenes = sceneSource.slice(0, 3).map((text, i) => ({
    beat:      i === 0 ? "Opening" : i === 1 ? "Core insight" : "Evidence / example",
    narration: text.trim().slice(0, 250),
  }));

  return {
    hook,
    scenes,
    cta: `Apply ${title} to your brand today and share your results.`,
  };
}

export function StudioScript({ title, body, summary, color }: Props) {
  const script = useMemo(() => generateScript(title, summary, body), [title, body, summary]);
  return <ScriptViewer script={script} color={color} />;
}
