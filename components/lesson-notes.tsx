import { useId, type PropsWithChildren } from "react";

import { Recap } from "@/components/lesson-recap";

type NoteProps = PropsWithChildren;
type HighlightColor = "citron" | "tomato" | "blue" | "pink";
type DiagramType = "stock-price" | "risk-reward" | "compound-growth";

const highlightColors: Record<HighlightColor, string> = {
  citron: "bg-teal-200 dark:bg-teal-900/80",
  tomato: "bg-amber-200 dark:bg-amber-900/70",
  blue: "bg-sky-200 dark:bg-sky-900/70",
  pink: "bg-rose-200 dark:bg-rose-900/70",
};

const diagrams: Record<DiagramType, { title: string; caption: string }> = {
  "stock-price": {
    title: "How a stock price moves",
    caption: "A trade happens when a buyer and seller agree on a price.",
  },
  "risk-reward": {
    title: "Risk and possible return",
    caption: "A greater possible return can come with a greater chance of loss.",
  },
  "compound-growth": {
    title: "How compounding can grow over time",
    caption: "Returns may build on earlier returns; the path is illustrative, not guaranteed.",
  },
};

export function Highlight({
  color = "citron",
  children,
}: NoteProps & { color?: HighlightColor }) {
  return (
    <mark className={`rounded-sm px-1 text-slate-950 dark:text-white ${highlightColors[color]}`}>
      {children}
    </mark>
  );
}

export function KeyIdea({ children }: NoteProps) {
  return (
    <aside className="my-7 rotate-[-0.4deg] border-2 border-slate-950 bg-amber-100 px-5 py-4 shadow-[4px_4px_0_var(--ink)] dark:border-slate-200 dark:bg-amber-950/60 dark:shadow-[4px_4px_0_rgba(255,255,255,0.22)]">
      <p className="lesson-handwriting text-xl font-bold text-slate-950 dark:text-amber-100">
        Key idea
      </p>
      <div className="mt-1 leading-7 text-slate-800 dark:text-slate-100">{children}</div>
    </aside>
  );
}

export function Definition({
  term,
  children,
}: NoteProps & { term: string }) {
  return (
    <aside className="my-7 border-2 border-dashed border-teal-700 bg-teal-50/80 px-5 py-4 dark:border-teal-300 dark:bg-teal-950/40">
      <p className="lesson-handwriting text-xl font-bold text-teal-900 dark:text-teal-200">
        {term}
      </p>
      <div className="mt-1 leading-7 text-slate-800 dark:text-slate-100">{children}</div>
    </aside>
  );
}

export function Watch({ children }: NoteProps) {
  return (
    <aside className="my-7 border-l-4 border-rose-500 bg-rose-50 px-5 py-4 dark:bg-rose-950/40">
      <p className="lesson-handwriting text-xl font-bold text-rose-900 dark:text-rose-200">
        Watch out
      </p>
      <div className="mt-1 leading-7 text-slate-800 dark:text-slate-100">{children}</div>
    </aside>
  );
}

export function Example({ children }: NoteProps) {
  return (
    <aside className="my-7 border-2 border-slate-950 bg-sky-50 px-5 py-4 dark:border-sky-200 dark:bg-sky-950/40">
      <p className="lesson-handwriting text-xl font-bold text-slate-950 dark:text-sky-200">
        Try it: a worked example
      </p>
      <div className="mt-1 leading-7 text-slate-800 dark:text-slate-100">{children}</div>
    </aside>
  );
}

export function Steps({ children }: NoteProps) {
  return <ol className="lesson-steps my-7 space-y-4">{children}</ol>;
}

export function Margin({ children }: NoteProps) {
  return (
    <aside className="lesson-margin-note lesson-handwriting" aria-label="Margin note">
      {children}
    </aside>
  );
}

export function Diagram({ type }: { type: DiagramType }) {
  const titleId = useId();
  const { title, caption } = diagrams[type];

  return (
    <figure className="my-9 border-y-2 border-slate-300 px-2 py-5 dark:border-slate-600 sm:px-5">
      <p className="lesson-handwriting mb-3 text-center text-xl font-bold text-slate-700 dark:text-slate-200">
        {title}
      </p>
      <svg
        viewBox="0 0 520 230"
        role="img"
        aria-labelledby={titleId}
        className="mx-auto block w-full max-w-2xl text-slate-900 dark:text-slate-100"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <title id={titleId}>{title}</title>
        {type === "stock-price" && (
          <>
            <path d="M72 24v164h384" stroke="#65736a" strokeWidth="2" />
            <path d="m76 149 70-32 58 16 58-65 56 24 55-47 78 23" stroke="#183027" strokeWidth="5" />
            <circle cx="146" cy="117" r="6" fill="#ed6246" stroke="none" />
            <circle cx="371" cy="45" r="6" fill="#d8eb68" stroke="none" />
            <text x="74" y="214" className="diagram-handwriting" fill="currentColor" stroke="none">earlier trades</text>
            <text x="385" y="214" className="diagram-handwriting" fill="currentColor" stroke="none">time</text>
            <text x="15" y="34" className="diagram-handwriting" fill="currentColor" stroke="none">price</text>
          </>
        )}
        {type === "risk-reward" && (
          <>
            <path d="M80 24v164h380" stroke="#65736a" strokeWidth="2" />
            <path d="m130 150 102-45 102 17 74-82" stroke="#ed6246" strokeWidth="4" />
            <circle cx="130" cy="150" r="7" fill="#d8eb68" stroke="none" />
            <circle cx="408" cy="40" r="7" fill="#ed6246" stroke="none" />
            <text x="235" y="217" className="diagram-handwriting" fill="currentColor" stroke="none">possible risk</text>
            <text x="12" y="32" className="diagram-handwriting" fill="currentColor" stroke="none">possible return</text>
            <text x="111" y="178" className="diagram-handwriting" fill="currentColor" stroke="none">lower</text>
            <text x="385" y="70" className="diagram-handwriting" fill="currentColor" stroke="none">higher</text>
          </>
        )}
        {type === "compound-growth" && (
          <>
            <path d="M72 24v164h384" stroke="#65736a" strokeWidth="2" />
            <path d="M82 170c95-1 116-15 172-34s110-28 189-88" stroke="#183027" strokeWidth="5" />
            <path d="M82 170h361" stroke="#ed6246" strokeWidth="2" strokeDasharray="7 8" />
            <circle cx="82" cy="170" r="6" fill="#ed6246" stroke="none" />
            <circle cx="443" cy="48" r="7" fill="#d8eb68" stroke="none" />
            <text x="70" y="216" className="diagram-handwriting" fill="currentColor" stroke="none">start</text>
            <text x="399" y="216" className="diagram-handwriting" fill="currentColor" stroke="none">time</text>
            <text x="11" y="34" className="diagram-handwriting" fill="currentColor" stroke="none">value</text>
          </>
        )}
      </svg>
      <figcaption className="mx-auto mt-3 max-w-xl text-center text-sm leading-6 text-slate-600 dark:text-slate-300">
        {caption}
      </figcaption>
    </figure>
  );
}

export { Recap };
