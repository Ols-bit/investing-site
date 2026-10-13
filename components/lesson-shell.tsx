import Link from "next/link";
import type { ReactNode } from "react";

import { FadeInSection } from "@/components/fade-in-section";
import type { Lesson } from "@/lib/lessons";

type LessonShellProps = {
  lesson: Lesson;
  current: number;
  total: number;
  children: ReactNode;
};

export function LessonShell({ lesson, current, total, children }: LessonShellProps) {
  const percent = Math.round((current / total) * 100);

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-8">
        <div className="rounded-2xl border border-teal-200 bg-teal-50/80 p-4 shadow-sm shadow-teal-950/5 dark:border-teal-300/15 dark:bg-teal-300/[0.06] dark:shadow-black/10">
          <div className="mb-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-teal-950 dark:text-teal-100">
          <span>Module {current} of {total}</span>
          <span>{percent}% complete</span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-teal-950/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
      <article className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-black/20 sm:p-8 lg:p-10">
        <header className="mb-8 border-b border-slate-200 pb-6 dark:border-white/10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-teal-800 dark:text-teal-200">
            Learning path
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300">
            {lesson.summary}
          </p>
        </header>

        <div className="space-y-6 text-slate-700 dark:text-slate-300 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-950 dark:[&_h2]:text-white [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-950 dark:[&_h3]:text-white [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:font-medium [&_a]:text-teal-800 [&_a]:underline [&_a]:decoration-teal-300 [&_a]:underline-offset-4 [&_a:hover]:text-teal-950 dark:[&_a]:text-teal-200 dark:[&_a]:decoration-teal-500 dark:[&_a:hover]:text-teal-100 dark:[&_table]:border-white/10 dark:[&_th]:border-white/10 dark:[&_td]:border-white/10 dark:[&_thead]:bg-slate-800 dark:[&_thead]:text-slate-100 dark:[&_tbody_tr:nth-child(even)]:bg-white/[0.03] dark:[&_tbody_th]:text-slate-100">
          {children}
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6 dark:border-white/10">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              Sources
            </p>
            <Link
              href="/"
              className="text-sm font-semibold text-teal-800 transition-colors hover:text-teal-950 dark:text-teal-200 dark:hover:text-teal-100"
            >
              Back to modules
            </Link>
          </div>

          <ul className="space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {lesson.sources.map((source) => (
              <li key={source}>
                <a href={source} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 transition-colors hover:text-teal-800 dark:decoration-slate-600 dark:hover:text-teal-200">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </article>
      </FadeInSection>
    </main>
  );
}
