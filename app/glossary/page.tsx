import { GlossaryDirectory } from "@/components/glossary-directory";
import { createPageMetadata } from "@/lib/site";

export const metadata = createPageMetadata(
  "Glossary",
  "Plain-English definitions for investing terms, from shares and funds to risk and returns.",
  "/glossary",
);

export default function GlossaryPage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="grid gap-8 border-b-2 border-slate-950 pb-10 sm:grid-cols-[1fr_0.7fr] sm:items-end">
        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
            Clear definitions
          </p>
          <h1 className="font-display text-6xl font-extrabold tracking-tight text-slate-950 sm:text-7xl">
            Glossary
          </h1>
        </div>
        <p className="max-w-md text-base leading-7 text-slate-600 sm:justify-self-end sm:text-lg">
          Investing terms, explained in plain English. These definitions are
          educational, not financial advice.
        </p>
      </header>
      <GlossaryDirectory />
    </main>
  );
}
