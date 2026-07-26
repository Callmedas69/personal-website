# frontend audit: 0xNull personal site (2026-07-26)

## verdict

A disciplined, design-system-led site that passes the generic-AI smell test cleanly: zero hits across the 10-pattern slop blacklist, a real two-font system (Sohne + Sohne Mono), five-signal color roles respected, lowercase copy and tonal depth intact per DESIGN.md. The scroll narrative is mechanically excellent, settling exactly at every target in both directions with clean reversibility and full reduced-motion fallback. What holds the score back is a cluster of hygiene issues: an icon-only submit button with no accessible name, roughly 300 identical gsap "Invalid scope" console warnings on the desktop homepage from a mis-scoped call that has not been isolated, tweens created in useEffect without cleanup, a dead component still in the tree, and missing social/page metadata. Overall score 31/40.

## scores

| pillar | score /10 | summary |
|---|---|---|
| visual design | 9 | Fully compliant with the site's own DESIGN.md; zero slop tells; strong, confident register |
| animation | 8 | Flawless scroll settle and reversibility, reduced-motion solid; docked for ~300 Invalid scope warnings on desktop |
| code quality | 7 | Dead component, gsap-in-useEffect without useGSAP/cleanup, metadata gaps |
| a11y + performance | 7 | Empty submit button, focus indicators stripped without replacement, one unreferenced raster asset |

impeccable technical subscore: not available. The impeccable Claude skill is not installed in this environment; the npm CLI (impeccable 2.1.7) `detect src` ran clean with no output, and its URL scoring mode is broken on this machine (path bug). No impeccable scores are reported.

## quick wins (do these first)

1. [P1] Submit button has no accessible name -> do: add `aria-label="send"` to the button, src/components/AgentTerminal.tsx:501
2. [P2] No openGraph/twitter metadata site-wide -> do: add `openGraph` and `twitter` fields to the root metadata object, src/app/layout.tsx:6
3. [P2] Focus indicators stripped on filter checkboxes and terminal input -> do: add `focus-visible:border-accent-blue/50` (the pattern the search input already uses), src/app/cognitive-log/page.tsx:255, src/app/cognitive-log/page.tsx:286, src/components/AgentTerminal.tsx:492
4. [P2] One-shot tweens in useEffect without cleanup -> do: capture the tween and return `() => tween.kill()` from each effect, src/components/sections/onchain/BlockTicker.tsx:17, src/components/sections/onchain/RpcConsole.tsx:24
5. [P3] Dead component WobbleVisualizer -> do: delete src/components/WobbleVisualizer.tsx (zero imports, its `wobble-trigger` event is dispatched nowhere)
6. [P3] /cognitive-log inherits the root title -> do: add src/app/cognitive-log/layout.tsx exporting `metadata` with a page-specific title (the page itself is a client component, so metadata must live in a server layout)
7. [P3] Unreferenced 32.5KB PNG in public/ -> do: delete public/invisible-law-001.png, or wire it into the page if it was meant to ship

## findings by severity

### P0 blocking

None.

### P1 major

