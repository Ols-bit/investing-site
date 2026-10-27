import { isValidElement, type ReactNode } from "react";
import type { MDXComponents } from "mdx/types";

import { CompoundInterestCalculator } from "@/components/compound-interest-calculator";
import { FeesVsReturnsCalculator } from "@/components/fees-vs-returns-calculator";
import { ForAge } from "@/components/for-age";
import { GoalPlannerCalculator } from "@/components/goal-planner-calculator";
import {
  Definition,
  Diagram,
  Example,
  Highlight,
  KeyIdea,
  Margin,
  Recap,
  Steps,
  Watch,
} from "@/components/lesson-notes";
import { LessonQuiz } from "@/components/quiz";
import { Term } from "@/components/term";
import { WhatIfInvestedCalculator } from "@/components/what-if-invested-calculator";

function getHeadingText(children: ReactNode): string {
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getHeadingText).join("");
  }
  if (isValidElement<{ children?: ReactNode }>(children)) {
    return getHeadingText(children.props.children);
  }
  return "";
}

function getHeadingId(children: ReactNode) {
  return getHeadingText(children)
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}

const components: MDXComponents = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-semibold tracking-tight text-slate-900 dark:text-white" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="lesson-note-heading text-3xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-4xl" {...props} id={props.id ?? getHeadingId(children)}>
      {children}
    </h2>
  ),
  p: ({ children, ...props }) => (
    <p className="text-base leading-7 text-slate-800 dark:text-slate-200" {...props}>
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
  WhatIfInvestedCalculator,
  FeesVsReturnsCalculator,
  GoalPlannerCalculator,
  Quiz: LessonQuiz,
  Term,
  Highlight,
  KeyIdea,
  Definition,
  Watch,
  Example,
  Steps,
  Margin,
  Recap,
  Diagram,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
