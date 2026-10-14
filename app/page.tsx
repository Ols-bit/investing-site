import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { lessons } from "@/lib/lessons";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col">
      <FadeInSection className="mx-auto w-full max-w-7xl px-4 pb-12 pt-9 sm:px-6 sm:pb-16 sm:pt-14 lg:px-8">
        <section className="relative grid min-h-[32rem] overflow-hidden rounded-br-[5rem] bg-slate-950 text-white sm:grid-cols-[1.15fr_0.85fr] sm:rounded-br-[8rem]">
          <div className="relative z-10 flex flex-col items-start justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <p className="mb-7 text-xs font-bold uppercase tracking-[0.22em] text-teal-300">
              Investing Basics · A field guide
            </p>
            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.94] tracking-[-0.055em] sm:text-6xl lg:text-7xl xl:text-8xl">
                Learn to invest
                <br />
                before you risk
                <br />
                a dollar.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                Plain-English lessons on markets, risk and long-term thinking. No picks, no promises—just the fundamentals.
              </p>
              <Link
                href="/learn"
                className="mt-9 inline-flex min-h-12 items-center justify-center gap-4 bg-teal-300 px-6 py-3 text-sm font-bold text-slate-950 transition-transform duration-200 hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300"
              >
                Browse the lessons
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="relative hidden min-h-full items-center justify-center overflow-hidden bg-teal-300 sm:flex">
              <svg aria-hidden="true" viewBox="0 0 520 520" fill="none" className="h-full w-full max-w-[34rem]">
                <circle cx="364" cy="147" r="105" fill="#183027" />
                <circle cx="364" cy="147" r="68" stroke="#F5F1E6" strokeWidth="2" />
                <path d="M54 414H460M54 330H460M54 246H460M54 162H460" stroke="#183027" strokeOpacity=".2" />
                <path d="m54 352 94-28 72 18 69-104 67 27 104-154" stroke="#183027" strokeWidth="9" strokeLinecap="square" strokeLinejoin="bevel" />
                <path d="m411 112 49-1-4 48" stroke="#183027" strokeWidth="9" strokeLinecap="square" strokeLinejoin="bevel" />
                <path d="M84 434h14m-14-14v14m330-300h14m-14-14v14" stroke="#ED6246" strokeWidth="5" />
              </svg>
              <Link
                href={`/lessons/${lessons[0].slug}`}
                className="absolute bottom-7 left-7 right-7 border-l-4 border-amber-300 bg-slate-950 p-5 text-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950 sm:bottom-10 sm:left-10 sm:right-10"
              >
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-teal-300">
                  First lesson · {lessons[0].estimatedMinutes} min
                </span>
                <span className="mt-2 block font-display text-xl font-bold tracking-tight">
                  {lessons[0].title}
                </span>
                <span className="mt-2 block text-sm text-slate-200">
                  Read the first chapter <span aria-hidden="true">→</span>
                </span>
              </Link>
            </div>
        </section>
      </FadeInSection>

      <FadeInSection className="mx-auto grid w-full max-w-7xl gap-8 px-4 pb-16 sm:grid-cols-[0.7fr_1.3fr] sm:px-6 lg:px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-800">The approach</p>
          <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
            Learn the rules before the noise.
          </h2>
        </div>
        <div className="grid gap-x-10 sm:grid-cols-2">
          <article className="border-t-2 border-slate-950 py-5">
            <h3 className="text-lg font-bold text-slate-950">Understand the trade-offs</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              See how time, risk, costs and diversification affect the choices investors make.
            </p>
          </article>
          <article className="border-t-2 border-slate-950 py-5">
            <h3 className="text-lg font-bold text-slate-950">Make your own decisions</h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
              Build a foundation for asking better questions. The lessons educate; they never tell you what to buy.
            </p>
          </article>
        </div>
      </FadeInSection>
    </main>
  );
}
