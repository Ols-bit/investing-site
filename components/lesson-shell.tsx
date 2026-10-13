import Link from "next/link";
import type { ReactNode } from "react";

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
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
          <span>Module {current} of {total}</span>
          <span>{percent}% complete</span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <header className="mb-8 border-b border-slate-200 pb-6">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
            Learning path
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
            {lesson.summary}
          </p>
        </header>

        <div className="space-y-6 text-slate-700 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:tracking-tight [&_h2]:text-slate-900 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-slate-900 [&_p]:leading-7 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:font-medium [&_a]:text-emerald-800 [&_a]:underline [&_a]:decoration-emerald-300 [&_a]:underline-offset-4 [&_a:hover]:text-emerald-950">
          {children}
        </div>

        <footer className="mt-10 border-t border-slate-200 pt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
              Sources
            </p>
            <Link
              href="/"
              className="text-sm font-medium text-slate-700 transition-colors hover:text-slate-950"
            >
              Back to modules
            </Link>
          </div>

          <ul className="space-y-2 text-sm leading-6 text-slate-600">
            {lesson.sources.map((source) => (
              <li key={source}>
                <a href={source} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 hover:text-slate-900">
                  {source}
                </a>
              </li>
            ))}
          </ul>
        </footer>
      </article>
    </main>
  );
}
