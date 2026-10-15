"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import {
  isMarketNewsArticle,
  type MarketNewsArticle,
  type ApiError,
} from "@/lib/stock-types";

function isApiError(value: unknown): value is ApiError {
  return value !== null && typeof value === "object" && "error" in value && typeof value.error === "string";
}

function formatRelativeTime(timestamp: number) {
  const seconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export function LatestNewsPreview() {
  const [articles, setArticles] = useState<MarketNewsArticle[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      try {
        const response = await fetch("/api/news?category=general", { signal: controller.signal });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(isApiError(payload) ? payload.error : "News is temporarily unavailable.");
        }
        if (!Array.isArray(payload) || !payload.every(isMarketNewsArticle)) {
          throw new Error("News returned an unexpected response.");
        }
        setArticles(payload.slice(0, 4));
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(caught instanceof Error ? caught.message : "News is temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void load();
    return () => controller.abort();
  }, []);

  return (
    <section aria-labelledby="home-news-title" className="rounded-t-[2.5rem] bg-slate-50 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">From the market</p>
            <h2 id="home-news-title" className="mt-3 text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
              Latest news.
            </h2>
          </div>
          <Link href="/news" className="inline-flex min-h-11 items-center gap-3 border-b-2 border-slate-950 text-sm font-bold text-slate-950 hover:border-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            See all news <span aria-hidden="true">→</span>
          </Link>
        </div>
        {loading ? (
          <div aria-label="Loading latest news" className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="animate-pulse border-t-2 border-slate-300 py-5">
                <div className="h-3 w-1/3 bg-slate-200" />
                <div className="mt-5 h-6 w-full bg-slate-200" />
                <div className="mt-2 h-6 w-4/5 bg-slate-200" />
                <div className="mt-5 h-4 w-full bg-slate-200" />
              </div>
            ))}
          </div>
        ) : error ? (
          <p role="alert" className="border-l-4 border-amber-300 bg-amber-50 px-4 py-3 text-sm text-slate-950">{error}</p>
        ) : articles.length === 0 ? (
          <p role="status" className="border-t-2 border-slate-950 py-6 text-sm text-slate-700">No recent headlines are available.</p>
        ) : (
          <div className="grid gap-x-7 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article, index) => (
              <motion.article
                key={article.id}
                initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="border-t-2 border-slate-950 py-5"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-slate-600">
                  {article.source} <span aria-hidden="true">·</span> {formatRelativeTime(article.datetime)}
                </p>
                <h3 className="mt-4 text-xl font-bold leading-tight text-slate-950">
                  <a href={article.url} target="_blank" rel="noopener noreferrer" className="underline decoration-transparent underline-offset-4 hover:decoration-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
                    {article.headline}
                  </a>
                </h3>
                {article.summary && <p className="mt-3 line-clamp-4 text-sm leading-6 text-slate-700">{article.summary}</p>}
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
