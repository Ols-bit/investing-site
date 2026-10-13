import type { Metadata } from "next";

import { FadeInSection } from "@/components/fade-in-section";

export const metadata: Metadata = {
  title: "News | Investing Basics",
};

export default function NewsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection>
        <section className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-7 shadow-xl shadow-amber-950/5 dark:border-amber-300/15 dark:from-amber-300/[0.08] dark:via-white/[0.03] dark:to-orange-300/[0.07] sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-800 dark:text-amber-200">
            Fresh perspectives
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            News
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-700 dark:text-slate-300">Coming soon.</p>
        </section>
      </FadeInSection>
    </main>
  );
}
