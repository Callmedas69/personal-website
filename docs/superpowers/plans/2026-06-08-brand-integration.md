# Brand Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the 0xDas brand identity + 0xNull mascot into the personal website and push directly to main.

**Architecture:** Create a new custom pixel-art canvas component `OxNull.tsx` for the mascot, insert it in `page.tsx`'s hero layout, update footers in `page.tsx` and `feed/page.tsx`, and add a tagline comment to `Header.tsx`.

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS v4, HTML Canvas.

---

### Task 1: Create OxNull Mascot Component

**Files:**
- Create: `src/components/OxNull.tsx`

- [ ] **Step 1: Write OxNull component code**
  Create the file `src/components/OxNull.tsx` with the following content:

  ```tsx
  "use client";

  import { useEffect, useRef } from "react";

  type Mood = "thinking" | "shipping" | "broke" | "flow";

  interface OxNullProps {
    mood?: Mood;
    size?: number;
    className?: string;
  }

  const PIXELS = [
    [0,0,0,2,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,1,1,1,1,1,2,1,1,1],
    [2,1,1,1,1,2,1,1,1,1],
    [1,1,3,4,3,4,3,1,1,2],
    [1,1,3,5,3,5,3,1,1,1],
    [1,1,3,3,3,3,3,2,1,1],
    [1,2,3,3,3,3,3,1,1,1],
    [0,1,1,1,1,1,1,1,1,0],
    [0,0,4,4,4,4,4,2,1,0],
    [0,0,0,6,6,6,4,1,1,0],
    [0,6,6,7,7,6,6,4,1,0],
    [0,6,6,6,6,6,6,4,2,0],
    [0,8,1,6,6,6,4,8,1,0],
    [0,0,0,0,1,1,1,1,0,0],
    [0,0,0,1,1,1,1,1,0,0],
    [0,0,0,9,1,1,1,1,0,0],
    [0,0,0,1,9,1,1,2,0,0],
    [0,0,0,1,4,1,1,1,0,0],
    [0,0,0,1,4,1,1,1,1,0],
    [0,0,1,1,1,9,9,9,1,0],
  ];

  const BASE_PALETTE: Record<number, string> = {
    1: "#808080", // GR
    2: "#868686", // GL
    3: "#2a2a2a", // DK
    4: "#646464", // GD
    5: "#ffffff", // EW  eye (default)
    6: "#6ab3db", // BL  item (default)
    7: "#88c0db", // BM
    8: "#efcda7", // SK
    9: "#4a4a4a", // FT
  };

  const MOOD_OVERRIDES: Record<Mood, { eye: string; item: string }> = {
    thinking: { eye: "#ffffff", item: "#6ab3db" },
    shipping: { eye: "#00e87a", item: "#00e87a" },
    broke:    { eye: "#ff4d4d", item: "#ff4d4d" },
    flow:     { eye: "#60d0ff", item: "#9d7cf4" },
  };

  export default function OxNull({ mood = "thinking", size = 80, className }: OxNullProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const GRID_W = 10;
    const GRID_H = 21;
    const px = Math.floor(size / GRID_W);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const overrides = MOOD_OVERRIDES[mood];
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      PIXELS.forEach((row, r) => {
        row.forEach((code, c) => {
          if (code === 0) return;
          let color = BASE_PALETTE[code];
          if (code === 5) color = overrides.eye;
          if (code === 6 || code === 7) color = overrides.item;
          ctx.fillStyle = color;
          ctx.fillRect(c * px, r * px, px, px);
        });
      });
    }, [mood, px]);

    return (
      <canvas
        ref={canvasRef}
        width={GRID_W * px}
        height={GRID_H * px}
        style={{ imageRendering: "pixelated", width: GRID_W * px, height: GRID_H * px }}
        className={className}
      />
    );
  }
  ```

- [ ] **Step 2: Commit file**
  Run:
  ```bash
  git add src/components/OxNull.tsx
  git commit -m "feat: add OxNull pixel art mascot component"
  ```

---

### Task 2: Integrate Mascot and Slogan into Home Page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Inspect page.tsx**
  Identify the layout wrappers, the hero section structure, and footer `<p>` tag location.

- [ ] **Step 2: Apply changes in page.tsx**
  Import `OxNull` at the top:
  ```tsx
  import OxNull from "@/components/OxNull";
  ```
  Add the mascot to the hero section (find the relative wrapper for the hero and place it inside, right-aligned, bottom-anchored):
  ```tsx
  <div className="absolute bottom-0 right-8 hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
    <OxNull mood="thinking" size={96} />
  </div>
  ```
  Replace the footer `<p>` tag:
  ```tsx
  <p className="font-mono text-[9px] text-text-slate/60">
    0xDas  // the thinking is free.  cognitive. solo. shipping.
  </p>
  ```

- [ ] **Step 3: Commit changes**
  Run:
  ```bash
  git add src/app/page.tsx
  git commit -m "feat: integrate OxNull mascot and slogan into Home Page"
  ```

---

### Task 3: Integrate Slogan into Feed Page Footer

**Files:**
- Modify: `src/app/feed/page.tsx`

- [ ] **Step 1: Update footer in feed page**
  Replace the footer `<p>` tag inside `src/app/feed/page.tsx` with:
  ```tsx
  <p className="font-mono text-[9px] text-text-slate/60">
    0xDas  // the thinking is free.  cognitive. solo. shipping.
  </p>
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add src/app/feed/page.tsx
  git commit -m "feat: integrate slogan into Feed Page footer"
  ```

---

### Task 4: Integrate Tagline into Header Component

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Update Header.tsx**
  Add the tagline comment after the `0xdas.dev` `<span>` link block:
  ```tsx
  <span className="hidden lg:inline font-mono text-[10px] text-text-slate/40 ml-1">
    // the thinking is free.
  </span>
  ```

- [ ] **Step 2: Commit changes**
  Run:
  ```bash
  git add src/components/Header.tsx
  git commit -m "feat: add tagline comment to Header"
  ```

---

### Task 5: Compilation and Deploy to main

**Files:**
- None

- [ ] **Step 1: Run TypeScript compiler**
  Run: `npx tsc --noEmit`
  Expected: Clean exit without errors.

- [ ] **Step 2: Push changes to main**
  Run: `git push origin main`
  Expected: Clean push to remote main branch.
