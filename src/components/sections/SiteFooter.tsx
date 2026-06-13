"use client";

import { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, MM } from "@/lib/motion";
import { useBlockNumber } from "wagmi";

/**
 * Void-energy ending. No CTA, no resolution — the session line and the
 * blinking cursor say the log just keeps going.
 */
export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null);
  const { data: blockNumber } = useBlockNumber({ watch: true });
  const [mood, setMood] = useState("thinking");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM, (ctx) => {
        const { ok } = ctx.conditions as { ok: boolean };
        if (!ok) return;
        gsap.from("[data-footer-line]", {
          y: 16,
          autoAlpha: 0,
          duration: 0.6,
          ease: EASE.outSoft,
          stagger: 0.1,
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 80%",
            once: true,
          },
        });
      });
    },
    { scope: footerRef }
  );

  // Mirror the live mood theme (set by the terminal's mood dots)
  useEffect(() => {
    const root = document.documentElement;
    setMood(root.dataset.theme || "thinking");
    const observer = new MutationObserver(() => {
      setMood(root.dataset.theme || "thinking");
    });
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return (
    <footer ref={footerRef} data-mascot-section="footer" className="relative min-h-[60svh] flex flex-col justify-end w-full max-w-6xl mx-auto px-6 pb-12 select-none">
      <div className="space-y-6 border-t border-border-line/20 pt-10">
        <div data-footer-line className="flex items-center space-x-4 font-mono text-xs text-text-slate">
          <a href="https://farcaster.xyz/0xd" target="_blank" rel="noopener noreferrer" className="hover:text-accent-mint transition-colors">farcaster</a>
          <span aria-hidden="true" className="text-text-slate/40">·</span>
          <a href="https://x.com/0xdasx" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">twitter</a>
          <span aria-hidden="true" className="text-text-slate/40">·</span>
          <a href="https://github.com/Callmedas69" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">github</a>
        </div>

        <div data-footer-line className="font-mono text-[10px] text-text-slate/70">
          session: persisted · theme: {mood} · block: {blockNumber ? `#${blockNumber.toString()}` : "#syncing"}
        </div>

        <p data-footer-line className="font-mono text-[11px] text-text-slate">
          // the thinking is free - 0xDas<span className="inline-block w-2 h-3.5 bg-accent-blue/70 animate-cursor ml-0.5 align-middle" />
        </p>
      </div>
    </footer>
  );
}
