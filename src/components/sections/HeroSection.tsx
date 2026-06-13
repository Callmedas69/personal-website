"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, DUR, STAGGER, MM } from "@/lib/motion";

/**
 * Full-viewport hero. Lines are wrapped in overflow-hidden masks so the
 * entrance choreography can slide them in; content is server-rendered
 * visible by default (animations are .from() tweens). On scroll the hero
 * "logs out": lines shear upward and dim, staying faintly visible.
 */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MM, (ctx) => {
        const { ok } = ctx.conditions as { ok: boolean };
        if (!ok) return;

        // resolve element targets for THIS mount — selector strings would go
        // stale across dev remounts and miss when the boot listener fires late
        const root = sectionRef.current!;
        const eyebrow = root.querySelector("[data-hero-eyebrow]");
        const lines = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-line]"));
        const subs = Array.from(root.querySelectorAll<HTMLElement>("[data-hero-sub]"));
        const hint = root.querySelector("[data-hero-hint]");

        const playEntrance = () => {
          const tl = gsap.timeline({ defaults: { ease: EASE.out } });
          tl.from(eyebrow, { yPercent: 110, duration: DUR.base }, 0);
          tl.from(lines, { yPercent: 110, duration: DUR.slow, stagger: STAGGER.lines }, 0.12);
          tl.from(subs, { yPercent: 110, autoAlpha: 0, duration: DUR.base, stagger: STAGGER.panels }, 0.45);
          tl.from(hint, { autoAlpha: 0, duration: DUR.base }, 0.7);
        };

        let onBoot: (() => void) | null = null;
        if (document.documentElement.dataset.boot === "pending") {
          // hold under the boot overlay; entrance fires as the overlay wipes out
          gsap.set(hint, { autoAlpha: 0 });
          onBoot = () => {
            gsap.set(hint, { clearProps: "all" });
            playEntrance();
          };
          document.addEventListener("boot-complete", onBoot, { once: true });
        } else {
          playEntrance();
        }

        // scroll-out: light parallax shear, dims to 15% — "logs out", never vanishes
        lines.forEach((line, i) => {
          gsap.to(line, {
            y: -48 * (i + 1),
            autoAlpha: 0.15,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom 20%",
              scrub: true,
            },
          });
        });
        // fromTo + immediateRender:false so the scrub never caches the
        // boot-hidden state of these elements as its start value
        gsap.fromTo(
          [eyebrow, ...subs, hint],
          { autoAlpha: 1 },
          {
            autoAlpha: 0.1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: "bottom 30%",
              scrub: true,
            },
          }
        );

        return () => {
          if (onBoot) document.removeEventListener("boot-complete", onBoot);
        };
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      data-mascot-section="hero"
      className="relative min-h-[92svh] flex flex-col justify-center w-full max-w-6xl mx-auto px-6 pt-28 pb-16"
    >
      {/* 3D mascot anchor — MascotStage aligns the fixed WebGL canvas to this rect */}
      <div
        data-mascot-slot="hero"
        className="absolute right-6 top-1/2 -translate-y-1/2 w-[30%] aspect-[3/4] pointer-events-none hidden md:block"
        aria-hidden="true"
      />
      <div className="space-y-5">
        <div className="overflow-hidden">
          <div data-hero-eyebrow className="font-mono text-xs font-bold text-accent-blue uppercase tracking-widest">
            [ 0x_Cognitive_Context ]
          </div>
        </div>

        <h1 className="font-sans text-[clamp(2.75rem,7.5vw,6rem)] font-extrabold tracking-[-0.04em] text-white leading-[1.02] text-balance">
          <span className="block overflow-hidden">
            <span data-hero-line className="block">the ideas are loud</span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block text-accent-blue">the button is hard</span>
          </span>
        </h1>

        <div className="overflow-hidden">
          <p data-hero-sub className="font-mono text-sm md:text-base text-text-slate leading-relaxed max-w-xl">
            anyone can show a deploy. nobody shows the moment before they almost quit.
          </p>
        </div>

        <div className="overflow-hidden">
          <p data-hero-sub className="font-mono text-[10px] text-text-slate tracking-widest">
            cognitive. solo. shipping.
          </p>
        </div>
      </div>

      <div data-hero-hint className="absolute bottom-8 left-6 font-mono text-[11px] text-text-slate select-none">
        // scroll: attach session<span className="inline-block w-2 h-3.5 bg-accent-blue/70 animate-cursor ml-1 align-middle" />
      </div>
    </section>
  );
}
