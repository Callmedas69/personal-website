---
name: 0xNull Personal Site
description: A live cognitive OS for a solo builder on Base. Terminal-native, mood-aware, always mid-thought.
colors:
  bg-deep: "#011627"
  bg-surface: "#070d19"
  text-primary: "#d8dee9"
  text-slate: "#5f7d97"
  text-muted: "#999999"
  accent-blue: "#6e9cf1"
  accent-mint: "#75d1c4"
  accent-yellow: "#fec97d"
  accent-green: "#aae87b"
  accent-purple: "#9372c9"
  border-overlay: "#c0c7d1"
typography:
  display:
    fontFamily: "'Sohne', system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7.5vw, 6rem)"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.04em"
  body:
    fontFamily: "'Sohne Mono', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "'Sohne Mono', 'JetBrains Mono', ui-monospace, monospace"
    fontSize: "0.625rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.1em"
rounded:
  sm: "4px"
  md: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
components:
  panel:
    backgroundColor: "{colors.bg-deep}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  panel-nested:
    backgroundColor: "{colors.bg-surface}"
    rounded: "{rounded.md}"
    padding: "20px 24px"
  mood-btn:
    backgroundColor: "transparent"
    textColor: "{colors.text-slate}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  mood-btn-active:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.accent-blue}"
    rounded: "{rounded.sm}"
    padding: "10px 12px"
  status-badge:
    backgroundColor: "{colors.bg-surface}"
    textColor: "{colors.accent-mint}"
    rounded: "{rounded.sm}"
    padding: "2px 8px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.text-slate}"
  nav-link-active:
    backgroundColor: "transparent"
    textColor: "{colors.accent-yellow}"
---

# Design System: 0xNull Personal Site

## 1. Overview

**Creative North Star: "The Cognitive OS"**

This is a personal operating system mid-boot. Not a portfolio, not a landing page: a live interface that logs a mind at work. Every panel is a read-out. Every color state is a process signal. The UI never resolves into a pitch or a CTA; it documents and continues. The terminal is the identity.

The palette is deep, desaturated navy (`#011627`) with five precision accents keyed to system states: blue for primary signal, mint for live status, yellow for cognitive navigation, green for shipping output, purple for archive/hold. No gradients, no glass, no decorative chrome. Borders are 12% opacity overlays. Depth is tonal — bg-deep (`#011627`) versus bg-surface (`#070d19`) — not shadows. The whole system reads as authored by a developer who treats UI like source code.

The voice is lowercase, comment-syntax (`//`), dry, always mid-thought. "void energy, always mid-thought" is not just a footer line; it is the design register. Panels feel like annotated processes. Labels feel like variable names. Copy ends in continuation, not completion.

This system explicitly rejects: SaaS landing page structure (no gradient CTAs, no metric callouts, no "empower your workflow" copy); the developer-portfolio cliché (no "Hi, I'm Harry" hero, no skills grid, no contact form); NFT maximalism (no floor prices, no Discord links, no loud on-chain bragging); AI startup slop (no cream background, no rounded-everything, no gradient text, no next-gen buzzwords). The reference is Stripe Dev tools — dark precision, Sohne typography, information-dense without noise.

**Key Characteristics:**
- Deep navy mono-surface, two-level tonal depth only
- Five semantic accent colors, each bound to a specific system state
- Two-font system: Sohne (display/hero) + Sohne Mono (everything else)
- Compact sizing — body at 14px, labels at 9-10px; density is a feature
- Borders via 12% opacity overlay, never colored stripes
- Motion is state-signal only: pulse dots, blink cursor, mood transitions

## 2. Colors: The Signal Palette

Five accents, each with a job. No color is decorative.

### Primary
- **Operator Blue** (`#6e9cf1`): The primary accent. Used on eyebrow labels, h1 accent span, active nav indicators, hover glows, and the terminal glow shadow. The "signal is live" color. Use it for anything that says "primary active state."
- **Deep Navy** (`#011627`): Main body background and terminal-bg. The canvas everything is drawn on. Never change this for cosmetic variation.

