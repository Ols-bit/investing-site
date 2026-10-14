"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import {
  addToWatchlist,
  getServerWatchlistSnapshot,
  getWatchlistSnapshot,
  removeFromWatchlist,
  subscribeToWatchlist,
} from "@/lib/watchlist-store";
import { isStockQuote, type StockQuote, type StockSearchResult } from "@/lib/stock-types";
import { StockSearch } from "@/components/stock-search";
import { Watchlist } from "@/components/watchlist";

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function MarketsDashboard() {
  const watchlist = useSyncExternalStore(
    subscribeToWatchlist,
    getWatchlistSnapshot,
    getServerWatchlistSnapshot,
  );
  const [selectedStock, setSelectedStock] = useState<StockSearchResult | null>(null);
  const [selectedQuote, setSelectedQuote] = useState<StockQuote | null>(null);
  const [selectedQuoteError, setSelectedQuoteError] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedStock) {
      return;
    }

    const stock = selectedStock;
    const controller = new AbortController();
    async function loadSelectedQuote() {
      try {
        const response = await fetch(
          `/api/quote?symbol=${encodeURIComponent(stock.symbol)}`,
          { signal: controller.signal },
        );
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error("A detailed quote is temporarily unavailable. Please try again.");
        }
        if (!isStockQuote(payload)) {
          throw new Error("A detailed quote returned an unexpected response.");
        }
        setSelectedQuote(payload);
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Unable to load the selected stock quote.", error);
          setSelectedQuoteError(
            error instanceof Error
              ? error.message
              : "A detailed quote is temporarily unavailable. Please try again.",
          );
        }
      }
    }
    void loadSelectedQuote();
    return () => controller.abort();
  }, [selectedStock]);

  function addStock(stock: StockSearchResult) {
    addToWatchlist(stock);
  }

  function removeStock(symbol: string) {
    removeFromWatchlist(symbol);
    if (selectedStock?.symbol === symbol) {
      setSelectedStock(null);
    }
  }

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <section className="border-t-2 border-slate-950 bg-white p-5 sm:p-6">
          <h2 className="mb-4 text-xl font-bold tracking-tight text-slate-950">
            Add to your watchlist
          </h2>
          <StockSearch onSelect={addStock} />
        </section>

        <section className="border-t-2 border-slate-950 bg-white p-5 sm:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-950">
              Your watchlist
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {watchlist.stocks.length} {watchlist.stocks.length === 1 ? "stock" : "stocks"}
            </span>
          </div>
          {watchlist.error && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950 dark:border-amber-300/20 dark:bg-amber-300/10 dark:text-amber-100"
            >
              {watchlist.error}
            </p>
          )}
          <Watchlist
            stocks={watchlist.stocks}
            onRemove={removeStock}
            onSelect={(stock) => {
              setSelectedStock(stock);
              setSelectedQuote(null);
              setSelectedQuoteError(null);
            }}
          />
        </section>
      </div>

      {selectedStock && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-950/70 p-0 sm:items-center sm:p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedStock(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setSelectedStock(null);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-detail-title"
            className="w-full max-w-lg border-t-4 border-amber-300 bg-white p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-800 dark:text-teal-200">
                  Stock details
                </p>
                <h2
                  id="stock-detail-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-slate-950"
                >
                  {selectedStock.name}
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {selectedStock.symbol}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedStock(null)}
                aria-label="Close stock details"
                className="inline-flex size-9 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            {selectedQuote ? (
              <dl className="mt-6 grid grid-cols-2 gap-3">
                {[
                  ["Current price", formatPrice(selectedQuote.currentPrice)],
                  ["Change", `${selectedQuote.change >= 0 ? "+" : ""}${formatPrice(selectedQuote.change)}`],
                  ["Percent change", `${selectedQuote.percentChange >= 0 ? "+" : ""}${selectedQuote.percentChange.toFixed(2)}%`],
                  ["Previous close", formatPrice(selectedQuote.previousClose)],
                  ["Day high", formatPrice(selectedQuote.high)],
                  ["Day low", formatPrice(selectedQuote.low)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50 p-4 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <dt className="text-xs text-slate-500 dark:text-slate-400">{label}</dt>
                    <dd className="mt-1 text-base font-semibold text-slate-950 dark:text-white">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>
            ) : selectedQuoteError ? (
              <p role="alert" className="mt-6 text-sm text-rose-700 dark:text-rose-300">
                {selectedQuoteError}
              </p>
            ) : (
              <p role="status" className="mt-6 text-sm text-slate-600 dark:text-slate-300">
                Loading quote details…
              </p>
            )}
          </section>
        </div>
      )}
    </>
  );
}
