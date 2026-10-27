import type { PropsWithChildren } from "react";

type LessonRecapProps = PropsWithChildren<{
  label?: string;
}>;

export function Recap({ label = "In one line", children }: LessonRecapProps) {
  return (
    <aside className="lesson-recap my-8 border-l-4 border-teal-700 bg-teal-50 px-5 py-4 dark:bg-teal-950/40">
      <p className="lesson-handwriting text-xl font-bold text-teal-900 dark:text-teal-200">
        {label}
      </p>
      <div className="mt-1 leading-7 text-slate-800 dark:text-slate-100">{children}</div>
    </aside>
  );
}
