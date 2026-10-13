import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tools | Investing Basics",
};

export default function ToolsPage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Tools
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">Coming soon.</p>
      </section>
    </main>
  );
}
