"use client";

import { useId, useState, type FormEvent } from "react";

import { CalculatorLineChart } from "@/components/calculator-line-chart";

type FeesResult = {
  years: number;
  fundA: number[];
  fundB: number[];
  feeA: number;
  feeB: number;
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

function projectBalance(
  startingAmount: number,
  annualReturn: number,
  annualFee: number,
  years: number,
) {
  const values = [startingAmount];
  const netRate = (annualReturn - annualFee) / 100;
  let balance = startingAmount;
  for (let year = 1; year <= years; year += 1) {
    balance *= 1 + netRate;
    values.push(balance);
  }
  return values;
}

export function FeesVsReturnsCalculator() {
  const id = useId();
  const [startingAmount, setStartingAmount] = useState("10000");
  const [years, setYears] = useState("10");
  const [annualReturn, setAnnualReturn] = useState("7");
  const [feeA, setFeeA] = useState("0.2");
  const [feeB, setFeeB] = useState("0.75");
  const [result, setResult] = useState<FeesResult | null>(null);
  const [error, setError] = useState("");

  function calculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const start = Number(startingAmount);
    const duration = Number(years);
    const expectedReturn = Number(annualReturn);
    const firstFee = Number(feeA);
    const secondFee = Number(feeB);

    if (!Number.isFinite(start) || start <= 0 || start > 10_000_000) {
      setError("Enter a starting amount greater than £0 and no more than £10,000,000.");
      setResult(null);
      return;
    }
    if (!Number.isInteger(duration) || duration < 1 || duration > 50) {
      setError("Choose a whole number of years from 1 to 50.");
      setResult(null);
      return;
    }
    if (!Number.isFinite(expectedReturn) || expectedReturn < -50 || expectedReturn > 50) {
      setError("Enter an assumed annual return between -50% and 50%.");
      setResult(null);
      return;
    }
    if (
      !Number.isFinite(firstFee) ||
      !Number.isFinite(secondFee) ||
      firstFee < 0 ||
      secondFee < 0 ||
      firstFee > 10 ||
      secondFee > 10
    ) {
      setError("Enter annual fees from 0% to 10% for both funds.");
      setResult(null);
      return;
    }
    if (firstFee === secondFee) {
      setError("Choose different annual fees to compare the two funds.");
      setResult(null);
      return;
    }

    setError("");
    setResult({
      years: duration,
      feeA: firstFee,
      feeB: secondFee,
      fundA: projectBalance(start, expectedReturn, firstFee, duration),
      fundB: projectBalance(start, expectedReturn, secondFee, duration),
    });
  }

  const finalA = result?.fundA.at(-1) ?? 0;
  const finalB = result?.fundB.at(-1) ?? 0;
  const difference = finalA - finalB;

  return (
    <section
      aria-labelledby={`${id}-title`}
      className="my-8 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
        Calculator
      </p>
      <h2 id={`${id}-title`} className="mt-2 font-display text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
        Fees vs returns
      </h2>
      <p className="mt-3 max-w-2xl leading-7 text-slate-700">
        Compare how two annual fee assumptions could affect the same starting
        amount and assumed growth rate.
      </p>

      <form onSubmit={calculate} className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-starting`} className="mb-2 block text-sm font-semibold text-slate-900">
            Starting amount (GBP)
          </label>
          <input
            id={`${id}-starting`}
            type="number"
            min="0"
            max="10000000"
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
          <label htmlFor={`${id}-years`} className="mb-2 block text-sm font-semibold text-slate-900">
            Time invested (years)
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
          <label htmlFor={`${id}-return`} className="mb-2 block text-sm font-semibold text-slate-900">
            Assumed annual return before fees (%)
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor={`${id}-fee-a`} className="mb-2 block text-sm font-semibold text-slate-900">
              Fund A annual fee (%)
            </label>
            <input
              id={`${id}-fee-a`}
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={feeA}
              onChange={(event) => {
                setFeeA(event.target.value);
                setResult(null);
                setError("");
              }}
              className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
            />
          </div>
          <div>
            <label htmlFor={`${id}-fee-b`} className="mb-2 block text-sm font-semibold text-slate-900">
              Fund B annual fee (%)
            </label>
            <input
              id={`${id}-fee-b`}
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={feeB}
              onChange={(event) => {
                setFeeB(event.target.value);
                setResult(null);
                setError("");
              }}
              className="min-h-12 w-full border-2 border-slate-950 bg-white px-3 text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
            />
          </div>
        </div>
        <button
          type="submit"
          className="min-h-12 w-full bg-slate-950 px-5 font-bold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800 sm:col-span-2 sm:w-fit"
        >
          Compare the illustration
        </button>
      </form>

      {error && (
        <p role="alert" className="mt-5 border-l-4 border-rose-700 bg-rose-50 p-4 leading-6 text-rose-900">
          {error}
        </p>
      )}
      {result ? (
        <>
          <div className="mt-6 grid gap-4 border-t-2 border-slate-950 pt-5 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-600">Fund A illustration</p>
              <p className="mt-1 font-display text-xl font-extrabold tabular-nums text-slate-950">
                {currency.format(finalA)}
              </p>
              <p className="mt-1 text-xs text-slate-600">{result.feeA}% annual fee</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Fund B illustration</p>
              <p className="mt-1 font-display text-xl font-extrabold tabular-nums text-slate-950">
                {currency.format(finalB)}
              </p>
              <p className="mt-1 text-xs text-slate-600">{result.feeB}% annual fee</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-600">Difference after {result.years} years</p>
              <p className={`mt-1 font-display text-xl font-extrabold tabular-nums ${difference >= 0 ? "text-emerald-800" : "text-rose-800"}`}>
                {currency.format(Math.abs(difference))}
              </p>
              <p className="mt-1 text-xs text-slate-600">
                {difference >= 0 ? "more with Fund A" : "more with Fund B"}
              </p>
            </div>
          </div>
          <CalculatorLineChart
            description={`Illustrated balances for two fee assumptions over ${result.years} years.`}
            series={[
              { label: `Fund A (${result.feeA}% fee)`, color: "#176b45", values: result.fundA },
              { label: `Fund B (${result.feeB}% fee)`, color: "#b83f2c", values: result.fundB },
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
            Enter your assumptions to compare the two fee illustrations.
          </p>
        )
      )}
      <p className="mt-4 text-sm leading-6 text-slate-600">
        Simplified annual compounding using the assumed return minus each annual
        fee. It excludes contributions, inflation, tax and other charges.
        Illustration only; not financial advice.
      </p>
    </section>
  );
}
