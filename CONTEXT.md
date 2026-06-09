## Workspace Name: 0xdas Personal Website Codebase

STRICT: do not read the whole codebase. only read the part of codebase that is relevant to the user's request.

### Core Architecture & State (May 2026)
- **Framework**: Next.js 16.2.6 (Turbopack) with React 19.
- **Styling**: Tailwind CSS v4 custom variables (Stripe Dev dark mode palette `#011627`).
- **Main Layout**: `src/app/page.tsx` renders a split dashboard:
  - Left column: `InvisibleLawVisualizer` (static artwork preview) + `BrandDashboard` (tabs demonstrating Interpretable Context Methodology and smart contract mint simulation).
  - Right column: `AgentTerminal` (AI terminal console).
- **Inter-Component Communication**:
  - The `BrandDashboard`'s simulated mint action dispatches the `generate-trigger` event on success.
  - *Note: `InvisibleLawVisualizer` displays a static preview only — it no longer regenerates seeds or listens to `generate-trigger`.*
  - *Note: `AgentTerminal` `/generate` command has been removed.*
- **Connect Wallet & Mint Button Integration (May 2026)**:
  - Custom monospace themed RainbowKit setup in `providers.tsx`.
  - Bespoke client-side `HeaderConnectButton.tsx` wrapper resolving React 19 serialization errors.
  - Dynamic `02_ONCHAIN` logging console wired to L2 block updates and transaction receipt confirmations (with auto-scroll enabled on log updates).
  - Smart state button disabling based on contract parameter reads.
- **Lint/Build Status**: TS validation clean (`npx tsc --noEmit` compiles cleanly; ESLint checks ignored during builds in `next.config.ts`).
- **Session 2026-05-26 Changes**:
  - `InvisibleLawVisualizer.tsx`: Removed Sandbox tab entirely.
  - `BrandDashboard.tsx`: Removed contract/status/minted/price labels from 02_ONCHAIN; RPC console logs now auto-scroll; 01_AI-NATIVE tab displays ICM paper abstract (3-sentence summary) + node graph of 3 core principles (CLAUDE.md, CONTEXT.md, Folder Structure); title hyperlinked to arXiv.
  - `AgentTerminal.tsx`: Fixed `/clear` command (was not matching slash-prefixed form); added `/archives` command listing ON HOLD (InvisibleLaw, Judith, The Arc) and ARCHIVED (BaseCred, Lore, Phi, Geoplet) projects; added `[ /archives ]` quick suggestion button; removed `/generate` command and its button.

### Session 2026-06-09 Changes
- **AgentTerminal refactor**: Decomposed into `src/components/terminal/types.ts`, `commands.ts`, `MoodBadge.tsx`. `AgentTerminal.tsx` is now a clean UI shell (~334 lines).
- **0xNull persona**: Prompt prefix `0xNull@0xdas`, welcome copy updated with `// you're talking to 0xNull.`, identity bar updated.
- **Mood state system**: `MoodState` = thinking (white) / shipping (green) / broke (red) / flow (cyan). `● mood` badge renders above each response (streaming + committed).
- **Command responses**: All 6 responses rewritten in 0xNull voice (dry, builder-brained). Housed in `commands.ts` — no inline strings in UI layer.
- **/feed → /cognitive-log**: Directory renamed, `Header.tsx` href/active check/label updated, page h1 and error strings updated, component renamed `CognitiveLog`.

### Next Session TODOs
- [x] **Review `/archives` and `/projects` project descriptions** (Completed 2026-05-31)
- [x] **Mobile layout refactor** (Completed 2026-05-31)
- [x] **0xNull terminal persona + mood states** (Completed 2026-06-09)
- [ ] **Test terminal UI visually** — run dev server, verify mood badge colors, streaming behavior, and cognitive-log route in browser.

