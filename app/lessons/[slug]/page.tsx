import { notFound } from "next/navigation";

import { LessonShell } from "@/components/lesson-shell";
import { getLessonBySlug, getLessonProgress, lessons } from "@/lib/lessons";

import WhyInvestLesson from "@/content/lessons/why-invest.mdx";
import AssetClassesLesson from "@/content/lessons/asset-classes.mdx";
import RiskReturnAndDiversificationLesson from "@/content/lessons/risk-return-and-diversification.mdx";
import FundsLesson from "@/content/lessons/funds-index-funds-and-etfs.mdx";
import AccountsAndTaxesLesson from "@/content/lessons/accounts-and-taxes.mdx";
import CostsAndFeesLesson from "@/content/lessons/costs-and-fees.mdx";
import InvestorPsychologyLesson from "@/content/lessons/investor-psychology.mdx";
import BuildingSimplePlanLesson from "@/content/lessons/building-a-simple-plan.mdx";

const lessonComponents = {
  "why-invest": WhyInvestLesson,
  "asset-classes": AssetClassesLesson,
  "risk-return-and-diversification": RiskReturnAndDiversificationLesson,
  "funds-index-funds-and-etfs": FundsLesson,
  "accounts-and-taxes": AccountsAndTaxesLesson,
  "costs-and-fees": CostsAndFeesLesson,
  "investor-psychology": InvestorPsychologyLesson,
  "building-a-simple-plan": BuildingSimplePlanLesson,
} as const;

export async function generateStaticParams() {
  return lessons.map((lesson) => ({ slug: lesson.slug }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const lesson = getLessonBySlug(slug);

  if (!lesson) {
    notFound();
  }

  const LessonContent = lessonComponents[slug as keyof typeof lessonComponents];

  if (!LessonContent) {
    notFound();
  }

  const { current, total } = getLessonProgress(slug);

  return (
    <LessonShell lesson={lesson} current={current} total={total}>
      <LessonContent />
    </LessonShell>
  );
}