- empty-button | a11y + performance | src/components/AgentTerminal.tsx:501 (verified: the submit button's only child is `<Send size={14} />`, no aria-label, title, or text) | Screen readers announce an unnamed button; keyboard users can still submit via Enter, so it degrades rather than breaks -> do: add `aria-label="send"` to the button
- gsap-invalid-scope-spam | animation | docs/audits/assets/2026-07-26/console-log.txt lines 3-304 (~300 identical "[warning] Invalid scope", desktop homepage only: 5 at load, then a batch at every scroll settle point down and up; absent on mobile and reduced-motion passes) | Some gsap call receives a scope resolving to zero elements on the desktop layout (gsap-core.js:674 `toArray(value)[0] || _warn("Invalid scope")`); no visual breakage was observed, but an unidentified call is failing on every scroll settle and spamming the console -> do: in dev, monkey-patch console.warn to capture a stack trace on "Invalid scope", identify the offending context (all useGSAP scopes are ref objects, src/components/sections/*.tsx and src/components/AgentTerminal.tsx:148,166), and fix the scope or guard the call

### P2 moderate

- gsap-no-cleanup (merged: BlockTicker + RpcConsole) | code quality | src/components/sections/onchain/BlockTicker.tsx:17 (`gsap.fromTo` in useEffect, no cleanup return, no useGSAP), src/components/sections/onchain/RpcConsole.tsx:24 (`gsap.from` in useEffect, no cleanup return, no useGSAP) | Both are short 0.25s one-shots so the real-world leak risk is low, but an unmount or re-trigger mid-tween leaves gsap holding stale element references, and the pattern is inconsistent with the useGSAP convention used everywhere else -> do: capture the tween (`const tw = gsap.fromTo(...)`) and return `() => tw.kill()`, or migrate both effects to useGSAP
- gsap-in-useeffect (MascotStage) | code quality | src/components/mascot/MascotStage.tsx:47 (useEffect body runs gsap.ticker/gsap.to; the file has no useGSAP; manual cleanup exists at lines 509-520) | Works today, but hand-rolled cleanup is exactly what useGSAP exists to guarantee; the ticker and tweens sit outside React's lifecycle tooling -> do: migrate the ticker/tween setup into useGSAP with a scope, keeping the existing MM.desktop/reduced-motion guards
- missing-social-metadata | code quality | src/app/layout.tsx:6 (root metadata has title + description but no openGraph/twitter) | Every shared link renders as an unfurled bare URL; no og:image, no card, site-wide -> do: add `openGraph` (title, description, images) and `twitter` card fields to the root metadata
- focus-indicator-removed | a11y + performance | src/app/cognitive-log/page.tsx:255 and :286 (`focus:ring-0 outline-none` on both filter checkboxes), src/components/AgentTerminal.tsx:492 (`border-none outline-none` on the input, no focus style at all); contrast with the search input's `focus:border-accent-blue/50` | Keyboard focus is invisible on three controls; the correct in-system pattern already exists on the search input -> do: add `focus-visible:border-accent-blue/50` (checkboxes: `focus-visible:ring-1 focus-visible:ring-accent-blue/50`) to match the search input

### P3 polish

- dead-component | code quality | src/components/WobbleVisualizer.tsx:7 (zero imports across src; its `wobble-trigger` event is dispatched nowhere; it also contains a gsap mousemove tween in useEffect at line 95, which is moot while the component is dead) | Dead code that still ships in the repo and invites stale imports -> do: delete src/components/WobbleVisualizer.tsx
- missing-page-title | code quality | src/app/cognitive-log/page.tsx:1 ("use client" page, inherits the root title "0xdas.dev · talk-to-my-agent") | The log page is indistinguishable from home in tabs, history, and search results -> do: add src/app/cognitive-log/layout.tsx exporting metadata with a page-specific title
- unreferenced-raster | a11y + performance | public/invisible-law-001.png (32.5KB, zero references in src, verified by grep) | Dead weight in public/; ships on every deploy for nothing -> do: delete the file, or reference it where it was intended

## evidence index

| section | viewport | screenshot |
|---|---|---|
| boot overlay, first visit | 1440px | docs/audits/assets/2026-07-26/desktop-00-boot.png |
| hero after boot | 1440px | docs/audits/assets/2026-07-26/desktop-01-after-boot.png |
| scroll-down settles 0-5 | 1440px | docs/audits/assets/2026-07-26/desktop-down-0.png ... desktop-down-5.png |
| scroll-up reversibility 0-4 (mascot reassembled at up-0, terminal re-pinned at up-2) | 1440px | docs/audits/assets/2026-07-26/desktop-up-0.png ... desktop-up-4.png |
| full page | 1440px | docs/audits/assets/2026-07-26/desktop-full.png |
| scroll-down settles 0-5 (terminal content at down-1, log cards stacked at down-3) | 390px | docs/audits/assets/2026-07-26/mobile-down-0.png ... mobile-down-5.png |
| scroll-up reversibility 0-4 | 390px | docs/audits/assets/2026-07-26/mobile-up-0.png ... mobile-up-4.png |
| full page | 390px | docs/audits/assets/2026-07-26/mobile-full.png |
| cognitive-log top + full | 1440px | docs/audits/assets/2026-07-26/log-desktop-top.png, log-desktop-full.png |
| cognitive-log top + full | 390px | docs/audits/assets/2026-07-26/log-mobile-top.png, log-mobile-full.png |
| reduced motion top/mid/bottom + full | 1440px | docs/audits/assets/2026-07-26/rm-01-top.png, rm-02-mid.png, rm-03-bottom.png, rm-full.png |
| console capture (scroll lines + ~300 Invalid scope warnings, zero errors) | 1440px | docs/audits/assets/2026-07-26/console-log.txt |

## skipped / not verified

- impeccable scored pass: not available in this environment (skill not installed; CLI `detect src` clean, URL mode broken). Pillar scores above are manual, based on verified findings only.
- The "Invalid scope" warning source was narrowed to the gsap-core scope resolver (node_modules/gsap/gsap-core.js:674) but not isolated to a specific component call; all useGSAP scopes in src are ref objects, so the trigger likely sits inside a recreated context or a selector string. Needs one dev pass with an instrumented console.warn.
- Unverified observations, recorded as notes only, not findings: (a) the footer is `min-h-[60svh] flex justify-end` (src/components/sections/SiteFooter.tsx:52), producing a large deliberate void above the footer content; it matches the DESIGN.md "void energy" register but reads empty at page bottom (desktop-down-5.png, mobile-down-5.png). (b) The mascot GLB's geometry/material/texture are never disposed on unmount; MascotStage.tsx disposes the renderer only (~line 519), so GPU memory can leak across unmount/remount cycles. Neither was confirmed as a defect in the live pass.
- Not re-reported per prior audit state: BlockTicker pulse-dot-always-on (deferred from the 2026-07-04 audit), AgentTerminal THEMES global-token bleed (judged a deliberate feature), and all 2026-07-04 fixes (no regressions found).
- Discarded with evidence during this audit (not promoted): cognitive-log topic filter casing/weight inconsistency (live DOM probe showed identical computed styles, a rendering illusion); blue block next to the header logo (the Logo.tsx:28 blinking cursor caught mid-blink, intentional); mobile terminal empty body at mobile-down-2.png (mid-scrub state, content confirmed at mobile-down-1.png); footer-top void (design intent, demoted to observation (a)).
