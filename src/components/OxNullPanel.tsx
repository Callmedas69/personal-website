"use client";

import { useState } from "react";
import OxNull from "@/components/OxNull";

type Mood = "thinking" | "shipping" | "broke" | "flow";

const MOODS: {
  id: Mood;
  label: string;
  eyeColor: string;
  useFor: string;
  accentClass: string;
  borderClass: string;
  bgClass: string;
  dotColor: string;
}[] = [
  {
    id: "thinking",
    label: "// thinking",
    eyeColor: "#ffffff",
    useFor: "opinion threads, reframes, purple cow lines",
    accentClass: "text-text-primary",
    borderClass: "border-text-primary/30",
    bgClass: "bg-text-primary/5",
    dotColor: "#ffffff",
  },
  {
    id: "shipping",
    label: "// shipping",
    eyeColor: "#00e87a",
    useFor: "build logs, deploys, project updates",
    accentClass: "text-accent-green",
    borderClass: "border-accent-green/30",
    bgClass: "bg-accent-green/5",
    dotColor: "#aae87b",
  },
  {
    id: "broke",
    label: "// it broke",
    eyeColor: "#ff4d4d",
    useFor: "debugging stories, honest failures",
    accentClass: "text-red-400",
    borderClass: "border-red-400/30",
    bgClass: "bg-red-400/5",
    dotColor: "#f87171",
  },
  {
    id: "flow",
    label: "// in flow",
    eyeColor: "#60d0ff",
    useFor: "process posts, cognitive state content",
    accentClass: "text-accent-blue",
    borderClass: "border-accent-blue/30",
    bgClass: "bg-accent-blue/5",
    dotColor: "#6e9cf1",
  },
];

export default function OxNullPanel() {
  const [activeMood, setActiveMood] = useState<Mood>("thinking");
  const active = MOODS.find((m) => m.id === activeMood)!;

  return (
    <div className="w-full border border-border-line bg-terminal-bg rounded-lg overflow-hidden select-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-terminal-inner/40 border-b border-border-line">
        <div className="flex items-center space-x-1.5 font-mono text-[10px] text-text-slate">
          <span
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ backgroundColor: active.dotColor }}
          />
          <span className="tracking-widest uppercase">0xNull</span>
        </div>
        <span
          className={`font-mono text-[10px] font-bold transition-colors duration-300 ${active.accentClass}`}
        >
          {active.label}
        </span>
      </div>

      {/* Body */}
      <div className="flex items-center gap-6 px-6 py-5 bg-terminal-inner">
        {/* Mascot — large, centered */}
        <div className="shrink-0 flex items-center justify-center w-[100px]">
          <OxNull mood={activeMood} size={100} />
        </div>

        {/* Mood selector grid */}
        <div className="flex-1 grid grid-cols-2 gap-2">
          {MOODS.map((mood) => {
            const isActive = mood.id === activeMood;
            return (
              <button
                key={mood.id}
                onClick={() => setActiveMood(mood.id)}
                className={`
                  text-left px-3 py-2.5 rounded border font-mono transition-all duration-150
                  ${isActive
                    ? `${mood.borderClass} ${mood.bgClass} ${mood.accentClass}`
                    : "border-border-line/40 bg-transparent text-text-slate hover:border-border-line hover:text-text-primary"
                  }
                `}
              >
                <div className="flex items-center space-x-1.5 mb-0.5">
                  <span
                    className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-150"
                    style={{
                      backgroundColor: isActive ? mood.dotColor : "rgba(95,125,151,0.4)",
                    }}
                  />
                  <span className={`text-[10px] font-bold tracking-wide ${isActive ? mood.accentClass : ""}`}>
                    {mood.label}
                  </span>
                </div>
                <p className="text-[9px] text-text-slate/70 leading-relaxed pl-3">
                  {mood.useFor}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-border-line/40 font-mono text-[9px] text-text-slate/40">
        void energy, always mid-thought. — 0xNull
      </div>
    </div>
  );
}