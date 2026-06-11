# Awwwards-Grade Scroll Narrative — 0xdas.dev Personal Website

## Context

The site (`D:\Harry\90_CODEBASE\01_active\personal-website`) is a single-viewport "cognitive OS" dashboard: hero + BrandDashboard left, AgentTerminal right, plus a `/cognitive-log` feed page. The identity is strong (DESIGN.md: deep navy, 5-signal palette, Sohne/Sohne Mono, mood system, `//` voice) but there is no choreography, no scroll story, no signature moment — it can't compete for Awwwards site-of-the-day (design 40%, usability 30%, creativity 20%, content 10%).

**Approved direction (user decisions):**
1. Homepage becomes a **scroll narrative**: boot → hero → pinned terminal → cognitive log strip → onchain proof → void-energy footer.
2. **Boot sequence intro** (~1.7s typed kernel log), sessionStorage-skipped on repeat visits, skipped under reduced-motion.
3. Scope: **homepage + cognitive-log page**, refactoring allowed.
4. Wow factor: **Lenis smooth scroll + GSAP ScrollTrigger pinning/scrubbing** (no custom cursor, no canvas shader).

**Concept anchor:** the scroll is literally a session — boot → identity → live process → output log → onchain proof → unresolved end. Every animation is a system event, never decoration. The mood/theme system (CSS custom props on `documentElement`, localStorage `0xnull-theme`) is preserved untouched.

## Stack facts (verified)

- Next.js 16.2.6 (Turbopack), React 19, Tailwind v4 `@theme`. Dev: `npm run dev` → port 3001.
- `gsap@3.15` + `@gsap/react@2.1.2` installed; ScrollTrigger ships in gsap core (`gsap/ScrollTrigger`). `lenis` NOT installed — only new dependency.
- `page.tsx` is currently a server component (good — can fetch posts server-side).
- `WobbleVisualizer.tsx` and `InvisibleLawVisualizer.tsx` are orphaned (not rendered).
- Project CLAUDE.md: Next 16 breaking changes — check `node_modules/next/dist/docs/` before using unfamiliar Next APIs (esp. `next/font/local`).

## Design-system constraints (DESIGN.md — binding)

- Tonal depth only (`#011627` / `#070d19`), no shadows except `.terminal-glow`, no blur/glass/gradient-text, radius ≤8px.
- 5-signal palette semantics: blue=primary, mint=live/onchain, yellow=cognitive nav, green=shipped, purple=archive.
- Sohne for hero h1 ONLY; Sohne Mono everywhere else. Lowercase, `//` comment syntax.
- Bracket eyebrow `[ ... ]` above hero h1 only — section headers use `// label` comment syntax instead.
- WCAG AA body text; full `prefers-reduced-motion` alternatives mandatory.
- **DESIGN.md amendment** (document during polish): display role promoted to full-viewport scale `clamp(2.75rem, 7.5vw, 6rem)`, tracking `-0.04em` (craft ceiling), everything else unchanged.

## Architecture

### New files

```
src/lib/motion.ts                       — EASE/DUR/STAGGER constants, matchMedia conditions, ScrollTrigger config
src/lib/paragraph.ts                    — shared Paragraph fetch/mapping (server-usable, revalidate 300, [] on failure)
src/components/SmoothScroll.tsx         — Lenis provider (client)
src/components/sections/BootOverlay.tsx
src/components/sections/HeroSection.tsx
src/components/sections/TerminalSection.tsx
src/components/sections/LogStrip.tsx
src/components/sections/OnchainSection.tsx
src/components/sections/onchain/BlockTicker.tsx
src/components/sections/onchain/RpcConsole.tsx
src/components/sections/onchain/MintPanel.tsx
src/components/sections/SiteFooter.tsx
src/components/terminal/engine.ts       — pure seekable scripted-session engine
src/components/terminal/script.ts       — demo session content (/stack, /projects, /status)
src/components/cognitive-log/LogReveal.tsx
```

### Modified

