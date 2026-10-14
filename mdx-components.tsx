import type { MDXComponents } from "mdx/types";

import { CompoundInterestCalculator } from "@/components/compound-interest-calculator";
import { ForAge } from "@/components/for-age";
import { Quiz } from "@/components/quiz";

const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white" {...props}>
      {children}
    </h2>
  ),
  p: ({ children, ...props }) => (
    <p className="text-base leading-7 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc space-y-2 pl-6 text-base leading-7 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal space-y-2 pl-6 text-base leading-7 text-slate-700 dark:text-slate-300" {...props}>
      {children}
    </ol>
  ),
  a: ({ children, ...props }) => (
    <a className="font-medium text-emerald-700 underline decoration-emerald-200 underline-offset-4 hover:text-emerald-900 dark:text-teal-200 dark:decoration-teal-500 dark:hover:text-teal-100" {...props}>
      {children}
    </a>
  ),
  ForAge,
  CompoundInterestCalculator,
  Quiz,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
