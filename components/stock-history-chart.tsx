"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  HISTORY_RANGES,
  isStockHistory,
  type ApiError,
  type HistoryPoint,
  type HistoryRange,
  type StockHistory,
} from "@/lib/stock-types";

type StockHistoryChartProps = {
  symbol: string;
};

type HistoryView = {
  key: string;
  data?: StockHistory;
  error?: string;
};

const WIDTH = 680;
const HEIGHT = 250;
const PADDING = { top: 18, right: 14, bottom: 34, left: 62 };

function isApiError(value: unknown): value is ApiError {
  return (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  );
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: value < 1 ? 4 : 2,
  }).format(value);
}

function parsePointTime(point: HistoryPoint) {
  const normalized = point.time.includes("T") ? point.time : point.time.replace(" ", "T");
  return new Date(`${normalized}Z`);
}

function formatAxisTime(point: HistoryPoint, range: HistoryRange) {
  const date = parsePointTime(point);
  if (range === "1D") {
    return new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "UTC",
    }).format(date);
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function formatTooltipTime(point: HistoryPoint, range: HistoryRange) {
  return new Intl.DateTimeFormat(undefined, {
    ...(range === "1D"
      ? { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }
      : { year: "numeric", month: "short", day: "numeric" }),
    timeZone: "UTC",
    timeZoneName: range === "1D" ? "short" : undefined,
  }).format(parsePointTime(point));
}

function ChartSkeleton() {
  return (
    <div aria-label="Loading price history" className="animate-pulse">
      <div className="mb-4 h-3 w-28 bg-slate-200" />
      <div className="h-56 border-b border-l border-slate-300 bg-slate-50 p-4">
        <div className="h-full w-full border-b border-t border-dashed border-slate-200" />
      </div>
    </div>
  );
}

