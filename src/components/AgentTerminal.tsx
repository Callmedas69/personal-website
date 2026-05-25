"use client";

import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, Cpu, Command, Send } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

// Register useGSAP
gsap.registerPlugin(useGSAP);

interface LogEntry {
  command?: string;
  response: string;
  isHTML?: boolean;
}

export default function AgentTerminal() {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponseStream, setCurrentResponseStream] = useState("");
  
  // Command History States
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  
  const terminalRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Entrance animation for the terminal
  useGSAP(() => {
    gsap.from(terminalRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power3.out",
    });
  }, { scope: terminalRef });

  // Auto-scroll to bottom of logs when log entries change
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, currentResponseStream]);

  // Focus input on console click
  const handleConsoleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Helper to stream typing text in terminal
  const streamText = async (text: string, isHTML: boolean = false) => {
    setIsTyping(true);
    setCurrentResponseStream("");
    
    let currentIdx = 0;
    const intervalTime = 6; // Speed up streaming slightly
    
    return new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (currentIdx < text.length) {
          // If HTML, stream larger chunks to avoid broken tags during load
          if (isHTML && text[currentIdx] === "<") {
            const closingAngleIdx = text.indexOf(">", currentIdx);
            if (closingAngleIdx !== -1) {
              const htmlTag = text.substring(currentIdx, closingAngleIdx + 1);
              setCurrentResponseStream((prev) => prev + htmlTag);
              currentIdx = closingAngleIdx + 1;
              return;
            }
          }
          
          setCurrentResponseStream((prev) => prev + text[currentIdx]);
          currentIdx++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
          resolve();
        }
      }, intervalTime);
    });
  };

  // Command Router Engine
  const executeCommand = async (cmd: string) => {
    if (isTyping) return; // Block input while response is streaming
    
    const sanitizedCmd = cmd.trim().toLowerCase();
    let response = "";
    let isHTML = false;

    if (sanitizedCmd === "clear") {
      setLogs([]);
      setInputVal("");
      setHistoryIdx(-1);
      return;
    }

    if (sanitizedCmd === "") {
      return;
    }

    // Add to history
    setHistory(prev => [cmd, ...prev]);
    setHistoryIdx(-1);

    // Process commands
    switch (true) {
      case sanitizedCmd === "/help" || sanitizedCmd === "help":
        isHTML = true;
        response = `
<div class="space-y-2 font-mono text-text-slate">
  <div class="text-accent-yellow font-bold uppercase mb-1">=== COGNITIVE ENTRY POINTS ===</div>
  <div><span class="text-accent-mint font-semibold">/stack</span>     - View technical skill pillars (AI, Onchain, Creative)</div>
  <div><span class="text-accent-mint font-semibold">/projects</span>  - Inspect signature work (BasedMining, Wobbles, Vault)</div>
  <div><span class="text-accent-mint font-semibold">/wobble</span>    - Trigger jump animation on Wobble NFT</div>
  <div><span class="text-accent-mint font-semibold">/status</span>    - Verify current developer availability</div>
  <div><span class="text-accent-mint font-semibold">/socials</span>   - Get socials coordinate (Farcaster, X, GitHub)</div>
  <div><span class="text-accent-mint font-semibold">/clear</span>     - Clear console screen</div>
</div>`;
        break;

      case sanitizedCmd === "/stack" || sanitizedCmd === "stack" || sanitizedCmd.includes("stack") || sanitizedCmd.includes("skill"):
        isHTML = true;
        response = `
<div class="space-y-3 font-mono">
  <div>
    <span class="text-accent-blue font-bold">[ AI-NATIVE SYSTEMS ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>LLM Context Ops & prompt engineering (<span class="text-accent-yellow">CLAUDE.md</span> boundary logic)</li>
      <li>Obsidian Vault architecture for startup productivity</li>
      <li>Agentic workflows and automated developer briefings</li>
    </ul>
  </div>
  <div>
    <span class="text-accent-purple font-bold">[ ONCHAIN ENGINEERING ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>Fully onchain metadata & SVG contract renderers</li>
      <li>Smart contract development (Solidity on <span class="text-accent-blue font-semibold">Base</span>)</li>
      <li>Client integration via viem, wagmi, ethers</li>
    </ul>
  </div>
  <div>
    <span class="text-accent-mint font-bold">[ CREATIVE FRONTEND ]</span>
    <ul class="list-disc list-inside text-text-slate ml-2 mt-1 space-y-0.5">
      <li>React, Next.js (App Router), and TypeScript</li>
      <li>Complex UI animations using <span class="text-accent-yellow font-semibold">GSAP Timelines</span> & spring physics</li>
      <li>Utility-first styling with Tailwind CSS v4 design variables</li>
    </ul>
  </div>
</div>`;
        break;

      case sanitizedCmd === "/projects" || sanitizedCmd === "projects" || sanitizedCmd.includes("project") || sanitizedCmd.includes("work"):
        isHTML = true;
        response = `
<div class="space-y-3 font-mono text-text-slate">
  <div>
    <span class="text-accent-green font-bold">1. BASEDMINING</span> <span class="text-[10px] text-text-slate/60">(Active client work)</span>
    <div class="ml-2 mt-0.5 text-text-primary">Content automation & video rendering pipeline.</div>
    <div class="ml-2 text-[10px]">Stack: Remotion, Node.js, Farcaster client integrations.</div>
  </div>
  <div>
    <span class="text-accent-green font-bold">2. WOBBLES</span> <span class="text-[10px] text-text-slate/60">(Fully Onchain NFTs)</span>
    <div class="ml-2 mt-0.5 text-text-primary">Dynamic, interactive creatures responding to onchain events.</div>
    <div class="ml-2 text-[10px]">Stack: SVG Rendering, Solidity ERC-721, Base mainnet.</div>
  </div>
  <div>
    <span class="text-accent-green font-bold">3. COGNITIVE VAULT</span> <span class="text-[10px] text-text-slate/60">(Internal tools)</span>
    <div class="ml-2 mt-0.5 text-text-primary">AI context engineering layer managing Obsidian shared brain.</div>
    <div class="ml-2 text-[10px]">Stack: ContextOps routing, prompt mapping, daily hooks.</div>
  </div>
</div>`;
        break;

      case sanitizedCmd === "/wobble" || sanitizedCmd === "wobble":
        isHTML = true;
        response = `
<div class="space-y-1 font-mono text-accent-yellow">
  <div><span class="text-accent-mint font-bold">[SYSTEM]</span> Dispatched trigger signal to <span class="text-text-primary underline">wobble-trigger</span> event...</div>
  <div class="text-text-slate text-xs pl-4">> Animating Wobble SVG on Base L2...</div>
</div>`;
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("wobble-trigger"));
        }
        break;

      case sanitizedCmd === "/status" || sanitizedCmd === "status" || sanitizedCmd.includes("available") || sanitizedCmd.includes("availability"):
        isHTML = true;
        response = `
<div class="font-mono space-y-1 text-text-slate">
  <div><span class="text-text-primary">Status:</span> <span class="text-accent-mint font-semibold">Active</span> building autonomous agents on Base.</div>
  <div><span class="text-text-primary">Availability:</span> Open for high-leverage consulting or technical advisory roles at the intersection of AI + Onchain.</div>
  <div><span class="text-text-primary">Ecosystem:</span> Base / Ethereum L2s</div>
</div>`;
        break;

      case sanitizedCmd === "/socials" || sanitizedCmd === "socials" || sanitizedCmd.includes("social") || sanitizedCmd.includes("contact") || sanitizedCmd.includes("github") || sanitizedCmd.includes("twitter") || sanitizedCmd.includes("warpcast") || sanitizedCmd.includes("farcaster"):
        isHTML = true;
        response = `
<div class="font-mono space-y-2 text-text-slate">
  <div class="text-accent-blue font-bold uppercase mb-1">=== SOCIAL COORDINATES ===</div>
  <div>Farcaster: <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">warpcast.com/0xdas</a> <span class="text-xs text-text-slate/60">(4k followers)</span></div>
  <div>Twitter/X: <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">x.com/0xdas</a></div>
  <div>GitHub: <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" class="text-accent-mint hover:underline font-semibold">github.com/0xdas</a></div>
</div>`;
        break;

      default:
        response = `Command not found: "${cmd}". Type /help to see available coordinates.`;
        break;
    }

    // Set temporary state for user input log entry
    const newLogIndex = logs.length;
    setLogs((prev) => [...prev, { command: cmd, response: "" }]);
    setInputVal("");

    // Stream response
    await streamText(response, isHTML);

    // Save final response in output log state
    setLogs((prev) => {
      const updated = [...prev];
      if (updated[newLogIndex]) {
        updated[newLogIndex] = {
          command: cmd,
          response: response,
          isHTML: isHTML,
        };
      }
      return updated;
    });
    setCurrentResponseStream("");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputVal.trim() && !isTyping) {
      executeCommand(inputVal);
    }
  };

  const handleSuggestionClick = (cmd: string) => {
    if (!isTyping) {
      executeCommand(cmd);
    }
  };

  // Keyboard navigation for command history (Up/Down Arrow)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0 && historyIdx < history.length - 1) {
        const nextIdx = historyIdx + 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIdx > 0) {
        const nextIdx = historyIdx - 1;
        setHistoryIdx(nextIdx);
        setInputVal(history[nextIdx]);
      } else if (historyIdx === 0) {
        setHistoryIdx(-1);
        setInputVal("");
      }
    }
  };

  return (
    <div 
      ref={terminalRef}
      className="terminal-glow scanlines relative w-full h-[620px] rounded-lg border border-border-line bg-terminal-bg flex flex-col overflow-hidden text-sm"
      onClick={handleConsoleClick}
    >
      {/* Terminal Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-terminal-bg border-b border-border-line select-none">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40"></div>
        </div>
        <div className="text-xs font-mono font-bold text-accent-blue tracking-wide">
          -- 0xdas.dev --
        </div>
        <div className="flex items-center text-xs text-text-slate font-mono space-x-1">
          <Cpu size={12} className="text-accent-mint animate-pulse" />
          <span className="hidden sm:inline">talk-to-my-agent v1.1.0</span>
        </div>
      </div>

      {/* Terminal Screen Info Bar */}
      <div className="px-4 py-1.5 bg-terminal-inner/30 border-b border-border-line text-[11px] font-mono text-text-slate flex justify-between select-none">
        <div>talk-to-my-agent · v1.1.0 · base-mainnet</div>
        <div>UTC+7</div>
      </div>

      {/* Log Console Space */}
      <div 
        ref={logsContainerRef}
        className="flex-1 p-5 overflow-y-auto font-mono bg-terminal-inner text-text-primary space-y-4 cursor-text"
      >
        {/* Welcome Section */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-accent-blue text-xl font-bold">
            <span>welcome.</span>
            <span className="inline-block w-2.5 h-5 bg-accent-blue animate-cursor"></span>
          </div>
          <div className="text-text-slate leading-relaxed max-w-xl text-[13px]">
            trained on five years of onchain development, and the patient art of building autonomous agents that don&apos;t drain their wallets six blocks later.
          </div>
          <div className="flex items-center space-x-1.5 text-xs text-text-slate bg-terminal-bg/40 border border-border-line rounded px-3 py-1.5 w-fit">
            <AlertTriangle size={12} className="text-accent-yellow" />
            <span>this feature uses AI. responses may be inaccurate — always verify.</span>
          </div>
        </div>

        {/* Console Command Logs */}
        <div className="space-y-4 pt-2">
          {logs.map((log, idx) => (
            <div key={idx} className="space-y-1.5">
              {log.command && (
                <div className="flex items-start space-x-2">
                  <span className="text-accent-green font-bold">client@0xdas</span>
                  <span className="text-text-slate">~</span>
                  <span className="text-accent-blue font-bold">%</span>
                  <span className="text-text-primary font-semibold">{log.command}</span>
                </div>
              )}
              {log.response && (
                <div className="pl-4 border-l border-border-line/45">
                  {log.isHTML ? (
                    <div dangerouslySetInnerHTML={{ __html: log.response }} />
                  ) : (
                    <div className="whitespace-pre-wrap text-text-slate leading-relaxed">{log.response}</div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Currently Streaming Response */}
          {isTyping && (
            <div className="space-y-1.5">
              <div className="pl-4 border-l border-border-line/45">
                <div dangerouslySetInnerHTML={{ __html: currentResponseStream }} />
                <span className="inline-block w-2.5 h-4 bg-accent-mint animate-cursor ml-1"></span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggested Quick Commands */}
      <div className="px-4 py-2.5 bg-terminal-bg border-t border-border-line flex flex-wrap gap-2 items-center select-none">
        <span className="text-[11px] font-mono text-text-slate mr-1 flex items-center gap-1">
          <Command size={10} />
          $ try &gt;
        </span>
        <button 
          onClick={() => handleSuggestionClick("/stack")}
          disabled={isTyping}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-blue bg-terminal-inner/40 hover:bg-accent-blue/10 hover:border-accent-blue/40 transition-colors disabled:opacity-40"
        >
          [ /stack ]
        </button>
        <button 
          onClick={() => handleSuggestionClick("/projects")}
          disabled={isTyping}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-yellow bg-terminal-inner/40 hover:bg-accent-yellow/10 hover:border-accent-yellow/40 transition-colors disabled:opacity-40"
        >
          [ /projects ]
        </button>
        <button 
          onClick={() => handleSuggestionClick("/wobble")}
          disabled={isTyping}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-mint bg-terminal-inner/40 hover:bg-accent-mint/10 hover:border-accent-mint/40 transition-colors disabled:opacity-40"
        >
          [ /wobble ]
        </button>
        <button 
          onClick={() => handleSuggestionClick("/help")}
          disabled={isTyping}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-purple bg-terminal-inner/40 hover:bg-accent-purple/10 hover:border-accent-purple/40 transition-colors disabled:opacity-40"
        >
          [ /help ]
        </button>
      </div>

      {/* Console Input Footer Prompt */}
      <form 
        onSubmit={handleFormSubmit}
        className="flex items-center px-4 py-3 bg-terminal-inner border-t border-border-line select-none"
      >
        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-accent-green font-bold">client@0xdas</span>
          <span className="text-text-slate">~</span>
          <span className="text-accent-blue font-bold">%</span>
        </div>
        <input 
          ref={inputRef}
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value.slice(0, 200))}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder={isTyping ? "agent is responding..." : "ask your agent a question..."}
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm ml-2.5 text-text-primary placeholder-text-slate/60 disabled:cursor-not-allowed"
          autoFocus
        />
        <div className="flex items-center space-x-3 text-xs font-mono text-text-slate">
          <span className="hidden sm:inline-block text-[10px] text-text-slate/65 border border-border-line px-1 rounded bg-terminal-bg/50">
            ↑↓ for history
          </span>
          <span className="w-12 text-right text-[11px]">
            {inputVal.length}/200
          </span>
          <button 
            type="submit" 
            disabled={!inputVal.trim() || isTyping}
            className="text-text-slate hover:text-accent-mint transition-colors disabled:opacity-45 disabled:hover:text-text-slate cursor-pointer"
          >
            <Send size={14} />
          </button>
        </div>
      </form>
    </div>
  );
}
