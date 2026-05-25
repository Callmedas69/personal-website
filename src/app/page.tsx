import AgentTerminal from "@/components/AgentTerminal";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white">
      {/* Background radial grid effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/90 to-brand-bg pointer-events-none z-0"></div>
      
      {/* Page Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-5xl w-full mx-auto select-none">
        <div className="font-mono text-sm tracking-widest font-bold text-accent-blue hover:text-accent-mint transition-colors cursor-pointer">
          0xdas
        </div>
        <div className="flex items-center space-x-5 text-xs text-text-slate font-mono">
          <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-mint transition-colors">farcaster</a>
          <span>·</span>
          <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">twitter</a>
          <span>·</span>
          <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hover:text-accent-purple transition-colors">github</a>
        </div>
      </header>

      {/* Main Terminal Widget Space */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 w-full max-w-5xl mx-auto">
        <AgentTerminal />
      </main>

      {/* Page Footer */}
      <footer className="relative z-10 py-6 text-center select-none">
        <div className="flex justify-center space-x-6 mb-2">
          <a 
            href="https://github.com/0xdas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-slate hover:text-accent-purple transition-colors"
            title="GitHub"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
            </svg>
          </a>
          <a 
            href="https://x.com/0xdas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-slate hover:text-accent-blue transition-colors"
            title="Twitter / X"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a 
            href="https://warpcast.com/0xdas" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-text-slate hover:text-accent-mint transition-colors"
            title="Farcaster"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2.04c-5.5 0-9.96 4.46-9.96 9.96 0 5.5 4.46 9.96 9.96 9.96 5.5 0 9.96-4.46 9.96-9.96 0-5.5-4.46-9.96-9.96-9.96zm4.8 14.16h-9.6v-1.2h9.6v1.2zm0-3.6h-9.6v-1.2h9.6v1.2zm0-3.6h-9.6v-1.2h9.6v1.2z" />
            </svg>
          </a>
        </div>
        <p className="font-mono text-[10px] text-text-slate/60">
          © {new Date().getFullYear()} 0xdas. all rights reserved. built in public on base.
        </p>
      </footer>
    </div>
  );
}

