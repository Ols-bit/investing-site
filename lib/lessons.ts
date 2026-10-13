export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  sources: string[];
};

export const lessons: Lesson[] = [
  {
    slug: "why-invest",
    title: "Why invest",
    summary:
      "Understand the idea behind investing and why long-term growth can matter more than short-term saving.",
    estimatedMinutes: 10,
    sources: [
      "https://www.investor.gov/",
      "https://www.moneyhelper.org.uk/",
      "https://www.investopedia.com/",
    ],
  },
  {
    slug: "asset-classes",
    title: "Asset classes",
    summary:
      "Explore the main types of investments: shares, bonds, cash and alternatives, with simple explanations.",
    estimatedMinutes: 12,
    sources: [
      "https://www.finra.org/investors/learn-to-invest",
      "https://www.sec.gov/investor",
    ],
  },
  {
    slug: "risk-return-and-diversification",
    title: "Risk, return and diversification",
    summary:
      "Learn how risk and reward connect, and why spreading investments can help reduce anxiety and volatility.",
    estimatedMinutes: 14,
    sources: [
      "https://www.finra.org/investors/learn-to-invest",
      "https://www.moneysmart.gov.au/investing",
    ],
  },
  {
    slug: "funds-index-funds-and-etfs",
    title: "Funds (index funds and ETFs)",
    summary:
      "See how pooled investments can offer simple, low-cost ways to gain broad market exposure.",
    estimatedMinutes: 15,
    sources: [
      "https://www.moneysmart.gov.au/investing",
      "https://www.sec.gov/investor",
    ],
  },
  {
    slug: "accounts-and-taxes",
    title: "Accounts and taxes",
    summary:
      "Compare common account types and understand how taxes can affect investment outcomes over time.",
    estimatedMinutes: 13,
    sources: [
      "https://www.irs.gov/individuals",
      "https://www.gov.uk/tax-savings-accounts",
    ],
  },
  {
    slug: "costs-and-fees",
    title: "Costs and fees",
    summary:
      "Look at why costs matter and how management, platform and transaction fees can compound over time.",
    estimatedMinutes: 10,
    sources: [
      "https://www.moneysmart.gov.au/investing",
      "https://www.finra.org/investors/learn-to-invest",
    ],
  },
  {
    slug: "investor-psychology",
    title: "Investor psychology",
    summary:
      "Understand common emotional traps and how a steady process can help prevent costly mistakes.",
    estimatedMinutes: 12,
    sources: [
      "https://www.behaviouralinsights.co.uk",
      "https://www.finra.org/investors/learn-to-invest",
    ],
  },
  {
    slug: "building-a-simple-plan",
    title: "Building a simple plan",
    summary:
      "Pull the pieces together into a calm, simple investing plan that matches your goals and timeline.",
    estimatedMinutes: 16,
    sources: [
      "https://www.moneysmart.gov.au/investing",
      "https://www.finra.org/investors/learn-to-invest",
    ],
  },
];

export function getLessonBySlug(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

export function getLessonProgress(slug: string) {
  const index = lessons.findIndex((lesson) => lesson.slug === slug);

  if (index < 0) {
    return { current: 0, total: lessons.length, percent: 0 };
  }

  return {
    current: index + 1,
    total: lessons.length,
    percent: Math.round(((index + 1) / lessons.length) * 100),
  };
}
