"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { AlertTriangle, Command, Send } from "lucide-react";
import { gsap } from "@/lib/motion";
import { useGSAP } from "@gsap/react";
import MoodBadge from "./terminal/MoodBadge";
import OxNull from "./OxNull";
import { resolveCommand } from "./terminal/commands";
import { sliceAt } from "./terminal/engine";
import { DEMO_SCRIPT } from "./terminal/script";
import { MOOD_CONFIG } from "./terminal/types";
import type { LogEntry, MoodState } from "./terminal/types";

gsap.registerPlugin(useGSAP);

export interface AgentTerminalProps {
  /** "scripted": render a deterministic slice of the demo session driven by scriptProgress (0..1). */
  mode?: "interactive" | "scripted";
  scriptProgress?: number;
  /** called when the user clicks the terminal during the scripted demo */
  onRequestSkip?: () => void;
}

const THEMES: Record<MoodState, Record<string, string>> = {
  thinking: {
    "--color-brand-bg":       "#011627",
    "--color-terminal-bg":    "#011627",
    "--color-terminal-inner": "#070d19",
    "--color-text-primary":   "#d8dee9",
    "--color-text-slate":     "#5f7d97",
    "--color-accent-blue":    "#6e9cf1",
    "--color-border-line":    "rgba(192,199,209,0.12)",
  },
  shipping: {
    "--color-brand-bg":       "#011a08",
    "--color-terminal-bg":    "#011a08",
    "--color-terminal-inner": "#030f05",
    "--color-text-primary":   "#d4ead8",
    "--color-text-slate":     "#4a7a58",
    "--color-accent-blue":    "#aae87b",
    "--color-border-line":    "rgba(170,232,123,0.12)",
  },
  broke: {
    "--color-brand-bg":       "#1a0608",
    "--color-terminal-bg":    "#1a0608",
    "--color-terminal-inner": "#110405",
    "--color-text-primary":   "#ead8d9",
    "--color-text-slate":     "#7a4a50",
    "--color-accent-blue":    "#f87171",
    "--color-border-line":    "rgba(248,113,113,0.12)",
  },
  flow: {
    "--color-brand-bg":       "#010f1a",
    "--color-terminal-bg":    "#010f1a",
    "--color-terminal-inner": "#050c15",
    "--color-text-primary":   "#d8eaed",
    "--color-text-slate":     "#3d7080",
    "--color-accent-blue":    "#60d0ff",
    "--color-border-line":    "rgba(96,208,255,0.12)",
  },
};

const THEME_DOTS: { id: MoodState; color: string }[] = [
  { id: "thinking", color: "#6e9cf1" },
  { id: "shipping", color: "#aae87b" },
  { id: "broke",    color: "#f87171" },
  { id: "flow",     color: "#60d0ff" },
];

