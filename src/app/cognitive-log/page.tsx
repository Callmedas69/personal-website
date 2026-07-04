"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronDown, Plus, Minus, Search, ExternalLink } from "lucide-react";
import { useGSAP } from "@gsap/react";
import { gsap, EASE, DUR, STAGGER, MM } from "@/lib/motion";
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

export default function CognitiveLog() {
  const mainRef = useRef<HTMLElement>(null);
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Sidebar Filter States
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [typeOpen, setTypeOpen] = useState(true);
  const [topicOpen, setTypeTopicOpen] = useState(true);

  // Fetch live articles from Paragraph on mount (published only)
  useEffect(() => {
    async function fetchParagraphPosts() {
      try {
        setIsLoading(true);
        setError(null);
        
        const publishedRes = await fetch("/api/posts?status=published");
        const livePosts: FeedItem[] = [];

        if (publishedRes && publishedRes.ok) {
          const publishedData = await publishedRes.json();
          if (publishedData.items) {
            publishedData.items.forEach((post: any) => {
              let timestamp = Number(post.publishedAt || post.updatedAt);
              if (timestamp < 10000000000) {
                timestamp = timestamp * 1000;
              }
              const dateObj = new Date(timestamp);
              const formattedDate = isNaN(dateObj.getTime())
                ? "date unknown"
                : `${dateObj.getFullYear()}.${String(dateObj.getMonth() + 1).padStart(2, "0")}.${String(dateObj.getDate()).padStart(2, "0")}`;

              const cats = post.categories || [];
              let type: "BLOG" | "VIDEO" | "EVENT" = "BLOG";
              if (cats.some((c: string) => c.toLowerCase().includes("video"))) {
                type = "VIDEO";
              } else if (cats.some((c: string) => c.toLowerCase().includes("event") || c.toLowerCase().includes("meetup"))) {
                type = "EVENT";
              }

              livePosts.push({
                id: post.id,
                title: post.title,
                subtitle: post.subtitle || "",
                date: formattedDate,
                type,
                topics: cats.map((c: string) => c.trim().toUpperCase()).filter(Boolean).length 
                  ? cats.map((c: string) => c.trim().toUpperCase()) 
                  : ["AI"],
                url: `https://paragraph.xyz/@0x168d8b4f50bb3aa67d05a6937b643004257118ed/${post.slug}`,
                excerpt: post.subtitle || "Click to read the full article on Paragraph."
              });
            });
          }
        } else {
          throw new Error("Failed to fetch published posts from API");
        }

        // Sort posts by date descending
        livePosts.sort((a, b) => b.date.localeCompare(a.date));

        setFeedItems(livePosts);
      } catch (e: any) {
        console.error("Failed to fetch posts from Paragraph API", e);
        setError(e.message || "Failed to load posts.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchParagraphPosts();
  }, []);

  // Extract unique topics and counts for filter panel
  const allTopics = Array.from(new Set(feedItems.flatMap(item => item.topics))).sort();
  const allTypes = Array.from(new Set(feedItems.map(item => item.type))).sort();

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

  // Page entrance: h1 line-mask reveal, count + search follow
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MM, (ctx) => {
        const { ok } = ctx.conditions as { ok: boolean };
        if (!ok) return;
        const tl = gsap.timeline({ defaults: { ease: EASE.out } });
        tl.from("[data-log-title]", { yPercent: 110, duration: DUR.base });
        tl.from("[data-log-meta]", { autoAlpha: 0, y: 8, duration: DUR.base, stagger: 0.08 }, 0.2);
      });
    },
    { scope: mainRef }
  );

  // Row stagger — only when loading finishes, never on filter/search changes
  useGSAP(
    () => {
      if (isLoading) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const rows = gsap.utils.toArray<HTMLElement>("[data-feed-row]").slice(0, 15);
      if (rows.length === 0) return;
      gsap.from(rows, {
        y: 12,
        autoAlpha: 0,
        duration: 0.5,
        ease: EASE.outSoft,
        stagger: STAGGER.rows,
        clearProps: "all",
      });
    },
    { scope: mainRef, dependencies: [isLoading] }
  );

  return (
    <div className="flex flex-col min-h-screen bg-brand-bg text-text-primary selection:bg-accent-blue/30 selection:text-white relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-terminal-bg/30 via-brand-bg/95 to-brand-bg pointer-events-none z-0"></div>
      
      <Header />

      <main ref={mainRef} className="relative z-10 flex-1 w-full max-w-6xl mx-auto px-6 pt-28 pb-10">

        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-border-line/20">
          <div className="flex items-baseline space-x-3">
            <div className="overflow-hidden">
              <h1 data-log-title className="font-sans text-[clamp(2rem,4vw,3.25rem)] font-extrabold tracking-tight text-white text-balance">cognitive-log</h1>
            </div>
            <span data-log-meta className="font-mono text-accent-yellow text-sm font-bold">
              ({filteredItems.length})
            </span>
          </div>

          {/* Search Input */}
          <div data-log-meta className="relative mt-4 md:mt-0 w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-slate" />
            <input
              type="text"
              placeholder="search articles..."
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
              <span className="text-text-slate">/ filter</span>
              {(selectedTypes.length > 0 || selectedTopics.length > 0 || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="text-accent-blue hover:text-accent-mint transition-colors cursor-pointer"
                >
                  clear filters
                </button>
              )}
            </div>

            {/* Accordion: Type */}
            {allTypes.length > 0 && (
              <div className="space-y-2.5">
                <button
                  onClick={() => setTypeOpen(!typeOpen)}
                  className="w-full flex items-center justify-between font-mono text-xs text-text-primary font-bold hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-blue rounded-sm"></span>
                    <span>type</span>
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
            )}

            {/* Accordion: Topic */}
            {allTopics.length > 0 && (
              <div className="space-y-2.5">
                <button
                  onClick={() => setTypeTopicOpen(!topicOpen)}
                  className="w-full flex items-center justify-between font-mono text-xs text-text-primary font-bold hover:text-accent-blue transition-colors cursor-pointer"
                >
                  <span className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 bg-accent-mint rounded-sm"></span>
                    <span>topic</span>
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
            )}

            {/* FIG. 3 Interactive Artwork */}
            <div className="border border-border-line/45 rounded-lg bg-terminal-inner/20 p-4 font-mono text-[9px] text-text-slate flex flex-col space-y-2 select-none relative overflow-hidden h-[180px]">
              <div className="flex justify-between border-b border-border-line/35 pb-1">
                <span>fig. 3</span>
                <span className="text-accent-mint">ICM_INDEX</span>
              </div>
              <div className="flex-1 relative flex items-center justify-center">
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
              <div className="flex justify-between sm:grid sm:grid-cols-12 px-5 py-3 border-b border-border-line/50 font-mono text-[10px] text-text-slate tracking-wider select-none bg-terminal-inner/50">
                <div className="sm:col-span-2">/ date<span className="sm:hidden"> / name</span></div>
                <div className="hidden sm:block sm:col-span-8">/ name</div>
                <div className="sm:col-span-2 text-right">/ type</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-border-line/30">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <div key={idx} className="flex justify-between gap-3 sm:grid sm:grid-cols-12 px-5 py-4 items-center animate-pulse">
                      <div className="flex flex-col gap-2 flex-1 sm:contents">
                        <div className="sm:col-span-2 h-4 bg-border-line/20 rounded w-16"></div>
                        <div className="sm:col-span-8 h-4 bg-border-line/20 rounded w-2/3"></div>
                      </div>
                      <div className="shrink-0 sm:col-span-2 flex justify-end">
                        <div className="h-4 bg-border-line/20 rounded w-12"></div>
                      </div>
                    </div>
                  ))
                ) : error ? (
                  <div className="p-8 text-center font-mono text-xs text-red-400/80 space-y-1">
                    <div>// failed to load entries.</div>
                    <div className="text-text-slate/50">check connection and retry.</div>
                  </div>
                ) : filteredItems.length === 0 ? (
                  <div className="p-8 text-center font-mono text-xs text-text-slate space-y-2">
                    <div>// no matching entries.</div>
                    {(selectedTypes.length > 0 || selectedTopics.length > 0 || searchQuery) && (
                      <button
                        onClick={clearFilters}
                        className="text-accent-blue hover:text-accent-mint transition-colors cursor-pointer"
                      >
                        clear filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredItems.map(item => (
                    <div key={item.id} data-feed-row className="flex flex-col transition-colors hover:bg-terminal-inner/20">
                      
                      {/* Main Row */}
                      <div
                        onClick={() => toggleRow(item.id)}
                        className="flex items-center justify-between gap-3 sm:grid sm:grid-cols-12 px-5 py-4 sm:items-center cursor-pointer select-none"
                      >
                        {/* Date + Title: stacked on mobile, grid cells from sm: up */}
                        <div className="flex flex-col gap-1 min-w-0 sm:contents">
                          {/* Date */}
                          <div className="sm:col-span-2 font-mono text-xs text-accent-blue flex items-center space-x-1.5">
                            <span className="w-1.5 h-1.5 bg-accent-blue rounded-sm shrink-0"></span>
                            <span>{item.date}</span>
                          </div>

                          {/* Title */}
                          <div className="sm:col-span-8 sm:pr-4 flex items-center space-x-2">
                            <span className="text-sm font-semibold text-white hover:text-accent-mint transition-colors">
                              {item.title}
                            </span>
                            {item.topics.includes("DRAFT") && (
                              <span className="px-1.5 py-0.5 rounded border border-accent-yellow/30 text-accent-yellow bg-accent-yellow/5 text-[8px] font-mono font-bold tracking-wider scale-90">
                                draft
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Type & Accordion Action */}
                        <div className="shrink-0 sm:col-span-2 flex items-center justify-end space-x-3">
                          <span className="px-2 py-0.5 rounded border border-border-line/40 text-text-slate bg-terminal-bg/30 text-[9px] font-mono font-bold tracking-wider">
                            {item.type}
                          </span>
                          <div className="text-text-slate">
                            {expandedRow === item.id ? <Minus size={14} /> : <Plus size={14} />}
                          </div>
                        </div>

                      </div>

                      {/* Expanded Content Panel — grid-rows trick animates height in pure CSS */}
                      <div
                        className="grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none"
                        style={{ gridTemplateRows: expandedRow === item.id ? "1fr" : "0fr" }}
                      >
                        <div className="overflow-hidden">
                        <div className="px-5 pb-5 pt-1 border-x border-b border-border-line/40 bg-terminal-inner/20 rounded-b-lg font-mono text-xs text-text-slate space-y-3">
                          {item.subtitle && (
                            <p className="text-white font-medium">{item.subtitle}</p>
                          )}
                          {item.excerpt && (
                            <p className="leading-relaxed text-[11px] max-w-3xl">{item.excerpt}</p>
                          )}
                          <div className="flex flex-wrap gap-2.5 items-center pt-2">
                            <span className="text-[10px] text-text-slate/60 mr-1">topics:</span>
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
                                  ? "read article"
                                  : item.type === "VIDEO"
                                  ? "watch video"
                                  : "view event"}
                              </span>
                              <ExternalLink size={12} />
                            </a>
                          </div>
                        </div>
                        </div>
                      </div>

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
          0xDas  // the thinking is free.  cognitive. solo. shipping.
        </p>
      </footer>
    </div>
  );
}
