import type { Metadata } from "next";
import { LearningPathCards } from "@/components/learning-paths";
import { learningPaths } from "@/content/paths";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata(
  "Learning paths",
  "Guided investing lesson sequences, from the basics to trading and UK accounts.",
  "/paths",
);

export default function PathsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-12 max-w-4xl border-b-2 border-slate-950 pb-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Choose a sequence</p>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">A clear route through the lessons.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">Each path links existing lessons in a useful order. Your completion is saved on this device.</p>
      </header>
      <LearningPathCards paths={learningPaths} />
    </main>
  );
}
