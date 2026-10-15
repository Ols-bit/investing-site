import type { Metadata } from "next";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `Privacy | ${SITE_NAME}`,
  description: "A template explaining how this educational site handles personal data.",
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <header className="border-b-2 border-slate-950 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Privacy</p>
        <h1 className="mt-4 text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">Privacy policy</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-700">
          Template for [Company name]. Replace the bracketed contact details and have this policy reviewed before publishing.
        </p>
        <p className="mt-3 text-sm text-slate-600">Last updated: [Add date]</p>
      </header>
      <div className="divide-y divide-slate-300">
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Who is responsible for your information?</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The data controller is [Company name], of [Company address]. Contact us at [Contact email] with questions about this policy or your personal information.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Information stored in your browser</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            This site saves lesson completion and quiz progress in your browser&apos;s localStorage so it can be shown on your next visit. The watchlist may also be saved there. This information stays on that browser unless you clear its site data; it is not sent to us by the site.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Analytics and email</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The email form currently shown on the site is a non-functional preview and does not collect or store email addresses. If a mailing list is introduced, this policy must be updated to explain what is collected, the purpose and legal basis, how long it is kept, and how to withdraw consent.
          </p>
          <p className="mt-3 text-base leading-7 text-slate-700">
            No analytics service is configured by this project at present. If anonymous or other analytics are added, this notice must identify the provider, the data collected, the purpose, and any consent choices before that service is enabled.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Market data providers and hosting</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            When you request quotes, news or price history, the server sends the requested symbols and relevant query to Finnhub or Twelve Data to retrieve that information. API credentials are kept on the server. Vercel hosts the site and may process technical request data, such as IP address and logs, to operate and protect the service. These providers handle information under their own terms and privacy notices.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Cookies and similar storage</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            The site does not use advertising cookies. Browser localStorage is used for lesson progress and the watchlist. Hosting or security services may use technically necessary storage; review Vercel&apos;s current documentation and update this section if the site&apos;s configuration changes.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Retention and security</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Browser-saved progress remains until you clear it. Server and provider logs are retained according to the relevant hosting and provider policies. We take reasonable steps to protect information but cannot promise that internet transmission or storage is completely secure.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Your UK data protection rights</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            Where UK GDPR applies, you may have the right to request access, correction, deletion or restriction of your personal data, to object to certain processing, and to receive portable data. You may also complain to the Information Commissioner&apos;s Office. These rights depend on the circumstances and lawful basis. Contact [Contact email] to make a request.
          </p>
        </section>
        <section className="py-8">
          <h2 className="text-2xl font-bold text-slate-950">Changes and contact</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">
            We may update this policy when the site or its services change. For privacy questions, contact [Company name], [Company address], at [Contact email].
          </p>
        </section>
      </div>
    </main>
  );
}
