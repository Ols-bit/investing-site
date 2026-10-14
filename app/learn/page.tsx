import type { Metadata } from "next";
import Link from "next/link";

import { FadeInSection } from "@/components/fade-in-section";
import { LearningProgressSummary, LessonCompletionBadge } from "@/components/lesson-progress";
import { lessons } from "@/lib/lessons";

export const metadata: Metadata = {
  title: "Learn | Investing Basics",
  description: "Explore beginner-friendly investing lessons.",
};

const moduleStyles = [
  {
    icon: "🌱",
    accent: "from-emerald-400 to-teal-500",
    surface: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-300/20 dark:bg-emerald-300/[0.06]",
    iconSurface: "bg-emerald-100 text-emerald-900 dark:bg-emerald-300/15 dark:text-emerald-200",
    badge: "bg-emerald-100 text-emerald-900 dark:bg-emerald-300/15 dark:text-emerald-200",
  },
  {
    icon: "🎨",
    accent: "from-sky-400 to-cyan-500",
    surface: "border-sky-200 bg-sky-50/70 dark:border-sky-300/20 dark:bg-sky-300/[0.06]",
    iconSurface: "bg-sky-100 text-sky-900 dark:bg-sky-300/15 dark:text-sky-200",
    badge: "bg-sky-100 text-sky-900 dark:bg-sky-300/15 dark:text-sky-200",
  },
  {
    icon: "⚖️",
    accent: "from-violet-400 to-indigo-500",
    surface: "border-violet-200 bg-violet-50/70 dark:border-violet-300/20 dark:bg-violet-300/[0.06]",
    iconSurface: "bg-violet-100 text-violet-900 dark:bg-violet-300/15 dark:text-violet-200",
    badge: "bg-violet-100 text-violet-900 dark:bg-violet-300/15 dark:text-violet-200",
  },
  {
    icon: "🧺",
    accent: "from-amber-400 to-orange-500",
    surface: "border-amber-200 bg-amber-50/70 dark:border-amber-300/20 dark:bg-amber-300/[0.06]",
    iconSurface: "bg-amber-100 text-amber-950 dark:bg-amber-300/15 dark:text-amber-200",
    badge: "bg-amber-100 text-amber-950 dark:bg-amber-300/15 dark:text-amber-200",
  },
  {
    icon: "🗂️",
    accent: "from-rose-400 to-pink-500",
    surface: "border-rose-200 bg-rose-50/70 dark:border-rose-300/20 dark:bg-rose-300/[0.06]",
    iconSurface: "bg-rose-100 text-rose-900 dark:bg-rose-300/15 dark:text-rose-200",
    badge: "bg-rose-100 text-rose-900 dark:bg-rose-300/15 dark:text-rose-200",
  },
  {
    icon: "🪙",
    accent: "from-lime-400 to-green-500",
    surface: "border-lime-200 bg-lime-50/70 dark:border-lime-300/20 dark:bg-lime-300/[0.06]",
    iconSurface: "bg-lime-100 text-lime-950 dark:bg-lime-300/15 dark:text-lime-200",
    badge: "bg-lime-100 text-lime-950 dark:bg-lime-300/15 dark:text-lime-200",
  },
  {
    icon: "🧠",
    accent: "from-fuchsia-400 to-purple-500",
    surface: "border-fuchsia-200 bg-fuchsia-50/70 dark:border-fuchsia-300/20 dark:bg-fuchsia-300/[0.06]",
    iconSurface: "bg-fuchsia-100 text-fuchsia-950 dark:bg-fuchsia-300/15 dark:text-fuchsia-200",
    badge: "bg-fuchsia-100 text-fuchsia-950 dark:bg-fuchsia-300/15 dark:text-fuchsia-200",
  },
  {
    icon: "🧩",
    accent: "from-orange-400 to-amber-500",
    surface: "border-orange-200 bg-orange-50/70 dark:border-orange-300/20 dark:bg-orange-300/[0.06]",
    iconSurface: "bg-orange-100 text-orange-950 dark:bg-orange-300/15 dark:text-orange-200",
    badge: "bg-orange-100 text-orange-950 dark:bg-orange-300/15 dark:text-orange-200",
  },
];

export default function LearnPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-10 rounded-[2rem] bg-gradient-to-br from-slate-950 via-[#102d42] to-teal-950 p-7 text-white shadow-xl shadow-teal-950/10 sm:p-10">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-teal-200">
          The learning path
        </p>
        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Investing, one idea at a time.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-200">
          Eight short modules take you through the foundations, at a pace that works for you.
        </p>
      </FadeInSection>

      <LearningProgressSummary lessonIds={lessons.map((lesson) => lesson.slug)} />

      <section aria-label="Learning modules" className="grid gap-5 md:grid-cols-2">
        {lessons.map((lesson, index) => {
          const style = moduleStyles[index % moduleStyles.length];

          return (
            <FadeInSection key={lesson.slug} className="h-full">
              <Link
                href={`/lessons/${lesson.slug}`}
                className={`group relative isolate flex h-full flex-col overflow-hidden rounded-3xl border p-6 shadow-sm shadow-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700 dark:shadow-black/10 dark:hover:shadow-black/30 dark:focus-visible:outline-teal-300 ${style.surface}`}
              >
                <span aria-hidden="true" className={`absolute inset-x-0 top-0 -z-10 h-1 bg-gradient-to-r ${style.accent}`} />
                <div className="mb-5 flex items-center justify-between gap-4">
                  <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                    Module {index + 1}
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    <LessonCompletionBadge lessonId={lesson.slug} />
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${style.badge}`}>
                      {lesson.estimatedMinutes} min
                    </span>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span aria-hidden="true" className={`inline-flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-sm ${style.iconSurface}`}>
                    {style.icon}
                  </span>
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-slate-950 transition-colors group-hover:text-teal-800 dark:text-white dark:group-hover:text-teal-200">
                      {lesson.title}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
                      {lesson.summary}
                    </p>
                  </div>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-700 transition-all group-hover:gap-3 dark:text-slate-200">
                  Explore module
                  <span aria-hidden="true">→</span>
                </span>
              </Link>
            </FadeInSection>
          );
        })}
      </section>
    </main>
  );
}
