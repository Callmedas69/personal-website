import AgentTerminal from "@/components/AgentTerminal";
import BrandDashboard from "@/components/BrandDashboard";
import Header from "@/components/Header";
import OxNull from "@/components/OxNull";
import OxNullPanel from "@/components/OxNullPanel";

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
          <div className="lg:col-span-6 flex flex-col space-y-6">

            {/* Hero */}
            <div className="relative space-y-3">
              <div className="font-mono text-xs font-bold text-accent-blue uppercase tracking-widest">
                [ 0x_Cognitive_Context ]
              </div>

              <h1 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                the ideas are loud<br />
                <span className="text-accent-blue">the button is hard</span>
              </h1>

              <p className="font-mono text-sm text-text-slate leading-relaxed">
                anyone can show a deploy. nobody shows the moment before they almost quit.
              </p>

              <p className="font-mono text-[10px] text-text-slate/50 tracking-widest">
                cognitive. solo. shipping.
              </p>
            </div>

            {/* 0xNull mood panel */}
            <OxNullPanel />

            {/* Brand Dashboard */}
            <BrandDashboard />

          </div>

          {/* RIGHT COLUMN — Agent Terminal */}
          <div className="lg:col-span-6 h-full min-h-[620px]">
            <AgentTerminal />
          </div>

        </div>
      </main>

      <footer className="relative z-10 py-6 text-center select-none border-t border-border-line/20 mt-auto">
        <p className="font-mono text-[9px] text-text-slate/60">
          // the thinking is free - 0xDas▋
        </p>
      </footer>
    </div>
  );
}