import type { Metadata } from "next";
import { RiskQuiz } from "@/components/risk-quiz";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata(
  "Risk and goals quiz",
  "An eight-question educational exercise about investing goals, time horizons and comfort with uncertainty.",
  "/risk-quiz",
);

export default function RiskQuizPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-10 border-b-2 border-slate-950 pb-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Eight questions · About five minutes</p>
        <h1 className="max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">How do you think about risk?</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 sm:text-lg">
          Reflect on goals, time and uncertainty. Your result suggests lessons to explore; it does not assess what investments are suitable for you.
        </p>
      </header>
      <RiskQuiz />
    </main>
  );
}
