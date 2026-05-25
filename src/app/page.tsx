import AgentTerminal from "@/components/AgentTerminal";
import InvisibleLawVisualizer from "@/components/InvisibleLawVisualizer";
import BrandDashboard from "@/components/BrandDashboard";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
      
      {/* Background radial grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0"></div>
      
      {/* Page Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl w-full mx-auto select-none border-b border-border-line/40">
        <div className="flex items-center space-x-3">
          <div className="font-mono text-sm tracking-widest font-bold text-accent-blue hover:text-accent-mint transition-colors cursor-pointer">
            0xdas.dev
          </div>
          <span className="text-text-slate/40 text-xs">|</span>
          <div className="flex items-center space-x-1.5 bg-terminal-inner/60 border border-border-line/60 rounded px-2 py-0.5 text-[9px] font-mono text-accent-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
            <span>BASE_MAINNET : ONLINE</span>
          </div>
        </div>
        <div className="flex items-center space-x-5 text-xs text-text-slate font-mono">
          <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-mint transition-colors">farcaster</a>
          <span>·</span>
          <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">twitter</a>
          <span>·</span>
          <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">github</a>
          <span className="text-text-slate/40 text-xs">|</span>
          <ConnectButton showBalance={false} chainStatus="icon" accountStatus="avatar" />
        </div>
      </header>

      {/* Main Grid Layout Space */}
      <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Identity & Showcases */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            
            {/* Identity & Positioning Headline */}
            <div className="space-y-3">
              <div className="font-mono text-xs font-bold text-accent-blue uppercase tracking-widest">
                [ AI-Native Onchain Developer ]
              </div>
              <h1 className="font-sans text-2xl md:text-3xl font-extrabold tracking-tight text-white leading-tight">
                building autonomous systems, creative web experiences, and fully onchain products.
              </h1>
              <p className="font-mono text-xs text-text-slate leading-relaxed">
                Blending LLM context engineering with onchain generative art engines governed by mathematical laws.
              </p>
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
          © {new Date().getFullYear()} 0xdas. all rights reserved. built in public on base.
        </p>
      </footer>
    </div>
  );
}
