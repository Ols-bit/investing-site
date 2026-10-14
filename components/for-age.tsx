"use client";

import type { ReactNode } from "react";

import { useAgeGroup, type AgeGroup } from "@/components/age-group-provider";

type ForAgeProps = {
  under18?: ReactNode;
  age18to24?: ReactNode;
  age25to34?: ReactNode;
  age35to49?: ReactNode;
  age50Plus?: ReactNode;
  fallback?: ReactNode;
};

const ageGroupProp: Record<AgeGroup, Exclude<keyof ForAgeProps, "fallback">> = {
  "Under 18": "under18",
  "18-24": "age18to24",
  "25-34": "age25to34",
  "35-49": "age35to49",
  "50+": "age50Plus",
};

export function ForAge({
  under18,
  age18to24,
  age25to34,
  age35to49,
  age50Plus,
  fallback,
}: ForAgeProps) {
  const { ageGroup } = useAgeGroup();
  const ageContent = {
    under18,
    age18to24,
    age25to34,
    age35to49,
    age50Plus,
  };
  const content = ageGroup ? ageContent[ageGroupProp[ageGroup]] : undefined;

  return (
    <aside className="my-6 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800">
      {content ?? fallback}
    </aside>
  );
}