### Secondary
- **Surface Navy** (`#070d19`): Nested container background (panel bodies, terminal inner, BrandDashboard inner). Expresses one level of depth below bg-deep via tone shift alone — no shadow.
- **Live Mint** (`#75d1c4`): Status indicators: BASE_MAINNET badge, pulse dot in panel headers, secondary nav hover. Means "live process, external connection, on-chain."
- **Cognitive Yellow** (`#fec97d`): Active state for `/cognitive-log` nav link. The warm signal; reserved for the writing/thinking navigation destination.

### Tertiary
- **Shipping Green** (`#aae87b`): Shipping mood state, success outputs from the terminal. Means "running, deployed, successful build."
- **Archive Purple** (`#9372c9`): GitHub nav hover. Tertiary decorative. Use sparingly — for references to archived work or external repository state.

### Neutral
- **Foreground Cool** (`#d8dee9`): Primary reading text. Used on h1, body prose at full weight, any text the user must read. Must hit ≥4.5:1 against bg-deep (it does: contrast ~12:1).
- **Slate Mid** (`#5f7d97`): Secondary labels: nav links at rest, sub-descriptions in panels, comment-like annotations. Decorative at scale (e.g. `text-[9px]`); at body size verify ≥4.5:1 (contrast ~4.6:1 against bg-deep; borderline — use at ≥14px only).
- **Muted Gray** (`#999999`): Tertiary hints and placeholder text. At 14px body size against bg-deep this is ~5.2:1; still passes AA. Do not use for critical reading text.
- **Border Overlay** (`#c0c7d1` at 12% opacity): All dividers, panel borders, section separators. Never use border-overlay at higher opacity for decorative effect.

### Named Rules
**The Five-Signal Rule.** Each accent color has one job. Blue = primary active. Mint = live status. Yellow = cognitive navigation. Green = shipping output. Purple = archive/external. Do not use an accent outside its semantic role to add visual interest. Adding another blue element "for balance" is a defect, not a design decision.

**The Opacity Border Rule.** All borders are `border-overlay` (`#c0c7d1`) at 12% opacity — never a solid color stripe, never a thick decorative left-border, never a gradient. One exception: mood button active state uses the mood's accent color at 30% opacity as its border. That's a state signal, not decoration.

## 3. Typography

**Display Font:** Sohne (served from stripe.dev/fonts; fallback: system-ui, sans-serif)
**Body/Mono Font:** Sohne Mono (served from stripe.dev/fonts; fallback: JetBrains Mono, ui-monospace, monospace)

**Character:** A two-font system with maximum contrast. Sohne carries the hero headline — tight-tracked, extrabold, sparse. Sohne Mono handles everything else: labels, body prose, interactive elements, footers. The mono-forward approach is intentional; the UI reads as authored by someone who works in a terminal all day.

### Hierarchy
- **Display** (800, clamp(2.75rem–6rem), leading 1.02, -0.04em): Hero h1 only. One instance per page. Two-line treatment with a colored break (`<span class="text-accent-blue">`). Never gradient; never all-caps. *Amended 2026-06-11: the scroll-narrative redesign promoted the display role to full-viewport scale; 6rem is the hard ceiling and -0.04em the tracking floor.*
- **Body** (400, 0.875rem / 14px, leading 1.6): All prose text in panels and descriptions. Sohne Mono. Max line length 65–75ch where content allows.
- **Label** (700, 0.625rem / 10px, leading 1, 0.1em, UPPERCASE): Eyebrow tags (`[ 0x_Cognitive_Context ]`), panel header titles, status badge text. Sohne Mono. The uppercase tracking is reserved for this role only.
- **Micro** (400–700, 0.5625rem / 9px, leading 1.2): Footer lines, sub-descriptions, atmosphere text at very low opacity. Decorative — not reading text. Does not need to meet contrast AA.

