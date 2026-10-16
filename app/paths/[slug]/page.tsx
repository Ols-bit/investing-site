import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { PathLessonList } from "@/components/learning-paths";
import { learningPaths } from "@/content/paths";
import { createPageMetadata } from "@/lib/site";

export function generateStaticParams() {
  return learningPaths.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/paths/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const path = learningPaths.find((item) => item.slug === slug);
  return path
    ? createPageMetadata(path.title, path.description, `/paths/${slug}`)
    : createPageMetadata("Learning path", "A guided investing lesson sequence.", "/paths");
}

export default async function LearningPathPage({ params }: PageProps<"/paths/[slug]">) {
  const { slug } = await params;
  const path = learningPaths.find((item) => item.slug === slug);
  if (!path) notFound();

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-10 border-b-2 border-slate-950 pb-8">
        <Link href="/paths" className="text-sm font-bold text-teal-800 underline underline-offset-4 hover:text-slate-950">All learning paths</Link>
        <p className="mb-4 mt-8 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Guided path</p>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">{path.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">{path.description}</p>
      </header>
      <PathLessonList path={path} />
    </main>
  );
}
