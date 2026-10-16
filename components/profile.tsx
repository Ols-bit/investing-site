"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLessonProgress } from "@/components/lesson-progress";
import { BADGES, earnedBadgeIds } from "@/lib/badges";
import { getStreakStats } from "@/lib/learning-stats";
import { lessons, manualLessons } from "@/lib/lessons";
import { learningPaths } from "@/content/paths";

const resultTitles = {
  "careful-planner": "The careful planner",
  "steady-builder": "The steady builder",
  "long-view-explorer": "The long-view explorer",
  "curious-learner": "The curious learner",
} as const;

function BadgeMark({ badgeId }: { badgeId: string }) {
  const marks: Record<string, string> = {
    "first-lesson": "M7 4h10v16H7zM10 8h4M10 12h4",
    "first-quiz": "m6 12 4 4 8-9",
    "five-lessons": "M5 7h14M5 12h14M5 17h14",
    "three-day-streak": "M5 19V11M12 19V5M19 19V9",
    "path-finished": "M6 20V4l12 3-12 3",
    "risk-quiz": "M12 3v18M3 12h18M5.6 5.6l12.8 12.8m0-12.8L5.6 18.4",
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-8">
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity=".12" />
      <path d={marks[badgeId]} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BadgeToast() {
  const { badgeToast, dismissBadgeToast } = useLessonProgress();
  useEffect(() => {
    if (!badgeToast) return;
    const timeout = window.setTimeout(dismissBadgeToast, 5000);
    return () => window.clearTimeout(timeout);
  }, [badgeToast, dismissBadgeToast]);

  if (!badgeToast) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[70] flex max-w-sm items-center gap-3 border-2 border-slate-950 bg-amber-300 p-4 text-slate-950" role="status" aria-live="polite">
      <span className="text-teal-900"><BadgeMark badgeId={badgeToast.id} /></span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-bold uppercase tracking-[0.14em]">Badge earned</span>
        <span className="block font-display text-lg font-extrabold">{badgeToast.title}</span>
      </span>
      <button type="button" aria-label="Dismiss badge notification" onClick={dismissBadgeToast} className="min-h-10 min-w-10 font-bold hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-950">×</button>
    </div>
  );
}

export function ProfileOverview() {
  const { progress, learning, ready, storageError } = useLessonProgress();
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    const timeout = window.setTimeout(() => setNow(new Date()), 0);
    return () => window.clearTimeout(timeout);
  }, []);
  const allLessons = [...manualLessons, ...lessons];
  const completed = allLessons.filter((lesson) => progress[lesson.slug]?.completed);
  const scoredLessons = allLessons.filter((lesson) => progress[lesson.slug]?.bestQuizScore !== null && progress[lesson.slug]?.bestQuizScore !== undefined);
  const activityTime = now ?? new Date(0);
  const streak = getStreakStats(learning.activityDays, activityTime);
  const earned = earnedBadgeIds(progress, learning, learningPaths, activityTime);

  return (
    <div aria-busy={!ready}>
      <section className="mb-12 grid gap-4 sm:grid-cols-3" aria-label="Learning summary">
        <article className="border-t-4 border-teal-700 bg-teal-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-900">Current streak</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-slate-950">{ready ? streak.current : "—"} <span className="text-lg">days</span></p>
          <p className="mt-2 text-sm text-slate-700">{streak.activeToday ? "You learned today." : "Learn today to keep it going."}</p>
        </article>
        <article className="border-t-4 border-amber-500 bg-amber-50 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-950">Lessons completed</p>
          <p className="mt-2 font-display text-4xl font-extrabold text-slate-950">{ready ? completed.length : "—"}</p>
          <p className="mt-2 text-sm text-slate-700">Across the manual and learning modules.</p>
        </article>
        <article className="border-t-4 border-slate-950 bg-slate-100 p-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-700">Risk exercise</p>
          {learning.riskProfile ? (
            <p className="mt-2 font-display text-2xl font-extrabold text-slate-950">{resultTitles[learning.riskProfile.type]}</p>
          ) : (
            <Link href="/risk-quiz" className="mt-3 inline-block font-bold text-teal-900 underline underline-offset-4 hover:text-slate-950">Take the educational quiz</Link>
          )}
          <p className="mt-2 text-sm text-slate-700">A reflection exercise, not a suitability assessment.</p>
        </article>
      </section>

      <section aria-labelledby="badges-heading" className="mb-12">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 border-slate-950 pb-3">
          <h2 id="badges-heading" className="font-display text-3xl font-extrabold text-slate-950">Badges</h2>
          <p className="text-sm text-slate-600">{earned.size} of {BADGES.length} earned</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BADGES.map((badge) => {
            const isEarned = earned.has(badge.id);
            return (
              <article key={badge.id} className={`flex items-center gap-4 border p-4 ${isEarned ? "border-teal-800 bg-teal-50 text-teal-900" : "border-slate-300 bg-slate-100 text-slate-400"}`}>
                <BadgeMark badgeId={badge.id} />
                <div>
                  <h3 className={`font-bold ${isEarned ? "text-slate-950" : "text-slate-500"}`}>{badge.title}</h3>
                  <p className={`mt-1 text-sm leading-5 ${isEarned ? "text-slate-700" : "text-slate-500"}`}>{isEarned ? badge.description : "Not earned yet"}</p>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section aria-labelledby="quiz-scores-heading">
        <h2 id="quiz-scores-heading" className="mb-4 border-b-2 border-slate-950 pb-3 font-display text-3xl font-extrabold text-slate-950">Best quiz scores</h2>
        {scoredLessons.length ? (
          <ul className="divide-y divide-slate-300 border-y border-slate-300">
            {scoredLessons.map((lesson) => (
              <li key={lesson.slug} className="flex items-center justify-between gap-4 py-3">
                <Link href={`/lessons/${lesson.slug}`} className="font-semibold text-teal-900 underline-offset-4 hover:underline">{lesson.title}</Link>
                <span className="font-bold tabular-nums text-slate-950">{progress[lesson.slug]?.bestQuizScore}%</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-sm leading-6 text-slate-600">Quiz scores appear here after you finish a lesson quiz.</p>}
      </section>

      {completed.length === 0 && ready && <p className="mt-8"><Link href="/paths" className="font-bold text-teal-900 underline underline-offset-4 hover:text-slate-950">Choose a learning path</Link></p>}
      {storageError && <p className="mt-8 border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-950" role="alert">{storageError}</p>}
    </div>
  );
}
