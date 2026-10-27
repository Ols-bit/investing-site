import { manualLessons } from "@/lib/lessons";

export type LearningPath = {
  slug: string;
  title: string;
  description: string;
  lessonSlugs: string[];
};

export const learningPaths: LearningPath[] = [
  {
    slug: "total-beginner",
    title: "Total beginner",
    description: "Start with shares, markets, diversification, and a simple investing plan.",
    lessonSlugs: [
      "manual-what-is-a-stock",
      "manual-how-markets-work",
      "asset-classes",
      "funds-index-funds-and-etfs",
      "manual-reading-quotes",
      "manual-diversification",
      "building-a-simple-plan",
    ],
  },
  {
    slug: "saving-for-a-house",
    title: "Saving for a house",
    description: "Explore goals, timelines, and UK accounts for saving toward a home.",
    lessonSlugs: [
      "why-invest",
      "accounts-and-taxes",
      "uk-stocks-and-shares-isas",
      "uk-lifetime-isas",
      "uk-investing-tax-basics",
      "risk-return-and-diversification",
      "manual-diversification",
      "costs-and-fees",
      "building-a-simple-plan",
    ],
  },
  {
    slug: "pensions-and-isas",
    title: "Pensions and ISAs",
    description: "Compare ISAs, pensions, fees, tax rules, and investment risk.",
    lessonSlugs: [
      "uk-stocks-and-shares-isas",
      "accounts-and-taxes",
      "uk-lifetime-isas",
      "uk-sipps-and-personal-pensions",
      "uk-workplace-pensions",
      "uk-investing-tax-basics",
      "uk-platforms-and-fees",
      "manual-fees-and-taxes",
      "costs-and-fees",
      "risk-return-and-diversification",
      "building-a-simple-plan",
    ],
  },
  {
    slug: "how-to-trade",
    title: "How to Trade",
    description: "Learn how shares, orders, market data, and risk fit together.",
    lessonSlugs: manualLessons.map((lesson) => lesson.slug),
  },
];
