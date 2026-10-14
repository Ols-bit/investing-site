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
        <section className="grid gap-6 border-l-8 border-amber-300 bg-teal-300 p-7 sm:grid-cols-[1.1fr_0.9fr] sm:items-end sm:gap-10 sm:p-10 lg:p-14">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-700">
              Explore market data
            </p>
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Markets
            </h1>
          </div>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
            Follow familiar companies, compare recent prices, and build a watchlist.
          </p>
        </section>
      </FadeInSection>
      <FadeInSection className="mt-7">
        <MarketsDashboard />
        <p className="mt-5 text-center text-xs text-slate-500">
          Prices may be delayed. Not financial advice.
        </p>
      </FadeInSection>
    </main>
  );
}
