"use client";

import Link from "next/link";
import { useLessonProgress } from "@/components/lesson-progress";
import type { ManualStage } from "@/lib/lessons";

export function ManualStages({ stages }: { stages: ManualStage[] }) {
  const { progress, ready, storageError } = useLessonProgress();

  return (
    <div className="space-y-12">
      {stages.map((stage, index) => {
        const completedCount = stage.lessons.filter(
          (lesson) => progress[lesson.slug]?.completed,
        ).length;
        const percent = Math.round((completedCount / stage.lessons.length) * 100);

        return (
          <section
            key={stage.name}
            aria-labelledby={`manual-stage-${index}`}
            aria-busy={!ready}
            className="grid gap-5 border-t-2 border-slate-950 pt-5 sm:grid-cols-[0.8fr_1.2fr] sm:gap-10"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
                Stage {String(index + 1).padStart(2, "0")}
              </p>
              <h2
                id={`manual-stage-${index}`}
                className="mt-2 text-3xl font-bold leading-tight text-slate-950 sm:text-4xl"
              >
                {stage.name}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-slate-600">
                {stage.summary}
              </p>
              <div className="mt-5 max-w-sm">
                <div className="mb-2 flex justify-between gap-3 text-xs font-semibold text-slate-600">
                  <span>Stage progress</span>
                  <span>{completedCount} of {stage.lessons.length} complete</span>
                </div>
                <div
                  className="h-2 bg-slate-200"
                  role="progressbar"
                  aria-label={`${stage.name} completion`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                >
                  <div className="h-full bg-teal-700 transition-all" style={{ width: `${percent}%` }} />
                </div>
              </div>
            </div>

            <ol className="divide-y divide-slate-300 border-y border-slate-300">
              {stage.lessons.map((lesson) => {
                const completed = progress[lesson.slug]?.completed ?? false;
                return (
                  <li key={lesson.slug}>
                    <Link
                      href={`/lessons/${lesson.slug}`}
                      className="group grid grid-cols-[2rem_1fr_auto] items-center gap-3 py-4 transition-colors hover:bg-teal-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
                    >
                      <span
                        aria-label={completed ? "Completed" : "Not completed"}
                        className={`flex size-6 items-center justify-center border text-xs font-bold ${
                          completed
                            ? "border-teal-700 bg-teal-700 text-white"
                            : "border-slate-400 text-transparent"
                        }`}
                      >
                        ✓
                      </span>
                      <span>
                        <span className="block font-bold text-slate-950 group-hover:text-teal-800">
                          {lesson.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {lesson.estimatedMinutes} min read
                        </span>
                      </span>
                      <span aria-hidden="true" className="text-lg text-teal-800">
                        →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ol>
          </section>
        );
      })}
      {storageError && (
        <p role="alert" className="border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-950">
          {storageError}
        </p>
      )}
    </div>
  );
}