- `src/app/layout.tsx` — wrap children in `<SmoothScroll>`; add boot-gate inline script next to existing theme script.
- `src/app/page.tsx` — async server component: `getRecentPosts(8)` + section composition.
- `src/app/globals.css` — boot pre-hydration cover, hero display tokens, scroll-snap utilities.
- `src/components/AgentTerminal.tsx` — `mode: "scripted" | "interactive"` + `scriptProgress` prop; streaming extracted to engine.
- `src/components/Header.tsx` — fixed position, solid `bg-brand-bg` tone on scroll (no blur), z-40.
- `src/app/cognitive-log/page.tsx` — entrance + row stagger + CSS grid-rows expand.

### Retired

- `BrandDashboard.tsx` deleted — `02_ONCHAIN` tab becomes OnchainSection; `01_CONTEXT` (ICM content) becomes terminal-section marginalia. Hooks `useContractReads`/`useMint` reused as-is. Remove inert `generate-trigger` dispatch.
- `InvisibleLawVisualizer.tsx` deleted (dead code).
- `WobbleVisualizer.tsx` kept as optional footer easter egg (stretch item only).

### Lenis + ScrollTrigger integration

```tsx
// SmoothScroll.tsx ("use client") — ReactLenis from "lenis/react"
<ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}>
// useEffect: gsap.ticker.add(t => lenisRef.current?.lenis?.raf(t * 1000));
//            gsap.ticker.lagSmoothing(0);
//            lenis.on("scroll", ScrollTrigger.update)
```
- `root` mode = window scroll → no scrollerProxy needed, pins work as `fixed`.
- Touch stays native (no `syncTouch`).
- Conditionally render ReactLenis only when `prefers-reduced-motion: no-preference` (native scroll fallback).
- `ScrollTrigger.config({ ignoreMobileResize: true })` in `lib/motion.ts`.

### Motion language (`src/lib/motion.ts`)

```ts
EASE = { out: "expo.out", outSoft: "power4.out", inOut: "power3.inOut" }
DUR = { fast: 0.3, base: 0.6, slow: 0.9 }
STAGGER = { lines: 0.08, rows: 0.04, panels: 0.12 }
MM = { reduce, ok, desktop: "(min-width: 768px)", mobile: "(max-width: 767px)" }
```
Every section: `useGSAP({ scope })` + one `gsap.matchMedia()` with shared MM conditions. Pins exist only inside `desktop && ok` contexts.

### Boot gating (overlay, not route)

Inline script in layout (pattern of existing theme guard):
```js
try{ var b=sessionStorage.getItem('0xnull-booted');
  if(!b && !matchMedia('(prefers-reduced-motion: reduce)').matches)
    document.documentElement.dataset.boot='pending'; }catch(e){}
```
CSS: `[data-boot="pending"]` shows fixed `bg-brand-bg` cover pre-hydration + locks body overflow. No-JS = no attribute = plain visible page (content never gated). BootOverlay renders nothing when attribute absent; on completion sets sessionStorage, removes attribute, dispatches `boot-complete` event for hero entrance. While active: `lenis.stop()`; on complete: `lenis.start()` + `ScrollTrigger.refresh()`.

## Homepage sections

`page.tsx`: `<BootOverlay /><Header /><main><HeroSection /><TerminalSection /><LogStrip posts={posts} /><OnchainSection /></main><SiteFooter />`

### 1. Boot overlay
Fixed inset-0 z-60, centered: OxNull mascot (DPR-scaled canvas) + mono 12px log lines + 1px blue progress rule (scaleX 0→1). Lines: `[ok] mounting /cognition`, `[ok] connecting BASE_MAINNET` (mint), `[ok] loading persona: 0xNull`, `[..] attaching session`. ~1.7s timeline: lines revealed via `clipPath: inset(0 100% 0 0) → inset(0 0% 0 0)` 0.18s each (terminal-output feel, no text mutation). Exit: lines fade stagger 0.03, overlay `yPercent: -100, 0.7s, expo.out`. Any keypress/click → `timeline.progress(1)`.

