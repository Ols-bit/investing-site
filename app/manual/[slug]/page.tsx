import { notFound, permanentRedirect } from "next/navigation";
import { manualLessons } from "@/lib/lessons";

export function generateStaticParams() {
  return manualLessons.flatMap(({ slug }) => [
    { slug },
    ...(slug.startsWith("manual-") ? [{ slug: slug.slice("manual-".length) }] : []),
  ]);
}

export default async function ManualLessonRedirect({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = manualLessons.find(
    (item) => item.slug === slug || item.slug === `manual-${slug}`,
  );

  if (!lesson) {
    notFound();
  }

  permanentRedirect(`/lessons/${lesson.slug}`);
}
