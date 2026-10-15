import { HomeHero } from "@/components/home-hero";
import { MarketTicker } from "@/components/market-ticker";
import { DeferredHomepageSection } from "@/components/deferred-homepage-section";

export default function Home() {
  return (
    <main id="homepage" className="flex w-full flex-1 flex-col overflow-x-clip">
      <HomeHero />
      <MarketTicker />
      <DeferredHomepageSection section="movers" />
      <DeferredHomepageSection section="news" />
      <DeferredHomepageSection section="lessons" />
      <section aria-labelledby="calculator-teaser-title" className="rounded-t-[2.5rem] bg-slate-950 px-5 pb-20 pt-16 text-white sm:px-8 sm:pb-24 sm:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-300">See how time adds up</p>
            <h2 id="calculator-teaser-title" className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">A little today. A lot of time.</h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-200">Explore how regular contributions and hypothetical growth can compound over time.</p>
          </div>
          <div className="bg-slate-50 p-3 text-slate-950 sm:p-6">
            <DeferredHomepageSection section="calculator" />
          </div>
        </div>
      </section>
      <section aria-labelledby="email-signup-title" className="rounded-t-[2.5rem] bg-amber-300 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1fr_0.8fr] sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">A note when it is ready</p>
            <h2 id="email-signup-title" className="mt-3 max-w-2xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">Good lessons, occasionally.</h2>
          </div>
          <form className="grid gap-3">
            <label htmlFor="signup-email" className="text-sm font-bold text-slate-950">Email address</label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input id="signup-email" type="email" autoComplete="email" placeholder="you@example.com" className="min-h-12 min-w-0 flex-1 border-2 border-slate-950 bg-slate-50 px-4 text-slate-950 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950" />
              <button type="button" disabled className="min-h-12 bg-slate-950 px-5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-70">Coming soon</button>
            </div>
            <p className="text-xs leading-5 text-slate-800">
              Consent: when signup is available, we will explain how your address is used and ask you to opt in. You can unsubscribe at any time. This preview does not collect or store your email address.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
