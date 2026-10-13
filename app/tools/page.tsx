import type { Metadata } from "next";

import { FadeInSection } from "@/components/fade-in-section";

export const metadata: Metadata = {
  title: "Tools | Investing Basics",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection>
        <section className="rounded-[2rem] border border-violet-200 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 p-7 shadow-xl shadow-violet-950/5 dark:border-violet-300/15 dark:from-violet-300/[0.08] dark:via-white/[0.03] dark:to-fuchsia-300/[0.07] sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-violet-800 dark:text-violet-200">
            Helpful calculators and guides
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Tools
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-300">Coming soon.</p>
        </section>
      </FadeInSection>
    </main>
  );
}
