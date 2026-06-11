"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/** Live Base block readout. Mint accent = live/onchain signal. */
export default function BlockTicker({ blockNumber }: { blockNumber?: bigint }) {
  const numRef = useRef<HTMLSpanElement>(null);
  const lastBlock = useRef<bigint | undefined>(undefined);

  useEffect(() => {
    if (!blockNumber || blockNumber === lastBlock.current) return;
    const isFirst = lastBlock.current === undefined;
    lastBlock.current = blockNumber;
    if (isFirst || !numRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      numRef.current,
      { y: 12, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.25, ease: "power4.out" }
    );
  }, [blockNumber]);

  return (
    <div className="border border-border-line rounded-lg bg-terminal-inner/40 p-5 font-mono select-none">
      <div className="flex items-center gap-1.5 text-[10px] text-text-slate mb-2">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse" />
        <span>base mainnet · live</span>
      </div>
      <div className="overflow-hidden">
        <span ref={numRef} className="block text-2xl md:text-3xl font-bold text-accent-mint tracking-tight">
          {blockNumber ? `#${blockNumber.toLocaleString()}` : "#syncing..."}
        </span>
      </div>
    </div>
  );
}
