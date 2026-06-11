# AgentTerminal 0xNull Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor `AgentTerminal.tsx` to adopt the 0xNull persona — new welcome copy, prompt prefix, dry rewritten responses, mood state system with visual indicator, and updated identity text.

**Architecture:** Decompose the monolithic component into focused modules. Shared types live in `terminal/types.ts`. All command response data and routing lives in `terminal/commands.ts`. The mood badge is a tiny presentational component in `terminal/MoodBadge.tsx`. `AgentTerminal.tsx` becomes a clean UI shell — state, streaming logic, and JSX only, no inline response strings.

**Tech Stack:** React 19, TypeScript, Tailwind CSS v4, Next.js App Router

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/components/terminal/types.ts` | `MoodState`, `MOOD_CONFIG`, `LogEntry` |
| Create | `src/components/terminal/commands.ts` | Command routing — returns `CommandResult` per input |
| Create | `src/components/terminal/MoodBadge.tsx` | Presentational mood badge component |
| Modify | `src/components/AgentTerminal.tsx` | UI shell — state, streaming, JSX; imports from above |

---

### Task 1: Create `src/components/terminal/types.ts`

**Files:**
- Create: `src/components/terminal/types.ts`

- [ ] **Step 1: Write the file**

```ts
export type MoodState = "thinking" | "shipping" | "broke" | "flow";

export const MOOD_CONFIG: Record<MoodState, { label: string; colorClass: string }> = {
  thinking: { label: "thinking", colorClass: "text-white/70" },
  shipping: { label: "shipping", colorClass: "text-accent-green" },
  broke:    { label: "broke",    colorClass: "text-red-400" },
  flow:     { label: "flow",     colorClass: "text-accent-mint" },
};

