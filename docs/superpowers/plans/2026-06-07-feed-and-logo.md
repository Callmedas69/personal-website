# Brand Logo Integration and Paragraph Feed Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate the official 0xdas brand symbol logo with blinking cursor animation into the website header and create a Stripe-inspired interactive `/feed` page displaying Paragraph.xyz publications and mock developer updates with full sidebar filtering.

**Architecture:** 
1. Re-host the SVG logo as a customizable inline React component `Logo.tsx` with dynamic classes.
2. Refactor header logic into a shared component `Header.tsx` including a link to the `/feed` page.
3. Fetch Paragraph articles dynamically from the public API and blend them with mock entries to form an interactive feed of 20 items.
4. Build a state-driven sidebar filter panel (Type/Topic) and an accordion-style table grid with micro-animations.

**Tech Stack:** Next.js 16 (React 19), Tailwind CSS v4, Lucide React, Paragraph public API.

---

### Task 1: Reusable Logo Component

**Files:**
- Create: `src/components/Logo.tsx`

- [ ] **Step 1: Create the custom Logo component**
  Write the brand symbol SVG inline in `src/components/Logo.tsx` allowing custom color control via standard Tailwind CSS classes.

  ```tsx
  import React from "react";

  interface LogoProps {
    className?: string;
    showText?: boolean;
  }

  export default function Logo({ className = "w-6 h-6", showText = false }: LogoProps) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        className={`${className} fill-current`}
      >
        <title>0xDas brand symbol</title>
        <style>{`
          @keyframes blink { 0%,49%{opacity:1} 50%,100%{opacity:0} }
          .cur { animation: blink 1.1s step-end infinite; }
        `}</style>
        <rect width="800" height="800" fill="none"/>
        <text
          x="60" y="500"
          fontFamily="'Courier New', Courier, monospace"
          fontSize="340"
          fontWeight="700"
          letterSpacing="-10"
        >0x</text>
        <rect className="cur" x="598" y="168" width="148" height="332" rx="6" />
        {showText && (
          <>
            <text
              x="60" y="590"
              fontFamily="'Courier New', Courier, monospace"
              fontSize="32"
              fontWeight="400"
              opacity="0.55"
              letterSpacing="1"
            >// no funnel. just output.</text>
            <text
              x="60" y="638"
              fontFamily="'Courier New', Courier, monospace"
              fontSize="26"
              fontWeight="400"
              opacity="0.35"
              letterSpacing="2"
            >cognitive. solo. shipping.</text>
          </>
        )}
      </svg>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/components/Logo.tsx
  git commit -m "feat: add inline Logo component with blinking cursor animation"
  ```

---

### Task 2: Shared Header Component

