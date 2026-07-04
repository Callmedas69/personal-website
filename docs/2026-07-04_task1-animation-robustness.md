# Task 1: Animation Robustness

plan: [2026-07-04_frontend-audit_plan.md](2026-07-04_frontend-audit_plan.md)

Scope: animation correctness. DoD: no snapping/jumping.

## Items

- [x] 1. `src/components/mascot/MascotStage.tsx` (~L509-519) — unmount cleanup kills `scrollTriggers`/ticker/observer/renderer but never `assemblyTl` (boot voxel-assembly timeline, built ~L478). Added `assemblyTl?.kill()`.
- [x] 2. `src/components/sections/HeroSection.tsx` (~L54-66) — scroll-out shear tween converted from `gsap.to()` to `gsap.fromTo(..., {immediateRender:false})`, matching the `hint` convention.
- [x] 3. `src/components/Header.tsx` (~L13-18) — replaced the raw `window.addEventListener("scroll", ...)` with an `IntersectionObserver` on a 24px sentinel prepended to `document.body`.
- [x] 4. `src/components/mascot/MascotStage.tsx` (~L326-339) `mkLogSpinTrigger` — reviewed against `LogStrip.tsx`: `LogStrip`'s `useGSAP` pin trigger mounts synchronously on render (before the async GLB load resolves), so its pin-spacer exists before `MascotStage` calls `ScrollTrigger.refresh()` in `startChoreography()`. Ordering is guaranteed by the natural async gap, not coincidental. No code change needed.

## No changes needed (verified clean)

Hero's existing `fromTo`/`immediateRender:false` usage, TerminalSection/LogStrip pin `start:"top top"` values, mascot `heroAligned` gating (dequantized-scale gotcha correctly avoided), `prefers-reduced-motion` coverage (all reviewed sections fully disable scrub/pin).

## Verification

- [x] `npx tsc --noEmit` clean.
- [ ] Manual scroll-scrub of full homepage (both directions) + terminal pin, boot path + repeat-visit path, confirm no snap/jump — deferred to end-of-session browser pass (see master plan verification section).
