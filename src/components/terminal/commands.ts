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
  <div>Farcaster: <a href="https://farcaster.xyz/0xd" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">farcaster.xyz/0xdas</a> <span class="text-xs text-text-slate/60">(4k followers)</span></div>
  <div>Twitter/X: <a href="https://x.com/0xdasx" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">x.com/0xdasx</a></div>
  <div>GitHub: <a href="https://github.com/Callmedas69" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">github.com/0xdas</a></div>
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
