"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { Brain, Disc, Orbit, Send, RefreshCw } from "lucide-react";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<"ai" | "onchain" | "creative">("ai");
  const motionBoxRef = useRef<HTMLDivElement>(null);
  
  // States for onchain panel
  const [txLog, setTxLog] = useState<string[]>([
    "Ready to execute contract call...",
    "RPC connected: Base mainnet"
  ]);
  const [isMinting, setIsMinting] = useState(false);
  const [mintCount, setMintCount] = useState(0);

  // States for creative panel
  const [animationSpeed, setAnimationSpeed] = useState(0.5);
  const [selectedEase, setSelectedEase] = useState("power2.out");

  // Animate custom elements in Creative tab
  const playMotion = (type: string) => {
    if (!motionBoxRef.current) return;
    
    // Clear existing tweens on the target
    gsap.killTweensOf(motionBoxRef.current);
    
    switch (type) {
      case "pulse":
        gsap.fromTo(motionBoxRef.current, 
          { scale: 1, filter: "brightness(100%)" }, 
          { 
            scale: 1.25, 
            filter: "brightness(140%)", 
            duration: animationSpeed, 
            yoyo: true, 
            repeat: 1, 
            ease: selectedEase 
          }
        );
        break;
      case "rotate":
        gsap.to(motionBoxRef.current, { 
          rotation: "+=360", 
          duration: animationSpeed * 1.5, 
          ease: selectedEase 
        });
        break;
      case "slide":
        gsap.timeline()
          .to(motionBoxRef.current, { x: 80, duration: animationSpeed, ease: selectedEase })
          .to(motionBoxRef.current, { x: -80, duration: animationSpeed, ease: selectedEase })
          .to(motionBoxRef.current, { x: 0, duration: animationSpeed * 0.8, ease: "bounce.out" });
        break;
      case "squish":
        gsap.timeline()
          .to(motionBoxRef.current, { scaleY: 0.6, scaleX: 1.4, duration: animationSpeed * 0.5, ease: "power1.in" })
          .to(motionBoxRef.current, { scaleY: 1.4, scaleX: 0.6, y: -40, duration: animationSpeed, ease: "power2.out" })
          .to(motionBoxRef.current, { scaleY: 0.9, scaleX: 1.1, y: 0, duration: animationSpeed * 0.8, ease: "bounce.out" })
          .to(motionBoxRef.current, { scaleY: 1, scaleX: 1, duration: 0.1 });
        break;
    }
  };

  // Mock contract mint
  const executeMint = () => {
    if (isMinting) return;
    setIsMinting(true);
    setTxLog(prev => [...prev, ">> mutating WobbleDNA(0x8a92...)..."]);
    
    setTimeout(() => {
      setTxLog(prev => [...prev, ">> Gas estimated: 42,109 Gwei"]);
      
      setTimeout(() => {
        const txHash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        setMintCount(prev => prev + 1);
        setTxLog(prev => [
          ...prev, 
          `>> Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
          `>> Success: Wobble #${100 + mintCount} minted successfully on Base.`
        ]);
        setIsMinting(false);

        // Also trigger the wobble jump automatically!
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wobble-trigger"));
        }
      }, 800);
    }, 500);
  };

  return (
    <div className="w-full border border-border-line bg-terminal-bg rounded-lg flex flex-col overflow-hidden h-[300px] md:h-[320px]">
      {/* Tabs Header */}
      <div className="flex border-b border-border-line select-none bg-terminal-inner/40">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 border-r border-border-line transition-colors cursor-pointer ${
            activeTab === "ai" 
              ? "bg-terminal-inner text-accent-blue border-b-2 border-b-accent-blue" 
              : "text-text-slate hover:text-text-primary hover:bg-terminal-inner/20"
          }`}
        >
          <Brain size={12} />
          <span>01_AI-NATIVE</span>
        </button>
        <button
          onClick={() => setActiveTab("onchain")}
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 border-r border-border-line transition-colors cursor-pointer ${
            activeTab === "onchain" 
              ? "bg-terminal-inner text-accent-yellow border-b-2 border-b-accent-yellow" 
              : "text-text-slate hover:text-text-primary hover:bg-terminal-inner/20"
          }`}
        >
          <Disc size={12} />
          <span>02_ONCHAIN</span>
        </button>
        <button
          onClick={() => setActiveTab("creative")}
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
            activeTab === "creative" 
              ? "bg-terminal-inner text-accent-mint border-b-2 border-b-accent-mint" 
              : "text-text-slate hover:text-text-primary hover:bg-terminal-inner/20"
          }`}
        >
          <Orbit size={12} />
          <span>03_CREATIVE</span>
        </button>
      </div>

      {/* Tab Panel Content */}
      <div className="flex-1 p-5 overflow-y-auto bg-terminal-inner text-sm relative">
        
        {/* Tab 1: AI Node Graph */}
        {activeTab === "ai" && (
          <div className="space-y-4 h-full flex flex-col justify-between">
            <div className="font-mono text-xs text-text-slate leading-relaxed">
              <span className="text-accent-blue font-bold">ContextOps Context Engine</span>
              <p className="mt-1">Active node structure mapping Obsidian vault memory loops and agent boundary logic. Restricts LLM paths to prevent cognitive drift.</p>
            </div>
            
            {/* Visual Node Graph Grid */}
            <div className="grid grid-cols-3 gap-2 py-1 font-mono text-[10px] text-center select-none">
              <div className="border border-accent-blue/30 rounded p-2 bg-accent-blue/5 hover:border-accent-blue/70 transition-colors cursor-help">
                <div className="font-semibold text-accent-blue">CLAUDE.md</div>
                <div className="text-[8px] text-text-slate mt-0.5">ROUTING RULES</div>
              </div>
              <div className="border border-border-line rounded p-2 bg-terminal-bg/40 flex items-center justify-center text-text-slate">
                <span>⇆</span>
              </div>
              <div className="border border-accent-mint/30 rounded p-2 bg-accent-mint/5 hover:border-accent-mint/70 transition-colors cursor-help">
                <div className="font-semibold text-accent-mint">CONTEXT.md</div>
                <div className="text-[8px] text-text-slate mt-0.5">WORKSPACE RULES</div>
              </div>
              
              <div className="col-span-3 flex justify-center py-1">
                <div className="w-0.5 h-4 bg-border-line"></div>
              </div>

              <div className="col-span-3 border border-accent-yellow/30 rounded p-2 bg-accent-yellow/5 hover:border-accent-yellow/70 transition-colors cursor-help max-w-xs mx-auto w-full">
                <div className="font-semibold text-accent-yellow">00_NOW / morning-briefing.md</div>
                <div className="text-[8px] text-text-slate mt-0.5">DAILY TASK STATE SYNCHRONIZATION</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Onchain Smart Contract */}
        {activeTab === "onchain" && (
          <div className="flex flex-col h-full justify-between space-y-3">
            {/* RPC Console Logs */}
            <div className="flex-1 bg-terminal-bg/60 border border-border-line rounded p-3 font-mono text-[10px] text-text-slate space-y-1 overflow-y-auto max-h-[140px]">
              {txLog.map((log, index) => (
                <div key={index} className={log.startsWith(">> Success") ? "text-accent-mint font-semibold" : ""}>
                  {log}
                </div>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="flex items-center justify-between border-t border-border-line/40 pt-3 font-mono">
              <div className="text-[10px] text-text-slate">
                <div>Contract: <span className="text-text-primary">WobbleNFT.sol</span></div>
                <div>Minted: <span className="text-accent-yellow font-bold">{mintCount} total</span></div>
              </div>
              <button
                onClick={executeMint}
                disabled={isMinting}
                className="btn-primary flex items-center space-x-1 hover:brightness-110 active:scale-95 transition-all text-xs font-semibold px-3 py-1.5 rounded cursor-pointer select-none bg-accent-yellow text-terminal-bg border-none"
                style={{
                  background: isMinting ? "#244e56" : "#fec97d",
                  color: isMinting ? "#75d1c4" : "#011627"
                }}
              >
                {isMinting ? (
                  <>
                    <RefreshCw size={11} className="animate-spin" />
                    <span>MINTING...</span>
                  </>
                ) : (
                  <>
                    <Send size={11} />
                    <span>MINT WOBBLE</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Creative Motion GSAP */}
        {activeTab === "creative" && (
          <div className="grid grid-cols-2 gap-4 h-full items-center">
            
            {/* Control Playground Controls */}
            <div className="space-y-3 font-mono text-[10px] text-text-slate">
              <div className="font-semibold text-accent-mint text-[11px] mb-1">GSAP Interpolation Console</div>
              
              {/* Easing Options */}
              <div className="space-y-1">
                <label className="block text-[9px] uppercase tracking-wide">Easing Type:</label>
                <select 
                  value={selectedEase} 
                  onChange={(e) => setSelectedEase(e.target.value)}
                  className="w-full bg-terminal-bg border border-border-line text-text-primary text-[10px] p-1 rounded outline-none"
                >
                  <option value="power2.out">power2.out (Smooth Ease)</option>
                  <option value="bounce.out">bounce.out (Physics Bounce)</option>
                  <option value="elastic.out(1, 0.3)">elastic.out (Rubber Spring)</option>
                  <option value="back.out(1.7)">back.out (Overshoot)</option>
                  <option value="none">linear (Flat Interpolation)</option>
                </select>
              </div>

              {/* Speed Slider */}
              <div className="space-y-1">
                <div className="flex justify-between">
                  <label className="text-[9px] uppercase tracking-wide">Duration:</label>
                  <span>{animationSpeed}s</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="1.5" 
                  step="0.1"
                  value={animationSpeed} 
                  onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                  className="w-full accent-accent-mint h-1 rounded bg-terminal-bg border border-border-line outline-none"
                />
              </div>
            </div>

            {/* Animating Visual Element */}
            <div className="flex flex-col items-center justify-center border border-border-line rounded bg-terminal-bg/40 p-4 h-full relative overflow-hidden">
              <div 
                ref={motionBoxRef}
                className="w-12 h-12 rounded bg-gradient-to-tr from-accent-blue via-accent-mint to-accent-yellow shadow-lg flex items-center justify-center text-terminal-bg cursor-pointer select-none font-bold text-xs"
                onClick={() => playMotion("squish")}
                style={{ transformOrigin: "center bottom" }}
              >
                GSAP
              </div>
              
              {/* Action trigger buttons */}
              <div className="grid grid-cols-4 gap-1 w-full mt-4">
                <button 
                  onClick={() => playMotion("pulse")}
                  className="text-[9px] font-mono py-1 rounded bg-terminal-bg border border-border-line text-text-slate hover:text-accent-mint hover:border-accent-mint/45 transition-colors cursor-pointer"
                >
                  pulse
                </button>
                <button 
                  onClick={() => playMotion("rotate")}
                  className="text-[9px] font-mono py-1 rounded bg-terminal-bg border border-border-line text-text-slate hover:text-accent-mint hover:border-accent-mint/45 transition-colors cursor-pointer"
                >
                  spin
                </button>
                <button 
                  onClick={() => playMotion("slide")}
                  className="text-[9px] font-mono py-1 rounded bg-terminal-bg border border-border-line text-text-slate hover:text-accent-mint hover:border-accent-mint/45 transition-colors cursor-pointer"
                >
                  slide
                </button>
                <button 
                  onClick={() => playMotion("squish")}
                  className="text-[9px] font-mono py-1 rounded bg-terminal-bg border border-border-line text-text-slate hover:text-accent-mint hover:border-accent-mint/45 transition-colors cursor-pointer"
                >
                  jump
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
