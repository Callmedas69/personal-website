## Workspace Name: 0xdas Personal Website Codebase

STRICT: do not read the whole codebase. only read the part of codebase that is relevant to the user's request.

### Core Architecture & State (May 2026)
- **Framework**: Next.js 16.2.6 (Turbopack) with React 19.
- **Styling**: Tailwind CSS v4 custom variables (Stripe Dev dark mode palette `#011627`).
- **Main Layout**: `src/app/page.tsx` renders a split dashboard:
  - Left column: `InvisibleLawVisualizer` (generative art canvas) + `BrandDashboard` (tabs demonstrating AI context nodes and smart contract mint simulation).
  - Right column: `AgentTerminal` (AI terminal console).
- **Inter-Component Communication**:
  - The `AgentTerminal` dispatches a custom event `generate-trigger` on the `window` object when the command `/generate` or `/mint` is executed.
  - The `InvisibleLawVisualizer` listens to this event and generates a new random seed, triggering a draw timeline.
  - The `BrandDashboard`'s simulated mint action also dispatches the `generate-trigger` event on success.
- **Lint/Build Status**: Clean production build (`npm run build`) and ESLint checks (`npm run lint`).
