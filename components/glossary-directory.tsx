"use client";

import { useMemo, useState } from "react";

import { glossaryTerms } from "@/lib/glossary";

export function GlossaryDirectory() {
  const [query, setQuery] = useState("");
  const filteredTerms = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return glossaryTerms;
    }

    return glossaryTerms.filter((entry) =>
      [entry.term, entry.definition, entry.explanation, ...(entry.aliases ?? [])]
        .filter((value): value is string => Boolean(value))
        .some((value) => value.toLowerCase().includes(normalizedQuery)),
    );
  }, [query]);
  const sections = useMemo(() => {
    const grouped = new Map<string, typeof filteredTerms>();
    for (const entry of filteredTerms) {
      const letter = entry.term[0].toUpperCase();
      grouped.set(letter, [...(grouped.get(letter) ?? []), entry]);
    }
    return [...grouped.entries()];
  }, [filteredTerms]);

  return (
    <div className="mt-10">
      <label
        htmlFor="glossary-search"
        className="mb-2 block text-sm font-bold text-slate-950"
      >
        Search terms
      </label>
      <input
        id="glossary-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Try “ETF” or “risk”"
        className="min-h-12 w-full max-w-xl border-2 border-slate-950 bg-white px-4 text-slate-950 placeholder:text-slate-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      />
      <p aria-live="polite" className="mt-3 text-sm text-slate-600">
        {filteredTerms.length} {filteredTerms.length === 1 ? "term" : "terms"}
        {query.trim() ? ` matching “${query.trim()}”` : ""}
      </p>

      {!filteredTerms.length ? (
        <p className="mt-8 border-l-4 border-amber-400 bg-amber-50 p-5 text-slate-800">
          No terms match that search. Try a broader word or a different spelling.
        </p>
      ) : (
        <>
          <nav
            aria-label="Glossary A to Z index"
            className="mt-6 flex flex-wrap gap-2 border-y-2 border-slate-950 py-4"
          >
            {sections.map(([letter]) => (
              <a
                key={letter}
                href={`#letter-${letter}`}
                className="inline-flex min-h-10 min-w-10 items-center justify-center border border-slate-500 px-2 font-bold text-slate-950 underline-offset-4 hover:bg-amber-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
              >
                {letter}
              </a>
            ))}
          </nav>

          <div className="mt-8 space-y-12">
            {sections.map(([letter, entries]) => (
              <section key={letter} aria-labelledby={`letter-${letter}`}>
                <h2
                  id={`letter-${letter}`}
                  className="border-b-2 border-slate-950 pb-3 font-display text-4xl font-extrabold text-slate-950"
                >
                  {letter}
                </h2>
                <dl>
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      id={`term-${entry.id}`}
                      className="grid scroll-mt-24 gap-2 border-b border-slate-300 py-5 sm:grid-cols-[minmax(12rem,0.35fr)_1fr] sm:gap-8"
                    >
                      <dt className="text-lg font-bold text-slate-950">
                        {entry.term}
                      </dt>
                      <dd>
                        <p className="leading-7 text-slate-700">
                          {entry.definition}
                        </p>
                        {entry.explanation && (
                          <p className="mt-2 leading-7 text-slate-600">
                            {entry.explanation}
                          </p>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
