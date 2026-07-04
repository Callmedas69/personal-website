# Task 3: Cognitive-Log Structural Fixes

plan: [2026-07-04_frontend-audit_plan.md](2026-07-04_frontend-audit_plan.md)

Scope: structural fixes isolated to `src/app/cognitive-log/page.tsx`.

## Items

- [x] `[ FIG. 3 ]` → `fig. 3` — dropped the bracket format reserved for the hero eyebrow.
- [x] Expanded-row panel border/bg: `border-accent-mint/20 bg-accent-mint/5` → `border-border-line/40 bg-terminal-inner/20`, matching the tonal-depth pattern used elsewhere in the file (neutral border, neutral surface tint).
- [x] Fallback date on parse failure: `"2026.06.02"` → `"date unknown"`. Note: `date` also drives `livePosts.sort` (string compare) — an unparseable-date item sorting to one end of the list is an acceptable rare-edge-case tradeoff versus displaying a fabricated real-looking date.

## Verification

- [x] `npx tsc --noEmit` clean.
- [ ] Visually confirm the expanded-row border reads as neutral (matches other panel borders) — deferred to end-of-session browser pass.
