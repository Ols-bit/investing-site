import {
  isMarketNewsArticle,
  type MarketNewsArticle,
  type MarketNewsCategory,
  type StockQuote,
  type StockSearchResult,
} from "@/lib/stock-types";

const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

type FinnhubFailureKind =
  | "missing-key"
  | "rate-limit"
  | "unavailable"
  | "no-quote"
  | "no-news";

export class FinnhubError extends Error {
  constructor(readonly kind: FinnhubFailureKind) {
    super(kind);
    this.name = "FinnhubError";
  }
}

function apiKey() {
  const key = process.env.FINNHUB_API_KEY;
  if (!key) {
    throw new FinnhubError("missing-key");
  }
  return key;
}

async function requestFinnhub(path: string, revalidate: number): Promise<unknown> {
  const url = new URL(`${FINNHUB_BASE_URL}${path}`);
  url.searchParams.set("token", apiKey());

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate } });
  } catch {
    throw new FinnhubError("unavailable");
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new FinnhubError("rate-limit");
    }
    throw new FinnhubError("unavailable");
  }

  try {
    return await response.json();
  } catch {
    throw new FinnhubError("unavailable");
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export async function getStockQuote(symbol: string): Promise<StockQuote> {
  const result = await requestFinnhub(`/quote?symbol=${encodeURIComponent(symbol)}`, 5);

  if (
    !isRecord(result) ||
    !isFiniteNumber(result.c) ||
    !isFiniteNumber(result.d) ||
    !isFiniteNumber(result.dp) ||
    !isFiniteNumber(result.h) ||
    !isFiniteNumber(result.l) ||
    !isFiniteNumber(result.pc) ||
    !isFiniteNumber(result.t) ||
    result.c <= 0 ||
    result.pc <= 0
  ) {
    throw new FinnhubError("no-quote");
  }

  return {
    symbol,
    currentPrice: result.c,
    change: result.d,
    percentChange: result.dp,
    high: result.h,
    low: result.l,
    previousClose: result.pc,
    timestamp: result.t,
  };
}

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  const result = await requestFinnhub(`/search?q=${encodeURIComponent(query)}`, 300);
  if (!isRecord(result) || !Array.isArray(result.result)) {
    throw new FinnhubError("unavailable");
  }

  return result.result
    .filter(
      (
        item,
      ): item is Record<string, unknown> & { symbol: string; description: string } =>
        isRecord(item) &&
        item.type === "Common Stock" &&
        typeof item.symbol === "string" &&
        typeof item.description === "string",
    )
    .map((item) => ({
      symbol: item.symbol,
      name: item.description,
    }))
    .filter((item) => item.symbol.length > 0 && item.name.length > 0)
    .slice(0, 8);
}

export async function getMarketNews(
  category: MarketNewsCategory,
): Promise<MarketNewsArticle[]> {
  const result = await requestFinnhub(
    `/news?category=${encodeURIComponent(category)}`,
    300,
  );
  if (!Array.isArray(result)) {
    throw new FinnhubError("no-news");
  }
  return result.filter(isMarketNewsArticle).map((article) => ({
    id: article.id,
    headline: article.headline,
    source: article.source,
    summary: article.summary,
    url: article.url,
    image: typeof article.image === "string" ? article.image : "",
    datetime: article.datetime,
    related: typeof article.related === "string" ? article.related : "",
    category: typeof article.category === "string" ? article.category : category,
  }));
}

export async function getCompanyNews(symbol: string): Promise<MarketNewsArticle[]> {
  const to = new Date();
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - 7);
  const dateString = (date: Date) => date.toISOString().slice(0, 10);
  const result = await requestFinnhub(
    `/company-news?symbol=${encodeURIComponent(symbol)}&from=${dateString(from)}&to=${dateString(to)}`,
    300,
  );
  if (!Array.isArray(result)) {
    throw new FinnhubError("no-news");
  }
  return result.filter(isMarketNewsArticle).map((article) => ({
    id: article.id,
    headline: article.headline,
    source: article.source,
    summary: article.summary,
    url: article.url,
    image: typeof article.image === "string" ? article.image : "",
    datetime: article.datetime,
    related: typeof article.related === "string" ? article.related : symbol,
    category: typeof article.category === "string" ? article.category : "",
  }));
}

export function getFinnhubErrorResponse(error: unknown): Response {
  if (error instanceof FinnhubError) {
    const responseByKind: Record<FinnhubFailureKind, { status: number; message: string }> = {
      "missing-key": {
        status: 503,
        message: "Market data is not configured yet. Please try again later.",
      },
      "rate-limit": {
        status: 429,
        message: "Market data is temporarily busy. Please try again in a moment.",
      },
      unavailable: {
        status: 502,
        message: "Market data is temporarily unavailable. Please try again.",
      },
      "no-quote": {
        status: 404,
        message: "No recent quote is available for this symbol.",
      },
      "no-news": {
        status: 502,
        message: "News is temporarily unavailable. Please try again later.",
      },
    };
    const { status, message } = responseByKind[error.kind];
    return Response.json({ error: message }, { status });
  }

  console.error("Unexpected error while requesting Finnhub data.", error);
  return Response.json(
    { error: "Market data is temporarily unavailable. Please try again." },
    { status: 502 },
  );
}
