"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import HeaderConnectButton from "./HeaderConnectButton";
import Logo from "./Logo";

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl w-full mx-auto select-none border-b border-border-line/40">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <Link href="/" className="flex items-center space-x-2.5 cursor-pointer group">
          <Logo className="w-8 h-8 sm:w-12 sm:h-12 text-accent-blue group-hover:text-accent-mint transition-colors" />
        </Link>
        <span className="hidden sm:inline text-text-slate/40 text-xs" aria-hidden="true">|</span>
        <div className="hidden sm:flex items-center space-x-1 bg-terminal-inner/60 border border-border-line/60 rounded px-1.5 sm:px-2 py-0.5 text-[9px] font-mono text-accent-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
          <span className="hidden sm:inline">BASE_MAINNET : ONLINE</span>
          <span className="sm:hidden">ONLINE</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-text-slate font-mono">
        <Link href="/cognitive-log" className={`transition-colors ${pathname === "/cognitive-log" ? "text-accent-yellow font-bold" : "hover:text-accent-yellow"}`}>
          cognitive-log
        </Link>
        <span className="text-text-slate/40 text-xs" aria-hidden="true">|</span>
        <HeaderConnectButton />
      </div>
    </header>
  );
}
