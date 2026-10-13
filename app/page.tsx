import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { lessons } from "@/lib/lessons";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <FadeInSection>
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-[#102d42] to-teal-950 p-7 text-white shadow-2xl shadow-teal-950/20 sm:p-10 lg:p-14">
          <div aria-hidden="true" className="absolute -right-20 -top-28 -z-10 size-96 rounded-full bg-teal-400/20 blur-3xl" />
          <div aria-hidden="true" className="absolute -bottom-40 left-1/3 -z-10 size-96 rounded-full bg-amber-300/10 blur-3xl" />
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
            <div>
              <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-teal-200/25 bg-teal-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">
                <span aria-hidden="true" className="size-2 rounded-full bg-amber-300" />
                A brighter way to learn about investing
              </p>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                Build confidence with every small step.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-200 sm:text-lg">
                Explore the building blocks of investing with calm, clear lessons made for curious beginners.
              </p>
              <Link
                href="/learn"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-amber-300 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-950/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-amber-200 hover:shadow-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-200"
              >
                Start learning
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <Link
              href={`/lessons/${lessons[0].slug}`}
              className="group relative rounded-3xl border border-white/15 bg-white/10 p-6 shadow-xl shadow-slate-950/20 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-teal-200/50 hover:bg-white/15 sm:p-8"
            >
              <div className="mb-8 flex items-center justify-between gap-4">
                <span className="inline-flex items-center gap-2 rounded-full bg-teal-300/15 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-teal-100">
                  <span aria-hidden="true">🌱</span>
                  Module 1
                </span>
                <span className="text-sm text-slate-300">{lessons[0].estimatedMinutes} min</span>
              </div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                {lessons[0].title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-200">
                {lessons[0].summary}
              </p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-amber-200 transition-colors group-hover:text-amber-100">
                Begin with the basics
                <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </div>
        </section>
      </FadeInSection>

      <FadeInSection className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: "🧭", title: "Learn at your pace", text: "Short modules, clear explanations." },
          { icon: "💡", title: "Start with the basics", text: "Build understanding one idea at a time." },
          { icon: "🌿", title: "Keep it grounded", text: "Education without pressure or promises." },
        ].map((item) => (
          <div key={item.title} className="rounded-2xl border border-slate-200/80 bg-white/80 p-5 shadow-sm shadow-slate-900/5 dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/10">
            <span aria-hidden="true" className="text-2xl">{item.icon}</span>
            <h2 className="mt-3 text-base font-semibold text-slate-950 dark:text-white">{item.title}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.text}</p>
          </div>
        ))}
      </FadeInSection>
    </main>
  );
}
