import Link from "next/link";

import { lessons } from "@/lib/lessons";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Beginner investing
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Learn the basics, calmly and step by step.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start with the building blocks of investing, without jargon or pressure. This
          path is designed to help you understand the ideas behind long-term investing.
        </p>
      </section>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Learning modules
          </h2>
          <span className="text-sm text-slate-500">{lessons.length} lessons</span>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
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

              <h3 className="text-xl font-semibold text-slate-900 group-hover:text-slate-700">
                {lesson.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{lesson.summary}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
