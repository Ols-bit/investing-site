export type StockSearchResult = {
  symbol: string;
  name: string;
};

export type StockQuote = {
  symbol: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  previousClose: number;
  timestamp: number;
};

export type ApiError = {
  error: string;
};

export function isStockSearchResults(value: unknown): value is StockSearchResult[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        item !== null &&
        typeof item === "object" &&
        "symbol" in item &&
        typeof item.symbol === "string" &&
        "name" in item &&
        typeof item.name === "string",
    )
  );
}

export function isStockQuote(value: unknown): value is StockQuote {
  return (
    value !== null &&
    typeof value === "object" &&
    "symbol" in value &&
    typeof value.symbol === "string" &&
    "currentPrice" in value &&
    typeof value.currentPrice === "number" &&
    "change" in value &&
    typeof value.change === "number" &&
    "percentChange" in value &&
    typeof value.percentChange === "number" &&
    "high" in value &&
    typeof value.high === "number" &&
    "low" in value &&
    typeof value.low === "number" &&
    "previousClose" in value &&
    typeof value.previousClose === "number" &&
    "timestamp" in value &&
    typeof value.timestamp === "number"
  );
}

export const DEFAULT_WATCHLIST: StockSearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
];
