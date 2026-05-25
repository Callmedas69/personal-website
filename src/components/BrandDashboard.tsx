"use client";

import React, { useState } from "react";
import { Brain, Disc, Send, RefreshCw } from "lucide-react";
import { INVISIBLE_LAW_ADDRESS } from "@/abi/InvisibleLaw";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<"ai" | "onchain">("ai");
  
  // States for onchain panel
  const [txLog, setTxLog] = useState<string[]>([
    "Ready to execute contract call...",
    "RPC connected: Base mainnet"
  ]);
  const [isMinting, setIsMinting] = useState(false);
  const [mintCount, setMintCount] = useState(0);

  // Mock contract mint
  const executeMint = () => {
    if (isMinting) return;
    setIsMinting(true);
    setTxLog(prev => [...prev, ">> mutating InvisibleLawDNA(0x6180...)..."]);
    
    setTimeout(() => {
      setTxLog(prev => [...prev, ">> Gas estimated: 38,200 Gwei"]);
      
      setTimeout(() => {
        const txHash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        setMintCount(prev => prev + 1);
        setTxLog(prev => [
          ...prev, 
          `>> Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
          `>> Success: Invisible Law #${100 + mintCount} minted successfully on Base.`
        ]);
        setIsMinting(false);

        // Trigger the InvisibleLaw visualizer to generate a new seed!
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("generate-trigger"));
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
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
            activeTab === "onchain" 
              ? "bg-terminal-inner text-accent-yellow border-b-2 border-b-accent-yellow" 
              : "text-text-slate hover:text-text-primary hover:bg-terminal-inner/20"
          }`}
        >
          <Disc size={12} />
          <span>02_ONCHAIN</span>
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
                <div>Contract: <a href={`https://basescan.org/address/${INVISIBLE_LAW_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline font-mono">0x6fd8b...05e7</a></div>
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
                    <span>MINT ARTWORK</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