### 2. Hero
`min-h-[92svh]`. Eyebrow `[ 0x_cognitive_context ]` (the only bracket eyebrow). h1 Sohne `clamp(2.75rem,7.5vw,6rem)` 800, `leading-[1.02] tracking-[-0.04em]`, current two-line copy with blue span. Sub-lines + bottom `// scroll: attach session` with blink cursor.
- Entrance (after boot-complete or immediately): lines in `overflow-hidden` masks, `yPercent: 110→0`, `DUR.slow`, `expo.out`, stagger. Server-rendered visible by default (gsap `.from()`).
- Scroll-out: no pin, one scrub trigger (`top top → bottom 20%`): per-line `y: -48*(i+1)` parallax shear, `autoAlpha → 0.15` ("logs out", stays faintly visible).
- Mobile identical; reduced-motion static.

### 3. Pinned terminal (centerpiece)
**Engine refactor first** (`terminal/engine.ts`): `buildScript(steps)` precomputes cumulative char counts (HTML tags atomic, mirroring existing streamText logic); `sliceAt(script, progress)` returns `{ logs, streaming }` — pure function of progress, so scrubbing forward/backward re-renders deterministically, zero timers. Script reuses `resolveCommand` from `terminal/commands.ts` so demo output never drifts from real responses. 3 commands: `/stack`, `/projects`, `/status`; mood badge + mascot mood follow per command.

`AgentTerminal` props: `{ mode, scriptProgress?, onRequestSkip? }`. Scripted mode: renders slice into existing console UI; input `readOnly tabIndex={-1}`, placeholder `// demo session — scroll, or click to skip`; no focus grab; click → `onRequestSkip` → `lenis.scrollTo(end)` → interactive.

```ts
ScrollTrigger.create({ trigger: wrap, start: "top top", end: "+=250%",
  pin: pinned, scrub: 0.5, anticipatePin: 1,
  onUpdate: s => setProgress(s.progress),   // state update only when char index changes
  onLeave: () => setMode("interactive"), onEnterBack: () => setMode("scripted") });
```
Layout: pinned `min-h-svh` flex; left aside (lg only, 34%) = marginalia (ICM content from old 01_CONTEXT tab, 3 blocks crossfading per script third); right = terminal. After pin ends: `// session attached — your turn` label, fully interactive.
- Perf: text growth contained in fixed-height `overflow-y:auto` console (layout contained).
- Mobile: no pin/scrub — interactive immediately + one-shot ~2.5s abbreviated 1-command demo on enter (`toggleActions: "play none none none"`).
- Reduced motion: interactive, static, no demo.

### 4. Cognitive log strip
Server fetch via `lib/paragraph.ts` (shares date/type/topic mapping with log page; `/api/posts` route stays). Failure → `[]` → renders `// log offline. full archive at /cognitive-log`.
Header: `// cognitive-log (n)` in accent-yellow comment syntax. Pinned viewport-height wrapper, horizontal track of post cards (date blue, title 14px, type badge, 8px radius, 12% borders). Last card: `view full log →` yellow nav card.
- Desktop: `gsap.to(track, { x: -(scrollWidth - innerWidth + pad), ease: "none", scrollTrigger: { pin, scrub: 1, invalidateOnRefresh, end: fn } })`; per-card autoAlpha 0.5→1 crossing center (enhancement only).
- Mobile/reduced-motion/no-JS: no pin — `overflow-x-auto snap-x snap-mandatory`.

### 5. Onchain proof section
Extraction of BrandDashboard 02_ONCHAIN. 12-col: left span-7 `RpcConsole` (log derivation from `BrandDashboard.tsx:89–149` → `useOnchainLog()` hook + existing disconnected simulation), right span-5 `BlockTicker` + `MintPanel`.
- BlockTicker: `useBlockNumber({ watch: true })`, big mono mint-accent readout; number flip `y: ±12 / autoAlpha`, 0.25s (instant under reduced-motion).
- MintPanel: existing button/state logic verbatim; framed as `// proof of work, onchain` (no NFT-bro CTA).
- Reveal: `start: "top 70%", toggleActions: "play none none reverse"`; panels `y: 24 autoAlpha: 0` stagger; console lines stagger like log catching up; live appended lines get tiny `gsap.from`.
- Mobile stacked, same reveal. No pin.

