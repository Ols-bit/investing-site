import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { LessonShell } from "@/components/lesson-shell";
import { getLessonBySlug, getLessonProgress, lessons, manualLessons } from "@/lib/lessons";
import { getLessonFrontmatter } from "@/lib/lesson-frontmatter";
import { createPageMetadata, SITE_NAME, SITE_URL } from "@/lib/site";

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const lesson = await getLessonFrontmatter(slug);
  if (!lesson) {
    notFound();
  }

  return {
    ...createPageMetadata(lesson.title, lesson.description, `/lessons/${slug}`),
    openGraph: {
      title: lesson.title,
      description: lesson.description,
      url: `/lessons/${slug}`,
      siteName: SITE_NAME,
      type: "article",
      images: [{
        url: `/lessons/${slug}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: lesson.title,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: lesson.title,
      description: lesson.description,
      images: [`/lessons/${slug}/opengraph-image`],
    },
  };
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
  const frontmatter = await getLessonFrontmatter(slug);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter?.title ?? lesson.title,
    description: frontmatter?.description ?? lesson.summary,
    mainEntityOfPage: new URL(`/lessons/${slug}`, SITE_URL).toString(),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <LessonShell lesson={lesson} current={current} total={total}>
        <LessonContent />
      </LessonShell>
    </>
  );
}
