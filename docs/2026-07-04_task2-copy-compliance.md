# Task 2: Copy Compliance

plan: [2026-07-04_frontend-audit_plan.md](2026-07-04_frontend-audit_plan.md)

Scope: text-only edits. DoD: anti AI-slop. No color/logic changes.

## Items

### Em-dashes (DESIGN.md's own no-em-dash rule)

- [x] `src/components/sections/TerminalSection.tsx:148`
- [x] `src/components/AgentTerminal.tsx:345`
- [x] `src/components/AgentTerminal.tsx:488`
- [x] `src/components/terminal/commands.ts:46`
- [x] `src/components/terminal/commands.ts:62`
- [x] `src/components/terminal/commands.ts:87`

Verified via `grep —` across `src/`: all remaining instances are in code comments (`//`, `/* */`), not visitor-facing copy — out of scope, left as-is.

### Hero stack discipline — `src/components/sections/HeroSection.tsx`

- [x] Was 5 text elements (eyebrow, headline, 2 subtext blocks, hint). Cut the second subtext block (`cognitive. solo. shipping.`, already documented as brand-personality words in PRODUCT.md, not lost content) and removed the `hint` element and all its animation wiring. Now 3 elements (eyebrow, headline, 1 subtext).
- [x] `// scroll: attach session` banned scroll-cue removed (was the `hint` element, deleted entirely).
- [x] `[ 0x_Cognitive_Context ]` → `[ 0x_cognitive_context ]`, dropped the forced `uppercase` class.

### Plain-UI-chrome lowercase fixes

- [x] `Header.tsx`: `ONLINE` → `online` (kept `BASE_MAINNET` as-is).
- [x] `onchain/MintPanel.tsx`: lowercased all button/badge strings.
- [x] `cognitive-log/page.tsx`: lowercased `search articles...`, `/ filter`, `clear filters` (both spots now consistent), `type`, `topic`, `topics:`, table headers `date`/`name`/`type`, `read article`/`watch video`/`view event`, `draft` badge.

## Left alone (stylized caps / terminal-log style, per decision)

`commands.ts` banners/section headers/project names, `OnchainSection.tsx` RPC/gas/tx log copy, `RpcConsole.tsx` header, all of `WobbleVisualizer.tsx`.

## Verification

- [x] Re-read every touched string against the em-dash ban and lowercase-chrome rule.
- [x] `npx tsc --noEmit` clean.
