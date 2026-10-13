import type { Metadata } from "next";
import Link from "next/link";

import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learn | Investing Basics",
  description: "Explore beginner-friendly investing lessons.",
};

export default function LearnPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Learning path
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Investing, one idea at a time.
        </h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
          Eight short modules take you through the foundations, at a pace that works for you.
        </p>
      </header>

      <section aria-label="Learning modules" className="grid gap-4 md:grid-cols-2">
        {lessons.map((lesson, index) => (
          <Link
            key={lesson.slug}
            href={`/lessons/${lesson.slug}`}
            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <div className="mb-3 flex items-center justify-between gap-4">
              <span className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                Module {index + 1}
              </span>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                {lesson.estimatedMinutes} min
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700">
              {lesson.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
