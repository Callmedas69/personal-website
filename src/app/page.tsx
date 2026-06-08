import AgentTerminal from "@/components/AgentTerminal";
import InvisibleLawVisualizer from "@/components/InvisibleLawVisualizer";
import BrandDashboard from "@/components/BrandDashboard";
import Header from "@/components/Header";
import OxNull from "@/components/OxNull";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
      
      {/* Background radial grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0"></div>
      
      {/* Page Header */}
      <Header />

      {/* Main Grid Layout Space */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Identity & Showcases */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Identity & Positioning Headline */}
            <div className="relative space-y-3">
              <div className="font-mono text-xs font-bold text-accent-blue uppercase tracking-widest">
                [ 0x_Cognitive_Context ]
              </div>
              <h1 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                Building protocol infrastructure, media automation pipelines, and fully onchain experiments.
              </h1>
              <p className="font-mono text-xs text-text-slate leading-relaxed">
                Structuring cognitive workspaces through the filesystem, blending context engineering with math-driven onchain systems.
              </p>
              <div className="absolute bottom-0 right-8 hidden lg:block opacity-60 hover:opacity-100 transition-opacity">
                <OxNull mood="thinking" size={96} />
              </div>
            </div>

            {/* Invisible Law Interactive SVG Generative Art */}
            <InvisibleLawVisualizer />

            {/* Content Pillars Dashboard */}
            <BrandDashboard />

          </div>

          {/* Right Column: Agent Terminal CLI */}
          <div className="lg:col-span-7 h-full">
            <AgentTerminal />
          </div>

        </div>
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 py-6 text-center select-none border-t border-border-line/20 mt-auto">
        <p className="font-mono text-[9px] text-text-slate/60">
          0xDas  // the thinking is free.  cognitive. solo. shipping.
        </p>
      </footer>
    </div>
  );
}
