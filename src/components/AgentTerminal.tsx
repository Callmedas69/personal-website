"use client";

import React, { useState, useRef, useEffect } from "react";
import { AlertTriangle, Cpu, Command, Send } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import MoodBadge from "./terminal/MoodBadge";
import { resolveCommand } from "./terminal/commands";
import type { LogEntry, MoodState } from "./terminal/types";

gsap.registerPlugin(useGSAP);

export default function AgentTerminal() {
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponseStream, setCurrentResponseStream] = useState("");
  
  // Command History States
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [currentMood, setCurrentMood] = useState<MoodState>("shipping");
  const [isStreamingHTML, setIsStreamingHTML] = useState(true);
  
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
    if (isTyping) return;

    const trimmed = cmd.trim();
    if (!trimmed) return;

    const result = resolveCommand(trimmed);
    if (!result) return;

    if (result.clear) {
      setLogs([]);
      setInputVal("");
      setHistoryIdx(-1);
      return;
    }

    setHistory(prev => [cmd, ...prev]);
    setHistoryIdx(-1);

    setLogs(prev => [...prev, { command: cmd, response: "" }]);
    setInputVal("");

    setCurrentMood(result.mood);
    setIsStreamingHTML(result.isHTML);
    await streamText(result.response, result.isHTML);

    setLogs(prev => {
      const updated = [...prev];
      const target = updated.length - 1;
      if (updated[target]?.command === cmd) {
        updated[target] = {
          command: cmd,
          response: result.response,
          isHTML: result.isHTML,
          mood: result.mood,
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
          <span className="hidden sm:inline">0xNull</span>
        </div>
      </div>

      {/* Terminal Screen Info Bar */}
      <div className="px-4 py-1.5 bg-terminal-inner/30 border-b border-border-line text-[11px] font-mono text-text-slate flex justify-between select-none">
        <div>
          <span className="hidden sm:inline">0xNull · </span>
        </div>
        <div>v1.1.0</div>
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
          </div>
          <div className="text-text-slate leading-relaxed max-w-xl text-[13px] space-y-0.5">
            <div>the ideas never stopped. the button was just hard.</div>
            <div>the thinking is free. the agent is live.</div>
            <div className="text-text-slate/50">// you&apos;re talking to 0xNull.</div>
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
                  <span className="text-accent-green font-bold">0xNull@0xdas</span>
                  <span className="text-text-slate">~</span>
                  <span className="text-accent-blue font-bold">%</span>
                  <span className="text-text-primary font-semibold">{log.command}</span>
                </div>
              )}
              {log.response && (
                <div className="pl-4 border-l border-border-line/45">
                  {log.mood && (
                    <div className="mb-1">
                      <MoodBadge mood={log.mood} />
                    </div>
                  )}
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
                <div className="mb-1">
                  <MoodBadge mood={currentMood} />
                </div>
                {isStreamingHTML ? (
                  <div dangerouslySetInnerHTML={{ __html: currentResponseStream }} />
                ) : (
                  <div className="whitespace-pre-wrap text-text-slate leading-relaxed">{currentResponseStream}</div>
                )}
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
          onClick={() => handleSuggestionClick("/archives")}
          disabled={isTyping}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-purple bg-terminal-inner/40 hover:bg-accent-purple/10 hover:border-accent-purple/40 transition-colors disabled:opacity-40"
        >
          [ /archives ]
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
        <div className="flex items-center space-x-1.5 text-xs font-mono">
          <span className="text-accent-green font-bold hidden sm:inline">0xNull@0xdas</span>
          <span className="text-text-slate hidden sm:inline">~</span>
          <span className="text-accent-blue font-bold">%</span>
        </div>
        <input 
          ref={inputRef}
          type="text" 
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value.slice(0, 200))}
          onKeyDown={handleKeyDown}
          disabled={isTyping}
          placeholder={isTyping ? "agent is responding..." : "ask 0xNull a question..."}
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
