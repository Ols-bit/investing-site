"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ApiError } from "@/lib/stock-types";
import type { MarketMover, MarketMovers } from "@/lib/movers";

function isApiError(value: unknown): value is ApiError {
  return value !== null && typeof value === "object" && "error" in value && typeof value.error === "string";
}

function isMover(value: unknown): value is MarketMover {
  return value !== null && typeof value === "object" &&
    "symbol" in value && typeof value.symbol === "string" &&
    "name" in value && typeof value.name === "string" &&
    "price" in value && typeof value.price === "number" &&
    "percentChange" in value && typeof value.percentChange === "number";
}

function isMovers(value: unknown): value is MarketMovers {
  return value !== null && typeof value === "object" &&
    "gainers" in value && Array.isArray(value.gainers) && value.gainers.every(isMover) &&
    "losers" in value && Array.isArray(value.losers) && value.losers.every(isMover) &&
    "updatedAt" in value && typeof value.updatedAt === "number" &&
    "stale" in value && typeof value.stale === "boolean";
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(price);
}

function MoversList({
  title,
  items,
  direction,
}: {
  title: string;
  items: MarketMover[];
  direction: "up" | "down";
}) {
  const accent = direction === "up" ? "text-teal-300" : "text-amber-300";
  return (
    <section aria-label={title} className="min-w-0 border-t-2 border-white/60">
      <h3 className="py-4 font-display text-2xl font-bold text-white">{title}</h3>
      {items.length ? (
        <ol className="divide-y divide-white/20">
          {items.map((item, index) => (
            <li key={item.symbol}>
              <Link
                href={`/markets?symbol=${encodeURIComponent(item.symbol)}`}
                className="grid min-h-[4.5rem] grid-cols-[2rem_1fr_auto] items-center gap-3 py-3 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-teal-300"
              >
                <span className="text-xs tabular-nums text-slate-300">0{index + 1}</span>
                <span className="min-w-0">
                  <span className="block truncate font-bold">{item.symbol}</span>
                  <span className="block truncate text-xs text-slate-300">{item.name}</span>
                </span>
                <span className="text-right tabular-nums">
                  <span className="block text-sm font-semibold">{formatPrice(item.price)}</span>
                  <span className={`block text-xs font-bold ${accent}`}>
                    {item.percentChange >= 0 ? "+" : ""}{item.percentChange.toFixed(2)}%
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="py-5 text-sm text-slate-200">No quotes are available right now.</p>
      )}
    </section>
  );
}

function MoversSkeleton() {
  return (
    <div aria-label="Loading top movers" className="grid gap-10 md:grid-cols-2">
      {["Gainers", "Losers"].map((title) => (
        <div key={title} className="border-t-2 border-white/60">
          <div className="py-4 font-display text-2xl font-bold text-white">{title}</div>
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="flex min-h-[4.5rem] items-center justify-between border-t border-white/20 py-3">
              <div className="h-4 w-1/2 animate-pulse bg-white/20" />
              <div className="h-4 w-16 animate-pulse bg-white/20" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function TopMovers() {
  const [data, setData] = useState<MarketMovers | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    async function loadMovers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/movers", { signal: controller.signal });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(isApiError(payload) ? payload.error : "Market movers are temporarily unavailable.");
        }
        if (!isMovers(payload)) {
          throw new Error("Market movers returned an unexpected response.");
        }
        setData(payload);
      } catch (caught) {
        if (!controller.signal.aborted) {
          setError(caught instanceof Error ? caught.message : "Market movers are temporarily unavailable.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void loadMovers();
    return () => controller.abort();
  }, [attempt]);

  return (
    <section aria-labelledby="top-movers-title" className="rounded-t-[2.5rem] bg-slate-950 px-5 pb-20 pt-16 text-white sm:px-8 sm:pb-24 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 grid gap-5 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">Today in the market</p>
            <h2 id="top-movers-title" className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">Top movers.</h2>
            <p className="mt-5 max-w-xl text-sm leading-6 text-slate-200">Daily price changes can be noisy. This snapshot is context, not a recommendation.</p>
          </div>
          {data && (
            <p className="text-xs text-slate-300 sm:text-right">
              {data.stale ? "Showing last available data · " : "Last updated "}
              <time dateTime={new Date(data.updatedAt).toISOString()}>
                {new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(data.updatedAt)}
              </time>
            </p>
          )}
        </div>

        {loading ? (
          <MoversSkeleton />
        ) : error ? (
          <div role="alert" className="border-l-4 border-amber-300 bg-white/10 px-5 py-4 text-sm text-white">
            <p>{error}</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className="mt-3 min-h-10 border border-white px-4 font-bold hover:bg-white hover:text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">
              Try again
            </button>
          </div>
        ) : data ? (
          <div className="grid gap-10 md:grid-cols-2">
            <MoversList title="Gainers" items={data.gainers} direction="up" />
            <MoversList title="Losers" items={data.losers} direction="down" />
          </div>
        ) : null}
        <p className="mt-8 border-t border-white/25 pt-4 text-xs text-slate-300">
          Prices may be delayed. Not financial advice.
        </p>
      </div>
    </section>
  );
}
