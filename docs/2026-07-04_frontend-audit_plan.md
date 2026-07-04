# Frontend Design Audit + Fix Pass — 0xdas Personal Website

## Context

Audit of the homepage + cognitive-log against this project's own written design system (`PRODUCT.md` + `DESIGN.md`, register: brand/"cognitive OS") plus the `impeccable` and `design-taste-frontend` skills' anti-AI-slop rubrics. Goal: text/image balance, seamless animation (no snapping), a first-time visitor understands what the site is within the first two sections, no AI-slop, tests stay green.

Three Explore agents scanned in parallel: (1) hero/terminal copy + text-image balance, (2) log/onchain/footer/cognitive-log copy + content density, (3) the animation/ScrollTrigger implementation for snapping-bug patterns. Findings were cross-checked against DESIGN.md's actual component specs before being turned into fixes — two flagged "violations" turned out to be false positives (see Excluded section in task 4 doc).

## Decisions (asked and answered before execution)

- **Scope**: fix everything found, one pass, not just the mechanical subset.
- **Casing**: leave stylized caps alone on brand/project names and terminal-log-style output (AgentTerminal's `commands.ts`, OnchainSection's RPC/gas/tx log lines, WobbleVisualizer). Only fix casing on plain UI chrome (buttons, filters, table headers, badges, tooltips).
- **WobbleVisualizer.tsx**: unused dead code (existing open TODO from 2026-06-11 session), left untouched this pass.

## Task docs

1. [`2026-07-04_task1-animation-robustness.md`](2026-07-04_task1-animation-robustness.md) — animation correctness (DoD: no snapping/jumping).
2. [`2026-07-04_task2-copy-compliance.md`](2026-07-04_task2-copy-compliance.md) — em-dash removal, hero stack trim, plain-UI-chrome lowercase fixes.
3. [`2026-07-04_task3-cognitive-log-fixes.md`](2026-07-04_task3-cognitive-log-fixes.md) — structural fixes isolated to `cognitive-log/page.tsx`.
4. [`2026-07-04_task4-five-signal-color-cleanup.md`](2026-07-04_task4-five-signal-color-cleanup.md) — color-role cleanup across AgentTerminal, LogStrip, TerminalSection, RpcConsole, MintPanel.

Execution order: 1 → 2 → 3 → 4. Each task doc is independently scoped enough to execute, verify, and commit separately.

## Deferred (not part of any task doc)

- `onchain/BlockTicker.tsx` pulse dot animates regardless of real connection/sync state. Would need real liveness wiring, more than a copy/color fix.

## Verification (per task, and once at the end)

- [x] `npx tsc --noEmit` clean (after every task).
- [x] `npm run build` clean, twice (mid-session and final).
- [x] Manual scroll-scrub of the full homepage, both directions, in a real Chrome session against the **production build** (`next start`), from hero through the terminal pin, log strip, onchain, to footer and back. No snap/jump. Mascot reassembles correctly on scroll-up, demo replays via `onEnterBack`, footer dissolve/undissolve both work.
- [x] Zero console errors across the full run.
- [x] All copy/color fixes confirmed live: lowercase chrome, comma replacing em-dash in scripted terminal output, neutral file-label cards, neutral RPC console lines, blue "connect" CTA.
- [ ] Boot path (first-visit) not explicitly re-verified this pass (repeat-visit path was, since sessionStorage was already set); no code touched boot logic, low risk.
- Test suite: none exists in this project (no `test` script) — vacuously satisfied.

**Bisect note**: mid-verification, a scroll jump (page snapping back to an earlier scroll position) appeared twice during **dev-server** (`next dev`) testing. Git-stashed all Task 1-4 changes, reverted to session-start baseline, reproduced the identical jump on unmodified code, with a literal browser "Frame with ID 0 was removed" error — confirming it's a dev-server/HMR/WebSocket reload artifact, not a GSAP/ScrollTrigger bug, and not caused by any change in this session. Re-verified clean against the **production build**, where it does not occur. Stash popped, all changes restored.
