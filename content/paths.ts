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
    description: "Start with ownership, learn how markets work, then build a simple foundation for understanding risk.",
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
    description: "Explore goals, time horizons, UK savings and investment accounts, and the trade-offs around risk.",
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
    description: "Learn how UK tax wrappers and pensions differ, and what fees and investment risk mean in context.",
    lessonSlugs: [
      "accounts-and-taxes",
      "uk-stocks-and-shares-isas",
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
];
