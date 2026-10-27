import { FadeInSection } from "@/components/fade-in-section";
import { LearningPathCards } from "@/components/learning-paths";
import { learningPaths } from "@/content/paths";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Learn",
  "Choose a guided investing learning path, from the basics to more advanced topics.",
  "/learn",
);

export default function LearnPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection className="mb-10 grid gap-7 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1.2fr_0.8fr] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Choose your starting point</p>
          <h1 className="max-w-4xl text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl lg:text-7xl">
            Learn at your own pace.
          </h1>
        </div>
        <p className="max-w-lg text-base leading-7 text-slate-600 sm:justify-self-end sm:text-lg">
          Follow a guided sequence at a level that suits you. Your lesson progress is saved on this device.
        </p>
      </FadeInSection>

      <LearningPathCards paths={learningPaths} />
    </main>
  );
}
