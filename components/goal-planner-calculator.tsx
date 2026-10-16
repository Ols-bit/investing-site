"use client";

import { useId, useState, type FormEvent } from "react";

import { CalculatorLineChart } from "@/components/calculator-line-chart";

type GoalResult = {
  target: number;
  years: number;
  monthlyContribution: number;
  balances: number[];
  targets: number[];
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

function projectGoal(
  startingAmount: number,
  annualReturn: number,
  years: number,
  monthlyContribution: number,
) {
  const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const balances = [startingAmount];
  let balance = startingAmount;
  for (let month = 1; month <= years * 12; month += 1) {
    balance = balance * (1 + monthlyRate) + monthlyContribution;
    if (month % 12 === 0) {
      balances.push(balance);
    }
  }
  return balances;
}

function getMonthlyContribution(
  target: number,
  startingAmount: number,
  annualReturn: number,
  years: number,
) {
  const months = years * 12;
  const monthlyRate = Math.pow(1 + annualReturn / 100, 1 / 12) - 1;
  const startingFutureValue = startingAmount * Math.pow(1 + monthlyRate, months);
  const contributionFactor =
    Math.abs(monthlyRate) < 1e-10
      ? months
      : (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate;

  return Math.max(0, (target - startingFutureValue) / contributionFactor);
}

export function GoalPlannerCalculator() {
  const id = useId();
  const [targetAmount, setTargetAmount] = useState("25000");
  const [years, setYears] = useState("10");
  const [startingAmount, setStartingAmount] = useState("1000");
  const [annualReturn, setAnnualReturn] = useState("5");
  const [result, setResult] = useState<GoalResult | null>(null);
  const [error, setError] = useState("");

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const target = Number(targetAmount);
    const duration = Number(years);
    const start = Number(startingAmount);
    const expectedReturn = Number(annualReturn);

    if (!Number.isFinite(target) || target <= 0 || target > 100_000_000) {
      setError("Enter a target greater than £0 and no more than £100,000,000.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 50) {
      setError("Choose a whole number of years from 1 to 50.");
      setResult(null);
      return;
    }
    if (!Number.isFinite(start) || start < 0 || start > 100_000_000) {
      setError("Enter a starting amount from £0 to £100,000,000.");
      setResult(null);
      return;
    }
    if (!Number.isFinite(expectedReturn) || expectedReturn < -50 || expectedReturn > 50) {
      setError("Enter an assumed annual return between -50% and 50%.");
      setResult(null);
      return;
    }

    const monthlyContribution = getMonthlyContribution(
      target,
      start,
      expectedReturn,
      duration,
    );
    const balances = projectGoal(start, expectedReturn, duration, monthlyContribution);
    setError("");
    setResult({
      target,
      years: duration,
      monthlyContribution,
      balances,
      targets: Array.from({ length: duration + 1 }, () => target),
    });
  }

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="my-8 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
        Calculator
      </p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        Goal planner
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700">
        Estimate a monthly contribution that could reach a target under one
        assumed return. Real returns are uncertain.
      </p>

      <form onSubmit={calculate} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-target`} className="mb-2 block text-sm font-semibold text-slate-900">
            Target amount (GBP)
          </label>
          <input
            id={`${id}-target`}
            type="number"
            min="0"
            max="100000000"
            step="100"
            value={targetAmount}
            onChange={(event) => {
              setTargetAmount(event.target.value);
              setResult(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          />
        </div>
        <div>
          <label htmlFor={`${id}-years`} className="mb-2 block text-sm font-semibold text-slate-900">
            Time frame (years)
          </label>
          <input
            id={`${id}-years`}
            type="number"
            min="1"
            max="50"
            step="1"
            value={years}
            onChange={(event) => {
              setYears(event.target.value);
              setResult(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          />
        </div>
        <div>
          <label htmlFor={`${id}-starting`} className="mb-2 block text-sm font-semibold text-slate-900">
            Starting amount (GBP)
          </label>
          <input
            id={`${id}-starting`}
            type="number"
            min="0"
            max="100000000"
            step="100"
            value={startingAmount}
            onChange={(event) => {
              setStartingAmount(event.target.value);
              setResult(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          />
        </div>
        <div>
          <label htmlFor={`${id}-return`} className="mb-2 block text-sm font-semibold text-slate-900">
            Assumed annual return (%)
          </label>
          <input
            id={`${id}-return`}
            type="number"
            min="-50"
            max="50"
            step="0.1"
            value={annualReturn}
            onChange={(event) => {
              setAnnualReturn(event.target.value);
              setResult(null);
              setError("");
            }}
            className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          />
        </div>
        <button
          type="submit"
          className="min-h-12 w-full bg-slate-950 px-5 font-bold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 sm:col-span-2 sm:w-fit"
        >
          Estimate monthly amount
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-5 border-l-4 border-rose-700 bg-rose-50 p-4 leading-6 text-rose-900">
          {error}
        </p>
      )}
      {result ? (
        <>
          <div className="mt-6 border-t-2 border-slate-950 pt-5">
            <p className="text-sm font-semibold text-slate-600">
              Estimated monthly contribution
            </p>
            <p className="mt-1 font-display text-3xl font-extrabold tabular-nums text-slate-950">
              {currency.format(result.monthlyContribution)}
            </p>
            {result.monthlyContribution === 0 && (
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Under this assumption, the starting amount alone reaches or
                exceeds the target. The estimate does not account for losses or
                changes in returns.
              </p>
            )}
          </div>
          <CalculatorLineChart
            description={`Illustrated projected balance and target of ${currency.format(result.target)} over ${result.years} years.`}
            series={[
              { label: "Illustrated balance", color: "#176b45", values: result.balances },
              { label: "Target", color: "#b83f2c", values: result.targets },
            ]}
            xLabels={[
              "Year 0",
              `Year ${Math.round(result.years / 2)}`,
              `Year ${result.years}`,
            ]}
          />
        </>
      ) : (
        !error && (
          <p className="mt-5 text-sm leading-6 text-slate-600">
            Enter your target, time frame and assumptions to calculate an
            illustration.
          </p>
        )
      )}
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Assumes monthly contributions at month end and a steady effective return.
        It does not account for inflation, tax, fees or changing returns.
        Illustration only; not financial advice.
      </p>
    </section>
  );
}
