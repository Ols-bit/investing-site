"use client";

import { useEffect, useState } from "react";
import {
  isMarketNewsArticle,
  type ApiError,
  type MarketNewsArticle,
} from "@/lib/stock-types";

type CompanyNewsProps = {
  symbol: string;
};

function isApiError(value: unknown): value is ApiError {
  return (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  );
}

export function CompanyNews({ symbol }: CompanyNewsProps) {
  const [articles, setArticles] = useState<MarketNewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function loadCompanyNews() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/news?symbol=${encodeURIComponent(symbol)}`, {
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            isApiError(payload) ? payload.error : "Company news is unavailable right now.",
          );
        }
        if (!Array.isArray(payload) || !payload.every(isMarketNewsArticle)) {
          throw new Error("Company news returned an unexpected response.");
        }
        setArticles(payload);
      } catch (caughtError) {
        if (!controller.signal.aborted) {
          setArticles([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Company news is unavailable right now.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }
    void loadCompanyNews();
    return () => controller.abort();
  }, [symbol]);

  return (
    <section aria-labelledby="company-news-heading" className="mt-7 border-t-2 border-slate-950 pt-5">
      <h3 id="company-news-heading" className="text-xl font-bold text-slate-950">
        Latest {symbol} news
      </h3>
      {loading && (
        <p className="mt-3 animate-pulse text-sm text-slate-500" role="status">
          Loading company news…
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 border-l-4 border-rose-500 bg-rose-50 px-3 py-2 text-sm text-rose-950">
          {error}
        </p>
      )}
      {!loading && !error && articles.length === 0 && (
        <p className="mt-3 text-sm text-slate-600">No recent articles found for this company.</p>
      )}
      {!loading && articles.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-200">
          {articles.slice(0, 4).map((article) => (
            <li key={article.id} className="py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {article.source}
              </p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 block text-sm font-semibold leading-5 text-slate-950 underline decoration-transparent underline-offset-2 hover:decoration-amber-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                {article.headline}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
