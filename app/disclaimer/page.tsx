import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Disclaimer | ${SITE_NAME}`,
  description: "Important information about education, investment risk and market data.",
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <header className="border-b-2 border-slate-950 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Please read</p>
        <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">Disclaimer</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          This page explains what {SITE_NAME} can and cannot do. It is a template and should be reviewed for your circumstances before publication.
        </p>
      </header>
      <div className="divide-y divide-slate-300">
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Education, not financial advice</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The lessons, tools, news summaries and market information on this site are for general education only. They do not take account of your goals, finances or needs and are not a personal recommendation or an invitation to buy or sell an investment.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Investing involves risk</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The value of investments can go down as well as up. You may get back less than you invest, including losing some or all of your capital. Consider whether an investment is suitable for you and seek independent professional advice if you need help with a personal decision.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Past performance is not a guide</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Historical prices, examples, hypothetical calculations and past performance cannot predict future results. Figures used in examples are for explanation and are not forecasts.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Market information may be delayed</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Quotes, charts and news are supplied by third parties and may be delayed, incomplete or inaccurate. Do not rely on this site to make time-sensitive decisions.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Not a regulated financial adviser</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            {SITE_NAME} is an educational resource, not a regulated financial adviser, broker or investment service. Nothing on this site creates an adviser-client relationship.
          </p>
        </section>
      </div>
    </main>
  );
}
