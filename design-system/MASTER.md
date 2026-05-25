# Design System Master - Agent Terminal Portfolio

This document represents the visual and structural source of truth for **0xdas.dev** (Harry's personal website), ensuring high-fidelity implementation of the interactive agent-terminal UI using Next.js, TailwindCSS, and GSAP.

---

## 1. Design Direction Summary

- **Aesthetic Direction Name:** Industrial Utilitarian Terminal
- **Design Feasibility & Impact Index (DFII) Score:** 15/15 (High Visual Impact, High Context Fit, High Performance, Managed Consistency)
- **Key Inspiration:** `agent-terminal.png` + `stripe.dev` high-contrast dark accents.
- **Tone:** Technical, precise, minimalist, and developer-immersive.

---

## 2. Design System Snapshot

### Color Palette (Stripe Dot Dev Extracted)
```css
:root {
  --color-bg-page: #0f121d;          /* Ultra dark navy screen backing */
  --color-bg-terminal: #011627;      /* Primary canvas (Stripe dev dark navy) */
  --color-bg-terminal-inner: #070d19;/* Slightly darker background for logs */
  
  --color-text-primary: #d8dee9;     /* Off-white readable terminal logs */
  --color-text-slate: #5f7d97;       /* Muted slate text (labels/disclaimers) */
  --color-text-muted: #999999;       /* Muted gray placeholder text */
  
  --color-accent-blue: #6e9cf1;      /* Interactive blue highlights (welcome, brand) */
  --color-accent-yellow: #fec97d;    /* Warning highlights / bracket decorations */
  --color-accent-mint: #75d1c4;      /* Interactive green accent (CTA buttons, cursor) */
  --color-accent-green: #aae87b;     /* Successful operations & CLI client prompts */
  --color-accent-purple: #9372c9;    /* Meta fields & tag values */
  
  --color-border: rgba(192, 199, 209, 0.15); /* Muted border lines */
}
```

### Typography (Tailwind Configuration Extension)
- **Expressive Font (Mono/Logs):** `JetBrains Mono` / `Fira Code` (via Google Fonts fallback) for terminal commands, outputs, buttons, and user entries.
- **Brand/Header Font:** Custom `sohne-var` (pointing directly to the Stripe.dev CDN Web Font) for headers and large welcome texts.
- **Size Hierarchy:**
  - Large Header (`welcome.`): `32px` / `2rem`
  - Body running text: `14px` / `0.875rem`
  - Suggestion buttons, labels: `12px` / `0.75rem`
  - Small warnings: `11px` / `0.6875rem`

### Spacing Rhythm
- Incremental **4px / 8px spacing grid** to align UI elements cleanly.
- Container padding: `16px` for small screens, `32px` for desktop grids.
- Height of touch targets: Minimum `44px` (using padding-expansion tags for buttons).

### Motion Philosophy (GSAP)
- **Typing Sequence:** Streams response strings character-by-character (`duration: 0.015s` per character) to simulate real-time text output.
- **Entrance Animation:** The terminal shell box enters with a subtle spring fade (`y: 20 → 0`, `duration: 0.6s`, `ease: "power2.out"`).
- **Line Insertion:** When a command is fired, new console lines slide up and fade in smoothly (`duration: 0.2s`, `ease: "power1.out"`).
- **No Blocking Input:** User can submit commands at any time; in-progress streams can be clicked to skip/instantly complete typing.

---

## 3. Section Layout (Model: `agent-terminal.png`)

```
+-------------------------------------------------------------+
| -- 0xdas.dev --                                             |
+-------------------------------------------------------------+
| talk-to-my-agent · v1.0.0 · build dev · base-mainnet        |
|                                                             |
| welcome. [Blinking Block Cursor]                            |
|                                                             |
| trained on 5 years of onchain development, and the patient  |
| art of building autonomous agents that don't drain their    |
| wallets six blocks later.                                   |
|                                                             |
| ⚠️ this feature uses AI. responses may be inaccurate.       |
|                                                             |
| $ try one >                                                 |
|                                                             |
| [ what's your stack? ]  [ show me a project ]               |
| [ are you available? ]  [ /help ]                           |
|                                                             |
+-------------------------------------------------------------+
| client@0xdas ~ % what kind of projects do you take?   0/200 |
+-------------------------------------------------------------+
```

---

## 4. Differentiation Callout

> **This avoids generic UI by doing a fully responsive, keyboard-navigable CLI terminal console instead of the typical visual grid cards, allowing users to type commands or click bracketed commands to watch the agent print structured ASCII logs, smart contract hashes, and context structures in real-time.**

---

## 5. Pre-Delivery Checklist
- [ ] Primary text contrast is at least `4.5:1` in dark mode.
- [ ] Blinking cursor and characters print without layout jitter.
- [ ] Commands and button actions execute reliably.
- [ ] Safe areas respected on vertical orientations.
