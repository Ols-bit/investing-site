import type { Metadata } from "next";
import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description: "Why this investing education site exists and who it is for.",
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-12 sm:px-8 sm:py-16">
      <section className="grid gap-10 border-b-2 border-slate-950 pb-12 sm:grid-cols-[1.15fr_0.85fr] sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">About</p>
          <h1 className="mt-4 max-w-4xl text-6xl font-extrabold leading-[0.92] tracking-tight text-slate-950 sm:text-7xl lg:text-8xl">
            Investing, explained without the noise.
          </h1>
        </div>
        <p className="max-w-xl text-lg leading-8 text-slate-700">
          I made {SITE_NAME} for people who want to understand investing before making decisions with their money. It is a place to learn the language, mechanics and risks in plain English, without stock picks or promises.
        </p>
      </section>

      <section className="grid gap-10 py-12 sm:grid-cols-[0.85fr_1.15fr] sm:py-16">
        <div className="flex min-h-72 items-center justify-center border-2 border-dashed border-slate-500 bg-teal-50 p-8 text-center">
          <p className="max-w-xs text-sm font-semibold leading-6 text-slate-700">
            PHOTO PLACEHOLDER
            <br />
            Add a photo of yourself here when you are ready.
          </p>
        </div>
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">A note from the person behind the site</p>
          <h2 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">A little more about why I built it.</h2>
          <p className="mt-5 text-base leading-7 text-slate-700">
            [Add your own story here: what led you to make this resource, what you wish you had known as a beginner, and what readers can expect from it.]
          </p>
          <p className="mt-5 text-base leading-7 text-slate-700">
            The lessons are educational. They are not personal recommendations, and they will never tell you what to buy.
          </p>
          <Link href="/manual" className="mt-8 inline-flex min-h-12 items-center gap-4 bg-slate-950 px-6 font-bold text-white hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700">
            Read the manual <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
