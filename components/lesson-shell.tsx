import Link from "next/link";
import type { ReactNode } from "react";

import { FadeInSection } from "@/components/fade-in-section";
import { LessonSectionProgress } from "@/components/lesson-section-progress";
import { Recap } from "@/components/lesson-recap";
import { LessonCompletionButton } from "@/components/lesson-progress";
import type { Lesson } from "@/lib/lessons";
import { lessonQuizSlugs } from "@/lib/lessons";

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
      <FadeInSection className="mb-10">
        <div className="border-b-2 border-slate-950 pb-4">
          <div className="mb-3 flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.16em] text-slate-700">
            <span>Lesson {current} of {total}</span>
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
        <article className="lesson-notebook px-4 py-6 sm:px-9 sm:py-10">
          <header className="mb-7 border-b border-slate-300 pb-7 dark:border-slate-600">
            <p className="lesson-handwriting mb-2 text-xl font-bold text-teal-800 dark:text-teal-200">
              Lesson notes
            </p>
            <h1 className="max-w-4xl font-display text-5xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-6xl">
              {lesson.title}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg">
              {lesson.summary}
            </p>
          </header>

          <Recap>{lesson.summary}</Recap>
          <LessonSectionProgress />

          <div className="lesson-note-content text-slate-800 dark:text-slate-200">
            {children}
            {!lessonQuizSlugs.has(lesson.slug) && (
              <Recap label="Remember this">{lesson.summary}</Recap>
            )}
          </div>

          <footer className="mt-10 border-t-2 border-slate-950 pt-6 dark:border-slate-500">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-600 dark:text-slate-300">
                Sources
              </p>
              <Link
                href="/learn"
                className="text-sm font-bold text-teal-800 transition-colors hover:text-slate-950 dark:text-teal-200 dark:hover:text-white"
              >
                Back to Learn
              </Link>
            </div>

            <ul className="space-y-2 text-sm leading-6 text-slate-700 dark:text-slate-300">
              {lesson.sources.map((source) => (
                <li key={source}>
                  <a href={source} target="_blank" rel="noreferrer" className="underline decoration-slate-400 underline-offset-4 transition-colors hover:text-teal-800 dark:decoration-slate-500 dark:hover:text-teal-200">
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
