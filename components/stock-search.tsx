"use client";

import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  isStockSearchResults,
  type ApiError,
  type StockSearchResult,
} from "@/lib/stock-types";

type StockSearchProps = {
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

export function StockSearch({ onSelect }: StockSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockSearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const inputId = useId();
  const listboxId = useId();
  const requestId = useRef(0);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      return;
    }

    const currentRequest = ++requestId.current;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(trimmedQuery)}`, {
          signal: controller.signal,
        });
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            isApiError(payload) ? payload.error : "Search is temporarily unavailable.",
          );
        }
        if (!isStockSearchResults(payload)) {
          throw new Error("Search returned an unexpected response.");
        }
        if (currentRequest === requestId.current) {
          setResults(payload);
          setActiveIndex(-1);
        }
      } catch (caughtError) {
        if (controller.signal.aborted) {
          return;
        }
        if (currentRequest === requestId.current) {
          setResults([]);
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "Search is temporarily unavailable.",
          );
        }
      } finally {
        if (currentRequest === requestId.current && !controller.signal.aborted) {
          setLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  function select(stock: StockSearchResult) {
    onSelect(stock);
    requestId.current += 1;
    setQuery("");
    setResults([]);
    setError(null);
    setLoading(false);
    setOpen(false);
    setActiveIndex(-1);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (!open || results.length === 0) {
      if (event.key === "ArrowDown" && results.length > 0) {
        setOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % results.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => (index <= 0 ? results.length - 1 : index - 1));
    } else if (event.key === "Enter" && activeIndex >= 0) {
      event.preventDefault();
      select(results[activeIndex]);
    }
  }

  const dropdownVisible = open && query.trim().length >= 2;

  return (
    <div className="relative">
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-semibold text-slate-800 dark:text-slate-100"
      >
        Find a stock
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-400"
        >
          <circle cx="10.8" cy="10.8" r="6.8" />
          <path d="m16 16 4.5 4.5" />
        </svg>
        <input
          id={inputId}
          type="search"
          value={query}
          onChange={(event) => {
            const nextQuery = event.target.value;
            requestId.current += 1;
            setQuery(nextQuery);
            setResults([]);
            setError(null);
            setActiveIndex(-1);
            if (nextQuery.trim().length < 2) {
              setLoading(false);
            }
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={dropdownVisible}
          aria-controls={listboxId}
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          placeholder="Search by company or symbol"
          className="w-full rounded-2xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-sm text-slate-950 shadow-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-600/10 dark:border-white/15 dark:bg-slate-900 dark:text-white dark:focus:border-teal-300 dark:focus:ring-teal-300/10"
        />
      </div>

      {dropdownVisible && (
        <div className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 dark:border-white/10 dark:bg-slate-900">
          {loading && (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">Searching…</p>
          )}
          {error && (
            <p role="alert" className="px-4 py-3 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </p>
          )}
          {!loading && !error && results.length === 0 && (
            <p className="px-4 py-3 text-sm text-slate-500 dark:text-slate-300">
              No matching common stocks found.
            </p>
          )}
          {results.length > 0 && (
            <ul id={listboxId} role="listbox" aria-label="Stock search results" className="py-1">
              {results.map((stock, index) => (
                <li
                  key={`${stock.symbol}-${stock.name}`}
                  id={`${listboxId}-option-${index}`}
                  role="option"
                  aria-selected={activeIndex === index}
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => select(stock)}
                    className={`flex w-full items-center justify-between gap-4 px-4 py-3 text-left transition-colors ${
                      activeIndex === index
                        ? "bg-teal-50 dark:bg-teal-300/10"
                        : "hover:bg-slate-50 dark:hover:bg-white/5"
                    }`}
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-slate-950 dark:text-white">
                        {stock.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">
                        {stock.symbol}
                      </span>
                    </span>
                    <span aria-hidden="true" className="text-lg text-teal-700 dark:text-teal-300">
                      +
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <p aria-live="polite" className="sr-only">
        {loading ? "Searching stocks" : `${results.length} search results`}
      </p>
    </div>
  );
}
