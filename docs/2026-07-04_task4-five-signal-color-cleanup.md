# Task 4: Five-Signal Color-Role Cleanup

plan: [2026-07-04_frontend-audit_plan.md](2026-07-04_frontend-audit_plan.md)

Scope: color-role cleanup. Five-signal rule: blue=primary / mint=live / yellow=cognitive-nav / green=shipped / purple=archive, each used only in its own role.

## Items

- [x] `src/components/AgentTerminal.tsx` `THEMES` (~L25-62) — **reversed during execution, no change.** On reading the full object, `THEMES` swaps `--color-brand-bg`, `--color-terminal-bg`, `--color-terminal-inner`, `--color-text-primary`, `--color-text-slate`, `--color-accent-blue`, `--color-border-line` together, i.e. a deliberate full-page mood reskin (documented in CONTEXT.md session history as the "mood state system"), not an accidental role bleed. Scoping it to component-local vars would remove a signature feature. Left as-is; flagged to Harry.
- [x] `src/components/AgentTerminal.tsx` (~L319-323) mood-selector dots — removed the per-dot `boxShadow` glow (DESIGN.md's Mood Selector Button spec shows active state via border/opacity only, no shadow). Kept the existing opacity-based active/inactive treatment, which already communicates selection.
- [x] `src/components/sections/LogStrip.tsx` (~L92-100) and `src/app/cognitive-log/page.tsx` (~L391-397) content-type badges (BLOG/VIDEO/EVENT) — both recolored from blue/purple/mint to one neutral treatment (`border-border-line/40 text-text-slate bg-terminal-bg/30`).
- [x] `src/components/sections/TerminalSection.tsx` (~L27-38) file labels (CLAUDE.md/CONTEXT.md/FILESYSTEM) — recolored from blue/mint/yellow to neutral (`border-border-line/40 bg-terminal-inner/20`, `text-text-primary` label).
- [x] `src/components/sections/onchain/RpcConsole.tsx` (~L43-53) — connection-status lines (`Connected to`/`Wallet status:`/`RPC status:`) recolored from accent-blue to neutral `text-text-primary`; generic `>>` progress-line yellow branch removed (falls to default neutral). Kept mint for success/confirmed and red-400 for errors (matches AgentTerminal's existing "broke" mood precedent).
- [x] `src/components/sections/onchain/MintPanel.tsx` (~L56-66) — default MINT button color changed from accent-yellow to accent-blue, matching the CONNECT button's color (same "primary action" role, now consistent regardless of wallet-connection state; note the two buttons are mutually exclusive via the `isConnected` ternary, so they were never simultaneously visible, but the role's color now stays constant across states). Hardcoded `#244e56` pending-state background replaced with an accent-mint-derived `rgba(117,209,196,0.18)` tint (pending = live process, mint's role).

## Excluded as false positives (verified against DESIGN.md's own component specs, no change)

`SiteFooter.tsx`/`Header.tsx` social-link hover colors (farcaster→mint, twitter→blue, github→purple) exactly match DESIGN.md's documented Navigation Link spec.

## Flagged for Harry (not fixed, reversed judgment call)

`AgentTerminal.tsx` `THEMES` global-token mood reskin: the audit plan called this a bug, but it's a deliberate, pre-existing, documented feature (full-page mood-reactive theme). No change made. If you did want the "blue = primary always" contract to hold *even while a mood is active*, that would mean either scoping the reskin to exclude `--color-accent-blue`, or accepting that the reskin intentionally overrides the whole palette while active — worth a real decision, not a silent fix.

## Verification

- [x] `npx tsc --noEmit` clean.
- [x] `npx eslint` on all Task 1-4 touched files: 15 pre-existing errors surfaced (matches CONTEXT.md's documented debt: `any` types, setState-in-effect, `//` comment-syntax colliding with `jsx-no-comment-textnodes`) — none introduced by these changes, left untouched per minimal-impact rule.
- [ ] Visually confirm each accent color reads consistently with its assigned role across the page — deferred to end-of-session browser pass.
