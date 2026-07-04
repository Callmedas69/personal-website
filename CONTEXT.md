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

### Session 2026-06-11 Changes — Mobile Polish (Session 38)
- **BootOverlay.tsx**: last boot line is now `[/] attaching session` with cycling spinner (`/ - \ |`, 100ms interval); 1.2s hold after lines + progress bar, spinner flips to `[ok]` (mint) with 0.4s beat, then the wipe. Skip-on-click/keypress and sessionStorage repeat-visit paths intact. Total boot ~4s.
- **LogStrip.tsx**: mobile (<md) stacks cards as full-width column (`flex flex-col md:flex-row`, `w-full md:w-[340px]`); horizontal snap + GSAP pinned scrub unchanged from md up.
- **cognitive-log/page.tsx**: feed rows on mobile (<sm) stack date (line 1) over title (line 2), type badge pinned right — `sm:contents` wrapper dissolves into the 12-col table grid at sm+. Header labels and loading skeleton reshaped to match.
- **Commits**: `b25ed80` (boot spinner), `4ed2e0c` (mobile layouts) — pushed to main.
- **Uncommitted leftovers**: `.gitignore` (+`.gstack/`) and `CNAME` deletion sit in the working tree — commit as chore or restore.
- **Known debt**: 5 pre-existing eslint errors in `cognitive-log/page.tsx` (`any` types, setState-in-effect, `//` text nodes) — untouched per minimal-impact rule.

### Session 2026-06-13 Changes — 3D Voxel Mascot Scroll Companion
- **New feature**: interactive 3D `0xnull` voxel mascot (vanilla three.js, NOT R3F). Source GLB `00_THE-VAULT/99_SYSTEM/personal-brand/symbol/0xnull_3d-object.glb` (156 separate voxel meshes, 28k verts, no rig/anim). Optimized 1MB → 32KB via gltf-transform dedup/prune/quantize (`npm run asset:mascot`); output `public/models/0xnull.glb` (156 meshes intact, 9 shared materials). Preloaded in `layout.tsx`.
- **New files** `src/components/mascot/`: `Mascot.tsx` (next/dynamic ssr:false + WebGL probe), `MascotStage.tsx` (orchestrator engine), `scene.ts` (renderer/lights/loader + eyeVoxels + emissive glow), `assembly.ts` (boot assembly + `computeDissolveDirs`/`applyDissolve`), `moods.ts` (mood→eye color, mirrors AgentTerminal THEMES), `poses.ts` (per-section screen-space poses).
- **Behavior**: one fixed full-viewport canvas (`pointer-events-none`), model (not canvas) moves. Boot: voxels scatter+assemble during boot progress/spinner window (`boot-assembly-start` event added to BootOverlay), then fly into hero on `boot-complete`. Scroll companion via `data-mascot-section` anchors on the 5 sections + pose-lerp in one `gsap.ticker` loop: hero (float+parallax) → terminal (peek top-right, watch) → log (barrel-spin on scrub) → onchain (scale by block ticker) → footer (voxel dissolve into void, scrub-driven, full at max scroll). Procedural blink (eye voxels) + mood-reactive eye emissive glow (MutationObserver on `[data-theme]`).
- **Fallbacks**: reduced-motion = static hero pose, render-on-demand, no ticker; mobile (`!MM.desktop`) = skip canvas entirely (matches hero slot `hidden md:block`); no WebGL = bail.
- **BUG FIXED (this session)**: repeat-visit path froze the model to end of page — it aligned to hero slot but never created scroll behavior (only first-visit `goToHero` did). Now both paths funnel through unified `startChoreography()`.
- **Key gotcha**: the quantized GLB carries a large dequantization scale on the loaded root (~555). Never seed transforms from `modelGroup.scale`; `tickLoop` must not touch the model before `heroAligned` (lets boot assembly own it). Entrance seeds deterministically from the hero target.
- **Modified**: `BootOverlay.tsx` (mascot slot replaces pixel OxNull, assembly-start dispatch), `HeroSection.tsx` (`[data-mascot-slot='hero']` centered), all 5 sections (`data-mascot-section`), `page.tsx` (`<Mascot/>`), `layout.tsx` (GLB preload), `package.json` (three, @types/three, @gltf-transform/cli, asset:mascot script).
- **Verified**: `npx tsc --noEmit` clean, mascot files eslint clean, zero console errors across full scroll (headless). NOT felt-tested in real browser — pose tuning (spin speed, blink rate, terminal peek height) likely needs eyeball adjustment.
- **Commit**: `aed2840` pushed to main (17 files, +2636/-31). CNAME deletion / .gitignore / CONTEXT.md deliberately NOT committed (CNAME deletion would break 0xdas.dev domain).

