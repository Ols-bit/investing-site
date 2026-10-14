import type { Metadata } from "next";

import { FadeInSection } from "@/components/fade-in-section";

export const metadata: Metadata = {
  title: "Tools | Investing Basics",
};

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
    </main>
  );
}