export default function AgentTerminal({
  mode = "interactive",
  scriptProgress = 0,
  onRequestSkip,
}: AgentTerminalProps = {}) {
  const scripted = mode === "scripted";
  const [inputVal, setInputVal] = useState("");
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [currentResponseStream, setCurrentResponseStream] = useState("");

  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [currentMood, setCurrentMood] = useState<MoodState>("shipping");
  const [isStreamingHTML, setIsStreamingHTML] = useState(true);

  const [themeMood, setThemeMood] = useState<MoodState>("thinking");

  const terminalRef = useRef<HTMLDivElement>(null);
  const logsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const mascotRef = useRef<HTMLDivElement>(null);

  // Restore theme from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("0xnull-theme") as MoodState | null;
      if (saved && Object.keys(THEMES).includes(saved)) {
        setThemeMood(saved);
        document.documentElement.dataset.theme = saved;
      }
    } catch {}
  }, []);

  const selectMood = (id: MoodState) => {
    setThemeMood(id);
    document.documentElement.dataset.theme = id;
    try { localStorage.setItem("0xnull-theme", id); } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      Object.entries(THEMES[id]).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
    } else {
      gsap.to(document.documentElement, {
        ...THEMES[id],
        duration: 0.55,
        ease: "power3.inOut",
      });
    }
  };

  // Scripted demo: rendering is a pure function of scroll progress
  const slice = useMemo(
    () => (scripted ? sliceAt(DEMO_SCRIPT, scriptProgress) : null),
    [scripted, scriptProgress]
  );
  const displayLogs = slice ? slice.logs : logs;
  const scriptTyping = slice?.typingCommand ?? null;
  const scriptStreaming = slice?.streaming ?? null;
  const busy = scripted ? scriptTyping !== null || scriptStreaming !== null : isTyping;
  const mascotMood = scripted ? slice!.mood : currentMood;

  // Terminal entrance animation — fires when the terminal scrolls into view
  useGSAP(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.from(terminalRef.current, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      ease: "power3.out",
      scrollTrigger: {
        trigger: terminalRef.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
    });
  }, { scope: terminalRef });

  // Mascot talking animation — bounces while streaming
  useGSAP(() => {
    if (!mascotRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (busy) {
      gsap.to(mascotRef.current, {
        y: -4,
        yoyo: true,
        repeat: -1,
        duration: 0.25,
        ease: "power2.inOut",
      });
    } else {
      gsap.killTweensOf(mascotRef.current);
      gsap.to(mascotRef.current, { y: 0, duration: 0.15, ease: "power2.out" });
    }
  }, { scope: terminalRef, dependencies: [busy] });

  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs, currentResponseStream, scriptProgress]);

  const handleConsoleClick = () => {
    if (scripted) {
      onRequestSkip?.();
      return;
    }
    if (inputRef.current) inputRef.current.focus();
  };

  const streamText = async (text: string, isHTML: boolean = false) => {
    setIsTyping(true);
    setCurrentResponseStream("");

    let currentIdx = 0;
    const intervalTime = 6;

    return new Promise<void>((resolve) => {
      const timer = setInterval(() => {
        if (currentIdx < text.length) {
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
    if (inputVal.trim() && !isTyping) executeCommand(inputVal);
  };

  const handleSuggestionClick = (cmd: string) => {
    if (!isTyping) executeCommand(cmd);
  };

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
      {/* Title Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-terminal-bg border-b border-border-line select-none">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/40" />
        </div>
        <div className="text-xs font-mono font-bold text-accent-blue tracking-wide">
          [ 0xdas.dev ]
        </div>
        <div className="text-xs font-mono text-text-slate/60">0xNull</div>
      </div>

      {/* Mascot Bar — RPG portrait + mood label + theme dots */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-terminal-inner border-b border-border-line select-none">
        <div className="flex items-center gap-3">
          <div ref={mascotRef}>
            <OxNull mood={mascotMood} size={40} />
          </div>
          <span className={`font-mono text-[10px] ${busy ? MOOD_CONFIG[mascotMood].colorClass : MOOD_CONFIG[themeMood].colorClass}`}>
            {busy ? "// responding..." : scripted ? "// demo session" : `// ${MOOD_CONFIG[themeMood].label}`}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {THEME_DOTS.map(({ id, color }) => (
            <button
              key={id}
              onClick={(e) => { e.stopPropagation(); selectMood(id); }}
              title={id}
              className="w-2.5 h-2.5 rounded-full transition-all duration-150 hover:scale-125 cursor-pointer"
              style={{
                backgroundColor: color,
                opacity: themeMood === id ? 1 : 0.3,
                boxShadow: themeMood === id ? `0 0 6px ${color}` : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* Log Console */}
      <div
        ref={logsContainerRef}
        className="flex-1 p-5 overflow-y-auto font-mono bg-terminal-inner text-text-primary space-y-4 cursor-text"
      >
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

        <div className="space-y-4 pt-2">
          {displayLogs.map((log, idx) => (
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

          {/* Scripted demo: command being typed at the prompt */}
          {scriptTyping !== null && (
            <div className="flex items-start space-x-2">
              <span className="text-accent-green font-bold">0xNull@0xdas</span>
              <span className="text-text-slate">~</span>
              <span className="text-accent-blue font-bold">%</span>
              <span className="text-text-primary font-semibold">
                {scriptTyping}
                <span className="inline-block w-2.5 h-4 bg-accent-blue animate-cursor ml-0.5 align-middle" />
              </span>
            </div>
          )}

          {/* Scripted demo: response streaming out */}
          {scriptStreaming && (
            <div className="space-y-1.5">
              <div className="flex items-start space-x-2">
                <span className="text-accent-green font-bold">0xNull@0xdas</span>
                <span className="text-text-slate">~</span>
                <span className="text-accent-blue font-bold">%</span>
                <span className="text-text-primary font-semibold">{scriptStreaming.command}</span>
              </div>
              <div className="pl-4 border-l border-border-line/45">
                <div className="mb-1">
                  <MoodBadge mood={scriptStreaming.mood} />
                </div>
                {scriptStreaming.isHTML ? (
                  <div dangerouslySetInnerHTML={{ __html: scriptStreaming.partial }} />
                ) : (
                  <div className="whitespace-pre-wrap text-text-slate leading-relaxed">{scriptStreaming.partial}</div>
                )}
                <span className="inline-block w-2.5 h-4 bg-accent-mint animate-cursor ml-1" />
              </div>
            </div>
          )}

          {!scripted && isTyping && (
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
                <span className="inline-block w-2.5 h-4 bg-accent-mint animate-cursor ml-1" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Commands */}
      <div className="px-4 py-2.5 bg-terminal-bg border-t border-border-line flex flex-wrap gap-2 items-center select-none">
        <span className="text-[11px] font-mono text-text-slate mr-1 flex items-center gap-1">
          <Command size={10} />
          $ try &gt;
        </span>
        <button
          onClick={() => handleSuggestionClick("/stack")}
          disabled={isTyping || scripted}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-blue bg-terminal-inner/40 hover:bg-accent-blue/10 hover:border-accent-blue/40 transition-colors disabled:opacity-40"
        >
          [ /stack ]
        </button>
        <button
          onClick={() => handleSuggestionClick("/projects")}
          disabled={isTyping || scripted}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-yellow bg-terminal-inner/40 hover:bg-accent-yellow/10 hover:border-accent-yellow/40 transition-colors disabled:opacity-40"
        >
          [ /projects ]
        </button>
        <button
          onClick={() => handleSuggestionClick("/archives")}
          disabled={isTyping || scripted}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-purple bg-terminal-inner/40 hover:bg-accent-purple/10 hover:border-accent-purple/40 transition-colors disabled:opacity-40"
        >
          [ /archives ]
        </button>
        <button
          onClick={() => handleSuggestionClick("/help")}
          disabled={isTyping || scripted}
          className="px-2 py-0.5 rounded text-xs font-mono border border-border-line text-accent-purple bg-terminal-inner/40 hover:bg-accent-purple/10 hover:border-accent-purple/40 transition-colors disabled:opacity-40"
        >
          [ /help ]
        </button>
      </div>

      {/* Input */}
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
          readOnly={scripted}
          tabIndex={scripted ? -1 : 0}
          placeholder={
            scripted
              ? "// demo session — scroll, or click to skip"
              : isTyping
              ? "agent is responding..."
              : "ask 0xNull a question..."
          }
          className="flex-1 bg-transparent border-none outline-none font-mono text-sm ml-2.5 text-text-primary placeholder-text-slate/60 disabled:cursor-not-allowed"
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
