import { notFound } from "next/navigation";

import { LessonShell } from "@/components/lesson-shell";
import { getLessonBySlug, getLessonProgress, lessons, manualLessons } from "@/lib/lessons";

import WhyInvestLesson from "@/content/lessons/01-why-invest.mdx";
import AssetClassesLesson from "@/content/lessons/asset-classes.mdx";
import RiskReturnAndDiversificationLesson from "@/content/lessons/risk-return-and-diversification.mdx";
import FundsLesson from "@/content/lessons/funds-index-funds-and-etfs.mdx";
import AccountsAndTaxesLesson from "@/content/lessons/accounts-and-taxes.mdx";
import CostsAndFeesLesson from "@/content/lessons/costs-and-fees.mdx";
import InvestorPsychologyLesson from "@/content/lessons/investor-psychology.mdx";
import BuildingSimplePlanLesson from "@/content/lessons/building-a-simple-plan.mdx";
import WhatIsAStockLesson from "@/content/lessons/manual-what-is-a-stock.mdx";
import HowMarketsWorkLesson from "@/content/lessons/manual-how-markets-work.mdx";
import OrderTypesLesson from "@/content/lessons/manual-order-types.mdx";
import ReadingQuotesLesson from "@/content/lessons/manual-reading-quotes.mdx";
import ReadingChartsLesson from "@/content/lessons/manual-reading-charts.mdx";
import DiversificationLesson from "@/content/lessons/manual-diversification.mdx";
import PositionSizingLesson from "@/content/lessons/manual-position-sizing.mdx";
import FeesAndTaxesLesson from "@/content/lessons/manual-fees-and-taxes.mdx";
import BeginnerMistakesLesson from "@/content/lessons/manual-beginner-mistakes.mdx";

const lessonComponents = {
  "why-invest": WhyInvestLesson,
  "asset-classes": AssetClassesLesson,
  "risk-return-and-diversification": RiskReturnAndDiversificationLesson,
  "funds-index-funds-and-etfs": FundsLesson,
  "accounts-and-taxes": AccountsAndTaxesLesson,
  "costs-and-fees": CostsAndFeesLesson,
  "investor-psychology": InvestorPsychologyLesson,
  "building-a-simple-plan": BuildingSimplePlanLesson,
  "manual-what-is-a-stock": WhatIsAStockLesson,
  "manual-how-markets-work": HowMarketsWorkLesson,
  "manual-order-types": OrderTypesLesson,
  "manual-reading-quotes": ReadingQuotesLesson,
  "manual-reading-charts": ReadingChartsLesson,
  "manual-diversification": DiversificationLesson,
  "manual-position-sizing": PositionSizingLesson,
  "manual-fees-and-taxes": FeesAndTaxesLesson,
  "manual-beginner-mistakes": BeginnerMistakesLesson,
} as const;

export async function generateStaticParams() {
  return [...lessons, ...manualLessons].map((lesson) => ({ slug: lesson.slug }));
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
