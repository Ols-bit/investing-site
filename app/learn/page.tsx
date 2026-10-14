import type { Metadata } from "next";
import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { LearningProgressSummary, LessonCompletionBadge } from "@/components/lesson-progress";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learn | Investing Basics",
  description: "Explore beginner-friendly investing lessons.",
};

export default function LearnPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-10 grid gap-7 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
            Eight lessons · Start anywhere
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Investing, without the noise.
          </h1>
        </div>
        <p className="max-w-lg text-base leading-7 text-slate-600 sm:justify-self-end sm:text-lg">
          Clear explanations of the ideas behind investing, from risk and return to building a simple plan.
        </p>
      </FadeInSection>

      <LearningProgressSummary lessonIds={lessons.map((lesson) => lesson.slug)} />

      <section aria-label="Learning modules" className="grid gap-x-12 md:grid-cols-2">
        {lessons.map((lesson, index) => (
          <FadeInSection key={lesson.slug} className="h-full">
            <Link
              href={`/lessons/${lesson.slug}`}
              className="group grid h-full grid-cols-[3.5rem_1fr] gap-4 border-t border-slate-300 py-6 transition-colors duration-200 hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:grid-cols-[4.5rem_1fr]"
            >
              <span
                aria-hidden="true"
                className="pt-1 font-display text-3xl font-extrabold leading-none text-amber-500 sm:text-4xl"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                  <span>{lesson.estimatedMinutes} min read</span>
                  <LessonCompletionBadge lessonId={lesson.slug} />
                </div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950 transition-colors group-hover:text-teal-800 sm:text-2xl">
                  {lesson.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
                  {lesson.summary}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-950 transition-transform group-hover:translate-x-1">
                  Read lesson <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          </FadeInSection>
        ))}
      </section>
    </main>
  );
}
