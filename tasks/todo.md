# awwwards scroll narrative — 2026-06-11

plan: docs/2026-06-11_awwwards-scroll-narrative_plan.md

- [x] 1. foundation: npm i lenis, lib/motion.ts, SmoothScroll in layout, Header fixed
- [x] 2. static restructure: section components, BrandDashboard redistributed, dead code deleted
- [x] 3. boot overlay: inline script + css cover + timeline + skip paths
- [x] 4. hero choreography: entrance + scrub-out
- [x] 5. terminal engine + pinned scrub + marginalia + mobile fallback
- [x] 6. log strip: lib/paragraph, horizontal scrub, mobile snap
- [x] 7. onchain section + footer
- [x] 8. cognitive-log page treatment
- [x] 9. polish: reduced-motion audit, mobile audit, DESIGN.md amendment

## review

Shipped the full scroll narrative. Verified: prod build clean, boot plays once
per session (sessionStorage skip, reduced-motion skip, click-to-skip, no-JS
safe), hero entrance + scrub-out, pinned terminal demo scrubs deterministically
both directions and hands over to interactive, log strip pins only when cards
overflow viewport, onchain panels reveal with live block ticker, footer stagger,
cognitive-log entrance + CSS expand. Zero console errors.

Two bugs found and fixed during verification:
1. `autoFocus` on terminal input hijacked page load scroll — removed.
2. Scrubbed hero tween cached boot-hidden opacity as start value and
   ScrollTrigger.refresh re-applied it — fixed with fromTo + immediateRender:false
   and element-ref targets (selector strings go stale across dev remounts).

Remaining (logged in CONTEXT.md): 4x-throttle perf profile + Lighthouse,
self-host Sohne, WobbleVisualizer easter-egg decision.

Not committed to git — awaiting Harry's review.
