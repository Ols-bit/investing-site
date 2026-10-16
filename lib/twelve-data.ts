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
  "1W": { interval: "1h", outputsize: 50, revalidate: 3600 },
  "1M": { interval: "1day", outputsize: 32, revalidate: 3600 },
  "3M": { interval: "1day", outputsize: 70, revalidate: 3600 },
  "6M": { interval: "1day", outputsize: 140, revalidate: 3600 },
  YTD: { interval: "1day", outputsize: 250, revalidate: 3600, yearToDate: true },
  "1Y": { interval: "1day", outputsize: 260, revalidate: 3600 },
  "5Y": { interval: "1week", outputsize: 260, revalidate: 86400 },
  ALL: { interval: "1month", outputsize: MAX_OUTPUT_SIZE, revalidate: 86400 },
};

type TwelveDataErrorKind = "missing-key" | "rate-limit" | "unavailable";

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

function parseTimestamp(value: string): number | null {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?(Z|[+-]\d{2}:\d{2})?)?$/,
  );
  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, millisecondText, zone] =
    match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText ?? 0);
  const minute = Number(minuteText ?? 0);
  const second = Number(secondText ?? 0);
  const millisecond = Number((millisecondText ?? "").padEnd(3, "0"));

  if (month < 1 || month > 12 || hour > 23 || minute > 59 || second > 59) {
    return null;
  }
  const calendarDate = new Date(0);
  calendarDate.setUTCFullYear(year, month - 1, day);
  calendarDate.setUTCHours(0, 0, 0, 0);
  if (
    day < 1 ||
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) {
    return null;
  }

  if (zone) {
    const zonedTime = Date.parse(value.replace(" ", "T"));
    return Number.isFinite(zonedTime) ? zonedTime : null;
  }

  const timestamp = calendarDate.getTime() + ((hour * 60 + minute) * 60 + second) * 1000 + millisecond;
  return Number.isFinite(timestamp) ? timestamp : null;
}

function parsePoint(value: unknown): HistoryPoint | null {
  if (!isRecord(value) || typeof value.datetime !== "string") {
    return null;
  }
  const timestamp = parseTimestamp(value.datetime);
  const close = parseNumber(value.close);
  if (timestamp === null || close === undefined || close <= 0) {
    return null;
  }
  const open = parseNumber(value.open);
  const high = parseNumber(value.high);
  const low = parseNumber(value.low);
  const volume = parseNumber(value.volume);
  return {
    time: value.datetime,
    timestamp,
    close,
    ...(open === undefined ? {} : { open }),
    ...(high === undefined ? {} : { high }),
    ...(low === undefined ? {} : { low }),
    ...(volume === undefined ? {} : { volume }),
  };
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
    return { symbol, range, points: [] };
  }

  let points = payload.values
    .map(parsePoint)
    .filter((point): point is HistoryPoint => point !== null)
    .sort((left, right) => left.timestamp - right.timestamp);

  if (range === "1D" && points.length > 0) {
    const latestTradingDate = new Date(points.at(-1)!.timestamp).toISOString().slice(0, 10);
    points = points.filter(
      (point) => new Date(point.timestamp).toISOString().slice(0, 10) === latestTradingDate,
    );
  }
  return { symbol, range, points };
}

export function getHistoryErrorResponse(error: unknown) {
  return errorResponse(error);
}
