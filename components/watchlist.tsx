"use client";

import { useEffect, useState } from "react";
import {
  isStockQuote,
  type ApiError,
  type StockQuote,
  type StockSearchResult,
} from "@/lib/stock-types";

type WatchlistProps = {
  stocks: StockSearchResult[];
  onRemove: (symbol: string) => void;
  onSelect: (stock: StockSearchResult) => void;
};

function isApiError(value: unknown): value is ApiError {
  return (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatChange(value: number, percent: boolean) {
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    signDisplay: "always",
  }).format(value);
  return percent ? `${formatted}%` : formatted;
}

export function Watchlist({ stocks, onRemove, onSelect }: WatchlistProps) {
  const [quotes, setQuotes] = useState<Record<string, StockQuote>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let disposed = false;
    let refreshing = false;

    async function refreshQuotes() {
      if (refreshing || stocks.length === 0) {
        if (stocks.length === 0) {
          setLoading(false);
          setError(null);
        }
        return;
      }
      refreshing = true;

      const results = await Promise.all(
        stocks.map(async (stock) => {
          try {
            const response = await fetch(`/api/quote?symbol=${encodeURIComponent(stock.symbol)}`);
            const payload: unknown = await response.json();
            if (!response.ok) {
              throw new Error(
                isApiError(payload) ? payload.error : "A stock quote could not be loaded.",
              );
            }
            if (!isStockQuote(payload)) {
              throw new Error("A stock quote returned an unexpected response.");
            }
            return { symbol: stock.symbol, quote: payload, error: null };
          } catch (caughtError) {
            return {
              symbol: stock.symbol,
              quote: null,
              error:
                caughtError instanceof Error
                  ? caughtError.message
                  : "A stock quote could not be loaded.",
            };
          }
        }),
      );

      if (!disposed) {
        const successfulQuotes = results.filter(
          (result): result is { symbol: string; quote: StockQuote; error: null } =>
            result.quote !== null,
        );
        if (successfulQuotes.length > 0) {
          setQuotes((previous) => ({
            ...previous,
            ...Object.fromEntries(
              successfulQuotes.map(({ symbol, quote }) => [symbol, quote]),
            ),
          }));
        }
        const firstError = results.find((result) => result.error)?.error;
        setError(firstError ?? null);
        setLoading(false);
      }

      refreshing = false;
    }

    void refreshQuotes();
    const intervalId = window.setInterval(() => void refreshQuotes(), 10_000);
    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, [stocks]);

  if (stocks.length === 0) {
    return (
      <div className="border border-dashed border-slate-300 px-5 py-10 text-center">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
          Your watchlist is empty.
        </p>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Search for a company above to add a stock.
        </p>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
        >
          {error}
          {Object.keys(quotes).length > 0 && (
            <span className="ml-1">Showing any previously loaded prices.</span>
          )}
        </div>
      )}

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {stocks.map((stock) => {
          const quote = quotes[stock.symbol];
          const isUp = quote ? quote.change >= 0 : false;

          return (
            <li
              key={stock.symbol}
              className="border-t border-slate-300 bg-white p-4 sm:p-5"
            >
              {quote ? (
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(stock)}
                    className="min-w-0 flex-1 rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:focus-visible:outline-teal-300"
                  >
                    <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">
                      {stock.name}
                    </span>
                    <span className="mt-0.5 block text-xs font-medium tracking-wide text-slate-500 dark:text-slate-400">
                      {stock.symbol}
                    </span>
                    <span className="mt-4 block text-2xl font-semibold tracking-tight text-slate-950 dark:text-white">
                      {formatPrice(quote.currentPrice)}
                    </span>
                    <span
                      className={`mt-1 inline-flex items-center gap-1 text-sm font-semibold ${
                        isUp
                          ? "text-teal-800"
                          : "text-rose-700"
                      }`}
                    >
                      <span aria-hidden="true">{isUp ? "↑" : "↓"}</span>
                      {formatChange(quote.change, false)} ({formatChange(quote.percentChange, true)})
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(stock.symbol)}
                    aria-label={`Remove ${stock.symbol} from watchlist`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-400 dark:hover:bg-rose-300/10 dark:hover:text-rose-300 dark:focus-visible:outline-teal-300"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      className="size-4"
                    >
                      <path d="M5 7h14M10 11v6m4-6v6M6.5 7l1 13h9l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              ) : loading ? (
                <div aria-label={`Loading ${stock.symbol} quote`} className="animate-pulse">
                  <div className="h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="mt-2 h-3 w-1/4 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="mt-5 h-7 w-1/2 rounded bg-slate-200 dark:bg-white/10" />
                  <div className="mt-2 h-4 w-2/3 rounded bg-slate-200 dark:bg-white/10" />
                </div>
              ) : (
                <div className="flex min-h-24 items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onSelect(stock)}
                    className="text-left text-sm font-semibold text-slate-800 focus-visible:outline-2 focus-visible:outline-teal-700 dark:text-slate-100 dark:focus-visible:outline-teal-300"
                  >
                    <span className="block">{stock.name}</span>
                    <span className="mt-0.5 block text-xs font-medium text-slate-500 dark:text-slate-400">
                      {stock.symbol}
                    </span>
                    <span className="mt-2 block text-xs font-normal text-slate-500 dark:text-slate-400">
                      Quote unavailable
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(stock.symbol)}
                    aria-label={`Remove ${stock.symbol} from watchlist`}
                    className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-rose-50 hover:text-rose-700 dark:text-slate-400 dark:hover:bg-rose-300/10 dark:hover:text-rose-300"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Quotes refresh about every 10 seconds.
      </p>
    </div>
  );
}
