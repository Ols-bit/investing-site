import "server-only";

import { getStockQuote } from "@/lib/finnhub";
import { US_TICKERS } from "@/lib/tickers";
import type { StockQuote } from "@/lib/stock-types";

const CACHE_DURATION = 3 * 60 * 1000;

export type MarketMover = {
  symbol: string;
  name: string;
  price: number;
  percentChange: number;
};

export type MarketMovers = {
  gainers: MarketMover[];
  losers: MarketMover[];
  updatedAt: number;
  stale: boolean;
};

let cachedMovers: MarketMovers | null = null;
let cacheExpiresAt = 0;
let pendingRequest: Promise<MarketMovers> | null = null;

function toMover(quote: StockQuote): MarketMover {
  const ticker = US_TICKERS.find((item) => item.symbol === quote.symbol);
  if (!ticker) {
    throw new Error(`Missing company name for ${quote.symbol}.`);
  }
  return {
    symbol: quote.symbol,
    name: ticker.name,
    price: quote.currentPrice,
    percentChange: quote.percentChange,
  };
}

async function requestMovers(): Promise<MarketMovers> {
  const results = await Promise.allSettled(
    US_TICKERS.map(({ symbol }) => getStockQuote(symbol)),
  );
  const failure = results.find(
    (result): result is PromiseRejectedResult => result.status === "rejected",
  );

  if (failure) {
    if (cachedMovers) {
      cacheExpiresAt = Date.now() + 60_000;
      return { ...cachedMovers, stale: true };
    }
    throw failure.reason;
  }

  const quotes = results.map((result) => {
    if (result.status !== "fulfilled") {
      throw new Error("A market quote was not available.");
    }
    return toMover(result.value);
  });
  const sorted = [...quotes].sort((a, b) => b.percentChange - a.percentChange);
  const now = Date.now();
  const latest: MarketMovers = {
    gainers: sorted.slice(0, 5),
    losers: sorted.slice(-5).reverse(),
    updatedAt: now,
    stale: false,
  };
  cachedMovers = latest;
  cacheExpiresAt = now + CACHE_DURATION;
  return latest;
}

export async function getMarketMovers(): Promise<MarketMovers> {
  if (cachedMovers && Date.now() < cacheExpiresAt) {
    return cachedMovers;
  }
  if (!pendingRequest) {
    pendingRequest = requestMovers().finally(() => {
      pendingRequest = null;
    });
  }
  return pendingRequest;
}
