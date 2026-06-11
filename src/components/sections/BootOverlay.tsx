"use client";

import { useEffect, useRef, useState } from "react";
import { useLenis } from "lenis/react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger, EASE } from "@/lib/motion";
import OxNull from "@/components/OxNull";

const BOOT_LINES = [
  { text: "[ok] mounting /cognition", color: "text-text-slate" },
  { text: "[ok] connecting BASE_MAINNET", color: "text-accent-mint" },
  { text: "[ok] loading persona: 0xNull", color: "text-accent-blue" },
];

const SPINNER_FRAMES = ["/", "-", "\\", "|"];

/**
 * First-visit boot sequence. The inline script in layout.tsx sets
 * [data-boot="pending"] before paint (skipped on repeat visits and under
 * reduced motion); CSS shows this cover and pre-clips the lines so nothing
 * flashes before hydration. No JS → no attribute → page renders plain.
 */
export default function BootOverlay() {
  const [active, setActive] = useState<boolean | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const spinnerRef = useRef<HTMLSpanElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    setActive(document.documentElement.dataset.boot === "pending");
  }, []);

  useGSAP(
    () => {
      if (!active || !overlayRef.current) return;

      lenis?.stop();

      // session-attach spinner; runs until the hold ends or the user skips
      let frame = 0;
      const spin = window.setInterval(() => {
        frame = (frame + 1) % SPINNER_FRAMES.length;
        if (spinnerRef.current) spinnerRef.current.textContent = SPINNER_FRAMES[frame];
      }, 100);
      const stopSpinner = () => {
        window.clearInterval(spin);
        if (spinnerRef.current) {
          spinnerRef.current.textContent = "ok";
          spinnerRef.current.parentElement?.classList.replace(
            "text-text-slate",
            "text-accent-mint"
          );
        }
      };

      const finish = () => {
        stopSpinner();
        try {
          sessionStorage.setItem("0xnull-booted", "1");
        } catch {}
        delete document.documentElement.dataset.boot;
        lenis?.start();
        ScrollTrigger.refresh();
        setActive(false);
      };

      const tl = gsap.timeline({ onComplete: finish });
      tlRef.current = tl;

      tl.to("[data-boot-line]", {
        clipPath: "inset(0 0% 0 0)",
        duration: 0.18,
        ease: EASE.outSoft,
        stagger: 0.28,
      });
      tl.to("[data-boot-progress]", { scaleX: 1, duration: 1.3, ease: "none" }, 0.1);
      // hold while the spinner runs, then flip [/] → [ok] and pause a beat
      tl.to({}, { duration: 1.2 });
      tl.call(stopSpinner);
      tl.to("[data-boot-line]", { autoAlpha: 0, duration: 0.2, stagger: 0.03 }, "+=0.4");
      tl.to("[data-boot-mascot], [data-boot-progress]", { autoAlpha: 0, duration: 0.2 }, "<");
      // hero entrance fires as the wipe begins, so the two motions overlap
      tl.call(() => document.dispatchEvent(new CustomEvent("boot-complete")));
      tl.to(overlayRef.current, { yPercent: -100, duration: 0.7, ease: EASE.out }, "-=0.05");

      // any key or click skips to the end
      const skip = () => tl.progress(1);
      window.addEventListener("keydown", skip);
      window.addEventListener("pointerdown", skip);
      return () => {
        window.clearInterval(spin);
        window.removeEventListener("keydown", skip);
        window.removeEventListener("pointerdown", skip);
      };
    },
    { scope: overlayRef, dependencies: [active] }
  );

  // active === null → not yet hydrated: keep the SSR cover in the DOM so the
  // [data-boot="pending"] CSS can show it before React loads.
  if (active === false) return null;

  return (
    <div
      ref={overlayRef}
      className="boot-cover fixed inset-0 z-[60] bg-brand-bg flex items-center justify-center"
      aria-hidden="true"
    >
      <div className="flex flex-col items-start gap-5 font-mono select-none">
        <div data-boot-mascot>
          <OxNull mood="thinking" size={64} />
        </div>
        <div className="space-y-1.5 text-xs">
          {BOOT_LINES.map((line) => (
            <div key={line.text} data-boot-line className={`boot-line ${line.color}`}>
              {line.text}
            </div>
          ))}
          <div data-boot-line className="boot-line text-text-slate">
            [<span ref={spinnerRef}>/</span>] attaching session
          </div>
        </div>
        <div className="w-48 h-px bg-border-line overflow-hidden">
          <div data-boot-progress className="boot-progress h-px bg-accent-blue origin-left" />
        </div>
      </div>
    </div>
  );
}
