"use client";

import { useEffect, useState } from "react";
import { isStockQuote, type StockQuote } from "@/lib/stock-types";

const symbols = ["AAPL", "MSFT", "NVDA"];
const fallbackQuotes = [
  { symbol: "AAPL", price: "$190.00" },
  { symbol: "MSFT", price: "$420.00" },
  { symbol: "NVDA", price: "$125.00" },
];

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export function MarketTicker() {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [usingFallback, setUsingFallback] = useState(false);

  useEffect(() => {
    let disposed = false;

    async function refresh() {
      const results = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const response = await fetch(`/api/quote?symbol=${symbol}`);
            const payload: unknown = await response.json();
            return response.ok && isStockQuote(payload) ? payload : null;
          } catch {
            return null;
          }
        }),
      );

      if (!disposed) {
        const available = results.filter((quote): quote is StockQuote => quote !== null);
        setQuotes(available);
        setUsingFallback(available.length === 0);
      }
    }

    void refresh();
    const intervalId = window.setInterval(() => void refresh(), 30_000);
    return () => {
      disposed = true;
      window.clearInterval(intervalId);
    };
  }, []);

  const items = usingFallback
    ? fallbackQuotes.map(({ symbol, price }) => ({
        symbol,
        price,
        change: "sample",
        isUp: true,
      }))
    : quotes.map((quote) => ({
        symbol: quote.symbol,
        price: formatPrice(quote.currentPrice),
        change: `${quote.change >= 0 ? "+" : ""}${quote.percentChange.toFixed(2)}%`,
        isUp: quote.change >= 0,
      }));

  const renderItems = () =>
    items.map((item) => (
      <span
        key={`${item.symbol}-${item.price}`}
        className="inline-flex items-center gap-3 px-6 font-mono text-xs font-medium tabular-nums sm:px-8 sm:text-sm"
      >
        <span className="font-sans font-bold tracking-wide">{item.symbol}</span>
        <span>{item.price}</span>
        <span className={item.isUp ? "text-teal-300" : "text-amber-100"}>{item.change}</span>
        <span aria-hidden="true" className="ml-3 size-1.5 bg-amber-300" />
      </span>
    ));

  return (
    <div
      aria-label={
        usingFallback
          ? "Market ticker with illustrative prices while live quotes are unavailable"
          : "Live stock prices"
      }
      className="market-ticker overflow-hidden border-b border-slate-800 bg-slate-950 py-2.5 text-white"
      role="region"
    >
      <div className="flex items-center">
        <span className="relative z-10 shrink-0 bg-slate-950 px-4 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300 sm:px-6">
          Market pulse
        </span>
        {items.length > 0 ? (
          <div className="min-w-0 overflow-hidden">
            <div className="market-ticker-track flex w-max motion-reduce:animate-none">
              <div className="flex items-center" aria-hidden="true">
                {renderItems()}
              </div>
              <div className="flex items-center" aria-hidden="true">
                {renderItems()}
              </div>
            </div>
          </div>
        ) : (
          <p className="px-5 text-xs text-slate-200" role="status">
            Loading live prices…
          </p>
        )}
      </div>
      {usingFallback && (
        <span className="sr-only">Illustrative sample prices, not current market quotes.</span>
      )}
      {items.length > 0 && (
        <ul className="sr-only" aria-live="polite" aria-label="Current ticker quotes">
          {items.map((item) => (
            <li key={item.symbol}>
              {item.symbol}: {item.price}, change {item.change}
              {usingFallback ? ", illustrative sample only" : ""}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