export interface LogEntry {
  command?: string;
  response: string;
  isHTML?: boolean;
  mood?: MoodState;
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/types.ts
git commit -m "feat(terminal): add shared types — MoodState, MOOD_CONFIG, LogEntry"
```

---

### Task 2: Create `src/components/terminal/commands.ts`

**Files:**
- Create: `src/components/terminal/commands.ts`

This module owns all command routing and response content. `AgentTerminal` calls `resolveCommand(cmd)` and gets back a typed result — no response strings in the UI layer.

- [ ] **Step 1: Write the file**

```ts
import type { MoodState } from "./types";

export interface CommandResult {
  response: string;
  isHTML: boolean;
  mood: MoodState;
  clear?: boolean;
}

export function resolveCommand(raw: string): CommandResult | null {
  const cmd = raw.trim().toLowerCase();

  if (cmd === "") return null;

  if (cmd === "clear" || cmd === "/clear") {
    return { response: "", isHTML: false, mood: "shipping", clear: true };
  }

  switch (true) {
    case cmd === "/help" || cmd === "help":
      return {
        mood: "shipping",
        isHTML: true,
        response: `
<div class="space-y-2 font-mono text-text-slate">
  <div class="text-accent-yellow font-bold uppercase mb-1">=== ENTRY POINTS ===</div>
  <div><span class="text-accent-mint font-semibold">/stack</span>     - what i build with (AI, Onchain)</div>
  <div><span class="text-accent-mint font-semibold">/projects</span>  - active work (BasedMining, ArcNotify, Vault)</div>
  <div><span class="text-accent-mint font-semibold">/archives</span>  - past experiments and shelved builds</div>
  <div><span class="text-accent-mint font-semibold">/status</span>    - availability and current focus</div>
  <div><span class="text-accent-mint font-semibold">/socials</span>   - where to find 0xdas onchain and offchain</div>
  <div><span class="text-accent-mint font-semibold">/clear</span>     - reset console</div>
</div>`,
      };

    case cmd === "/stack" || cmd === "stack" || cmd.includes("stack") || cmd.includes("skill"):
      return {
        mood: "flow",
        isHTML: true,
        response: `
<div class="space-y-3 font-mono">
  <div>
    <span class="text-accent-blue font-bold">[ AI-NATIVE SYSTEMS ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>LLM context ops &amp; prompt engineering (<span class="text-accent-yellow">CLAUDE.md</span> boundary logic)</li>
      <li>Obsidian Vault architecture — shared cognitive infrastructure</li>
      <li>Agentic workflows and automated developer briefings</li>
    </ul>
  </div>
  <div>
    <span class="text-accent-purple font-bold">[ ONCHAIN ENGINEERING ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>Fully onchain metadata &amp; SVG contract renderers</li>
      <li>Smart contract development (Solidity on <span class="text-accent-blue font-semibold">Base</span>)</li>
      <li>Client integration via viem, wagmi, ethers</li>
    </ul>
  </div>
  <div>
    <span class="text-accent-mint font-bold">[ CREATIVE FRONTEND ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>React, Next.js (App Router), TypeScript</li>
      <li>Complex UI animations — <span class="text-accent-yellow font-semibold">GSAP Timelines</span> &amp; spring physics</li>
      <li>Utility-first styling with Tailwind CSS v4</li>
    </ul>
  </div>
</div>`,
      };

    case cmd === "/projects" || cmd === "projects" || cmd.includes("project") || cmd.includes("work"):
      return {
        mood: "shipping",
        isHTML: true,
        response: `
<div class="space-y-3 font-mono text-text-slate">
  <div>
    <span class="text-accent-green font-bold">1. BASEDMINING</span> <span class="text-[10px] text-text-slate/60">(active)</span>
    <div class="ml-2 mt-0.5 text-text-primary">Content automation and video rendering pipeline.</div>
    <div class="ml-2 text-[10px]">Stack: Remotion, Node.js.</div>
  </div>
  <div>
    <span class="text-accent-green font-bold">2. ARCNOTIFY</span> <span class="text-[10px] text-text-slate/60">(building)</span>
    <div class="ml-2 mt-0.5 text-text-primary">Webhook notification service for Arc L1.</div>
    <div class="ml-2 text-[10px]">Stack: Next.js, Neon/Drizzle, Upstash QStash, Clerk, Resend, Viem.</div>
  </div>
  <div>
    <span class="text-accent-green font-bold">3. COGNITIVE VAULT</span> <span class="text-[10px] text-text-slate/60">(internal)</span>
    <div class="ml-2 mt-0.5 text-text-primary">AI context engineering layer — Obsidian shared brain.</div>
    <div class="ml-2 text-[10px]">Stack: ContextOps routing, prompt mapping, daily hooks.</div>
  </div>
</div>`,
      };

    case cmd === "/status" || cmd === "status" || cmd.includes("available") || cmd.includes("availability"):
      return {
        mood: "shipping",
        isHTML: true,
        response: `
<div class="font-mono space-y-1 text-text-slate">
  <div><span class="text-text-primary">state:</span> <span class="text-accent-mint font-semibold">building.</span> agents on Base.</div>
  <div><span class="text-text-primary">open to:</span> high-signal work at the intersection of AI + onchain. not taking everything.</div>
  <div><span class="text-text-primary">ecosystem:</span> Base / Ethereum L2s</div>
</div>`,
      };

    case cmd === "/archives" || cmd === "archives" || cmd.includes("archive") || cmd.includes("past") || cmd.includes("previous"):
      return {
        mood: "flow",
        isHTML: true,
        response: `
<div class="space-y-3 font-mono text-text-slate">
  <div class="text-accent-yellow font-bold uppercase mb-1">=== PREVIOUS BUILDS ===</div>
  <div>
    <span class="text-accent-blue font-bold">[ ON HOLD ]</span>
    <div class="ml-2 mt-1 space-y-1.5">
      <div><span class="text-text-primary font-semibold">Invisible Law</span> <span class="text-[10px] text-text-slate/60">(ERC-721)</span><div class="ml-2 text-[10px]">Generative geometric bauhaus art. Golden ratio as a law, onchain SVG rendering.</div></div>
      <div><span class="text-text-primary font-semibold">Judith</span> <span class="text-[10px] text-text-slate/60">(AI Tool)</span><div class="ml-2 text-[10px]">Public accountability tool targeting Bankr.bot. AI-drafted escalations, permanent wall of shame.</div></div>
      <div><span class="text-text-primary font-semibold">The ARC Academy</span> <span class="text-[10px] text-text-slate/60">(Platform)</span><div class="ml-2 text-[10px]">Financial literacy for Gen Alpha. Structured curriculum, interactive progress tracking.</div></div>
    </div>
  </div>
  <div>
    <span class="text-accent-purple font-bold">[ ARCHIVED ]</span>
    <div class="ml-2 mt-1 space-y-1.5">
      <div><span class="text-text-primary font-semibold">BaseCred</span> <span class="text-[10px] text-text-slate/60">(DeFi)</span><div class="ml-2 text-[10px]">Decision engine on aggregated onchain reputation (Ethos, Neynar, Talent Protocol).</div></div>
      <div><span class="text-text-primary font-semibold">Lore</span> <span class="text-[10px] text-text-slate/60">(Mini-App)</span><div class="ml-2 text-[10px]">Farcaster mini-app. AI-rephrased winter mantras with onchain sealing.</div></div>
      <div><span class="text-text-primary font-semibold">Phi</span> <span class="text-[10px] text-text-slate/60">(Solidity)</span><div class="ml-2 text-[10px]">Solidity contracts for Invisible Law. Fully onchain SVG generation via mathematical Phi libraries.</div></div>
      <div><span class="text-text-primary font-semibold">Geoplet ERC-721</span> <span class="text-[10px] text-text-slate/60">(NFT)</span><div class="ml-2 text-[10px]">Warplet transformation into geometric bauhaus style.</div></div>
    </div>
  </div>
</div>`,
      };

    case cmd === "/socials" || cmd === "socials" || cmd.includes("social") || cmd.includes("contact") || cmd.includes("github") || cmd.includes("twitter") || cmd.includes("warpcast") || cmd.includes("farcaster"):
      return {
        mood: "shipping",
        isHTML: true,
        response: `
<div class="font-mono space-y-2 text-text-slate">
  <div class="text-accent-blue font-bold uppercase mb-1">=== COORDINATES ===</div>
  <div>Farcaster: <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">warpcast.com/0xdas</a> <span class="text-xs text-text-slate/60">(4k followers)</span></div>
  <div>Twitter/X: <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">x.com/0xdas</a></div>
  <div>GitHub: <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">github.com/0xdas</a></div>
</div>`,
      };

    default:
      return {
        mood: "broke",
        isHTML: false,
        response: `unknown: "${raw.trim()}". /help lists what i respond to.`,
      };
  }
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/commands.ts
git commit -m "feat(terminal): command router — resolveCommand with 0xNull responses and mood"
```

---

### Task 3: Create `src/components/terminal/MoodBadge.tsx`

**Files:**
- Create: `src/components/terminal/MoodBadge.tsx`

- [ ] **Step 1: Write the file**

```tsx
import { MOOD_CONFIG, type MoodState } from "./types";

interface MoodBadgeProps {
  mood: MoodState;
}

export default function MoodBadge({ mood }: MoodBadgeProps) {
  const { label, colorClass } = MOOD_CONFIG[mood];
  return (
    <span className={`text-[10px] font-mono ${colorClass} opacity-80`}>
      ● {label}
    </span>
  );
}
```

- [ ] **Step 2: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/terminal/MoodBadge.tsx
git commit -m "feat(terminal): MoodBadge presentational component"
```

---

### Task 4: Refactor `AgentTerminal.tsx` — import new modules, update UI

**Files:**
- Modify: `src/components/AgentTerminal.tsx`

`AgentTerminal` becomes UI-only: state, streaming, JSX. All response data and types come from the new modules.

- [ ] **Step 1: Replace the old imports and inline types at the top of the file**

Find (lines 1–15):
```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, Cpu, Command, Send } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register useGSAP
gsap.registerPlugin(useGSAP);

interface LogEntry {
  command?: string;
  response: string;
  isHTML?: boolean;
}
```

Replace with:
```tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, Cpu, Command, Send } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MoodBadge from "./terminal/MoodBadge";
import { resolveCommand } from "./terminal/commands";
import type { LogEntry, MoodState } from "./terminal/types";

gsap.registerPlugin(useGSAP);
```

- [ ] **Step 2: Add `currentMood` state (after `historyIdx` state)**

Find:
```tsx
const [historyIdx, setHistoryIdx] = useState(-1);
```

Replace:
```tsx
const [historyIdx, setHistoryIdx] = useState(-1);
const [currentMood, setCurrentMood] = useState<MoodState>("shipping");
```

- [ ] **Step 3: Replace the entire `executeCommand` function**

Find and replace the full `executeCommand` async function (lines 89–252):

```tsx
const executeCommand = async (cmd: string) => {
  if (isTyping) return;

  const trimmed = cmd.trim();
  if (!trimmed) return;

  const result = resolveCommand(trimmed);
  if (!result) return;

  if (result.clear) {
    setLogs([]);
    setInputVal("");
    setHistoryIdx(-1);
    return;
  }

  setHistory(prev => [cmd, ...prev]);
  setHistoryIdx(-1);

  const newLogIndex = logs.length;
  setLogs(prev => [...prev, { command: cmd, response: "" }]);
  setInputVal("");

  setCurrentMood("thinking");
  await new Promise(r => setTimeout(r, 0)); // flush thinking state to UI
  setCurrentMood(result.mood);
  await streamText(result.response, result.isHTML);

  setLogs(prev => {
    const updated = [...prev];
    if (updated[newLogIndex]) {
      updated[newLogIndex] = {
        command: cmd,
        response: result.response,
        isHTML: result.isHTML,
        mood: result.mood,
      };
    }
    return updated;
  });
  setCurrentResponseStream("");
};
```

- [ ] **Step 4: Update welcome copy (lines ~325–337)**

Find:
```tsx
<div className="flex items-center space-x-2 text-accent-blue text-xl font-bold">
  <span>welcome.</span>
</div>
<div className="text-text-slate leading-relaxed max-w-xl text-[13px]">
  the ideas never stopped. the button was just hard.
  the thinking is free. the agent is live.
</div>
```

Replace:
```tsx
<div className="flex items-center space-x-2 text-accent-blue text-xl font-bold">
  <span>welcome.</span>
</div>
<div className="text-text-slate leading-relaxed max-w-xl text-[13px] space-y-0.5">
  <div>the ideas never stopped. the button was just hard.</div>
  <div>the thinking is free. the agent is live.</div>
  <div className="text-text-slate/50">// you're talking to 0xNull.</div>
</div>
```

- [ ] **Step 5: Update prompt prefix in log output**

Find:
```tsx
<span className="text-accent-green font-bold">client@0xdas</span>
```
Replace:
```tsx
<span className="text-accent-green font-bold">0xNull@0xdas</span>
```

- [ ] **Step 6: Update prompt prefix in input footer**

Find:
```tsx
<span className="text-accent-green font-bold hidden sm:inline">client@0xdas</span>
```
Replace:
```tsx
<span className="text-accent-green font-bold hidden sm:inline">0xNull@0xdas</span>
```

- [ ] **Step 7: Update identity text in title bar**

Find:
```tsx
<span className="hidden sm:inline">talk-to-my-agent</span>
```
Replace:
```tsx
<span className="hidden sm:inline">0xNull</span>
```

- [ ] **Step 8: Update identity text in info bar**

Find:
```tsx
<span className="hidden sm:inline">talk-to-my-agent · </span>
```
Replace:
```tsx
<span className="hidden sm:inline">0xNull · </span>
```

- [ ] **Step 9: Add MoodBadge to completed log entries**

Find:
```tsx
{log.response && (
  <div className="pl-4 border-l border-border-line/45">
    {log.isHTML ? (
      <div dangerouslySetInnerHTML={{ __html: log.response }} />
    ) : (
      <div className="whitespace-pre-wrap text-text-slate leading-relaxed">{log.response}</div>
    )}
  </div>
)}
```

Replace:
```tsx
{log.response && (
  <div className="pl-4 border-l border-border-line/45">
    {log.mood && (
      <div className="mb-1">
        <MoodBadge mood={log.mood} />
      </div>
    )}
    {log.isHTML ? (
      <div dangerouslySetInnerHTML={{ __html: log.response }} />
    ) : (
      <div className="whitespace-pre-wrap text-text-slate leading-relaxed">{log.response}</div>
    )}
  </div>
)}
```

- [ ] **Step 10: Add MoodBadge to streaming block**

Find:
```tsx
{isTyping && (
  <div className="space-y-1.5">
    <div className="pl-4 border-l border-border-line/45">
      <div dangerouslySetInnerHTML={{ __html: currentResponseStream }} />
      <span className="inline-block w-2.5 h-4 bg-accent-mint animate-cursor ml-1"></span>
    </div>
  </div>
)}
```

Replace:
```tsx
{isTyping && (
  <div className="space-y-1.5">
    <div className="pl-4 border-l border-border-line/45">
      <div className="mb-1">
        <MoodBadge mood={currentMood} />
      </div>
      <div dangerouslySetInnerHTML={{ __html: currentResponseStream }} />
      <span className="inline-block w-2.5 h-4 bg-accent-mint animate-cursor ml-1"></span>
    </div>
  </div>
)}
```

- [ ] **Step 11: Run TypeScript check**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git add src/components/AgentTerminal.tsx
git commit -m "refactor(terminal): wire new modules — clean UI shell with 0xNull persona and mood states"
```

---

## Self-Review Checklist

**Spec coverage:**
- [x] Welcome message — Task 4 Step 4
- [x] Prompt prefix `0xNull@0xdas` — Task 4 Steps 5–6
- [x] 0xNull persona on all responses — Task 2 (all cases in `resolveCommand`)
- [x] Mood states (thinking/shipping/broke/flow) — Task 1 (`MOOD_CONFIG`) + Task 2 (`mood` per case) + Task 4 Steps 2–3
- [x] Mood visual indicator — Task 3 (`MoodBadge`) + Task 4 Steps 9–10
- [x] Identity text update — Task 4 Steps 7–8
- [x] `npx tsc --noEmit` — each task
- [x] KISS + best practice — 4 files, 1 responsibility each; `AgentTerminal` is UI-only

**Placeholder scan:** No TBDs. All code blocks complete with real content.

**Type consistency:** `MoodState` defined once in `types.ts`, exported and imported everywhere. `LogEntry.mood?: MoodState`. `CommandResult.mood: MoodState`. `resolveCommand` return type `CommandResult | null`. All consistent.

**Scope:** Only these 4 files touched. No other components modified.
