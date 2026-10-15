import { FadeInSection } from "@/components/fade-in-section";
import { NewsFeed } from "@/components/news-feed";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "News",
  "Headlines and briefings from across the markets. Read the original reporting from its source.",
  "/news",
);

export default function NewsPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <FadeInSection>
        <section className="grid gap-8 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1fr_0.7fr] sm:items-end">
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
              Market reading
            </p>
            <h1 className="text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">
              News
            </h1>
          </div>
          <p className="max-w-md text-base leading-7 text-slate-600 sm:justify-self-end sm:text-lg">
            Headlines and briefings from across the markets. Read the original reporting from its source.
          </p>
        </section>
      </FadeInSection>
      <FadeInSection>
        <NewsFeed />
      </FadeInSection>
    </main>
  );
}
