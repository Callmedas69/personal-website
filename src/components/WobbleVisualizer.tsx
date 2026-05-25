"use client";

import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { RefreshCw, Zap } from "lucide-react";

export default function WobbleVisualizer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const wobbleRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGCircleElement>(null);
  const rightPupilRef = useRef<SVGCircleElement>(null);
  const mouthRef = useRef<SVGPathElement>(null);
  
  const [wobbleState, setWobbleState] = useState({
    id: "wobble-0xdas-88",
    dna: "0x75d1c4fec97d6e9cf1",
    generation: 1,
    mood: "CURIOUS",
    gasSaved: "0.084 ETH",
    mutation: "0x2F (ACTIVE)"
  });

  // Handle local trigger animation
  const triggerJump = () => {
    if (!wobbleRef.current) return;
    
    // Jump animation timeline
    const tl = gsap.timeline({
      onStart: () => {
        // Change mood on jump
        const moods = ["HYPERACTIVE", "HAPPY", "EXCITED", "BOUNCY", "DANCING"];
        setWobbleState(prev => ({
          ...prev,
          mood: moods[Math.floor(Math.random() * moods.length)]
        }));
      },
      onComplete: () => {
        setWobbleState(prev => ({ ...prev, mood: "CURIOUS" }));
      }
    });

    tl.to(wobbleRef.current, {
      scaleY: 0.7,
      scaleX: 1.3,
      y: 10,
      duration: 0.12,
      ease: "power1.inOut"
    })
    .to(wobbleRef.current, {
      scaleY: 1.25,
      scaleX: 0.8,
      y: -70,
      duration: 0.3,
      ease: "power2.out"
    })
    .to(wobbleRef.current, {
      scaleY: 0.85,
      scaleX: 1.15,
      y: 5,
      duration: 0.22,
      ease: "bounce.out"
    })
    .to(wobbleRef.current, {
      scaleY: 1,
      scaleX: 1,
      y: 0,
      duration: 0.15,
      ease: "power1.out"
    });

    // Mouth animation during jump
    gsap.to(mouthRef.current, {
      attr: { d: "M 135 170 Q 150 190 165 170" }, // Wide smile/open
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power1.inOut"
    });
  };

  // Mouse move listener for eye tracking
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate pupils tracking offset (max 6px offset)
      const angle = Math.atan2(y, x);
      const distance = Math.min(Math.sqrt(x*x + y*y) / 10, 6);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;

      gsap.to([leftPupilRef.current, rightPupilRef.current], {
        x: dx,
        y: dy,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const container = containerRef.current;
    if (container) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Listen for terminal /wobble command event
  useEffect(() => {
    const handleTerminalTrigger = () => {
      triggerJump();
    };
    window.addEventListener("wobble-trigger", handleTerminalTrigger);
    return () => {
      window.removeEventListener("wobble-trigger", handleTerminalTrigger);
    };
  }, []);

  // Rotate DNA / mutate
  const mutateDNA = () => {
    const hexChars = "0123456789abcdef";
    let newDna = "0x";
    for (let i = 0; i < 16; i++) {
      newDna += hexChars[Math.floor(Math.random() * 16)];
    }
    
    // Animate mouth to "O" shape
    gsap.to(mouthRef.current, {
      attr: { d: "M 140 170 Q 150 185 160 170" },
      duration: 0.15,
      yoyo: true,
      repeat: 1
    });

    // Mutate state values
    setWobbleState(prev => ({
      ...prev,
      dna: newDna,
      generation: prev.generation + 1,
      mood: "MUTATED",
      mutation: `0x${Math.floor(Math.random() * 256).toString(16).toUpperCase()} (STABLE)`
    }));

    triggerJump();
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full border border-border-line bg-terminal-inner/30 rounded-lg p-5 flex flex-col items-center justify-between select-none overflow-hidden h-[300px] md:h-[320px]"
    >
      {/* Decorative Blueprint Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(192,199,209,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(192,199,209,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none"></div>
      
      {/* HUD Header */}
      <div className="w-full flex items-center justify-between font-mono text-[10px] text-text-slate relative z-10">
        <div className="flex items-center space-x-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-mint animate-pulse"></span>
          <span className="tracking-wide">ONCHAIN_CREATURE // L2</span>
        </div>
        <div className="flex items-center space-x-2">
          <span>DNA: <span className="text-accent-blue font-bold">{wobbleState.dna.slice(0, 8)}...</span></span>
        </div>
      </div>

      {/* Main SVG Render Space */}
      <div className="relative flex-1 flex items-center justify-center w-full z-10">
        <svg 
          viewBox="0 0 300 300" 
          className="w-[180px] h-[180px] md:w-[200px] md:h-[200px] cursor-pointer"
          onClick={triggerJump}
        >
          {/* Shadow Ellipse under Wobble */}
          <ellipse 
            cx="150" 
            cy="235" 
            rx="55" 
            ry="10" 
            fill="rgba(7, 13, 25, 0.6)" 
          />

          {/* Animating Wobble Group */}
          <g ref={wobbleRef} style={{ transformOrigin: "150px 230px" }}>
            {/* Wobble Body Path */}
            <path 
              d="M 100 150 C 100 90, 200 90, 200 150 C 200 210, 100 220, 100 150 Z" 
              fill="#0a2534" 
              stroke="#75d1c4" 
              strokeWidth="4" 
              className="transition-colors duration-500"
              style={{
                fill: wobbleState.mood === "MUTATED" ? "#244e56" : "#0a2534",
                stroke: wobbleState.mood === "MUTATED" ? "#fec97d" : "#75d1c4"
              }}
            />

            {/* Left Eye */}
            <ellipse 
              cx="130" 
              cy="140" 
              rx="15" 
              ry="20" 
              fill="#ffffff" 
              stroke="#0a2534" 
              strokeWidth="2" 
            />
            {/* Left Pupil */}
            <circle 
              ref={leftPupilRef}
              cx="130" 
              cy="140" 
              r="6" 
              fill="#011627" 
            />
            {/* Left Eye Highlight */}
            <circle 
              cx="127" 
              cy="135" 
              r="2" 
              fill="#ffffff" 
            />

            {/* Right Eye */}
            <ellipse 
              cx="170" 
              cy="140" 
              rx="15" 
              ry="20" 
              fill="#ffffff" 
              stroke="#0a2534" 
              strokeWidth="2" 
            />
            {/* Right Pupil */}
            <circle 
              ref={rightPupilRef}
              cx="170" 
              cy="140" 
              r="6" 
              fill="#011627" 
            />
            {/* Right Eye Highlight */}
            <circle 
              cx="167" 
              cy="135" 
              r="2" 
              fill="#ffffff" 
            />

            {/* Mouth */}
            <path 
              ref={mouthRef}
              d="M 142 170 Q 150 178 158 170" 
              fill="none" 
              stroke={wobbleState.mood === "MUTATED" ? "#fec97d" : "#75d1c4"} 
              strokeWidth="3.5" 
              strokeLinecap="round" 
            />

            {/* Antennas / Tech Connectors */}
            <line x1="120" y1="95" x2="105" y2="75" stroke="#75d1c4" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="105" cy="75" r="4.5" fill="#6e9cf1" />

            <line x1="180" y1="95" x2="195" y2="75" stroke="#75d1c4" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="195" cy="75" r="4.5" fill="#fec97d" />
          </g>
        </svg>
      </div>

      {/* Monospace Creature Spec Deck */}
      <div className="w-full grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-text-slate/85 border-t border-border-line/60 pt-2.5 relative z-10">
        <div className="flex justify-between">
          <span>CREATURE_ID:</span>
          <span className="text-text-primary">{wobbleState.id}</span>
        </div>
        <div className="flex justify-between">
          <span>MUTATION:</span>
          <span className="text-accent-yellow">{wobbleState.mutation}</span>
        </div>
        <div className="flex justify-between">
          <span>GENERATION:</span>
          <span className="text-text-primary">G-{wobbleState.generation}</span>
        </div>
        <div className="flex justify-between">
          <span>STATE:</span>
          <span className="text-accent-mint font-semibold">{wobbleState.mood}</span>
        </div>
      </div>

      {/* Float Control Actions */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col space-y-2 z-20">
        <button 
          onClick={triggerJump}
          title="Trigger Onchain Jump"
          className="p-2 rounded bg-terminal-bg border border-border-line text-accent-blue hover:text-accent-mint hover:border-accent-mint/50 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <Zap size={13} />
        </button>
        <button 
          onClick={mutateDNA}
          title="Mutate DNA Sequence"
          className="p-2 rounded bg-terminal-bg border border-border-line text-accent-yellow hover:text-accent-green hover:border-accent-green/50 transition-all cursor-pointer shadow-md active:scale-95"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </div>
  );
}
