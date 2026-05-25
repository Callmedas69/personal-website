## Workspace Name: 0xdas Personal Website Codebase

STRICT: do not read the whole codebase. only read the part of codebase that is relevant to the user's request.

### Core Architecture & State (May 2026)
- **Framework**: Next.js 16.2.6 (Turbopack) with React 19.
- **Styling**: Tailwind CSS v4 custom variables (Stripe Dev dark mode palette `#011627`).
- **Main Layout**: `src/app/page.tsx` renders a split dashboard:
  - Left column: `WobbleVisualizer` (interactive SVG creature) + `BrandDashboard` (tabs demonstrating AI node maps, smart contract mint simulation, and GSAP motion sandbox).
  - Right column: `AgentTerminal` (AI terminal console).
- **Inter-Component Communication**:
  - The `AgentTerminal` dispatches a custom event `wobble-trigger` on the `window` object when the command `/wobble` is executed.
  - The `WobbleVisualizer` listens to this event and plays a GSAP squish-and-jump timeline.
  - The `BrandDashboard`'s simulated mint action also triggers this event upon success.
- **Lint/Build Status**: Clean production build (`npm run build`) and ESLint checks (`npm run lint`).
