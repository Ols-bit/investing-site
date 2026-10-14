"use client";

import { useEffect, useState } from "react";
import {
  isMarketNewsArticle,
  type ApiError,
  type MarketNewsArticle,
  type MarketNewsCategory,
} from "@/lib/stock-types";

const categories: { value: MarketNewsCategory; label: string }[] = [
  { value: "general", label: "General" },
  { value: "forex", label: "Forex" },
  { value: "crypto", label: "Crypto" },
  { value: "merger", label: "Merger" },
];

const PAGE_SIZE = 8;

function isApiError(value: unknown): value is ApiError {
  return (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  );
}

function isArticles(value: unknown): value is MarketNewsArticle[] {
  return Array.isArray(value) && value.every(isMarketNewsArticle);
}

function relativeTime(timestamp: number) {
  const elapsedSeconds = Math.max(0, Math.floor(Date.now() / 1000) - timestamp);
  if (elapsedSeconds < 60) return "Just now";
  if (elapsedSeconds < 3600) return `${Math.floor(elapsedSeconds / 60)}m ago`;
  if (elapsedSeconds < 86400) return `${Math.floor(elapsedSeconds / 3600)}h ago`;
  return `${Math.floor(elapsedSeconds / 86400)}d ago`;
}

function NewsCard({ article }: { article: MarketNewsArticle }) {
  const validImage = article.image && /^https?:\/\//i.test(article.image);
  const validUrl = /^https?:\/\//i.test(article.url);
  const summary =
    article.summary.length > 230
      ? `${article.summary.slice(0, 227).trimEnd()}…`
      : article.summary;

  return (
    <article className="grid border-t border-slate-300 py-5 sm:grid-cols-[9rem_1fr] sm:gap-6">
      <div
        aria-hidden="true"
        className="mb-4 aspect-[16/9] w-full bg-teal-100 bg-cover bg-center sm:mb-0 sm:aspect-square"
        style={validImage ? { backgroundImage: `url("${article.image}")` } : undefined}
      >
        {!validImage && (
          <div className="flex h-full items-center justify-center bg-teal-100">
            <span className="font-display text-3xl font-extrabold text-teal-800">
              {article.source.slice(0, 1).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
          <span>{article.source}</span>
          <span aria-hidden="true">·</span>
          <time dateTime={new Date(article.datetime * 1000).toISOString()}>
            {relativeTime(article.datetime)}
          </time>
        </div>
        <h2 className="mt-2 text-xl font-bold leading-tight text-slate-950 sm:text-2xl">
          {validUrl ? (
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              {article.headline}
            </a>
          ) : (
            article.headline
          )}
        </h2>
        {summary && <p className="mt-3 text-sm leading-6 text-slate-600">{summary}</p>}
        {validUrl && (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-teal-800 hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Read at {article.source}
            <span aria-hidden="true">↗</span>
          </a>
        )}
      </div>
    </article>
  );
}

function NewsSkeleton() {
  return (
    <div aria-label="Loading news" className="animate-pulse border-t border-slate-300 py-5">
      <div className="grid gap-5 sm:grid-cols-[9rem_1fr]">
        <div className="aspect-[16/9] bg-slate-200 sm:aspect-square" />
        <div>
          <div className="h-3 w-1/3 bg-slate-200" />
          <div className="mt-4 h-6 w-5/6 bg-slate-200" />
          <div className="mt-2 h-6 w-2/3 bg-slate-200" />
          <div className="mt-4 h-4 w-full bg-slate-200" />
          <div className="mt-2 h-4 w-3/4 bg-slate-200" />
        </div>
      </div>
    </div>
  );
}

export function NewsFeed() {
  const [category, setCategory] = useState<MarketNewsCategory>("general");
  const [articles, setArticles] = useState<MarketNewsArticle[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadNews() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/news?category=${category}`, {
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            isApiError(payload) ? payload.error : "News is temporarily unavailable.",
          );
        }
        if (!isArticles(payload)) {
          throw new Error("News returned an unexpected response.");
        }
        setArticles(payload);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setArticles([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "News is temporarily unavailable.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    void loadNews();
    return () => controller.abort();
  }, [category]);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMore = visibleCount < articles.length;

  return (
    <section aria-labelledby="latest-news-heading" className="mt-8">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
            Latest coverage
          </p>
          <h2 id="latest-news-heading" className="mt-2 text-3xl font-bold text-slate-950">
            Market news
          </h2>
        </div>
        <div aria-label="News category" className="flex flex-wrap gap-x-5 gap-y-2" role="tablist">
          {categories.map((item) => {
            const selected = category === item.value;
            return (
              <button
                key={item.value}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => {
                  setCategory(item.value);
                  setVisibleCount(PAGE_SIZE);
                }}
                className={`border-b-2 px-1 py-2 text-sm font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  selected
                    ? "border-teal-700 text-slate-950"
                    : "border-transparent text-slate-500 hover:border-slate-400 hover:text-slate-950"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div role="alert" className="border-l-4 border-rose-500 bg-rose-50 px-5 py-4 text-sm text-rose-950">
          {error}
        </div>
      )}
      {loading && (
        <div aria-busy="true" aria-label="Loading market news">
          {Array.from({ length: 4 }, (_, index) => (
            <NewsSkeleton key={index} />
          ))}
        </div>
      )}
      {!loading && !error && articles.length === 0 && (
        <p className="border-t border-slate-300 py-8 text-sm text-slate-600">
          No articles are available in this category right now.
        </p>
      )}
      {!loading && !error && articles.length > 0 && (
        <>
          <div role="tabpanel">{visibleArticles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}</div>
          {hasMore && (
            <button
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
              className="mt-4 min-h-11 border border-slate-950 px-5 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
            >
              Load more
            </button>
          )}
        </>
      )}
    </section>
  );
}
