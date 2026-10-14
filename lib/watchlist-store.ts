"use client";

import {
  DEFAULT_WATCHLIST,
  type StockSearchResult,
} from "@/lib/stock-types";

const STORAGE_KEY = "investing-site-watchlist";

type WatchlistSnapshot = {
  stocks: StockSearchResult[];
  ready: boolean;
  error: string | null;
};

const INITIAL_SNAPSHOT: WatchlistSnapshot = {
  stocks: DEFAULT_WATCHLIST,
  ready: false,
  error: null,
};
let snapshot = INITIAL_SNAPSHOT;
let hasInitialized = false;
const subscribers = new Set<() => void>();

function parseWatchlist(value: string | null): StockSearchResult[] {
  if (value === null) {
    return DEFAULT_WATCHLIST;
  }

  const parsed: unknown = JSON.parse(value);
  if (!Array.isArray(parsed)) {
    throw new Error("Saved watchlist has an invalid format.");
  }

  const seen = new Set<string>();
  return parsed.filter((item): item is StockSearchResult => {
    if (
      item === null ||
      typeof item !== "object" ||
      !("symbol" in item) ||
      typeof item.symbol !== "string" ||
      !("name" in item) ||
      typeof item.name !== "string" ||
      !/^[A-Z0-9.-]{1,10}$/.test(item.symbol) ||
      !item.name.trim() ||
      seen.has(item.symbol)
    ) {
      return false;
    }
    seen.add(item.symbol);
    return true;
  });
}

function notify() {
  subscribers.forEach((subscriber) => subscriber());
}

function readStorage(): WatchlistSnapshot {
  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY);
    const stocks = parseWatchlist(rawValue);
    if (rawValue === null) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
    }
    return { stocks, ready: true, error: null };
  } catch (error) {
    console.error("Unable to load the saved stock watchlist.", error);
    return {
      stocks: DEFAULT_WATCHLIST,
      ready: true,
      error: "Your saved watchlist could not be read. Using the default stocks for now.",
    };
  }
}

function subscribe(subscriber: () => void) {
  subscribers.add(subscriber);

  if (!hasInitialized) {
    hasInitialized = true;
    snapshot = readStorage();
    notify();
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY || event.key === null) {
      snapshot = readStorage();
      notify();
    }
  };
  window.addEventListener("storage", handleStorage);

  return () => {
    subscribers.delete(subscriber);
    window.removeEventListener("storage", handleStorage);
  };
}

export function getWatchlistSnapshot() {
  return snapshot;
}

export function getServerWatchlistSnapshot() {
  return INITIAL_SNAPSHOT;
}

export function subscribeToWatchlist(subscriber: () => void) {
  return subscribe(subscriber);
}

function updateWatchlist(stocks: StockSearchResult[]) {
  let error: string | null = null;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stocks));
  } catch (caughtError) {
    console.error("Unable to save the stock watchlist.", caughtError);
    error = "Your watchlist could not be saved in this browser.";
  }
  snapshot = { stocks, ready: true, error };
  notify();
}

export function addToWatchlist(stock: StockSearchResult) {
  if (snapshot.stocks.some((item) => item.symbol === stock.symbol)) {
    return;
  }
  updateWatchlist([...snapshot.stocks, stock]);
}

export function removeFromWatchlist(symbol: string) {
  updateWatchlist(snapshot.stocks.filter((stock) => stock.symbol !== symbol));
}
