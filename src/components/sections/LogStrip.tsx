"use client";

import { useRef } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { gsap, MM } from "@/lib/motion";
import type { FeedItem } from "@/lib/paragraph";

/**
 * Horizontal strip of the latest cognitive-log posts. Desktop gets a
 * pinned scroll-driven track; mobile / reduced-motion / no-JS falls back
 * to native overflow-x scrolling with snap (the markup below IS the fallback).
 */
export default function LogStrip({ posts }: { posts: FeedItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (posts.length === 0) return;
      const mm = gsap.matchMedia();
      mm.add(MM, (ctx) => {
        const { ok, desktop } = ctx.conditions as { ok: boolean; desktop: boolean };
        if (!ok || !desktop) return;

        const track = trackRef.current!;
        const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 48);

        // when the cards already fit the viewport there is nothing to scrub
        if (distance() < 100) return;

        // GSAP drives x; native overflow scrolling would fight it.
        // Center the strip vertically for the duration of the pin.
        gsap.set(track, { overflowX: "visible" });
        gsap.set(sectionRef.current, {
          minHeight: "100svh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        });

        gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: () => "+=" + distance(),
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });
      });
    },
    { scope: sectionRef, dependencies: [posts.length] }
  );

  return (
    <section ref={sectionRef} className="relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-6 pt-20 pb-4 font-mono select-none">
        <span className="text-accent-yellow text-sm font-bold">// cognitive-log</span>
        {posts.length > 0 && (
          <span className="text-text-slate text-sm ml-2">({posts.length})</span>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="w-full max-w-6xl mx-auto px-6 pb-20 font-mono text-sm text-text-slate">
          // log offline. full archive at{" "}
          <Link href="/cognitive-log" className="text-accent-yellow hover:underline">
            /cognitive-log
          </Link>
        </div>
      ) : (
        <div
          ref={trackRef}
          data-log-track
          className="flex flex-col md:flex-row gap-4 px-6 pb-20 md:overflow-x-auto md:snap-x md:snap-mandatory lg:[&::-webkit-scrollbar]:hidden"
        >
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              data-log-card
              className="md:snap-start md:shrink-0 w-full md:w-[340px] border border-border-line rounded-lg bg-terminal-inner/30 p-5 font-mono space-y-3 hover:border-border-line/80 hover:bg-terminal-inner/50 transition-colors group"
            >
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-accent-blue">{post.date}</span>
                <span
                  className={`px-2 py-0.5 rounded border font-bold tracking-wider text-[9px] ${
                    post.type === "BLOG"
                      ? "border-accent-blue/30 text-accent-blue bg-accent-blue/5"
                      : post.type === "VIDEO"
                      ? "border-accent-purple/30 text-accent-purple bg-accent-purple/5"
                      : "border-accent-mint/30 text-accent-mint bg-accent-mint/5"
                  }`}
                >
                  {post.type}
                </span>
              </div>
              <div className="text-sm font-semibold text-text-primary leading-snug group-hover:text-accent-mint transition-colors">
                {post.title}
              </div>
              {post.subtitle && (
                <div className="text-[11px] text-text-slate leading-relaxed line-clamp-3">
                  {post.subtitle}
                </div>
              )}
            </a>
          ))}

          <Link
            href="/cognitive-log"
            data-log-card
            className="md:snap-start md:shrink-0 w-full md:w-[220px] border border-accent-yellow/25 rounded-lg bg-terminal-inner/20 p-5 font-mono flex flex-col justify-between gap-3 hover:bg-accent-yellow/5 hover:border-accent-yellow/50 transition-colors"
          >
            <span className="text-[10px] text-text-slate">// full archive</span>
            <span className="text-sm font-bold text-accent-yellow">view full log →</span>
          </Link>
        </div>
      )}
    </section>
  );
}
