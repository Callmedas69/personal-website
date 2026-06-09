"use client";

import React, { useState, useEffect, useRef } from "react";
import { Brain, Disc, Send, RefreshCw, Wallet } from "lucide-react";
import { useAccount, useBlockNumber } from "wagmi";
import { useContractReads } from "@/hooks/useContractReads";
import { useMint } from "@/hooks/useMint";
import { formatEther } from "viem";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { INVISIBLE_LAW_ADDRESS } from "@/abi/InvisibleLaw";

export default function BrandDashboard() {
  const [activeTab, setActiveTab] = useState<"ai" | "onchain">("ai");
  const { address, isConnected, connector, chain } = useAccount();
  const { data: blockNumber } = useBlockNumber({ watch: true });
  
  const { 
    mintPrice, 
    totalMinted, 
    maxSupply, 
    canMint,
    isOwner,
    userMinted,
    remaining,
    maxPerWallet,
    isLoading: isContractLoading,
  } = useContractReads();

  const { mint, isPending, isConfirming, isSuccess, error, txHash, receipt } = useMint();
  const consoleLogsRef = useRef<HTMLDivElement>(null);

  // States for simulated onchain panel (when wallet is not connected)
  const [simLog, setSimLog] = useState<string[]>([
    "RPC status: Connected to Base mainnet",
    "Wallet status: DISCONNECTED",
    "Ready to execute simulation..."
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
    setSimLog([
      "RPC status: Connected to Base mainnet",
      "Wallet status: DISCONNECTED (SIMULATED)",
      ">> Simulating contract write to InvisibleLaw...",
      ">> Gas estimated: 38,243 units",
      ">> Awaiting simulated signature approval..."
    ]);
    
    setTimeout(() => {
      setSimLog(prev => [...prev, ">> Simulated signature approved."]);
      
      setTimeout(() => {
        const mockHash = "0x" + Array.from({length:64}, () => Math.floor(Math.random()*16).toString(16)).join("");
        setSimCount(prev => prev + 1);
        setSimLog(prev => [
          ...prev, 
          `>> Simulated Tx Hash: ${mockHash.slice(0, 10)}...${mockHash.slice(-8)}`,
          `>> Success: [SIMULATION] Invisible Law #${100 + simCount} minted.`,
          `>> Gas used: 52,109 units`
        ]);
        setIsSimulating(false);
 
        // Trigger visualizer
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("generate-trigger"));
        }
      }, 800);
    }, 800);
  };

  const handleRealMint = () => {
    if (isPending || isConfirming || (!isOwner && !canMint)) return;
    mint(1, mintPrice, isOwner);
  };

  // Dynamically compute transaction logs based on contract state to avoid setState-in-effect issues
  const activeTxLog: string[] = [];

  // 1. Connection & RPC details
  if (chain) {
    activeTxLog.push(`RPC status: Connected to ${chain.name} (Chain ID: ${chain.id})`);
  } else {
    activeTxLog.push("RPC status: Connected to Base mainnet");
  }

  if (blockNumber) {
    activeTxLog.push(`Current block: #${blockNumber.toString()}`);
  }

  if (connector && address) {
    const shortenedAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
    activeTxLog.push(`Wallet status: Connected via ${connector.name} (${shortenedAddr})`);
  } else {
    activeTxLog.push("Wallet status: Connected");
  }

  // 2. Contract parameters
  activeTxLog.push(`Contract address: ${INVISIBLE_LAW_ADDRESS}`);
  if (!isContractLoading) {
    activeTxLog.push(`Contract status: ${canMint ? "ACTIVE" : "INACTIVE"} | Total Minted: ${totalMinted} / ${maxSupply}`);
    activeTxLog.push(`User Balance: ${userMinted} PHI | Unit Price: ${formatEther(mintPrice)} ETH`);
  }

  // 3. Mint transaction logs
  if (isPending) {
    activeTxLog.push(">> [1/3] Signature requested: Please confirm the transaction in your wallet...");
  }

  if (txHash) {
    activeTxLog.push(`>> [2/3] Broadcasted. Tx Hash: ${txHash}`);
    if (isConfirming) {
      activeTxLog.push(">> [3/3] Confirming transaction on Base L2... waiting for inclusion...");
    }
  }

  if (isSuccess) {
    activeTxLog.push(">> [3/3] Confirmed!");
    if (receipt) {
      activeTxLog.push(`>> Success: Invisible Law minted in block #${receipt.blockNumber.toString()}!`);
      activeTxLog.push(`>> Gas used: ${receipt.gasUsed?.toString() || "unknown"} units`);
    } else {
      activeTxLog.push(">> Success: Invisible Law minted successfully on Base L2!");
    }
  }

  if (error) {
    let errorMsg = error.message;
    if (errorMsg.includes("User rejected the request") || errorMsg.includes("User denied transaction signature")) {
      errorMsg = "User rejected transaction signature.";
    } else if (errorMsg.length > 80) {
      errorMsg = errorMsg.slice(0, 80) + "...";
    }
    activeTxLog.push(`>> [ERROR] Transaction failed: ${errorMsg}`);
  }

  const logsToRender = isConnected ? activeTxLog : simLog;

  // Auto-scroll the RPC Console Logs to the bottom when new logs are added
  useEffect(() => {
    if (consoleLogsRef.current) {
      consoleLogsRef.current.scrollTop = consoleLogsRef.current.scrollHeight;
    }
  }, [logsToRender, activeTab]);

  // Dynamic button states
  let buttonText = "MINT ARTWORK";
  let buttonDisabled = isPending || isConfirming;
  
  if (isOwner) {
    buttonText = isPending || isConfirming ? "MINTING..." : "MINT (OWNER)";
  } else if (!isContractLoading) {
    if (remaining <= 0) {
      buttonText = "SOLD OUT";
      buttonDisabled = true;
    } else if (!canMint) {
      buttonText = "MINT INACTIVE";
      buttonDisabled = true;
    } else if (userMinted >= maxPerWallet) {
      buttonText = "MAX PER WALLET";
      buttonDisabled = true;
    } else if (isPending || isConfirming) {
      buttonText = "MINTING...";
    }
  }

  // Button background & text color
  let buttonBgColor = "var(--color-accent-yellow)";
  let buttonTextColor = "var(--color-terminal-bg)";
  if (buttonDisabled) {
    if (isPending || isConfirming) {
      buttonBgColor = "#244e56";
      buttonTextColor = "var(--color-accent-mint)";
    } else {
      buttonBgColor = "var(--color-terminal-inner)";
      buttonTextColor = "var(--color-text-slate)";
    }
  }

  return (
    <div className="w-full border border-border-line bg-terminal-bg rounded-lg flex flex-col overflow-hidden h-[300px] md:h-[320px]">
      {/* Tabs Header */}
      <div className="flex border-b border-border-line select-none bg-terminal-inner/40">
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 border-r border-border-line transition-colors cursor-pointer ${
            activeTab === "ai"
              ? "bg-accent-blue/10 text-accent-blue"
              : "text-text-slate hover:text-text-primary hover:bg-terminal-inner/20"
          }`}
        >
          <Brain size={12} />
          <span>01_CONTEXT</span>
        </button>
        <button
          onClick={() => setActiveTab("onchain")}
          className={`flex-1 py-3 text-center text-xs font-mono font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer ${
            activeTab === "onchain"
              ? "bg-accent-yellow/10 text-accent-yellow"
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
            <div className="bg-terminal-bg/60 border border-border-line rounded p-3 font-mono text-[10px] text-text-slate space-y-1">
              <div className="text-accent-blue">I don&apos;t use multi-agent orchestration.</div>
              <div className="text-accent-blue">Plain folders, numbered stages, markdown prompts.</div>
              <div className="text-accent-blue">One agent reads the right file at the right moment.</div>
              <div className="text-accent-blue">That&apos;s the whole system.</div>
              <div className="text-text-slate/60">
                <a
                  href="https://arxiv.org/html/2603.16021v2"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent-blue transition-colors"
                >
                  // interpretable context methodology
                </a>
              </div>
            </div>
            
            {/* Visual Node Graph Grid */}
            <div className="grid grid-cols-3 gap-2 py-1 font-mono text-[10px] text-center select-none">
              <div className="border border-accent-blue/30 rounded p-2 bg-accent-blue/5 hover:border-accent-blue/70 transition-colors cursor-help">
                <div className="font-semibold text-accent-blue text-[9px] sm:text-[10px]">CLAUDE.md</div>
                <div className="text-[7.5px] text-text-slate mt-0.5">ROUTING RULES</div>
              </div>
              <div className="border border-accent-mint/30 rounded p-2 bg-accent-mint/5 hover:border-accent-mint/70 transition-colors cursor-help">
                <div className="font-semibold text-accent-mint text-[9px] sm:text-[10px]">CONTEXT.md</div>
                <div className="text-[7.5px] text-text-slate mt-0.5">WORKSPACE RULES</div>
              </div>
              <div className="border border-accent-yellow/30 rounded p-2 bg-accent-yellow/5 hover:border-accent-yellow/70 transition-colors cursor-help">
                <div className="font-semibold text-accent-yellow text-[9px] sm:text-[10px]">FILESYSTEM</div>
                <div className="text-[7.5px] text-text-slate mt-0.5">WORKFLOW STAGES</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Onchain Smart Contract */}
        {activeTab === "onchain" && (
          <div className="flex flex-col h-full justify-between space-y-3">
            {/* RPC Console Logs */}
            <div 
              ref={consoleLogsRef}
              className="flex-1 bg-terminal-bg/60 border border-border-line rounded p-3 font-mono text-[10px] text-text-slate space-y-1 overflow-y-auto max-h-[140px]"
            >
              {logsToRender.map((log, index) => (
                <div key={index} className={
                  log.includes("Success:") || log.includes("Confirmed!")
                    ? "text-accent-mint font-semibold" 
                    : log.includes("Error:") || log.includes("[ERROR]")
                    ? "text-red-400 font-semibold" 
                    : log.includes("Connected to") || log.includes("Wallet status:") || log.includes("RPC status:")
                    ? "text-accent-blue"
                    : log.includes(">>")
                    ? "text-accent-yellow"
                    : ""
                }>
                  {log}
                </div>
              ))}
            </div>

            {/* Actions Grid */}
            <div className="flex items-center justify-between border-t border-border-line/40 pt-3 font-mono">
              <div className="text-[10px] text-text-slate">
                {isConnected && (
                  <>
                    {isOwner ? (
                      <div className="text-accent-mint font-bold mt-0.5">[OWNER CONNECTED]</div>
                    ) : !canMint ? (
                      <div className="text-accent-yellow font-semibold mt-0.5">[PUBLIC INACTIVE]</div>
                    ) : null}
                  </>
                )}
              </div>
              
              <div className="flex flex-col items-end justify-center">
                {isConnected ? (
                  <button
                    onClick={handleRealMint}
                    disabled={buttonDisabled}
                    className={`btn-primary flex items-center space-x-1 hover:brightness-110 transition-all text-xs font-semibold px-3 py-1.5 rounded select-none border-none ${
                      buttonDisabled ? "cursor-not-allowed opacity-75" : "cursor-pointer active:scale-95"
                    }`}
                    style={{
                      background: buttonBgColor,
                      color: buttonTextColor
                    }}
                  >
                    {isPending || isConfirming ? (
                      <>
                        <RefreshCw size={11} className="animate-spin" />
                        <span>{buttonText}</span>
                      </>
                    ) : (
                      <>
                        <Send size={11} />
                        <span>{buttonText}</span>
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
