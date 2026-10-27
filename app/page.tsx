import type { Metadata } from "next";

import { HomeHero } from "@/components/home-hero";
import { MarketTicker } from "@/components/market-ticker";
import { DeferredHomepageSection } from "@/components/deferred-homepage-section";
import { SubscribeForm } from "@/components/subscribe-form";
import {
  createPageMetadata,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/site";

export const metadata: Metadata = createPageMetadata(
  SITE_NAME,
  SITE_DESCRIPTION,
  "/",
);

export default function Home() {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <main id="homepage" className="flex w-full flex-1 flex-col overflow-x-clip">
        <HomeHero />
        <MarketTicker />
        <DeferredHomepageSection section="movers" />
        <DeferredHomepageSection section="news" />
        <section aria-labelledby="email-signup-title" className="rounded-t-[2.5rem] bg-amber-300 px-5 py-16 sm:px-8 sm:py-20">
          <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-[1fr_0.8fr] sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">A useful note, once a week</p>
              <h2 id="email-signup-title" className="mt-3 max-w-2xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">Weekly investing tips.</h2>
            </div>
            <SubscribeForm />
          </div>
        </section>
      </main>
    </>
  );
}
