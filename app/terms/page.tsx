import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Terms of use | ${SITE_NAME}`,
  description: "Template terms for using this educational investing site.",
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <header className="border-b-2 border-slate-950 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Terms</p>
        <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">Terms of use</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          Template terms for [Company name]. Have these terms reviewed and fill in the bracketed details before publication.
        </p>
        <p className="mt-3 text-sm text-slate-600">Last updated: [Add date]</p>
      </header>
      <div className="divide-y divide-slate-300">
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Using this site</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            By using {SITE_NAME}, you agree to these terms. If you do not agree, do not use the site. The site is intended as general educational material; it is not a substitute for advice suited to your circumstances.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Education and market data</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Nothing on this site is financial, investment, tax or legal advice, or a recommendation to buy, sell or hold an investment. Investing involves risk and you may lose money. Market data and news may be delayed, incomplete or inaccurate. See the Disclaimer for more information.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Your use of the material</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            You may use the site for personal, non-commercial learning. Do not misuse the site, attempt to disrupt it, or copy and republish its materials commercially without permission. Replace this section with the final copyright and licensing terms for [Company name].
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Third-party services and links</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The site may link to third-party websites or display data from third-party providers. Those services are operated independently and may have their own terms. We do not control their content, availability or privacy practices.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Availability and responsibility</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            We aim to keep the site available and information useful, but do not guarantee uninterrupted access, completeness or accuracy. To the extent the law permits, [Company name] is not responsible for losses arising from reliance on the site. Nothing in these terms excludes rights or liability that cannot legally be excluded.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Changes and governing law</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            We may update these terms by publishing a revised version here. These terms are governed by the laws of [England and Wales / applicable jurisdiction], and disputes will be handled by the courts of [applicable jurisdiction], subject to mandatory consumer protections.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Contact</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Questions about these terms: [Company name], [Company address], [Contact email].
          </p>
        </section>
      </div>
    </main>
  );
}
