import { CompoundInterestCalculator } from "@/components/compound-interest-calculator";
import { FeesVsReturnsCalculator } from "@/components/fees-vs-returns-calculator";
import { FadeInSection } from "@/components/fade-in-section";
import { GoalPlannerCalculator } from "@/components/goal-planner-calculator";
import { WhatIfInvestedCalculator } from "@/components/what-if-invested-calculator";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Tools",
  "Use simple calculators to explore investment costs, growth and goals.",
  "/tools",
);

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection>
        <section className="grid min-h-72 gap-8 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1fr_0.7fr] sm:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
              Calculators
            </p>
            <h1 className="text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">
              Tools
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-600 sm:justify-self-end sm:text-lg">
            Simple ways to explore how time, contributions and assumptions can shape an investment outcome.
          </p>
        </section>
      </FadeInSection>
      <div className="mt-8 divide-y-2 divide-slate-950">
        <section id="compound-interest" className="scroll-mt-24 py-2">
          <CompoundInterestCalculator />
        </section>
        <section id="what-if-invested" className="scroll-mt-24 py-2">
          <WhatIfInvestedCalculator />
        </section>
        <section id="fees-vs-returns" className="scroll-mt-24 py-2">
          <FeesVsReturnsCalculator />
        </section>
        <section id="goal-planner" className="scroll-mt-24 py-2">
          <GoalPlannerCalculator />
        </section>
      </div>
      <p className="mt-8 border-l-4 border-amber-400 bg-amber-50 p-5 leading-7 text-slate-800">
        All calculators are educational illustrations. Their assumptions are
        simplified and are not a prediction or financial advice.
      </p>
    </main>
  );
}
