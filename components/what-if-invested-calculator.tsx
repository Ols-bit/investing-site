"use client";

import { useId, useState, type FormEvent } from "react";

import { CalculatorLineChart } from "@/components/calculator-line-chart";
import { US_TICKERS } from "@/lib/tickers";
import {
  isStockHistory,
  type HistoryPoint,
} from "@/lib/stock-types";

const periodOptions = [
  { value: "1Y", label: "1 year", apiRange: "1Y" },
  { value: "5Y", label: "5 years", apiRange: "5Y" },
  { value: "10Y", label: "10 years", apiRange: "ALL" },
  { value: "MAX", label: "Max available", apiRange: "ALL" },
] as const;

type Period = (typeof periodOptions)[number]["value"];
type Calculation = {
  amount: number;
  start: HistoryPoint;
  end: HistoryPoint;
  points: HistoryPoint[];
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

function parseTimestamp(point: HistoryPoint) {
  return point.timestamp;
}

function getPeriodPoints(points: HistoryPoint[], period: Period) {
  const usable = points.filter(
    (point) => Number.isFinite(point.close) && point.close > 0 && Number.isFinite(parseTimestamp(point)),
  );
  if (period === "MAX" || usable.length < 2) {
    return usable;
  }

  const years = period === "1Y" ? 1 : period === "5Y" ? 5 : 10;
  const lastDate = new Date(parseTimestamp(usable[usable.length - 1]));
  const cutoffDate = new Date(lastDate);
  cutoffDate.setUTCFullYear(cutoffDate.getUTCFullYear() - years);
  const filtered = usable.filter((point) => parseTimestamp(point) >= cutoffDate.getTime());
  return filtered.length >= 2 ? filtered : usable.slice(-2);
}

function samplePoints(points: HistoryPoint[], count = 80) {
  if (points.length <= count) {
    return points;
  }
  return Array.from({ length: count }, (_, index) =>
    points[Math.round((index / (count - 1)) * (points.length - 1))],
  );
}

function formatDate(point: HistoryPoint) {
  const date = new Date(parseTimestamp(point));
  return new Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function getErrorMessage(value: unknown) {
  if (
    value !== null &&
    typeof value === "object" &&
    "error" in value &&
    typeof value.error === "string"
  ) {
    return value.error;
  }
  return "Historical prices could not be loaded. Please try again.";
}

export function WhatIfInvestedCalculator() {
  const id = useId();
  const [symbol, setSymbol] = useState<string>("AAPL");
  const [period, setPeriod] = useState<Period>("1Y");
  const [amount, setAmount] = useState("1000");
  const [calculation, setCalculation] = useState<Calculation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0 || parsedAmount > 10_000_000) {
      setError("Enter an amount greater than £0 and no more than £10,000,000.");
      setCalculation(null);
      return;
    }

    const selectedPeriod = periodOptions.find((option) => option.value === period);
    if (!selectedPeriod) {
      setError("Choose one of the available time periods.");
      setCalculation(null);
      return;
    }

    setLoading(true);
    setError("");
    setCalculation(null);
    try {
      const params = new URLSearchParams({ symbol, range: selectedPeriod.apiRange });
      const response = await fetch(`/api/history?${params.toString()}`);
      let result: unknown;
      try {
        result = await response.json();
      } catch {
        setError("The history service returned an unreadable response. Please try again.");
        return;
      }
      if (!response.ok) {
        setError(getErrorMessage(result));
        return;
      }
      if (!isStockHistory(result)) {
        setError("The price history could not be read. Please try again.");
        return;
      }

      const points = getPeriodPoints(result.points, period);
      if (points.length < 2) {
        setError(`There is not enough historical data for ${symbol} over that period.`);
        return;
      }
      setCalculation({
        amount: parsedAmount,
        start: points[0],
        end: points[points.length - 1],
        points,
      });
    } catch {
      setError("Historical prices could not be loaded. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const unitsValue = calculation
    ? (calculation.amount / calculation.start.close) * calculation.end.close
    : 0;
  const change = unitsValue - (calculation?.amount ?? 0);
  const percentChange = calculation
    ? ((calculation.end.close - calculation.start.close) / calculation.start.close) * 100
    : 0;
  const chartPoints = calculation ? samplePoints(calculation.points) : [];

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="my-8 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
        Calculator
      </p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        What if I&apos;d invested?
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700">
        Compare a one-time amount with a stock&apos;s past price movement. This is a
        historical illustration, not a forecast.
      </p>

      <form onSubmit={calculate} className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor={`${id}-symbol`} className="mb-2 block text-sm font-semibold text-slate-900">
            Stock
          </label>
          <select
            id={`${id}-symbol`}
            value={symbol}
            onChange={(event) => {
              setSymbol(event.target.value);
              setCalculation(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          >
            {US_TICKERS.map((ticker) => (
              <option key={ticker.symbol} value={ticker.symbol}>
                {ticker.symbol} — {ticker.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-period`} className="mb-2 block text-sm font-semibold text-slate-900">
            Period
          </label>
          <select
            id={`${id}-period`}
            value={period}
            onChange={(event) => {
              setPeriod(event.target.value as Period);
              setCalculation(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-amount`} className="mb-2 block text-sm font-semibold text-slate-900">
            Amount invested (GBP)
          </label>
          <input
            id={`${id}-amount`}
            type="number"
            min="0.01"
            max="10000000"
            step="0.01"
            inputMode="decimal"
            value={amount}
            onChange={(event) => {
              setAmount(event.target.value);
              setCalculation(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full bg-slate-950 px-5 font-bold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 disabled:cursor-wait disabled:opacity-70 sm:col-span-3 sm:w-fit"
        >
          {loading ? "Loading price history…" : error ? "Try again" : "Calculate illustration"}
        </button>
      </form>

      {loading && (
        <div aria-label="Loading price history" className="mt-6 animate-pulse">
          <div className="mb-3 h-5 w-48 bg-slate-200" />
          <div className="h-48 border-b-2 border-l-2 border-slate-300 bg-white" />
        </div>
      )}
      {error && !loading && (
        <p role="alert" className="mt-5 border-l-4 border-rose-700 bg-rose-50 p-4 leading-6 text-rose-900">
          {error}
        </p>
      )}
      {calculation && !loading && (
        <>
          <div className="mt-6 grid gap-4 border-t-2 border-slate-950 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-600">Illustrated value today</p>
              <p className="mt-1 font-display text-2xl font-extrabold tabular-nums text-slate-950">
                {currency.format(unitsValue)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Price change</p>
              <p className={`mt-1 text-xl font-bold tabular-nums ${change >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
                {change >= 0 ? "+" : ""}{currency.format(change)}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Price movement</p>
              <p className={`mt-1 text-xl font-bold tabular-nums ${percentChange >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
                {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
              </p>
            </div>
          </div>
          <CalculatorLineChart
            description={`${symbol} historical price movement from ${formatDate(calculation.start)} to ${formatDate(calculation.end)}.`}
            series={[
              {
                label: `${symbol} price-based value`,
                color: "#176b45",
                values: chartPoints.map(
                  (point) => (calculation.amount / calculation.start.close) * point.close,
                ),
              },
            ]}
            xLabels={[
              formatDate(chartPoints[0]),
              formatDate(chartPoints[Math.floor(chartPoints.length / 2)]),
              formatDate(chartPoints[chartPoints.length - 1]),
            ]}
          />
          <p className="mt-4 text-sm leading-6 text-slate-600">
            Uses the first and last available closing prices in the selected period.
            It excludes dividends, fees, taxes, currency conversion and the effect of
            investing at other times. Past performance does not predict future results.
            Illustration only; not financial advice.
          </p>
        </>
      )}
      {!loading && !error && !calculation && (
        <p className="mt-5 text-sm leading-6 text-slate-600">
          Choose a stock, amount and period to see a price-only illustration.
        </p>
      )}
    </section>
  );
}
