"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/motion";

/** RPC console log readout — auto-scrolls to the latest line; new lines tick in. */
export default function RpcConsole({ logs }: { logs: string[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
    // animate only lines appended after the initial render
    if (
      logs.length > prevCount.current &&
      prevCount.current > 0 &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const lines = el.querySelectorAll("[data-rpc-line]");
      const fresh = Array.from(lines).slice(prevCount.current);
      if (fresh.length) {
        gsap.from(fresh, { autoAlpha: 0, y: 6, duration: 0.25, ease: "power4.out", stagger: 0.05 });
      }
    }
    prevCount.current = logs.length;
  }, [logs]);

  return (
    <div className="border border-border-line rounded-lg bg-terminal-inner/40 flex flex-col h-full font-mono overflow-hidden">
      <div className="px-4 py-2.5 border-b border-border-line bg-terminal-inner/60 text-[10px] font-bold text-text-slate tracking-widest uppercase select-none">
        rpc console
      </div>
      <div
        ref={scrollRef}
        className="flex-1 p-4 text-[11px] text-text-slate space-y-1 overflow-y-auto min-h-[180px] max-h-[260px]"
      >
        {logs.map((log, index) => (
          <div
            data-rpc-line
            key={index}
            className={
              log.includes("Success:") || log.includes("Confirmed!")
                ? "text-accent-mint font-semibold"
                : log.includes("Error:") || log.includes("[ERROR]")
                ? "text-red-400 font-semibold"
                : log.includes("Connected to") || log.includes("Wallet status:") || log.includes("RPC status:")
                ? "text-accent-blue"
                : log.includes(">>")
                ? "text-accent-yellow"
                : ""
            }
          >
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}
