"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { RefreshCw, Layout } from "lucide-react";

// Phi Grid positions based on the golden ratio
const PHI_POSITIONS = [0, 14.6, 23.6, 38.2, 50, 61.8, 76.4, 85.4, 100];

// Bauhaus color palette from InvisibleLaw.sol contract
const BAUHAUS_COLORS = [
  "#E8505B", // Red/Coral
  "#F9D56E", // Yellow/Gold
  "#F3ECC2", // Cream/Beige
  "#14B1AB", // Teal
  "#9AB8A7", // Sage Green
  "#E89B5B", // Orange
  "#5B8EE8", // Blue
] as const;

// LCG Deterministic Random Generator from Seed
function seededRandom(seedStr: string) {
  let h = 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = (h << 5) - h + seedStr.charCodeAt(i);
    h |= 0;
  }
  let x = Math.abs(h);
  return function() {
    x = (1664525 * x + 1013904223) % 4294967296;
    return x / 4294967296;
  };
}

export default function InvisibleLawVisualizer() {
  const [seed, setSeed] = useState("0x618033988749");
  const [showGrid, setShowGrid] = useState(true);
  const canvasRef = useRef<SVGSVGElement>(null);
  
  // Parse composition info based on seed
  const composition = React.useMemo(() => {
    const rand = seededRandom(seed);
    
    // Tier Determination
    let tier: "Standard" | "Uncommon" | "Rare" | "Legendary" = "Standard";
    const tierRoll = rand();
    if (tierRoll < 0.02) tier = "Legendary";
    else if (tierRoll < 0.10) tier = "Rare";
    else if (tierRoll < 0.30) tier = "Uncommon";

    // Subtype Determination
    let subtype = "Standard";
    if (tier === "Legendary") {
      const subRoll = rand();
      if (subRoll < 0.4) subtype = "Spiral";
      else if (subRoll < 0.7) subtype = "Unity";
      else subtype = "Zero";
    } else if (tier === "Rare") {
      const subRoll = rand();
      if (subRoll < 0.4) subtype = "Sequence";
      else if (subRoll < 0.7) subtype = "Infinite";
      else subtype = "Ratio";
    } else if (tier === "Uncommon") {
      subtype = "Enhanced";
    }

    // Color definitions
    // Warm: Coral (#E8505B), Yellow (#F9D56E), Orange (#E89B5B)
    // Cool: Teal (#14B1AB), Sage (#9AB8A7), Blue (#5B8EE8)
    const warmColors = ["#E8505B", "#F9D56E", "#E89B5B"];
    const coolColors = ["#14B1AB", "#9AB8A7", "#5B8EE8"];
    const neutralColors = ["#F3ECC2"]; // Cream
    
    let allowedColors: string[] = [...BAUHAUS_COLORS];
    if (subtype === "Ratio") {
      allowedColors = rand() < 0.5 ? [...warmColors, ...neutralColors] : [...coolColors, ...neutralColors];
    } else if (subtype === "Unity") {
      allowedColors = [BAUHAUS_COLORS[Math.floor(rand() * BAUHAUS_COLORS.length)]];
    }

    // Generate Mosaic Rectangles
    let rectCount = 3;
    if (subtype === "Zero") rectCount = rand() < 0.5 ? 0 : 1;
    else if (subtype === "Infinite") rectCount = 7 + Math.floor(rand() * 3);
    else if (tier === "Uncommon") rectCount = 4 + Math.floor(rand() * 2);
    else if (tier === "Standard") rectCount = 2 + Math.floor(rand() * 2);

    const rectangles = [];
    for (let i = 0; i < rectCount; i++) {
      const x1Idx = Math.floor(rand() * (PHI_POSITIONS.length - 2));
      const x2Idx = x1Idx + 1 + Math.floor(rand() * (PHI_POSITIONS.length - 1 - x1Idx));
      const y1Idx = Math.floor(rand() * (PHI_POSITIONS.length - 2));
      const y2Idx = y1Idx + 1 + Math.floor(rand() * (PHI_POSITIONS.length - 1 - y1Idx));
      
      rectangles.push({
        x: PHI_POSITIONS[x1Idx],
        y: PHI_POSITIONS[y1Idx],
        w: PHI_POSITIONS[x2Idx] - PHI_POSITIONS[x1Idx],
        h: PHI_POSITIONS[y2Idx] - PHI_POSITIONS[y1Idx],
        color: allowedColors[Math.floor(rand() * allowedColors.length)],
        opacity: 0.65 + rand() * 0.25
      });
    }

    // Generate Intersection Dots
    let dotCount = 4;
    if (subtype === "Zero") dotCount = 0;
    else if (subtype === "Sequence") dotCount = 15 + Math.floor(rand() * 10);
    else if (subtype === "Infinite") dotCount = 12 + Math.floor(rand() * 6);
    else if (tier === "Uncommon") dotCount = 6 + Math.floor(rand() * 4);

    const dots = [];
    const fibRadii = [2, 3, 5, 8, 13];
    for (let i = 0; i < dotCount; i++) {
      const xIdx = Math.floor(rand() * PHI_POSITIONS.length);
      const yIdx = Math.floor(rand() * PHI_POSITIONS.length);
      dots.push({
        cx: PHI_POSITIONS[xIdx],
        cy: PHI_POSITIONS[yIdx],
        r: fibRadii[Math.floor(rand() * fibRadii.length)] * 0.8, // Scale down slightly for viewbox
        color: allowedColors[Math.floor(rand() * allowedColors.length)]
      });
    }

    // Generate Extended Lines
    let lineCount = 3;
    if (subtype === "Zero") lineCount = 0;
    else if (subtype === "Infinite") lineCount = 6 + Math.floor(rand() * 4);
    else if (tier === "Standard") lineCount = 2 + Math.floor(rand() * 2);

    const lines = [];
    for (let i = 0; i < lineCount; i++) {
      const isVertical = rand() < 0.5;
      const gridPos = PHI_POSITIONS[Math.floor(rand() * PHI_POSITIONS.length)];
      if (isVertical) {
        lines.push({ x1: gridPos, y1: 0, x2: gridPos, y2: 100, color: allowedColors[Math.floor(rand() * allowedColors.length)] });
      } else {
        lines.push({ x1: 0, y1: gridPos, x2: 100, y2: gridPos, color: allowedColors[Math.floor(rand() * allowedColors.length)] });
      }
    }

    // Concentric Rings
    let ringCount = 1;
    if (subtype === "Zero") ringCount = 0;
    else if (subtype === "Spiral") ringCount = 4;
    else if (subtype === "Infinite") ringCount = 3;

    const rings = [];
    const ringCenterX = subtype === "Spiral" ? 50 : PHI_POSITIONS[Math.floor(rand() * PHI_POSITIONS.length)];
    const ringCenterY = subtype === "Spiral" ? 50 : PHI_POSITIONS[Math.floor(rand() * PHI_POSITIONS.length)];
    
    for (let i = 0; i < ringCount; i++) {
      const r = subtype === "Spiral" 
        ? [18, 27.9, 42.8, 61.8][i]
        : 8 + (i * 12);
      rings.push({
        cx: ringCenterX,
        cy: ringCenterY,
        r: r,
        color: allowedColors[Math.floor(rand() * allowedColors.length)]
      });
    }

    return {
      tier,
      subtype,
      rectangles,
      dots,
      lines,
      rings
    };
  }, [seed]);

  // Entrance and Breathing animations using GSAP
  useEffect(() => {
    if (!canvasRef.current) return;

    // Animate lines and shapes drawing in
    const gridLines = canvasRef.current.querySelectorAll(".phi-grid-line");
    const extendedLines = canvasRef.current.querySelectorAll(".extended-line");
    const rings = canvasRef.current.querySelectorAll(".concentric-ring");
    const rects = canvasRef.current.querySelectorAll(".mosaic-rect");
    const dots = canvasRef.current.querySelectorAll(".intersection-dot");
    const boundaryCircle = canvasRef.current.querySelector(".boundary-circle");

    // Kill any existing animation
    gsap.killTweensOf([gridLines, extendedLines, rings, rects, dots, boundaryCircle]);

    // Timeline for initial draw
    const tl = gsap.timeline();
    
    tl.fromTo(gridLines, { opacity: 0 }, { opacity: 0.15, duration: 0.4, stagger: 0.02, ease: "power1.out" })
      .fromTo(boundaryCircle, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 0.35, duration: 0.5, ease: "back.out(1.5)" }, "-=0.2")
      .fromTo(extendedLines, { strokeDasharray: "100", strokeDashoffset: "100" }, { strokeDashoffset: "0", duration: 0.6, stagger: 0.05, ease: "power2.out" }, "-=0.3")
      .fromTo(rings, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.6, duration: 0.6, stagger: 0.1, ease: "elastic.out(1, 0.5)" }, "-=0.4")
      .fromTo(rects, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, stagger: 0.08, ease: "power2.out" }, "-=0.3")
      .fromTo(dots, { scale: 0, opacity: 0 }, { scale: 1, opacity: 0.95, duration: 0.4, stagger: 0.03, ease: "back.out(2)" }, "-=0.2");

    // Infinite breathing animations on rectangles
    rects.forEach((rect, i) => {
      gsap.to(rect, {
        opacity: 0.5,
        duration: 1.8 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
        delay: i * 0.15
      });
    });

  }, [seed]);

  const regenerateSeed = () => {
    const hexChars = "0123456789abcdef";
    let newSeed = "0x";
    for (let i = 0; i < 12; i++) {
      newSeed += hexChars[Math.floor(Math.random() * 16)];
    }
    setSeed(newSeed);
  };

  // Listen for custom trigger from terminal
  useEffect(() => {
    const handleTerminalTrigger = () => {
      regenerateSeed();
    };
    window.addEventListener("generate-trigger", handleTerminalTrigger);
    return () => {
      window.removeEventListener("generate-trigger", handleTerminalTrigger);
    };
  }, []);

  return (
    <div className="relative w-full border border-border-line bg-terminal-inner/30 rounded-lg p-5 flex flex-col items-center justify-between select-none overflow-hidden h-[300px] md:h-[320px]">
      
      {/* Decorative Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(192,199,209,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(192,199,209,0.02)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
      
      {/* Header Info */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-text-slate relative z-10">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse"></span>
          <span className="tracking-wide">INVISIBLE_LAW // Φ GENERATIVE_ART</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>SEED: <span className="text-accent-blue font-bold">{seed}</span></span>
        </div>
      </div>

      {/* Artboard SVG Container */}
      <div className="relative flex-1 flex items-center justify-center w-full z-10 py-2">
        <svg
          ref={canvasRef}
          viewBox="0 0 100 100"
          className="w-[170px] h-[170px] md:w-[190px] md:h-[190px] border border-border-line bg-[#011627] rounded shadow-2xl cursor-pointer overflow-hidden"
          onClick={regenerateSeed}
          style={{ transformOrigin: "center center" }}
        >
          {/* Layer 1: Phi Grid Lines */}
          {showGrid && (
            <g className="phi-grid">
              {PHI_POSITIONS.map((pos, i) => (
                <g key={`lines-${i}`}>
                  {/* Vertical */}
                  <line
                    x1={pos}
                    y1={0}
                    x2={pos}
                    y2={100}
                    stroke="#5f7d97"
                    strokeWidth="0.15"
                    className="phi-grid-line"
                  />
                  {/* Horizontal */}
                  <line
                    x1={0}
                    y1={pos}
                    x2={100}
                    y2={pos}
                    stroke="#5f7d97"
                    strokeWidth="0.15"
                    className="phi-grid-line"
                  />
                </g>
              ))}
            </g>
          )}

          {/* Layer 2: Boundary Circle */}
          {composition.subtype !== "Zero" && (
            <circle
              cx="50"
              cy="50"
              r="36"
              fill="none"
              stroke="#5f7d97"
              strokeWidth="0.3"
              strokeDasharray="1 3"
              className="boundary-circle"
              style={{ transformOrigin: "50px 50px" }}
            />
          )}

          {/* Layer 6: Extended Lines */}
          <g className="extended-lines">
            {composition.lines.map((line, idx) => (
              <line
                key={`line-${idx}`}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke={line.color}
                strokeWidth="0.45"
                className="extended-line"
              />
            ))}
          </g>

          {/* Layer 3: Mosaic Rectangles */}
          <g className="mosaic-rectangles">
            {composition.rectangles.map((rect, idx) => (
              <rect
                key={`rect-${idx}`}
                x={rect.x}
                y={rect.y}
                width={rect.w}
                height={rect.h}
                fill={rect.color}
                fillOpacity={rect.opacity}
                className="mosaic-rect"
                style={{ transformOrigin: `${rect.x + rect.w/2}px ${rect.y + rect.h/2}px` }}
              />
            ))}
          </g>

          {/* Layer 5: Concentric Rings */}
          <g className="concentric-rings">
            {composition.rings.map((ring, idx) => (
              <circle
                key={`ring-${idx}`}
                cx={ring.cx}
                cy={ring.cy}
                r={ring.r}
                fill="none"
                stroke={ring.color}
                strokeWidth="0.6"
                className="concentric-ring"
                style={{ transformOrigin: `${ring.cx}px ${ring.cy}px` }}
              />
            ))}
          </g>

          {/* Layer 4: Intersection Dots */}
          <g className="intersection-dots">
            {composition.dots.map((dot, idx) => (
              <circle
                key={`dot-${idx}`}
                cx={dot.cx}
                cy={dot.cy}
                r={dot.r}
                fill={dot.color}
                className="intersection-dot"
                style={{ transformOrigin: `${dot.cx}px ${dot.cy}px` }}
              />
            ))}
          </g>
        </svg>
      </div>

      {/* Footer Specification Deck */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-text-slate/85 border-t border-border-line/60 pt-2 relative z-10">
        <div className="flex justify-between">
          <span>TIER:</span>
          <span className={
            composition.tier === "Legendary" ? "text-accent-yellow font-bold" :
            composition.tier === "Rare" ? "text-accent-purple font-semibold" :
            composition.tier === "Uncommon" ? "text-accent-blue" : "text-text-primary"
          }>
            {composition.tier.toUpperCase()}
          </span>
        </div>
        <div className="flex justify-between">
          <span>SUBTYPE:</span>
          <span className="text-text-primary">{composition.subtype}</span>
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

      {/* Control Actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-20">
        <button
          onClick={regenerateSeed}
          title="Regenerate Generative Seed"
          className="p-2 rounded bg-terminal-bg border border-border-line text-accent-blue hover:text-accent-mint hover:border-accent-mint/50 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <RefreshCw size={13} />
        </button>
        <button
          onClick={() => setShowGrid(prev => !prev)}
          title="Toggle Phi Grid Overlay"
          className={`p-2 rounded border transition-all cursor-pointer shadow-md active:scale-95 ${
            showGrid 
              ? "bg-accent-blue/15 border-accent-blue/50 text-accent-blue" 
              : "bg-terminal-bg border-border-line text-text-slate hover:text-text-primary"
          }`}
        >
          <Layout size={13} />
        </button>
      </div>
    </div>
  );
}
