"use client";

import { useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, MM } from "@/lib/motion";
import AgentTerminal from "@/components/AgentTerminal";
import { DEMO_SCRIPT } from "@/components/terminal/script";

const MARGINALIA = [
  {
    key: "method",
    body: (
      <div className="space-y-1.5 text-[12px] leading-relaxed">
        <div className="text-text-slate/60 text-[10px]">// how the agent thinks</div>
        <div className="text-text-primary">i don&apos;t use multi-agent orchestration.</div>
        <div className="text-text-primary">plain folders, numbered stages, markdown prompts.</div>
        <div className="text-text-primary">one agent reads the right file at the right moment.</div>
        <div className="text-text-slate">that&apos;s the whole system.</div>
      </div>
    ),
  },
  {
    key: "files",
    body: (
      <div className="grid grid-cols-3 gap-2 text-[10px] text-center">
        <div className="border border-accent-blue/30 rounded p-2 bg-accent-blue/5">
          <div className="font-semibold text-accent-blue text-[9px]">CLAUDE.md</div>
          <div className="text-[7.5px] text-text-slate mt-0.5">ROUTING RULES</div>
        </div>
        <div className="border border-accent-mint/30 rounded p-2 bg-accent-mint/5">
          <div className="font-semibold text-accent-mint text-[9px]">CONTEXT.md</div>
          <div className="text-[7.5px] text-text-slate mt-0.5">WORKSPACE RULES</div>
        </div>
        <div className="border border-accent-yellow/30 rounded p-2 bg-accent-yellow/5">
          <div className="font-semibold text-accent-yellow text-[9px]">FILESYSTEM</div>
          <div className="text-[7.5px] text-text-slate mt-0.5">WORKFLOW STAGES</div>
        </div>
      </div>
    ),
  },
  {
    key: "paper",
    body: (
      <div className="text-[11px]">
        <a
          href="https://arxiv.org/html/2603.16021v2"
          target="_blank"
          rel="noopener noreferrer"
          className="text-text-slate hover:text-accent-blue transition-colors"
        >
          // interpretable context methodology →
        </a>
      </div>
    ),
  },
];

/**
 * The centerpiece. Desktop with motion: a pinned, scroll-scrubbed demo
 * session (deterministic, rewindable) that hands over to the fully
 * interactive terminal at the end of the pin. Mobile / reduced motion:
 * interactive immediately, no pin. Left marginalia carries the
 * interpretable-context methodology (from the retired BrandDashboard).
 */
export default function TerminalSection() {
  const wrapRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const lastUnit = useRef(-1);
  const lenis = useLenis();

  const [mode, setMode] = useState<"interactive" | "scripted">("interactive");
  const [progress, setProgress] = useState(0);
  const [demoSeen, setDemoSeen] = useState(false);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM, (ctx) => {
        const { ok, desktop } = ctx.conditions as { ok: boolean; desktop: boolean };
        if (!ok || !desktop) {
          setMode("interactive");
          return;
        }
        setMode("scripted");

        const st = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: "top top",
          end: "+=250%",
          pin: pinRef.current,
          scrub: 0.5,
          anticipatePin: 1,
          onUpdate: (self) => {
            // re-render only when the character index actually moves
            const unit = Math.floor(self.progress * DEMO_SCRIPT.totalUnits);
            if (unit !== lastUnit.current) {
              lastUnit.current = unit;
              setProgress(self.progress);
            }
          },
          onLeave: () => {
            setMode("interactive");
            setDemoSeen(true);
          },
          onEnterBack: () => setMode("scripted"),
        });
        stRef.current = st;

        return () => {
          stRef.current = null;
        };
      });
    },
    { scope: wrapRef }
  );

  const handleSkip = () => {
    const st = stRef.current;
    if (!st) return;
    const target = st.end + 2;
    if (lenis) {
      lenis.scrollTo(target, { duration: 0.8 });
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  };

  // marginalia block in focus follows the demo thirds
  const activeThird = Math.min(2, Math.floor(progress * 3));

  return (
    <section ref={wrapRef} id="terminal" className="relative">
      <div ref={pinRef} className="min-h-svh flex items-center w-full max-w-6xl mx-auto px-6 py-20">
        <div className="flex w-full gap-10 items-center">
          <aside className="hidden lg:flex w-[34%] flex-col gap-6 font-mono select-none">
            {MARGINALIA.map((block, i) => (
              <div
                key={block.key}
                className="transition-opacity duration-300"
                style={{ opacity: mode === "scripted" ? (i === activeThird ? 1 : 0.3) : 1 }}
              >
                {block.body}
              </div>
            ))}
            {mode === "interactive" && demoSeen && (
              <div className="text-[11px] text-accent-mint">// session attached — your turn</div>
            )}
          </aside>

          <div className="flex-1 min-w-0 min-h-[620px]">
            <AgentTerminal
              mode={mode}
              scriptProgress={progress}
              onRequestSkip={handleSkip}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
