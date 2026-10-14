import type { Metadata } from "next";

import { FadeInSection } from "@/components/fade-in-section";
import { MarketsDashboard } from "@/components/markets-dashboard";

export const metadata: Metadata = {
  title: "Markets | Investing Basics",
  description: "Follow stock prices and explore market data in a beginner-friendly watchlist.",
};

export default function MarketsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection>
        <section className="rounded-[2rem] border border-sky-200 bg-gradient-to-br from-sky-50 via-white to-teal-50 p-7 shadow-xl shadow-sky-950/5 dark:border-sky-300/15 dark:from-sky-300/[0.08] dark:via-white/[0.03] dark:to-teal-300/[0.07] sm:p-10">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sky-800 dark:text-sky-200">
            Explore market data
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Markets
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
            Follow a few familiar companies, compare recent price moves, and build a watchlist at your own pace.
          </p>
        </section>
      </FadeInSection>
      <FadeInSection className="mt-7">
        <MarketsDashboard />
        <p className="mt-5 text-center text-xs text-slate-500 dark:text-slate-400">
          Prices may be delayed. Not financial advice.
        </p>
      </FadeInSection>
    </main>
  );
}
