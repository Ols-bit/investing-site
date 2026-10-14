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

export const HISTORY_RANGES = [
  "1D",
  "1W",
  "1M",
  "3M",
  "6M",
  "YTD",
  "1Y",
  "5Y",
  "ALL",
] as const;

export type HistoryRange = (typeof HISTORY_RANGES)[number];

export type HistoryPoint = {
  time: string;
  close: number;
  open?: number;
  high?: number;
  low?: number;
  volume?: number;
};

export type StockHistory = {
  symbol: string;
  range: HistoryRange;
  points: HistoryPoint[];
};

export type MarketNewsCategory = "general" | "forex" | "crypto" | "merger";

export type MarketNewsArticle = {
  id: number;
  headline: string;
  source: string;
  summary: string;
  url: string;
  image: string;
  datetime: number;
  related: string;
  category: string;
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

export function isStockHistory(value: unknown): value is StockHistory {
  return (
    value !== null &&
    typeof value === "object" &&
    "symbol" in value &&
    typeof value.symbol === "string" &&
    "range" in value &&
    typeof value.range === "string" &&
    HISTORY_RANGES.includes(value.range as HistoryRange) &&
    "points" in value &&
    Array.isArray(value.points) &&
    value.points.every(
      (point) =>
        point !== null &&
        typeof point === "object" &&
        "time" in point &&
        typeof point.time === "string" &&
        "close" in point &&
        typeof point.close === "number" &&
        Number.isFinite(point.close),
    )
  );
}

export function isMarketNewsArticle(value: unknown): value is MarketNewsArticle {
  return (
    value !== null &&
    typeof value === "object" &&
    "id" in value &&
    typeof value.id === "number" &&
    Number.isFinite(value.id) &&
    "headline" in value &&
    typeof value.headline === "string" &&
    "source" in value &&
    typeof value.source === "string" &&
    "summary" in value &&
    typeof value.summary === "string" &&
    "url" in value &&
    typeof value.url === "string" &&
    /^https?:\/\//i.test(value.url) &&
    "datetime" in value &&
    typeof value.datetime === "number" &&
    Number.isFinite(value.datetime)
  );
}

export const DEFAULT_WATCHLIST: StockSearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
];
