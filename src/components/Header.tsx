"use client";

import React from "react";
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
          <Logo className="w-6 h-6 text-accent-blue group-hover:text-accent-mint transition-colors" />
          <span className="font-mono text-sm tracking-widest font-bold text-white group-hover:text-accent-mint transition-colors">
            0xdas.dev
          </span>
          <span className="hidden lg:inline font-mono text-[10px] text-text-slate/40 ml-1">
            // the thinking is free.
          </span>
        </Link>
        <span className="text-text-slate/40 text-xs">|</span>
        <div className="flex items-center space-x-1 bg-terminal-inner/60 border border-border-line/60 rounded px-1.5 sm:px-2 py-0.5 text-[9px] font-mono text-accent-mint">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
          <span className="hidden sm:inline">BASE_MAINNET : ONLINE</span>
          <span className="sm:hidden">ONLINE</span>
        </div>
      </div>
      <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-text-slate font-mono">
        <Link href="/feed" className={`transition-colors ${pathname === "/feed" ? "text-accent-yellow font-bold" : "hover:text-accent-yellow"}`}>
          feed
        </Link>
        <span className="text-text-slate/40">·</span>
        <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-mint transition-colors">farcaster</a>
        <span className="hidden sm:inline">·</span>
        <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-blue transition-colors">twitter</a>
        <span className="hidden sm:inline">·</span>
        <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-purple transition-colors">github</a>
        <span className="hidden sm:inline text-text-slate/40 text-xs">|</span>
        <HeaderConnectButton />
      </div>
    </header>
  );
}
