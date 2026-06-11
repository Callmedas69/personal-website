import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

if (typeof window !== "undefined") {
  ScrollTrigger.config({ ignoreMobileResize: true });
}

/** Shared motion language — every section uses these so the site moves as one system. */
export const EASE = {
  /** entrances */
  out: "expo.out",
  /** secondary reveals */
  outSoft: "power4.out",
  /** theme / system transitions (matches the existing 0.55s mood tween) */
  inOut: "power3.inOut",
} as const;

export const DUR = {
  fast: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

export const STAGGER = {
  lines: 0.08,
  rows: 0.04,
  panels: 0.12,
} as const;

/** gsap.matchMedia() conditions — pins/scrubs live only inside `desktop && ok`. */
export const MM = {
  reduce: "(prefers-reduced-motion: reduce)",
  ok: "(prefers-reduced-motion: no-preference)",
  desktop: "(min-width: 768px)",
  mobile: "(max-width: 767px)",
} as const;

export { gsap, ScrollTrigger };
