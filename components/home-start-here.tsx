"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { useLessonProgress } from "@/components/lesson-progress";
import { manualStages } from "@/lib/lessons";

const featuredLessons = manualStages.flatMap((stage) => stage.lessons).slice(0, 4);

export function HomeStartHere() {
  const { progress, ready } = useLessonProgress();
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="start-here-title"
      className="rounded-t-[2.5rem] bg-teal-300 px-5 pb-20 pt-16 sm:px-8 sm:pb-24 sm:pt-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 border-b-2 border-slate-950 pb-8 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-800">Start here</p>
            <h2 id="start-here-title" className="mt-3 max-w-3xl text-5xl font-extrabold leading-[0.94] tracking-tight text-slate-950 sm:text-6xl">
              The first things worth knowing.
            </h2>
          </div>
          <Link
            href="/manual"
            className="inline-flex min-h-12 items-center justify-center gap-4 justify-self-start border-2 border-slate-950 px-5 text-sm font-bold text-slate-950 transition-colors hover:bg-slate-950 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950 sm:justify-self-end"
          >
            Start the manual <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="mt-2 grid gap-x-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredLessons.map((lesson, index) => {
            const completed = progress[lesson.slug]?.completed ?? false;
            return (
              <motion.article
                key={lesson.slug}
                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                aria-busy={!ready}
                className="border-b border-slate-950/35 py-5 sm:border-b-0 sm:border-t sm:border-slate-950/35"
              >
                <Link
                  href={`/lessons/${lesson.slug}`}
                  className="group block min-h-36 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-950"
                >
                  <span className="flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em] text-slate-700">
                    <span>0{index + 1} / {lesson.estimatedMinutes} min</span>
                    {completed && (
                      <span className="border border-slate-950 px-2 py-1 text-[10px]">Complete</span>
                    )}
                  </span>
                  <h3 className="mt-5 text-xl font-bold leading-tight text-slate-950 group-hover:underline group-hover:decoration-2 group-hover:underline-offset-4">
                    {lesson.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-800">{lesson.summary}</p>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
