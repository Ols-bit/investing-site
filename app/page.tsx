import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
          Beginner investing
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Learn the basics, calmly and step by step.
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
          Start with the building blocks of investing, without jargon or pressure.
          Explore clear, beginner-friendly lessons at your own pace.
        </p>
        <Link
          href="/learn"
          className="mt-7 inline-flex items-center rounded-full bg-emerald-700 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-emerald-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
        >
          Explore the learning path
          <span aria-hidden="true" className="ml-2">→</span>
        </Link>
      </section>
    </main>
  );
}
