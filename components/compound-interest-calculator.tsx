"use client";

import { useMemo, useState } from "react";

type CalculatorValues = {
  startingAmount: number;
  monthlyContribution: number;
  annualReturn: number;
  years: number;
};

const defaults: CalculatorValues = {
  startingAmount: 1000,
  monthlyContribution: 100,
  annualReturn: 7,
  years: 20,
};

const inputSettings: {
  key: keyof CalculatorValues;
  label: string;
  min: number;
  max: number;
  step: number;
  suffix: string;
}[] = [
  { key: "startingAmount", label: "Starting amount", min: 0, max: 100000, step: 100, suffix: "" },
  { key: "monthlyContribution", label: "Monthly contribution", min: 0, max: 5000, step: 10, suffix: "/month" },
  { key: "annualReturn", label: "Annual return", min: 0, max: 20, step: 0.1, suffix: "%" },
  { key: "years", label: "Time invested", min: 1, max: 50, step: 1, suffix: "years" },
];

const currencyFormatter = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function formatCompactCurrency(value: number) {
  if (value >= 1_000_000) {
    return `£${(value / 1_000_000).toFixed(1)}m`;
  }
  if (value >= 10_000) {
    return `£${Math.round(value / 1_000)}k`;
  }
  if (value >= 1_000) {
    return `£${(value / 1_000).toFixed(1)}k`;
  }
  return currencyFormatter.format(value);
}

