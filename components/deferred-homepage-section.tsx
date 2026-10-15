"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

type HomepageSection = "movers" | "news" | "lessons" | "calculator";

const deferredSections = {
  movers: dynamic(() => import("@/components/top-movers").then((module) => module.TopMovers)),
  news: dynamic(() =>
    import("@/components/latest-news-preview").then((module) => module.LatestNewsPreview),
  ),
  lessons: dynamic(() =>
    import("@/components/home-start-here").then((module) => module.HomeStartHere),
  ),
  calculator: dynamic(() =>
    import("@/components/compound-interest-calculator").then(
      (module) => module.CompoundInterestCalculator,
    ),
  ),
};

const placeholders: Record<HomepageSection, { label: string; className: string }> = {
  movers: { label: "Loading top movers", className: "bg-slate-950" },
  news: { label: "Loading latest news", className: "bg-slate-50" },
  lessons: { label: "Loading featured lessons", className: "bg-teal-300" },
  calculator: { label: "Loading calculator", className: "bg-slate-50" },
};

export function DeferredHomepageSection({ section }: { section: HomepageSection }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [nearViewport, setNearViewport] = useState(false);
  const Component = deferredSections[section];

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (!("IntersectionObserver" in window)) {
      const frame = requestAnimationFrame(() => setNearViewport(true));
      return () => cancelAnimationFrame(frame);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNearViewport(true);
          observer.disconnect();
        }
      },
      { rootMargin: "480px 0px" },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const placeholder = placeholders[section];
  return (
    <div ref={containerRef} aria-busy={!nearViewport}>
      {nearViewport ? (
        <Component />
      ) : (
        <div
          role="status"
          aria-label={placeholder.label}
          className={`min-h-[26rem] rounded-t-[2.5rem] ${placeholder.className}`}
        />
      )}
    </div>
  );
}