### Session 2026-06-15 Changes — Mascot rebuilt on original GLB + clean render + scroll mood (Session 44)
- **Model swap**: hero mascot now uses the **original** `0xnull_3d-object.glb` (was briefly the `-noline` variant). `asset:mascot` simplified to `gltf-transform dedup → prune` only (dropped `--quantize-position`) → `public/models/0xnull.glb` (~67KB). Quantization had hurt precision; the original renders clean without it.
- **RCA — the "seam"/glassy saga**: a stock GLB viewer renders the model perfectly, so it was never the geometry. Real causes: (1) **camera depth-buffer starvation** — `createScene()` had `near 0.1 / far 5000` with the camera at z=2600, leaving no precision to separate the overlapping (edge 71 vs pitch 61) cube faces → z-fighting "mortar seams". Fixed to `PerspectiveCamera(35, 1, 1200, 4200)`. (2) GLB ships all 156 materials `doubleSided` → backfaces; set `mat.side = THREE.FrontSide` on load. (3) An over-engineered geometry **merge** (mergeGeometries + non-uniform scale + recomputed normals) had inverted faces into a transparent/glassy mess — fully reverted to a plain per-cube load.
- **Lighting/color**: `NeutralToneMapping` (exp 1.05) + neutral hemisphere/key/fill/ambient → true grey (ACES had muddied it to navy).
- **Per-part animation** (`MascotStage.tsx` `tickLoop`, gated off during boot/dissolve/reduced-motion): eye **blink**, orb **breathe + cursor hover-glow**, hands **micro-bob**. Eye cursor-tracking was added then **removed** at Harry's request.
- **Scroll-driven mood**: `SECTION_MOOD` map (hero=thinking, terminal=flow, log=shipping, onchain=flow, footer=broke) recolors **eyes (color) + orb (color+glow)** on section change via new `applyMascotMood`/`setMascotMoodInstant` in `moods.ts` (eyes now collected as `eyeMaterials` in `scene.ts`). Smooth 0.55s tween; the abrupt section-arrival emissive flare was removed for seamless scrolling. Manual terminal theme-dots still recolor too.
- **Scroll-return fix**: mascot parked top-right after scrolling up because the hero pose is anchored to a moving DOM slot (`[data-mascot-slot='hero']`) but `worldTgt` was only set at `setSection`. Now re-resolved every frame while `currentSection === "hero"`.
- **Footer dissolve**: cubes now stay **opaque** and fling **off-screen** (removed `opacity = 1-p` in `applyDissolve`; `dissolveSpread` 1.4→4) instead of fading transparent.
- **Files**: `scene.ts`, `MascotStage.tsx`, `moods.ts`, `assembly.ts`, `package.json`, regenerated `public/models/0xnull.glb`.
- **Verified**: `npx tsc --noEmit` + mascot eslint clean throughout. Render confirmed clean in browser (original colors). **All changes uncommitted.**
- **Memory**: saved `project_0xnull-mascot-render.md` (use original GLB, camera near/far + FrontSide fixes, no merge/quantize).

### Next Session TODOs
- [x] **Review `/archives` and `/projects` project descriptions** (Completed 2026-05-31)
- [x] **Mobile layout refactor** (Completed 2026-05-31)
- [x] **0xNull terminal persona + mood states** (Completed 2026-06-09)
- [x] **Test terminal UI visually** (Completed 2026-06-11 — covered by redesign verification)
- [ ] **Perf profile**: 4x CPU-throttle scrub through terminal pin + Lighthouse mobile run.
- [ ] **Self-host Sohne fonts** via next/font/local (currently hotlinked from stripe.dev with preload + swap).
- [ ] **Decide**: WobbleVisualizer as footer easter egg or delete.
- [x] **Commit leftovers** (stale — .gitignore `.gstack/` + CNAME removal already landed in an earlier commit; nothing left uncommitted as of 2026-07-04)

### Session 2026-07-04 Changes
- **CLAUDE.md**: added "Model routing (through July 7)" section — Sonnet 5 default, Fable 5 reserved for heavy tasks (migrations, codebase-wide refactors, hard bugs), note on Opus 4.8 security-adjacent reroute.
- **Commit**: `aec3b5c` pushed to main.