### Named Rules
**The Mono-Forward Rule.** Sohne (sans) appears on one element only: the hero h1 display heading. Every other text node — nav, labels, body, footer, terminal output — is Sohne Mono. The sans/mono distinction marks the signal/noise hierarchy: the h1 is the only message, everything else is the log.

**The Comment Syntax Rule.** Copy that introduces a state or context uses `//` prefix syntax: `// thinking`, `// shipping`, `// it broke`, `// in flow`. This is typography, not decoration. Do not use other symbols as section markers.

## 4. Elevation

Flat-by-default. No structural shadows anywhere in the system. Depth is expressed entirely through two background tones: bg-deep (`#011627`) as the base surface, bg-surface (`#070d19`) for nested containers and panel bodies. The delta is subtle — about 5 lightness points in OKLCH — enough to separate layers without creating visual weight.

One ambient glow exception: `.terminal-glow` applies a very low-opacity blue/mint radial shadow (`0 0 40px rgba(110,156,241,0.08), 0 0 80px rgba(117,209,196,0.03)`) to the main terminal panel. This is atmosphere, not structure — it signals "this panel is the primary live process." No other element uses box-shadow.

### Named Rules
**The Tonal Depth Rule.** Elevation = tone, not shadow. bg-deep is level 0. bg-surface is level 1. There is no level 2. If you need a third level, you have a layout problem, not an elevation problem.

**The Glow Exception Rule.** The terminal glow is the only permitted box-shadow in the system. It uses opacity ≤0.08. Do not add glow to cards, buttons, or nav elements. Do not increase the terminal glow opacity.

## 5. Components

### Terminal Panel
The core container. Used for AgentTerminal, OxNullPanel, BrandDashboard. Precise and authored — no decorative chrome.
- **Shape:** Gently cornered (8px radius, `rounded.md`), `overflow: hidden`
- **Background:** bg-deep (`#011627`) outer shell; bg-surface (`#070d19`) for inner body/content areas
- **Border:** `border-overlay` at 12% opacity — one 1px perimeter line; no inner shadows
- **Panel header strip:** bg-surface at 40% opacity, border-bottom at border-overlay 12%; horizontal padding 16px, vertical 10px
- **Header contents:** Mono label (10px, 700, tracked, UPPERCASE) in text-slate; colored dot indicator in the mood's accent color; right-aligned state label in mood accent
- **Body padding:** 20–24px horizontal, 20px vertical
- **Terminal glow:** Apply `.terminal-glow` to the AgentTerminal only

### Mood Selector Button
Interactive state-signal elements in a 2×2 grid. Each button represents one cognitive mode.
- **At rest:** transparent bg, `border-overlay` border at 40% opacity, text-slate text
- **Active:** bg-surface bg, mood accent color at 30% opacity as border, mood accent color as label text
- **Shape:** 4px radius (`rounded.sm`), 10px vertical / 12px horizontal padding
- **Contents:** 6px dot (mood accent color, active; text-slate/40 at rest) + label (10px, bold, `// label`) + description (9px, text-slate/70)
- **Hover:** border-overlay at 100% opacity, text shifts to text-primary
- **Transition:** 150ms, all properties

### Status Badge (BASE_MAINNET)
Live status indicator in the header. Signals active blockchain connection.
- **Shape:** 4px radius, horizontal padding 6–8px, vertical 2px
- **Background:** bg-surface at 60% opacity
- **Border:** border-overlay at 60% opacity
- **Text:** 9px Sohne Mono, accent-mint, uppercase. Pulse dot (6px, accent-mint) on the left.
- **Never:** use this pattern with a solid colored background. The translucency is intentional.

### Navigation Link
Mono nav links in the header. Minimal; no underline decorations.
- **At rest:** text-slate, 12px Sohne Mono
- **Hover:** each link has a designated hover accent (cognitive-log → accent-yellow; farcaster → accent-mint; twitter → accent-blue; github → accent-purple)
- **Active/current route:** accent-yellow, font-bold. No background, no underline, no border.
- **Separator:** `·` in text-slate at 40% opacity

