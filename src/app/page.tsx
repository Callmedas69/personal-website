import AgentTerminal from "@/components/AgentTerminal";
import BrandDashboard from "@/components/BrandDashboard";
import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">

      {/* Background radial grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0" />

      {/* Page Header */}
      <Header />

      {/* Main Grid — equal 6/6 split */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-6 flex flex-col space-y-6 order-last lg:order-first">

            {/* Hero */}
            <div className="relative space-y-3">
              <div className="font-mono text-xs font-bold text-accent-blue uppercase tracking-widest">
                [ 0x_Cognitive_Context ]
              </div>

              <h1 className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight text-white leading-tight text-balance">
                the ideas are loud<br />
                <span className="text-accent-blue">the button is hard</span>
              </h1>

              <p className="font-mono text-sm text-text-slate leading-relaxed">
                anyone can show a deploy. nobody shows the moment before they almost quit.
              </p>

              <p className="font-mono text-[10px] text-text-slate tracking-widest">
                cognitive. solo. shipping.
              </p>
            </div>

            {/* Brand Dashboard */}
            <BrandDashboard />

          </div>

          {/* RIGHT COLUMN — Agent Terminal */}
          <div className="lg:col-span-6 h-full min-h-[620px] order-first lg:order-last">
            <AgentTerminal />
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-6 text-center select-none border-t border-border-line/20 mt-auto space-y-2">
        <div className="flex items-center justify-center space-x-4 font-mono text-[10px] text-text-slate">
          <a href="https://farcaster.xyz/0xd" target="_blank" rel="noopener noreferrer" className="hover:text-accent-mint transition-colors">farcaster</a>
          <span aria-hidden="true" className="text-text-slate">·</span>
          <a href="https://x.com/0xdasx" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">twitter</a>
          <span aria-hidden="true" className="text-text-slate">·</span>
          <a href="https://github.com/Callmedas69" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">github</a>
        </div>
        <p className="font-mono text-[9px] text-text-slate">
          // the thinking is free - 0xDas▋
        </p>
      </footer>
    </div>
  );
}