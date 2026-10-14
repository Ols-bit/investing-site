import Link from "next/link";
import type { ReactNode } from "react";

import { FadeInSection } from "@/components/fade-in-section";
import { LessonCompletionButton } from "@/components/lesson-progress";
import type { Lesson } from "@/lib/lessons";

type LessonShellProps = {
  lesson: Lesson;
  current: number;
  total: number;
  children: ReactNode;
};

export function LessonShell({ lesson, current, total, children }: LessonShellProps) {
  const percent = Math.round((current / total) * 100);
  const backHref = lesson.track === "manual" ? "/manual" : "/learn";

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-10">
        <div className="border-b-2 border-slate-950 pb-4">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
            <span>{lesson.track === "manual" ? "Lesson" : "Module"} {current} of {total}</span>
            <span>{percent}% complete</span>
          </div>

          <div className="h-2 w-full overflow-hidden bg-slate-200">
            <div
              className="h-full bg-teal-700 transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </FadeInSection>

      <FadeInSection>
      <article className="bg-white px-5 py-7 sm:px-9 sm:py-10">
        <header className="mb-9 border-b border-slate-300 pb-8">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
            {lesson.track === "manual" ? "Trading manual" : "Learning path"}
          </p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">
            {lesson.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {lesson.summary}
          </p>
        </header>

        <div className="space-y-6 text-slate-700 [&_h2]:mt-12 [&_h2]:border-l-4 [&_h2]:border-amber-300 [&_h2]:pl-4 [&_h2]:text-3xl [&_h2]:font-bold [&_h2]:tracking-tight [&_h2]:text-slate-950 [&_h3]:mt-8 [&_h3]:text-2xl [&_h3]:font-bold [&_h3]:text-slate-950 [&_p]:leading-8 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6 [&_a]:font-semibold [&_a]:text-teal-800 [&_a]:underline [&_a]:decoration-teal-300 [&_a]:underline-offset-4 [&_a:hover]:text-slate-950 [&_table]:border-slate-300 [&_th]:border-slate-300 [&_td]:border-slate-300 [&_thead]:bg-slate-100 [&_thead]:text-slate-950 [&_tbody_tr:nth-child(even)]:bg-slate-100 [&_tbody_th]:text-slate-950">
          {children}
        </div>

        <footer className="mt-12 border-t-2 border-slate-950 pt-6">
          <div className="mb-3 flex items-center justify-between gap-4">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
              Sources
            </p>
            <Link
              href={backHref}
              className="text-sm font-bold text-teal-800 transition-colors hover:text-slate-950"
            >
              {lesson.track === "manual" ? "Back to manual" : "Back to modules"}
            </Link>
          </div>

          <ul className="space-y-2 text-sm leading-6 text-slate-600">
            {lesson.sources.map((source) => (
              <li key={source}>
                <a href={source} target="_blank" rel="noreferrer" className="underline decoration-slate-300 underline-offset-4 transition-colors hover:text-teal-800">
                  {source}
                </a>
              </li>
            ))}
          </ul>
          <LessonCompletionButton lessonId={lesson.slug} />
        </footer>
      </article>
      </FadeInSection>
    </main>
  );
}