function PricePlot({ data, range }: { data: StockHistory; range: HistoryRange }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const points = data.points;

  const plot = useMemo(() => {
    const plotWidth = WIDTH - PADDING.left - PADDING.right;
    const plotHeight = HEIGHT - PADDING.top - PADDING.bottom;
    const prices = points.map((point) => point.close);
    const minValue = Math.min(...prices);
    const maxValue = Math.max(...prices);
    const spread = maxValue - minValue || Math.max(maxValue * 0.02, 0.01);
    const min = Math.max(0, minValue - spread * 0.12);
    const max = maxValue + spread * 0.12;
    const x = (index: number) =>
      PADDING.left + (index / Math.max(points.length - 1, 1)) * plotWidth;
    const y = (value: number) =>
      PADDING.top + plotHeight - ((value - min) / (max - min)) * plotHeight;
    const path = points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.close)}`)
      .join(" ");
    const first = points[0].close;
    const last = points[points.length - 1].close;
    const change = last - first;
    const percentChange = first === 0 ? 0 : (change / first) * 100;
    const active = activeIndex === null ? null : points[activeIndex];
    const up = change >= 0;
    const color = up ? "#176b45" : "#b83f2c";

    return {
      plotWidth,
      plotHeight,
      min,
      max,
      x,
      y,
      path,
      first,
      last,
      change,
      percentChange,
      active,
      up,
      color,
      activeX: activeIndex === null ? null : x(activeIndex),
    };
  }, [activeIndex, points]);

  function setPointFromPointer(clientX: number) {
    const bounds = svgRef.current?.getBoundingClientRect();
    if (!bounds || points.length < 2) return;
    const svgX = ((clientX - bounds.left) / bounds.width) * WIDTH;
    const clampedX = Math.min(
      WIDTH - PADDING.right,
      Math.max(PADDING.left, svgX),
    );
    const fraction = (clampedX - PADDING.left) / plot.plotWidth;
    setActiveIndex(Math.round(fraction * (points.length - 1)));
  }

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">
            {range} change
          </p>
          <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-slate-950">
            {formatPrice(plot.last)}
          </p>
        </div>
        <p
          className={`text-sm font-bold tabular-nums ${plot.up ? "text-emerald-800" : "text-rose-700"}`}
        >
          {plot.change >= 0 ? "+" : ""}
          {formatPrice(plot.change)} ({plot.percentChange >= 0 ? "+" : ""}
          {plot.percentChange.toFixed(2)}%)
        </p>
      </div>

      <div className="relative touch-pan-y">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="block h-auto w-full select-none"
          role="img"
          aria-label={`${data.symbol} price chart for ${range}. Price moved from ${formatPrice(plot.first)} to ${formatPrice(plot.last)}.`}
          onPointerDown={(event) => setPointFromPointer(event.clientX)}
          onPointerMove={(event) => {
            if (event.pointerType !== "touch" || event.buttons > 0) {
              setPointFromPointer(event.clientX);
            }
          }}
          onPointerLeave={(event) => {
            if (event.pointerType !== "touch") {
              setActiveIndex(null);
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
              event.preventDefault();
              setActiveIndex((current) => {
                const index = current ?? points.length - 1;
                return Math.min(
                  points.length - 1,
                  Math.max(0, index + (event.key === "ArrowRight" ? 1 : -1)),
                );
              });
            } else if (event.key === "Escape") {
              setActiveIndex(null);
            }
          }}
          tabIndex={0}
        >
          {[0, 0.5, 1].map((fraction) => {
            const value = plot.min + (plot.max - plot.min) * fraction;
            const y = PADDING.top + plot.plotHeight * (1 - fraction);
            return (
              <g key={fraction}>
                <line
                  x1={PADDING.left}
                  x2={WIDTH - PADDING.right}
                  y1={y}
                  y2={y}
                  stroke="#d5d9d2"
                  strokeWidth="1"
                />
                <text
                  x={PADDING.left - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#65736a"
                  fontSize="11"
                >
                  {formatPrice(value)}
                </text>
              </g>
            );
          })}
          <path d={plot.path} fill="none" stroke={plot.color} strokeWidth="3" />
          {plot.activeX !== null && plot.active && (
            <>
              <line
                x1={plot.activeX}
                x2={plot.activeX}
                y1={PADDING.top}
                y2={HEIGHT - PADDING.bottom}
                stroke="#65736a"
                strokeWidth="1"
                strokeDasharray="3 4"
              />
              <circle
                cx={plot.activeX}
                cy={plot.y(plot.active.close)}
                r="5"
                fill={plot.color}
                stroke="#f5f1e6"
                strokeWidth="2"
              />
            </>
          )}
          <rect
            x={PADDING.left}
            y={PADDING.top}
            width={plot.plotWidth}
            height={plot.plotHeight}
            fill="transparent"
            className="cursor-crosshair"
            onPointerDown={(event) => {
              event.stopPropagation();
              setPointFromPointer(event.clientX);
            }}
            onPointerMove={(event) => {
              if (event.pointerType !== "touch" || event.buttons > 0) {
                setPointFromPointer(event.clientX);
              }
            }}
          />
          {[0, Math.floor((points.length - 1) / 2), points.length - 1]
            .filter((index, position, all) => all.indexOf(index) === position)
            .map((index) => (
              <text
                key={`${index}-${points[index].time}`}
                x={plot.x(index)}
                y={HEIGHT - 8}
                textAnchor={index === 0 ? "start" : index === points.length - 1 ? "end" : "middle"}
                fill="#65736a"
                fontSize="11"
              >
                {formatAxisTime(points[index], range)}
              </text>
            ))}
        </svg>
        {plot.active && (
          <div
            className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 border border-slate-950 bg-white px-3 py-2 text-xs text-slate-950"
            style={{
              left: `${Math.max(
                16,
                Math.min(
                  84,
                  (activeIndex! / Math.max(points.length - 1, 1)) * 100,
                ),
              )}%`,
            }}
            role="status"
          >
            <span className="block font-bold tabular-nums">{formatPrice(plot.active.close)}</span>
            <span className="mt-0.5 block text-slate-600">
              {formatTooltipTime(plot.active, range)}
            </span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs text-slate-500">
        Chart data may be delayed. Not financial advice.
      </p>
    </div>
  );
}

export function StockHistoryChart({ symbol }: StockHistoryChartProps) {
  const [range, setRange] = useState<HistoryRange>("1D");
  const [retryCount, setRetryCount] = useState(0);
  const [view, setView] = useState<HistoryView | null>(null);
  const key = `${symbol}:${range}`;

  useEffect(() => {
    const controller = new AbortController();
    async function loadHistory() {
      try {
        const response = await fetch(
          `/api/history?symbol=${encodeURIComponent(symbol)}&range=${range}`,
          { signal: controller.signal },
        );
        const payload: unknown = await response.json();
        if (!response.ok) {
          throw new Error(
            isApiError(payload) ? payload.error : "Chart data is temporarily unavailable.",
          );
        }
        if (!isStockHistory(payload)) {
          throw new Error("Chart data returned an unexpected response.");
        }
        setView({ key, data: payload });
      } catch (error) {
        if (!controller.signal.aborted) {
          setView({
            key,
            error:
              error instanceof Error
                ? error.message
                : "Chart data is temporarily unavailable.",
          });
        }
      }
    }
    void loadHistory();
    return () => controller.abort();
  }, [key, range, retryCount, symbol]);

  const currentView = view?.key === key ? view : null;

  return (
    <section aria-label={`${symbol} price history`} className="mt-6 border-y-2 border-slate-950 py-5">
      <div
        aria-label="Chart time range"
        className="mb-5 flex gap-1 overflow-x-auto pb-1"
        role="group"
      >
        {HISTORY_RANGES.map((item) => {
          const active = range === item;
          return (
            <button
              key={item}
              type="button"
              aria-pressed={active}
              onClick={() => setRange(item)}
              className={`min-h-10 min-w-11 shrink-0 px-2 text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                active
                  ? "bg-slate-950 text-white"
                  : "text-slate-600 hover:bg-teal-100 hover:text-slate-950"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {!currentView && <ChartSkeleton />}
      {currentView?.error && (
        <div className="border-l-4 border-rose-500 bg-rose-50 px-4 py-4" role="alert">
          <p className="text-sm text-rose-950">{currentView.error}</p>
          <button
            type="button"
            onClick={() => setRetryCount((count) => count + 1)}
            className="mt-3 min-h-10 border border-rose-800 px-4 py-2 text-sm font-bold text-rose-900 transition-colors hover:bg-rose-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Retry
          </button>
        </div>
      )}
      {currentView?.data && currentView.data.points.length === 0 && (
        <p className="border-t border-slate-300 py-6 text-sm text-slate-600" role="status">
          No price history is available for this range.
        </p>
      )}
      {currentView?.data && currentView.data.points.length > 0 && (
        <PricePlot data={currentView.data} range={range} />
      )}
    </section>
  );
}
