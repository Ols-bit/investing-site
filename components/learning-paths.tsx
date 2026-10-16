"use client";

import Link from "next/link";
import { useLessonProgress } from "@/components/lesson-progress";
import type { LearningPath } from "@/content/paths";
import { getLessonBySlug, lessons as coreLessons, manualLessons } from "@/lib/lessons";

export function LearningPathCards({ paths }: { paths: LearningPath[] }) {
  const { progress, ready } = useLessonProgress();

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {paths.map((path, index) => {
        const completed = path.lessonSlugs.filter((slug) => progress[slug]?.completed).length;
        const percent = path.lessonSlugs.length ? Math.round((completed / path.lessonSlugs.length) * 100) : 0;
        return (
          <article key={path.slug} aria-busy={!ready} className="flex flex-col border-t-4 border-teal-700 bg-white p-5 sm:p-6">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-800">Path {String(index + 1).padStart(2, "0")}</p>
            <h2 className="mt-3 font-display text-3xl font-extrabold text-slate-950">{path.title}</h2>
            <p className="mt-3 flex-1 text-sm leading-6 text-slate-700">{path.description}</p>
            <div className="mt-6">
              <div className="mb-2 flex justify-between gap-2 text-xs font-semibold text-slate-600">
                <span>{completed} of {path.lessonSlugs.length} lessons complete</span><span>{percent}%</span>
              </div>
              <div className="h-2 bg-slate-200" role="progressbar" aria-label={`${path.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}>
                <div className="h-full bg-teal-700 transition-[width]" style={{ width: `${percent}%` }} />
              </div>
            </div>
            <Link href={`/paths/${path.slug}`} className="mt-6 inline-flex min-h-11 items-center justify-center bg-slate-950 px-5 text-sm font-bold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
              {completed ? "Continue this path" : "View this path"}
            </Link>
          </article>
        );
      })}
    </div>
  );
}

export function PathLessonList({ path }: { path: LearningPath }) {
  const { progress, ready } = useLessonProgress();
  const lessons = path.lessonSlugs.map(getLessonBySlug).filter((lesson) => lesson !== undefined);
  const completed = lessons.filter((lesson) => progress[lesson.slug]?.completed).length;
  const percent = lessons.length ? Math.round((completed / lessons.length) * 100) : 0;

  return (
    <div aria-busy={!ready}>
      <div className="mb-8 max-w-xl">
        <div className="mb-2 flex justify-between text-sm font-semibold text-slate-700"><span>Your path progress</span><span>{completed} of {lessons.length}</span></div>
        <div className="h-2.5 bg-slate-200" role="progressbar" aria-label={`${path.title} progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={percent}><div className="h-full bg-teal-700" style={{ width: `${percent}%` }} /></div>
      </div>
      <ol className="divide-y divide-slate-300 border-y border-slate-300">
        {lessons.map((lesson, index) => {
          const isComplete = progress[lesson.slug]?.completed ?? false;
          return (
            <li key={lesson.slug}>
              <Link href={`/lessons/${lesson.slug}`} className="grid min-h-20 grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-4 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 sm:gap-5">
                <span className="font-display text-2xl font-extrabold text-amber-600">{String(index + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-bold text-slate-950">{lesson.title}</span>
                  <span className="mt-1 block text-sm leading-5 text-slate-600">{lesson.summary}</span>
                </span>
                <span className={`border px-2 py-1 text-xs font-bold ${isComplete ? "border-teal-800 bg-teal-800 text-white" : "border-slate-400 text-slate-600"}`}>{isComplete ? "Done" : "Start"}</span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function ContinueWhereLeftOff() {
  const { progress, ready } = useLessonProgress();
  const lessonSequence = [...manualLessons, ...coreLessons];
  const nextLesson = lessonSequence.find((lesson) => !progress[lesson.slug]?.completed);

  if (!ready || !nextLesson) return null;
  return (
    <Link href={`/lessons/${nextLesson.slug}`} className="inline-flex min-h-11 items-center justify-center gap-3 bg-slate-950 px-5 text-sm font-bold text-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950">
      Continue where you left off <span aria-hidden="true">→</span>
    </Link>
  );
}
