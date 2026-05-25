"use client";

import React, { useState, useEffect } from "react";
import { Brain, Disc, Send, RefreshCw, Wallet } from "lucide-react";
import { useAccount } from "wagmi";
import { useContractReads } from "@/hooks/useContractReads";
import { useMint } from "@/hooks/useMint";
import { formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { INVISIBLE_LAW_ADDRESS } from "@/abi/InvisibleLaw";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<"ai" | "onchain">("ai");
  const { isConnected } = useAccount();
  
  const { 
    mintPrice, 
    totalMinted, 
    maxSupply, 
    canMint,
    isLoading: isContractLoading,
  } = useContractReads();

  const { mint, isPending, isConfirming, isSuccess, error, txHash } = useMint();

  // States for simulated onchain panel (when wallet is not connected)
  const [simLog, setSimLog] = useState<string[]>([
    "Ready to execute contract call...",
    "RPC connected: Base mainnet"
  ]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simCount, setSimCount] = useState(0);

  // Trigger the InvisibleLaw visualizer to generate a new seed on successful actual mint
  useEffect(() => {
    if (isSuccess && txHash) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("generate-trigger"));
      }
    }
  }, [isSuccess, txHash]);

  // Mock contract mint simulation (when wallet is not connected)
  const executeSimulation = () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimLog(prev => [...prev, ">> simulating InvisibleLawDNA(0x6180...)..."]);
    
    setTimeout(() => {
      setSimLog(prev => [...prev, ">> Gas estimated: 38,200 Gwei"]);
      
      setTimeout(() => {
        const mockHash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        setSimCount(prev => prev + 1);
        setSimLog(prev => [
          ...prev, 
          `>> Simulated Tx Hash: ${mockHash.slice(0, 10)}...${mockHash.slice(-8)}`,
          `>> Success: [SIMULATION] Invisible Law #${100 + simCount} minted.`
        ]);
        setIsSimulating(false);

        // Trigger visualizer
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("generate-trigger"));
        }
      }, 800);
    }, 500);
  };

  const handleRealMint = () => {
    if (!canMint || isPending || isConfirming) return;
    mint(1, mintPrice);
  };

  // Dynamically compute transaction logs based on contract state to avoid setState-in-effect issues
  const activeTxLog = ["Ready to execute contract call...", "RPC connected: Base mainnet"];
  if (isPending) {
    activeTxLog.push(">> Waiting for wallet confirmation...");
  }
  if (isConfirming) {
    activeTxLog.push(">> Waiting for wallet confirmation...", ">> Transaction submitted. Confirming on Base L2...");
  }
  if (isSuccess && txHash) {
    activeTxLog.push(
      ">> Waiting for wallet confirmation...",
      ">> Transaction submitted. Confirming on Base L2...",
      `>> Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-8)}`,
      ">> Success: Invisible Law minted successfully on Base L2!"
    );
  }
  if (error) {
    activeTxLog.push(`>> Error: ${error.message.slice(0, 60)}...`);
  }

  const logsToRender = isConnected ? activeTxLog : simLog;

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
              {logsToRender.map((log, index) => (
                <div key={index} className={
                  log.includes("Success:") 
                    ? "text-accent-mint font-semibold" 
                    : log.includes("Error:") 
                    ? "text-red-400 font-semibold" 
                    : ""
                }>
                  {log}
                </div>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="flex items-center justify-between border-t border-border-line/40 pt-3 font-mono">
              <div className="text-[10px] text-text-slate">
                <div>Contract: <a href={`https://basescan.org/address/${INVISIBLE_LAW_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline font-mono">0x6fd8b...05e7</a></div>
                {isConnected ? (
                  <>
                    <div>Minted: <span className="text-accent-yellow font-bold">{isContractLoading ? "..." : `${totalMinted} / ${maxSupply}`}</span></div>
                    <div>Price: <span className="text-text-primary">{isContractLoading ? "..." : `${formatEther(mintPrice)} ETH`}</span></div>
                  </>
                ) : (
                  <div>Status: <span className="text-accent-yellow font-semibold">WALLET DISCONNECTED</span></div>
                )}
              </div>
              
              <div className="flex flex-col items-end justify-center">
                {isConnected ? (
                  <button
                    onClick={handleRealMint}
                    disabled={!canMint || isPending || isConfirming}
                    className="btn-primary flex items-center space-x-1 hover:brightness-110 active:scale-95 transition-all text-xs font-semibold px-3 py-1.5 rounded cursor-pointer select-none bg-accent-yellow text-terminal-bg border-none"
                    style={{
                      background: (isPending || isConfirming) ? "#244e56" : "#fec97d",
                      color: (isPending || isConfirming) ? "#75d1c4" : "#011627"
                    }}
                  >
                    {isPending || isConfirming ? (
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
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={executeSimulation}
                      disabled={isSimulating}
                      className="px-2.5 py-1 text-[11px] font-mono border border-border-line text-text-slate hover:text-text-primary rounded hover:bg-terminal-inner/30 cursor-pointer"
                    >
                      {isSimulating ? "SIMULATING..." : "SIMULATE MINT"}
                    </button>
                    <ConnectButton.Custom>
                      {({ openConnectModal }) => (
                        <button
                          onClick={openConnectModal}
                          className="flex items-center space-x-1 text-xs font-semibold px-3 py-1.5 rounded cursor-pointer select-none bg-accent-blue text-terminal-bg border-none hover:brightness-110 active:scale-95 transition-all"
                        >
                          <Wallet size={11} />
                          <span>CONNECT</span>
                        </button>
                      )}
                    </ConnectButton.Custom>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
