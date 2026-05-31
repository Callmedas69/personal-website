"use client";

import React from "react";
import Image from "next/image";

export default function InvisibleLawVisualizer() {
  return (
    <div className="relative w-full border border-border-line bg-terminal-inner/30 rounded-lg p-5 flex flex-col items-center justify-between select-none overflow-hidden h-[300px] md:h-[320px]">
      
      {/* Decorative Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(192,199,209,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(192,199,209,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
      
      {/* Header Info */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-text-slate relative z-10 border-b border-border-line/30 pb-2 mb-1">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse"></span>
          <span className="tracking-wide">INVISIBLE_LAW</span>
        </div>
        
        <div className="font-mono text-[9px] text-text-slate">
          <span className="text-accent-mint font-bold">#001 PREVIEW</span>
        </div>
      </div>

      {/* Artboard SVG or Image Container */}
      <div className="relative flex-1 flex items-center justify-center w-full z-10 py-1.5">
        <Image
          src="/invisible-law-001.png"
          alt="Invisible Law #001"
          width={185}
          height={185}
          className="w-[165px] h-[165px] md:w-[185px] md:h-[185px] border border-border-line rounded shadow-2xl object-contain bg-[#011627] hover:scale-[1.02] transition-transform duration-300"
          priority
        />
      </div>

      {/* Footer Specification Deck */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-text-slate/85 border-t border-border-line/45 pt-2 relative z-10">
        <div className="flex justify-between">
          <span>TIER:</span>
          <span className="text-accent-yellow font-bold">LEGENDARY</span>
        </div>
        <div className="flex justify-between">
          <span>SUBTYPE:</span>
          <span className="text-text-primary">Spiral</span>
        </div>
        <div className="flex justify-between">
          <span>GRID_SIZE:</span>
          <span className="text-text-primary">9 &times; 9 PHI</span>
        </div>
        <div className="flex justify-between">
          <span>SUPPLY:</span>
          <span className="text-accent-mint font-semibold">618 TOTAL</span>
        </div>
      </div>
    </div>
  );
}
