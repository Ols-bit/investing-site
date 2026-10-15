import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { ManualStages } from "@/components/manual-stages";
import { manualStages } from "@/lib/lessons";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Trading Manual",
  "A practical guide to stocks, orders, market data, risk and common investing mistakes.",
  "/manual",
);

export default function ManualPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-12 grid gap-8 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
            A practical guide · 9 lessons
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            The trading manual.
          </h1>
        </div>
        <div className="max-w-lg sm:justify-self-end">
          <p className="text-base leading-7 text-slate-600 sm:text-lg">
            Start with what a share is. Work through orders, market data and risk. Learn the mechanics without being told what to buy.
          </p>
          <p className="mt-4 border-l-4 border-amber-300 pl-3 text-sm font-semibold text-slate-700">
            Educational only. Not financial advice.{" "}
            <Link href="/disclaimer" className="underline underline-offset-4 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              Read the full disclaimer
            </Link>
          </p>
        </div>
      </FadeInSection>
      <ManualStages stages={manualStages} />
    </main>
  );
}