### Prompt Input (AgentTerminal)
The terminal command input. Styled as a real shell prompt line.
- **Background:** transparent or minimal (inherits bg-surface)
- **Border:** border-overlay bottom-only at 40% opacity on focus
- **Prompt prefix:** Sohne Mono, 10–12px, accent-blue — `0xNull@0xdas ~$`
- **Input text:** Sohne Mono, 14px, text-primary
- **Cursor:** blinking block (`animate-cursor`) in accent-blue
- **Focus ring:** none; the blink cursor is the focus indicator

### Eyebrow Label
One-line bracketed contextual markers.
- **Format:** `[ slug_with_underscores ]` in uppercase, Sohne Mono 10px, font-bold, tracked-widest (0.1em+), accent-blue
- **Placement:** above h1 only. Do not place eyebrow labels above sections, components, or card headers.
- **Never:** use a non-bracketed format for eyebrows, or apply tracked-widest to non-eyebrow content

## 6. Do's and Don'ts

### Do:
- **Do** use `border-overlay` (`#c0c7d1`) at exactly 12% opacity for all borders and dividers.
- **Do** express depth through bg-deep → bg-surface tone shift only. No box-shadows except the `.terminal-glow` exception on AgentTerminal.
- **Do** write all copy in lowercase. Section labels, nav items, mood states, terminal responses, footers — all lowercase unless it's an abbreviation like BASE or WCAG.
- **Do** prefix all state-describing copy with `//` comment syntax: `// thinking`, `// in flow`, `// it broke`.
- **Do** assign each accent color to its semantic role and use it only there. Blue = primary active. Mint = live/external. Yellow = cognitive nav. Green = shipped. Purple = archive.
- **Do** use Sohne only for the hero h1. Everything else — including all panels, labels, and interactive elements — is Sohne Mono.
- **Do** keep all text at 14px or above for reading content. Text at 9–10px is atmosphere only; don't put critical information at micro sizes.
- **Do** ensure body-weight text (Sohne Mono 14px, text-primary `#d8dee9`) maintains ≥4.5:1 against bg-deep (`#011627`).
- **Do** include `@media (prefers-reduced-motion: reduce)` alternatives for all animations: cursor blink → instant toggle; pulse dot → static; mood transition → instant color swap.

### Don't:
- **Don't** use this as a SaaS landing page. No gradient CTAs, no metric callouts ("10,000+ builders"), no "empower your workflow" or "seamless" copy. This is a cognitive OS, not a product pitch.
- **Don't** build a developer-portfolio cliché: no "Hi, I'm Harry" intro, no skills grid, no project card rows, no contact form with a "Send Message" button.
- **Don't** flex on-chain in the NFT-bro register: no floor prices, no Discord call-to-action, no "WEN MOON" energy. Wallet connection and block updates are identity markers, not features to brag about.
- **Don't** use AI startup slop aesthetics: no cream/warm-neutral background, no border-radius above 12px on panels, no gradient text (`background-clip: text`), no "next-generation" or "cutting-edge" or "game-changer" copy.
- **Don't** add shadows, glass, blur (`backdrop-filter`), or any elevation treatment beyond the `.terminal-glow` exception.
- **Don't** add a `border-left` or `border-right` stripe wider than 1px as a colored accent. The mood button border is a perimeter line, not a side stripe.
- **Don't** repeat the eyebrow pattern (`[ UPPERCASE · TRACKED ]`) on every section or component. It appears above the hero h1 and nowhere else in the current layout.
- **Don't** use more than two font families. Sohne + Sohne Mono is the entire system. No third face, no display variable, no web-safe serif fallback in running copy.
- **Don't** let `text-slate` (`#5f7d97`) carry reading-weight body text below 14px. At 12px it falls under 4.5:1 against bg-deep. Use it for labels and annotations only.
- **Don't** use rounded corners above 8px on containers. `rounded.sm` (4px) for tags/badges, `rounded.md` (8px) for panels. Full-pill (`rounded-full`) only for dots and live status indicators.
