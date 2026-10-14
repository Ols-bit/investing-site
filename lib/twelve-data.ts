import "server-only";

import type {
  HistoryPoint,
  HistoryRange,
  StockHistory,
} from "@/lib/stock-types";

const TWELVE_DATA_URL = "https://api.twelvedata.com/time_series";
const MAX_OUTPUT_SIZE = 5000;

type HistoryRequest = {
  interval: string;
  outputsize: number;
  revalidate: number;
  yearToDate?: boolean;
};

const rangeRequests: Record<HistoryRange, HistoryRequest> = {
  "1D": { interval: "5min", outputsize: 100, revalidate: 60 },
  "1W": { interval: "1h", outputsize: 50, revalidate: 300 },
  "1M": { interval: "1day", outputsize: 32, revalidate: 3600 },
  "3M": { interval: "1day", outputsize: 70, revalidate: 3600 },
  "6M": { interval: "1day", outputsize: 140, revalidate: 3600 },
  YTD: { interval: "1day", outputsize: 250, revalidate: 3600, yearToDate: true },
  "1Y": { interval: "1day", outputsize: 260, revalidate: 3600 },
  "5Y": { interval: "1week", outputsize: 260, revalidate: 86400 },
  ALL: { interval: "1month", outputsize: MAX_OUTPUT_SIZE, revalidate: 86400 },
};

type TwelveDataErrorKind = "missing-key" | "rate-limit" | "unavailable" | "no-data";

export class HistoryDataError extends Error {
  constructor(readonly kind: TwelveDataErrorKind) {
    super(kind);
    this.name = "HistoryDataError";
  }
}

function getApiKey() {
  const key = process.env.TWELVEDATA_API_KEY;
  if (!key) {
    throw new HistoryDataError("missing-key");
  }
  return key;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value !== "string" && typeof value !== "number") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parsePoint(value: unknown): HistoryPoint | null {
  if (!isRecord(value) || typeof value.datetime !== "string") {
    return null;
  }
  const close = parseNumber(value.close);
  if (close === undefined) {
    return null;
  }
  const open = parseNumber(value.open);
  const high = parseNumber(value.high);
  const low = parseNumber(value.low);
  const volume = parseNumber(value.volume);
  return {
    time: value.datetime,
    close,
    ...(open === undefined ? {} : { open }),
    ...(high === undefined ? {} : { high }),
    ...(low === undefined ? {} : { low }),
    ...(volume === undefined ? {} : { volume }),
  };
}

function toTimestamp(time: string) {
  const normalized = time.includes("T") ? time : time.replace(" ", "T");
  return Date.parse(`${normalized}Z`);
}

function errorResponse(error: unknown): Response {
  if (error instanceof HistoryDataError) {
    const responses: Record<TwelveDataErrorKind, { status: number; message: string }> = {
      "missing-key": {
        status: 503,
        message: "Chart data is not configured yet. Please try again later.",
      },
      "rate-limit": {
        status: 429,
        message: "Chart data is temporarily busy. Please wait a moment and try again.",
      },
      unavailable: {
        status: 502,
        message: "Chart data is temporarily unavailable. Please try again.",
      },
      "no-data": {
        status: 404,
        message: "No historical prices are available for this range.",
      },
    };
    const { status, message } = responses[error.kind];
    return Response.json({ error: message }, { status });
  }
  console.error("Unexpected error while requesting Twelve Data history.", error);
  return Response.json(
    { error: "Chart data is temporarily unavailable. Please try again." },
    { status: 502 },
  );
}

export async function getStockHistory(
  symbol: string,
  range: HistoryRange,
): Promise<StockHistory> {
  const requestOptions = rangeRequests[range];
  const url = new URL(TWELVE_DATA_URL);
  url.searchParams.set("symbol", symbol);
  url.searchParams.set("interval", requestOptions.interval);
  url.searchParams.set("outputsize", String(Math.min(requestOptions.outputsize, MAX_OUTPUT_SIZE)));
  url.searchParams.set("order", "DESC");
  url.searchParams.set("timezone", "UTC");
  if (requestOptions.yearToDate) {
    url.searchParams.set("date_from", `${new Date().getUTCFullYear()}-01-01`);
  }
  url.searchParams.set("apikey", getApiKey());

  let response: Response;
  try {
    response = await fetch(url, { next: { revalidate: requestOptions.revalidate } });
  } catch {
    throw new HistoryDataError("unavailable");
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new HistoryDataError("unavailable");
  }

  const apiErrorCode = isRecord(payload) ? String(payload.code ?? "") : "";
  if (response.status === 429 || apiErrorCode.startsWith("429")) {
    throw new HistoryDataError("rate-limit");
  }
  if (!response.ok || !isRecord(payload)) {
    throw new HistoryDataError("unavailable");
  }
  if (payload.status === "error" || "code" in payload && !("values" in payload)) {
    if (apiErrorCode.startsWith("429")) {
      throw new HistoryDataError("rate-limit");
    }
    throw new HistoryDataError("unavailable");
  }
  if (!Array.isArray(payload.values)) {
    throw new HistoryDataError("no-data");
  }

  let points = payload.values
    .map(parsePoint)
    .filter((point): point is HistoryPoint => point !== null)
    .sort((left, right) => toTimestamp(left.time) - toTimestamp(right.time));

  if (range === "1D" && points.length > 0) {
    const latestTradingDate = points.at(-1)?.time.slice(0, 10);
    points = points.filter((point) => point.time.slice(0, 10) === latestTradingDate);
  }
  if (points.length === 0) {
    throw new HistoryDataError("no-data");
  }

  return { symbol, range, points };
}

export function getHistoryErrorResponse(error: unknown) {
  return errorResponse(error);
}