export function CompoundInterestCalculator() {
  const [values, setValues] = useState(defaults);
  const calculation = useMemo(() => {
    const monthlyRate = values.annualReturn / 100 / 12;
    const months = values.years * 12;
    const points = [{ year: 0, contributed: values.startingAmount, balance: values.startingAmount }];
    let balance = values.startingAmount;
    let contributed = values.startingAmount;

    for (let month = 1; month <= months; month += 1) {
      balance = balance * (1 + monthlyRate) + values.monthlyContribution;
      contributed += values.monthlyContribution;

      if (month % 12 === 0) {
        points.push({ year: month / 12, contributed, balance });
      }
    }

    return {
      points,
      contributed,
      balance,
      interest: balance - contributed,
    };
  }, [values]);

  const chart = useMemo(() => {
    const width = 640;
    const height = 260;
    const padding = { top: 16, right: 20, bottom: 34, left: 64 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    const maximum = Math.max(calculation.balance, 1);
    const x = (index: number) =>
      padding.left + (index / Math.max(calculation.points.length - 1, 1)) * chartWidth;
    const y = (amount: number) => padding.top + chartHeight - (amount / maximum) * chartHeight;
    const contributedPath = calculation.points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.contributed)}`)
      .join(" ");
    const balancePath = calculation.points
      .map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.balance)}`)
      .join(" ");
    const growthAreaPath = [
      ...calculation.points.map((point, index) => `${index === 0 ? "M" : "L"} ${x(index)} ${y(point.balance)}`),
      ...calculation.points
        .slice()
        .reverse()
        .map((point, index) => `L ${x(calculation.points.length - 1 - index)} ${y(point.contributed)}`),
      "Z",
    ].join(" ");
    const contributedAreaPath = [
      `M ${x(0)} ${padding.top + chartHeight}`,
      ...calculation.points.map((point, index) => `L ${x(index)} ${y(point.contributed)}`),
      `L ${x(calculation.points.length - 1)} ${padding.top + chartHeight}`,
      "Z",
    ].join(" ");

    return {
      width,
      height,
      padding,
      chartHeight,
      x,
      y,
      maximum,
      contributedPath,
      balancePath,
      growthAreaPath,
      contributedAreaPath,
    };
  }, [calculation]);

  function updateValue(key: keyof CalculatorValues, value: number) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <section
      aria-labelledby="compound-calculator-title"
      className="my-8 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800 sm:p-7"
    >
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
          Calculator
        </p>
        <h2 id="compound-calculator-title" className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          Compound interest calculator
        </h2>
      </div>

      <div className="grid gap-x-8 gap-y-5 md:grid-cols-2">
        {inputSettings.map(({ key, label, min, max, step, suffix }) => (
          <div key={key}>
            <div className="mb-2 flex items-center justify-between gap-3">
              <label htmlFor={`${key}-number`} className="text-sm font-medium">
                {label}
              </label>
              <div className="flex items-center gap-1">
                <input
                  id={`${key}-number`}
                  aria-label={`${label} value`}
                  className="w-28 border border-slate-300 bg-white px-2 py-1.5 text-right text-sm text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                  type="number"
                  min={min}
                  max={max}
                  step={step}
                  value={values[key]}
                  onChange={(event) => {
                    const value = Number(event.target.value);
                    if (Number.isFinite(value)) {
                      updateValue(key, Math.min(max, Math.max(min, value)));
                    }
                  }}
                />
                {suffix && <span className="min-w-12 text-xs text-slate-500 dark:text-slate-400">{suffix}</span>}
              </div>
            </div>
            <input
              aria-label={`${label} slider`}
              className="h-2 w-full cursor-pointer accent-teal-700"
              type="range"
              min={min}
              max={max}
              step={step}
              value={values[key]}
              onChange={(event) => updateValue(key, Number(event.target.value))}
            />
          </div>
        ))}
      </div>

      <div className="mt-7 grid gap-3 sm:grid-cols-3">
        {[
          { label: "Estimated final balance", value: calculation.balance, emphasis: true },
          { label: "Total contributed", value: calculation.contributed },
          { label: "Estimated interest earned", value: calculation.interest },
        ].map(({ label, value, emphasis }) => (
          <div
            key={label}
            className={`border-t-2 p-4 ${emphasis ? "border-teal-700 bg-white" : "border-slate-300 bg-white/70"}`}
          >
            <p className="text-xs font-medium leading-5 text-slate-600 dark:text-slate-300">{label}</p>
            <p className="mt-1 text-xl font-semibold tracking-tight text-slate-950 dark:text-white">
              {currencyFormatter.format(value)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 border-t-2 border-slate-950 bg-white p-3 sm:p-5">
        <p className="mb-3 text-sm font-bold text-slate-800">Illustrated balance over time</p>
        <div className="w-full overflow-x-auto">
          <svg
            aria-label={`Estimated balance grows from ${currencyFormatter.format(values.startingAmount)} to ${currencyFormatter.format(calculation.balance)} over ${values.years} years. The chart separates contributions from growth.`}
            className="min-w-[28rem]"
            role="img"
            viewBox={`0 0 ${chart.width} ${chart.height}`}
          >
            {[0, 0.5, 1].map((fraction) => {
              const value = chart.maximum * fraction;
              const lineY = chart.y(value);
              return (
                <g key={fraction}>
                  <line
                    x1={chart.padding.left}
                    x2={chart.width - chart.padding.right}
                    y1={lineY}
                    y2={lineY}
                    className="stroke-slate-200"
                    strokeDasharray={fraction === 0 ? undefined : "4 5"}
                  />
                  <text x={chart.padding.left - 8} y={lineY + 4} textAnchor="end" className="fill-slate-500 text-[11px]">
                    {formatCompactCurrency(value)}
                  </text>
                </g>
              );
            })}
            <path d={chart.contributedAreaPath} className="fill-teal-200/80" />
            <path d={chart.growthAreaPath} className="fill-amber-300/70" />
            <path d={chart.contributedPath} fill="none" className="stroke-teal-700" strokeWidth="2" />
            <path d={chart.balancePath} fill="none" className="stroke-amber-700" strokeWidth="2.5" />
            <text x={chart.padding.left} y={chart.height - 8} className="fill-slate-500 text-[11px]">Year 0</text>
            <text x={chart.width - chart.padding.right} y={chart.height - 8} textAnchor="end" className="fill-slate-500 text-[11px]">
              Year {values.years}
            </text>
          </svg>
        </div>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600 dark:text-slate-300">
          <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-teal-600 dark:bg-teal-300" />Money you put in</span>
          <span className="inline-flex items-center gap-2"><span aria-hidden="true" className="size-2.5 rounded-full bg-amber-500 dark:bg-amber-300" />Illustrated growth</span>
        </div>
      </div>

      <p className="mt-4 text-xs leading-5 text-slate-600 dark:text-slate-300">
        Illustration only, not financial advice. Real returns vary.
      </p>
    </section>
  );
}