**Files:**
- Create: `src/components/Header.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Extract header logic into a shared component**
  Create `src/components/Header.tsx`. Replace `0xdas.dev` text with the `Logo` + text container. Add a `/feed` navigation link.

  ```tsx
  "use client";

  import React from "react";
  import Link from "next/link";
  import HeaderConnectButton from "./HeaderConnectButton";
  import Logo from "./Logo";

  export default function Header() {
    return (
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl w-full mx-auto select-none border-b border-border-line/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer group">
            <Logo className="w-6 h-6 text-accent-blue group-hover:text-accent-mint transition-colors" />
            <span className="font-mono text-sm tracking-widest font-bold text-white group-hover:text-accent-mint transition-colors">
              0xdas.dev
            </span>
          </Link>
          <span className="text-text-slate/40 text-xs">|</span>
          <div className="flex items-center space-x-1 bg-terminal-inner/60 border border-border-line/60 rounded px-1.5 sm:px-2 py-0.5 text-[9px] font-mono text-accent-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
            <span className="hidden sm:inline">BASE_MAINNET : ONLINE</span>
            <span className="sm:hidden">ONLINE</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-text-slate font-mono">
          <Link href="/feed" className="hover:text-accent-yellow transition-colors">
            feed
          </Link>
          <span className="text-text-slate/40">·</span>
          <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-mint transition-colors">farcaster</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-blue transition-colors">twitter</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-purple transition-colors">github</a>
          <span className="hidden sm:inline text-text-slate/40 text-xs">|</span>
          <HeaderConnectButton />
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 2: Replace page header with the shared Header component**
  Modify `src/app/page.tsx` to import and use the new `<Header />` component.

  ```diff
  -import HeaderConnectButton from "@/components/HeaderConnectButton";
  +import Header from "@/components/Header";
  
   export default function Home() {
     return (
       <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
         
         {/* Background radial grid effect */}
         <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0"></div>
         
         {/* Page Header */}
  -      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl w-full mx-auto select-none border-b border-border-line/40">
  -        <div className="flex items-center space-x-2 sm:space-x-3">
  -          <div className="font-mono text-sm tracking-widest font-bold text-accent-blue hover:text-accent-mint transition-colors cursor-pointer">
  -            0xdas.dev
  -          </div>
  -          <span className="text-text-slate/40 text-xs">|</span>
  -          <div className="flex items-center space-x-1 bg-terminal-inner/60 border border-border-line/60 rounded px-1.5 sm:px-2 py-0.5 text-[9px] font-mono text-accent-mint">
  -            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
  -            <span className="hidden sm:inline">BASE_MAINNET : ONLINE</span>
  -            <span className="sm:hidden">ONLINE</span>
  -          </div>
  -        </div>
  -        <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-text-slate font-mono">
  -          <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-mint transition-colors">farcaster</a>
  -          <span className="hidden sm:inline">·</span>
  -          <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-blue transition-colors">twitter</a>
  -          <span className="hidden sm:inline">·</span>
  -          <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-purple transition-colors">github</a>
  -          <span className="hidden sm:inline text-text-slate/40 text-xs">|</span>
  -          <HeaderConnectButton />
  -        </div>
  -      </header>
  +      <Header />
  ```

- [ ] **Step 3: Verify dev compilation and header rendering**
  Request: `Invoke-WebRequest -UseBasicParsing http://localhost:3001`
  Expected: Status 200 OK. Verify header displays Logo.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/Header.tsx src/app/page.tsx
  git commit -m "feat: refactor and integrate shared Header component with brand Logo"
  ```

---

### Task 3: Interactive Feed Page Implementation

**Files:**
- Create: `src/app/feed/page.tsx`

- [ ] **Step 1: Create the `/feed` page layout and data fetching logic**
  Implement `src/app/feed/page.tsx` with dynamic fetch from Paragraph API + mock article list to fill 20 items. Set up filter accordions and checkbox filters.

  ```tsx
  "use client";

  import React, { useState, useEffect } from "react";
  import Link from "next/link";
  import { ChevronDown, Plus, Minus, Search, ExternalLink } from "lucide-react";
  import Header from "@/components/Header";

  interface FeedItem {
    id: string;
    title: string;
    subtitle: string;
    date: string; // YYYY.MM.DD
    type: "BLOG" | "VIDEO" | "EVENT";
    topics: string[];
    url: string;
    excerpt?: string;
  }

  // Pre-compiled mock entries to enrich the feed page and fit the Stripe design
  const initialMockItems: FeedItem[] = [
    {
      id: "mock-1",
      title: "Building autonomous coding agents on Base L2",
      subtitle: "How to ship production-ready dApps without paying massive gas fees.",
      date: "2026.06.01",
      type: "BLOG",
      topics: ["AI", "Crypto", "Engineering"],
      url: "https://x.com/0xdas",
      excerpt: "An in-depth look at deploying AI-directed agents that interact with Base smart contracts and manage liquidity parameters autonomously using the Viem framework."
    },
    {
      id: "mock-2",
      title: "ICM: Replacing Multi-Agent Orchestration with Filesystems",
      subtitle: "Why numbered folders and markdown files beat complex state engines.",
      date: "2026.05.28",
      type: "VIDEO",
      topics: ["AI", "Best Practices", "Developer Productivity"],
      url: "https://x.com/0xdas",
      excerpt: "Demonstrating how a single LLM loop utilizing a structured filesystem workspace outperforms multi-agent graphs in task reliability and clarity."
    },
    {
      id: "mock-3",
      title: "Invisible Law: Generative Art under Math Constraints",
      subtitle: "Implementing golden ratio constraints directly into ERC-721 SVG templates.",
      date: "2026.05.20",
      type: "BLOG",
      topics: ["Crypto", "Engineering"],
      url: "https://x.com/0xdas",
      excerpt: "Explaining the mathematics behind the golden ratio spiral composition used to render fully onchain vector artwork without external CDN dependencies."
    },
    {
      id: "mock-4",
      title: "Stripe Startups Build Day Mexico City",
      subtitle: "Meeting the founders building automated billing engines.",
      date: "2026.08.19",
      type: "EVENT",
      topics: ["Build Day", "Meetup"],
      url: "https://x.com/0xdas",
      excerpt: "Sharing insights from our developer keynote on designing payment flows for AI assistant usage models."
    },
    {
      id: "mock-5",
      title: "Stripe London developer meetup - June 2026",
      subtitle: "Interactive sessions on Stripe Workflows and custom agents.",
      date: "2026.06.23",
      type: "EVENT",
      topics: ["Meetup", "Workflows"],
      url: "https://x.com/0xdas",
      excerpt: "Panel discussion on standardizing webhook handlers using Next.js route handlers and serverless workers."
    },
    {
      id: "mock-6",
      title: "Stripe Tour: London",
      subtitle: "Accelerating global commerce with autonomous agents.",
      date: "2026.06.10",
      type: "EVENT",
      topics: ["Meetup", "Payments"],
      url: "https://x.com/0xdas",
      excerpt: "Exploring payment processing triggers and transactional integrity constraints in distributed multi-agent operations."
    },
    {
      id: "mock-7",
      title: "Your agent is failing because your docs are stale",
      subtitle: "Keeping LLM context synced with dynamic library definitions.",
      date: "2026.06.03",
      type: "VIDEO",
      topics: ["AI", "Developer Productivity"],
      url: "https://x.com/0xdas",
      excerpt: "Watch how out-of-date API specs cause agent failure loops, and learn how to configure auto-syncing context docs in your repositories."
    },
    {
      id: "mock-8",
      title: "Inside minions: how Stripe uses autonomous one-shot AI coding",
      subtitle: "Deep-dive into Sentry's automated codebase patching engines.",
      date: "2026.05.28",
      type: "VIDEO",
      topics: ["AI", "Engineering", "Testing"],
      url: "https://x.com/0xdas",
      excerpt: "Breaking down code generation boundaries and how strict verification scripts contain agent execution failures."
    },
    {
      id: "mock-9",
      title: "Building autonomous coding agents at Stripe",
      subtitle: "A walkthrough of internal development environments for AI.",
      date: "2026.05.26",
      type: "VIDEO",
      topics: ["AI", "Developer Productivity"],
      url: "https://x.com/0xdas",
      excerpt: "Technical presentation on containerized development workspaces where agents safely execute tests and bundle scripts."
    },
    {
      id: "mock-10",
      title: "I gave Stripe Projects an idea and it materialized an entire stack",
      subtitle: "From prompt description to fully functional billing portal.",
      date: "2026.05.26",
      type: "VIDEO",
      topics: ["AI", "Payments", "Workflows"],
      url: "https://x.com/0xdas",
      excerpt: "Watch the execution pipeline generate database schemas, API routes, and a React frontend in real-time."
    },
    {
      id: "mock-11",
      title: "What it feels like building with Stripe Projects",
      subtitle: "Evaluating the developer experience of generative IDEs.",
      date: "2026.05.26",
      type: "BLOG",
      topics: ["Developer Productivity", "Getting Started"],
      url: "https://x.com/0xdas",
      excerpt: "Comparing manual coding loops with agentic prompt-compile cycles, highlighting speed blocks and mental model alignments."
    },
    {
      id: "mock-12",
      title: "Building a personalized cooking agent with ElevenLabs and Gemini",
      subtitle: "Hands-free cooking assistant utilizing voice synthesis.",
      date: "2026.05.23",
      type: "VIDEO",
      topics: ["AI", "Engineering"],
      url: "https://x.com/0xdas",
      excerpt: "Integrating Gemini multimodal input with real-time speech responses to handle recipe execution steps."
    },
    {
      id: "mock-13",
      title: "You can't whisper at an AI agent",
      subtitle: "Why aggressive specs produce higher-quality agent outputs.",
      date: "2026.05.14",
      type: "BLOG",
      topics: ["AI", "Best Practices"],
      url: "https://x.com/0xdas",
      excerpt: "Establishing the rule of clear specifications: if you wouldn't assign the task to a human developer with this little detail, don't expect the agent to guess it."
    },
    {
      id: "mock-14",
      title: "From init to deploy: building with agents and Stripe Projects",
      subtitle: "Full lifecycle walkthrough of a SaaS dashboard.",
      date: "2026.04.29",
      type: "BLOG",
      topics: ["Engineering", "Getting Started"],
      url: "https://x.com/0xdas",
      excerpt: "Deploying code directly from agent generation outputs onto serverless infrastructure with immediate verification loops."
    },
    {
      id: "mock-15",
      title: "Formatting an entire 25 million line codebase overnight",
      subtitle: "Standardizing codebase style across legacy repositories.",
      date: "2026.04.28",
      type: "BLOG",
      topics: ["Best Practices", "Developer Productivity", "Engineering"],
      url: "https://x.com/0xdas",
      excerpt: "The automation steps and testing strategies used to deploy formatters across Stripe without interrupting active PRs."
    },
    {
      id: "mock-16",
      title: "Selective Test Execution: Fast CI for a 50M-line Ruby monorepo",
      subtitle: "Skipping irrelevant tests via code change graph tracing.",
      date: "2026.04.09",
      type: "BLOG",
      topics: ["Best Practices", "Engineering", "Testing"],
      url: "https://x.com/0xdas",
      excerpt: "How to parse AST trees to compile a list of affected test files, reducing CI wait times from 40 minutes to under 3 minutes."
    },
    {
      id: "mock-17",
      title: "Provision a production-ready dev stack from your terminal",
      subtitle: "Instant developer workspaces via CLI configurations.",
      date: "2026.03.26",
      type: "BLOG",
      topics: ["Developer Productivity", "Getting Started"],
      url: "https://x.com/0xdas",
      excerpt: "Configuring containerized setups that boot up with databases pre-seeded and auth variables configured in under 5 seconds."
    },
    {
      id: "mock-18",
      title: "Designing flexible payment flows with Checkout Session",
      subtitle: "Customizing customer journeys during payment captures.",
      date: "2026.03.06",
      type: "BLOG",
      topics: ["Payments", "Workflows"],
      url: "https://x.com/0xdas",
      excerpt: "Best practices for passing custom metadata and handling webhooks to enable conditional access permissions instantly."
    },
    {
      id: "mock-19",
      title: "Building a mental model for Stripe payments",
      subtitle: "Understand the core concepts of accounts, balances, and charges.",
      date: "2026.02.19",
      type: "BLOG",
      topics: ["Payments", "Getting Started"],
      url: "https://x.com/0xdas",
      excerpt: "A beginner-friendly map to understanding payment gateways and ledger reconciliation rules without drowning in documentation."
    }
  ];

  export default function Feed() {
    const [feedItems, setFeedItems] = useState<FeedItem[]>(initialMockItems);
    const [filteredItems, setFilteredItems] = useState<FeedItem[]>(initialMockItems);
    const [expandedRow, setExpandedRow] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    
    // Sidebar Filter States
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [typeOpen, setTypeOpen] = useState(true);
    const [topicOpen, setTypeTopicOpen] = useState(true);

    // Fetch live articles from Paragraph on mount
    useEffect(() => {
      async function fetchParagraphPosts() {
        try {
          const res = await fetch(
            "https://public.api.paragraph.com/api/v1/publications/09JzlxG6yh5Ii8jvcUnb/posts"
          );
          if (res.ok) {
            const data = await res.json();
            if (data.items && data.items.length > 0) {
              const livePosts: FeedItem[] = data.items.map((post: any) => {
                const dateObj = new Date(Number(post.publishedAt));
                const formattedDate = isNaN(dateObj.getTime())
                  ? "2026.06.02"
                  : `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

                return {
                  id: post.id,
                  title: post.title,
                  subtitle: post.subtitle || "Published on Paragraph.",
                  date: formattedDate,
                  type: "BLOG",
                  topics: post.categories ? post.categories.map((c: string) => c.toUpperCase()) : ["AI"],
                  url: `https://paragraph.xyz/@0x168d8b4f50bb3aa67d05a6937b643004257118ed/${post.slug}`,
                  excerpt: post.subtitle || "Click to read the full article on Paragraph."
                };
              });

              // Merge live posts, avoiding duplicates
              setFeedItems(prev => {
                const filteredPrev = prev.filter(p => !livePosts.some(lp => lp.title === p.title));
                return [...livePosts, ...filteredPrev];
              });
            }
          }
        } catch (e) {
          console.error("Failed to fetch posts from Paragraph API", e);
        }
      }
      fetchParagraphPosts();
    }, []);

    // Extract unique topics and counts for filter panel
    const allTopics = Array.from(new Set(feedItems.flatMap(item => item.topics))).sort();
    const allTypes = ["BLOG", "VIDEO", "EVENT"];

    const getTopicCount = (topic: string) => feedItems.filter(item => item.topics.includes(topic)).length;
    const getTypeCount = (type: string) => feedItems.filter(item => item.type === type).length;

    // Apply filters and search
    useEffect(() => {
      let result = feedItems;

      if (selectedTypes.length > 0) {
        result = result.filter(item => selectedTypes.includes(item.type));
      }

      if (selectedTopics.length > 0) {
        result = result.filter(item => item.topics.some(t => selectedTopics.includes(t)));
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        result = result.filter(
          item =>
            item.title.toLowerCase().includes(query) ||
            item.subtitle.toLowerCase().includes(query) ||
            item.excerpt?.toLowerCase().includes(query)
        );
      }

      setFilteredItems(result);
    }, [feedItems, selectedTypes, selectedTopics, searchQuery]);

    const handleTypeChange = (type: string) => {
      setSelectedTypes(prev =>
        prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
      );
    };

    const handleTopicChange = (topic: string) => {
      setSelectedTopics(prev =>
        prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
      );
    };

    const clearFilters = () => {
      setSelectedTypes([]);
      setSelectedTopics([]);
      setSearchQuery("");
    };

    const toggleRow = (id: string) => {
      setExpandedRow(prev => (prev === id ? null : id));
    };

    return (
      <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0"></div>
        
        <Header />

        <main className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 py-10">
          
          {/* Header row */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border-line/20">
            <div className="flex items-baseline space-x-3">
              <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white">Feed</h1>
              <span className="font-mono text-accent-yellow text-sm font-bold">
                ({filteredItems.length})
              </span>
            </div>
            
            {/* Search Input */}
            <div className="relative mt-4 md:mt-0 w-full md:w-64">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-slate" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-terminal-inner border border-border-line rounded px-8 py-1.5 font-mono text-xs text-text-primary placeholder-text-slate/50 outline-none focus:border-accent-blue/50 transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Filter Sidebar */}
            <div className="lg:col-span-3 flex flex-col space-y-6">
              <div className="flex justify-between items-center font-mono text-xs border-b border-border-line/30 pb-2">
                <span className="text-text-slate">/ FILTER</span>
                {(selectedTypes.length > 0 || selectedTopics.length > 0 || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="text-accent-blue hover:text-accent-mint transition-colors cursor-pointer"
                  >
                    CLEAR FILTERS
                  </button>
                )}
              </div>

              {/* Accordion: Type */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setTypeOpen(!typeOpen)}
                  className="w-full flex items-center justify-between font-mono text-xs text-text-primary font-bold hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-blue rounded-sm"></span>
                    <span>Type</span>
                  </span>
                  <ChevronDown size={14} className={`transform transition-transform ${typeOpen ? "" : "-rotate-90"}`} />
                </button>
                {typeOpen && (
                  <div className="pl-3.5 space-y-1.5">
                    {allTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2 font-mono text-xs text-text-slate hover:text-text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="rounded bg-terminal-inner border-border-line text-accent-blue focus:ring-0 outline-none cursor-pointer"
                        />
                        <span>{type.charAt(0) + type.slice(1).toLowerCase()} ({getTypeCount(type)})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Accordion: Topic */}
              <div className="space-y-2.5">
                <button
                  onClick={() => setTypeTopicOpen(!topicOpen)}
                  className="w-full flex items-center justify-between font-mono text-xs text-text-primary font-bold hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-mint rounded-sm"></span>
                    <span>Topic</span>
                  </span>
                  <ChevronDown size={14} className={`transform transition-transform ${topicOpen ? "" : "-rotate-90"}`} />
                </button>
                {topicOpen && (
                  <div className="pl-3.5 space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                    {allTopics.map(topic => (
                      <label key={topic} className="flex items-center space-x-2 font-mono text-xs text-text-slate hover:text-text-primary cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedTopics.includes(topic)}
                          onChange={() => handleTopicChange(topic)}
                          className="rounded bg-terminal-inner border-border-line text-accent-blue focus:ring-0 outline-none cursor-pointer"
                        />
                        <span>{topic} ({getTopicCount(topic)})</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* FIG. 3 Interactive Artwork */}
              <div className="border border-border-line/45 rounded-lg bg-terminal-inner/20 p-4 font-mono text-[9px] text-text-slate flex flex-col space-y-2 select-none relative overflow-hidden h-[180px]">
                <div className="flex justify-between border-b border-border-line/35 pb-1">
                  <span>[ FIG. 3 ]</span>
                  <span className="text-accent-mint">ICM_INDEX</span>
                </div>
                <div className="flex-1 relative flex items-center justify-center">
                  {/* Decorative abstract lines using SVGs */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-border-line/80 stroke-current stroke-[0.5] fill-none">
                    <line x1="10" y1="10" x2="90" y2="90" />
                    <line x1="90" y1="10" x2="10" y2="90" />
                    <line x1="50" y1="0" x2="50" y2="100" />
                    <line x1="0" y1="50" x2="100" y2="50" />
                    <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
                    <path d="M 10 50 Q 50 10 90 50" />
                    <path d="M 10 50 Q 50 90 90 50" />
                  </svg>
                </div>
              </div>

            </div>

            {/* Right Column: Feed List */}
            <div className="lg:col-span-9">
              <div className="border border-border-line/60 rounded-lg overflow-hidden bg-terminal-inner/30">
                
                {/* Table Header */}
                <div className="grid grid-cols-12 px-5 py-3 border-b border-border-line/50 font-mono text-[10px] text-text-slate tracking-wider select-none bg-terminal-inner/50">
                  <div className="col-span-2">/ DATE</div>
                  <div className="col-span-7 sm:col-span-8">/ NAME</div>
                  <div className="col-span-3 sm:col-span-2 text-right">/ TYPE</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-border-line/30">
                  {filteredItems.length === 0 ? (
                    <div className="p-8 text-center font-mono text-xs text-text-slate">
                      No matching items found in the feed.
                    </div>
                  ) : (
                    filteredItems.map(item => (
                      <div key={item.id} className="flex flex-col transition-colors hover:bg-terminal-inner/20">
                        
                        {/* Main Row */}
                        <div
                          onClick={() => toggleRow(item.id)}
                          className="grid grid-cols-12 px-5 py-4 items-center cursor-pointer select-none"
                        >
                          {/* Date */}
                          <div className="col-span-2 font-mono text-xs text-accent-blue flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-accent-blue rounded-sm shrink-0"></span>
                            <span>{item.date}</span>
                          </div>
                          
                          {/* Title */}
                          <div className="col-span-7 sm:col-span-8 pr-4">
                            <span className="text-sm font-semibold text-white hover:text-accent-mint transition-colors">
                              {item.title}
                            </span>
                          </div>
                          
                          {/* Type & Accordion Action */}
                          <div className="col-span-3 sm:col-span-2 flex items-center justify-end space-x-3">
                            <span className={`px-2 py-0.5 rounded border text-[9px] font-mono font-bold tracking-wider ${
                              item.type === "BLOG"
                                ? "border-accent-blue/30 text-accent-blue bg-accent-blue/5"
                                : item.type === "VIDEO"
                                ? "border-accent-purple/30 text-accent-purple bg-accent-purple/5"
                                : "border-accent-mint/30 text-accent-mint bg-accent-mint/5"
                            }`}>
                              {item.type}
                            </span>
                            <div className="text-text-slate">
                              {expandedRow === item.id ? <Minus size={14} /> : <Plus size={14} />}
                            </div>
                          </div>

                        </div>

                        {/* Expanded Content Panel */}
                        {expandedRow === item.id && (
                          <div className="px-5 pb-5 pt-1 border-l-2 border-l-accent-mint bg-terminal-inner/40 font-mono text-xs text-text-slate space-y-3 animate-fadeIn">
                            {item.subtitle && (
                              <p className="text-white font-medium">{item.subtitle}</p>
                            )}
                            {item.excerpt && (
                              <p className="leading-relaxed text-[11px] max-w-3xl">{item.excerpt}</p>
                            )}
                            <div className="flex flex-wrap gap-2.5 items-center pt-2">
                              <span className="text-[10px] text-text-slate/60 mr-1">TOPICS:</span>
                              {item.topics.map(topic => (
                                <span key={topic} className="px-1.5 py-0.5 rounded bg-terminal-bg/50 border border-border-line text-[9px] text-text-slate font-medium">
                                  #{topic.toLowerCase()}
                                </span>
                              ))}
                              <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-auto inline-flex items-center space-x-1 text-accent-mint hover:underline font-bold text-[11px]"
                              >
                                <span>
                                  {item.type === "BLOG"
                                    ? "READ ARTICLE"
                                    : item.type === "VIDEO"
                                    ? "WATCH VIDEO"
                                    : "VIEW EVENT"}
                                </span>
                                <ExternalLink size={12} />
                              </a>
                            </div>
                          </div>
                        )}

                      </div>
                    ))
                  )}
                </div>

              </div>
            </div>

          </div>
        </main>

        <footer className="relative z-10 py-6 text-center select-none border-t border-border-line/20 mt-auto">
          <p className="font-mono text-[9px] text-text-slate/60">
            © {new Date().getFullYear()} 0xdas. all rights reserved. built in public on base.
          </p>
        </footer>
      </div>
    );
  }
  ```

- [ ] **Step 2: Commit**

  ```bash
  git add src/app/feed/page.tsx
  git commit -m "feat: implement feed page with sidebar filtering and Accordion expansions"
  ```

---

### Task 4: UI Navigation Integration

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Check active link state in shared Header**
  Modify `src/components/Header.tsx` to highlighted active links depending on current route (using `next/navigation` `usePathname`).

  ```tsx
  "use client";

  import React from "react";
  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import HeaderConnectButton from "./HeaderConnectButton";
  import Logo from "./Logo";

  export default function Header() {
    const pathname = usePathname();

    return (
      <header className="relative z-10 flex items-center justify-between px-6 py-4 max-w-6xl w-full mx-auto select-none border-b border-border-line/40">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link href="/" className="flex items-center space-x-2.5 cursor-pointer group">
            <Logo className="w-6 h-6 text-accent-blue group-hover:text-accent-mint transition-colors" />
            <span className="font-mono text-sm tracking-widest font-bold text-white group-hover:text-accent-mint transition-colors">
              0xdas.dev
            </span>
          </Link>
          <span className="text-text-slate/40 text-xs">|</span>
          <div className="flex items-center space-x-1 bg-terminal-inner/60 border border-border-line/60 rounded px-1.5 sm:px-2 py-0.5 text-[9px] font-mono text-accent-mint">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-mint animate-pulse"></span>
            <span className="hidden sm:inline">BASE_MAINNET : ONLINE</span>
            <span className="sm:hidden">ONLINE</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-5 text-xs text-text-slate font-mono">
          <Link href="/feed" className={`transition-colors ${pathname === "/feed" ? "text-accent-yellow font-bold" : "hover:text-accent-yellow"}`}>
            feed
          </Link>
          <span className="text-text-slate/40">·</span>
          <a href="https://warpcast.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-mint transition-colors">farcaster</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://x.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-blue transition-colors">twitter</a>
          <span className="hidden sm:inline">·</span>
          <a href="https://github.com/0xdas" target="_blank" rel="noopener noreferrer" className="hidden sm:inline hover:text-accent-purple transition-colors">github</a>
          <span className="hidden sm:inline text-text-slate/40 text-xs">|</span>
          <HeaderConnectButton />
        </div>
      </header>
    );
  }
  ```

- [ ] **Step 2: Verify both pages dev server loads correctly**
  Request `/` homepage and `/feed` page using `Invoke-WebRequest` to verify.
  Expected: Success 200 OK for both routes.

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/Header.tsx
  git commit -m "feat: add active navigation state highlighting to shared Header"
  ```