### 6. Footer (void energy)
`min-h-[60svh]` flex-end. Social row (existing semantic hover accents), session line `session: persisted · theme: {mood} · block: #live`, closing `// the thinking is free - 0xDas▋` with blink cursor. Lines stagger on enter, `once: true`. No CTA, no resolution. Stretch: WobbleVisualizer small in corner, jump on click.

## Cognitive-log page (restraint — reading surface)

1. h1 line-mask reveal (same language as hero, `DUR.base`); count + search autoAlpha follow. Via `LogReveal` client wrapper.
2. Row stagger when loading flips false (`y: 12, autoAlpha, STAGGER.rows`, first 15 rows only). Filter/search changes: NO re-stagger — 150ms CSS opacity on container only.
3. Expand: replace conditional render (`page.tsx:365`) with CSS `grid-template-rows: 0fr → 1fr` 200ms (instant under reduced-motion). No GSAP.

Lenis applies via layout automatically. No boot overlay on this route.

## Reduced-motion strategy (every section)

```ts
mm.add(MM, (ctx) => {
  const { ok, desktop } = ctx.conditions!;
  if (!ok) { gsap.set(targets, { clearProps: "all" }); return; }  // static, fully visible
  if (desktop) { /* pins + scrubs */ } else { /* one-shot reveals */ }
});
```
Boot skipped at inline-script level; Lenis not rendered; existing CSS cursor/pulse rules kept.

## Performance budget

- Scrubbed tweens: transform/opacity/clip-path only. Exception: scripted-terminal text growth — contained in fixed-height scroller, renders gated to char-index change.
- No permanent `will-change`; rely on GSAP force3D; track gets willChange via tween lifecycle only.
- Function-based measurements + `invalidateOnRefresh`; no layout reads in onUpdate.
- Theme CSS-var tween stays event-driven, never scroll-tied (full-page repaint).
- Fonts: hero 6rem makes Sohne the LCP. Minimum: preload links + `font-display: swap`. Recommended: self-host via `next/font/local` (verify API in `node_modules/next/dist/docs/` first).
- `svh` units everywhere; boot cover via CSS (no CLS); hero is real server-rendered LCP.
- Target: 60fps scrub at 4x CPU throttle through terminal pin + log strip.

## Phasing (each verifiable at localhost:3001)

1. **Foundation**: `npm i lenis`; `lib/motion.ts`; SmoothScroll in layout; Header fixed. Verify smooth scroll both routes, no hydration warnings.
2. **Static restructure**: section components, final markup/copy, zero animation; BrandDashboard redistributed; dead code deleted. Verify narrative reads at 375/768/1440; mood dots still retint everything.
3. **Boot overlay**: script + cover + timeline + skip paths. Verify first-visit boot, reload skip, `sessionStorage.clear()` replay, reduced-motion skip, JS-off plain page.
4. **Hero choreography**: entrance (both boot/no-boot paths) + scrub-out.
5. **Terminal engine + pin**: engine, modes, pin/scrub, marginalia, skip-to-interactive, mobile one-shot. Verify deterministic scrub both directions; interactive typing unchanged.
6. **Log strip**: lib/paragraph, server fetch, horizontal scrub, mobile snap, offline state.
7. **Onchain + footer**: ticker, console reveal, mint panel (disconnected sim + connect modal), footer.
8. **Cognitive-log page** treatment.
9. **Polish**: reduced-motion audit, mobile audit, 4x-throttle profile, Lighthouse (mobile ≥90), DESIGN.md hero-scale amendment, update CONTEXT.md session log.

## Verification protocol

- `npm run dev` → http://localhost:3001. Screenshot breakpoints 375/768/1280/1680 at each scroll position (browse/webapp-testing tooling).
- DevTools Rendering → emulate `prefers-reduced-motion: reduce`: no pins, no overlay, all content visible.
- Boot replay: `sessionStorage.removeItem('0xnull-booted')` → reload.
- Theme persistence: switch mood dots, reload, FOUC guard wins on all new sections.
- Perf recording while scrubbing terminal + strip at 4x CPU throttle; Lighthouse mobile.
- Wallet: disconnected simulation, RainbowKit connect modal, mint states.
