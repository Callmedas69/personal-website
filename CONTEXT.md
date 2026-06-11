## Workspace Name: 0xdas Personal Website Codebase

STRICT: do not read the whole codebase. only read the part of codebase that is relevant to the user's request.

### Core Architecture & State (May 2026)
- **Framework**: Next.js 16.2.6 (Turbopack) with React 19.
- **Styling**: Tailwind CSS v4 custom variables (Stripe Dev dark mode palette `#011627`).
- **Main Layout**: `src/app/page.tsx` renders a split dashboard:
  - Left column: `InvisibleLawVisualizer` (static artwork preview) + `BrandDashboard` (tabs demonstrating Interpretable Context Methodology and smart contract mint simulation).
  - Right column: `AgentTerminal` (AI terminal console).
- **Inter-Component Communication**:
  - The `BrandDashboard`'s simulated mint action dispatches the `generate-trigger` event on success.
  - *Note: `InvisibleLawVisualizer` displays a static preview only — it no longer regenerates seeds or listens to `generate-trigger`.*
  - *Note: `AgentTerminal` `/generate` command has been removed.*
- **Connect Wallet & Mint Button Integration (May 2026)**:
  - Custom monospace themed RainbowKit setup in `providers.tsx`.
  - Bespoke client-side `HeaderConnectButton.tsx` wrapper resolving React 19 serialization errors.
  - Dynamic `02_ONCHAIN` logging console wired to L2 block updates and transaction receipt confirmations (with auto-scroll enabled on log updates).
  - Smart state button disabling based on contract parameter reads.
- **Lint/Build Status**: TS validation clean (`npx tsc --noEmit` compiles cleanly; ESLint checks ignored during builds in `next.config.ts`).
- **Session 2026-05-26 Changes**:
  - `InvisibleLawVisualizer.tsx`: Removed Sandbox tab entirely.
  - `BrandDashboard.tsx`: Removed contract/status/minted/price labels from 02_ONCHAIN; RPC console logs now auto-scroll; 01_AI-NATIVE tab displays ICM paper abstract (3-sentence summary) + node graph of 3 core principles (CLAUDE.md, CONTEXT.md, Folder Structure); title hyperlinked to arXiv.
  - `AgentTerminal.tsx`: Fixed `/clear` command (was not matching slash-prefixed form); added `/archives` command listing ON HOLD (InvisibleLaw, Judith, The Arc) and ARCHIVED (BaseCred, Lore, Phi, Geoplet) projects; added `[ /archives ]` quick suggestion button; removed `/generate` command and its button.

### Session 2026-06-09 Changes
- **AgentTerminal refactor**: Decomposed into `src/components/terminal/types.ts`, `commands.ts`, `MoodBadge.tsx`. `AgentTerminal.tsx` is now a clean UI shell (~334 lines).
- **0xNull persona**: Prompt prefix `0xNull@0xdas`, welcome copy updated with `// you're talking to 0xNull.`, identity bar updated.
- **Mood state system**: `MoodState` = thinking (white) / shipping (green) / broke (red) / flow (cyan). `● mood` badge renders above each response (streaming + committed).
- **Command responses**: All 6 responses rewritten in 0xNull voice (dry, builder-brained). Housed in `commands.ts` — no inline strings in UI layer.
- **/feed → /cognitive-log**: Directory renamed, `Header.tsx` href/active check/label updated, page h1 and error strings updated, component renamed `CognitiveLog`.

### Session 2026-06-11 Changes — Awwwards Scroll Narrative Redesign
- **Homepage rebuilt as scroll narrative** (plan: `docs/2026-06-11_awwwards-scroll-narrative_plan.md`): boot → hero → pinned terminal demo → cognitive-log strip → onchain proof → void-energy footer.
- **New**: `lenis` smooth scroll (`SmoothScroll.tsx`, GSAP-ticker driven), `src/lib/motion.ts` (shared EASE/DUR/STAGGER/MM), `src/lib/paragraph.ts` (server-side posts fetch), `src/components/sections/*` (BootOverlay, HeroSection, TerminalSection, LogStrip, OnchainSection + onchain/*, SiteFooter), `terminal/engine.ts` + `script.ts` (seekable scripted-session engine).
- **AgentTerminal**: new `mode="scripted"` + `scriptProgress` props — ScrollTrigger scrubs a deterministic 3-command demo (/stack /projects /status), hands over to interactive at pin end. `autoFocus` removed (was scroll-hijacking page load).
- **Boot sequence**: first-visit kernel-style boot overlay (~2.4s), sessionStorage `0xnull-booted` skip, reduced-motion skip, click/keypress skip, no-JS safe (CSS-gated via `[data-boot="pending"]`).
- **Retired**: `BrandDashboard.tsx` (01_CONTEXT → terminal marginalia; 02_ONCHAIN → OnchainSection), `InvisibleLawVisualizer.tsx` (dead code). `WobbleVisualizer.tsx` kept unused (possible footer easter egg).
- **Header**: fixed position, solid tone after 24px scroll.
- **Cognitive-log page**: h1 mask entrance, one-time row stagger, CSS grid-rows expand animation, pt-28 for fixed header.
- **DESIGN.md amended**: display role promoted to clamp(2.75rem–6rem), tracking -0.04em.
- **Known gotcha**: scrubbed tweens must use `fromTo` + `immediateRender:false` when targets can be boot-hidden at creation (start values cache otherwise). Boot-listener targets must be element refs, not selector strings (dev remounts leave stale once-listeners).
- **Verified**: prod build clean, boot/skip/repeat-visit paths, reduced-motion (no overlay, content visible), mobile (no pin, interactive terminal), zero console errors.

### Next Session TODOs
- [x] **Review `/archives` and `/projects` project descriptions** (Completed 2026-05-31)
- [x] **Mobile layout refactor** (Completed 2026-05-31)
- [x] **0xNull terminal persona + mood states** (Completed 2026-06-09)
- [x] **Test terminal UI visually** (Completed 2026-06-11 — covered by redesign verification)
- [ ] **Perf profile**: 4x CPU-throttle scrub through terminal pin + Lighthouse mobile run.
- [ ] **Self-host Sohne fonts** via next/font/local (currently hotlinked from stripe.dev with preload + swap).
- [ ] **Decide**: WobbleVisualizer as footer easter egg or delete.

