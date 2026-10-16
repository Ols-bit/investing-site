export type Lesson = {
  slug: string;
  title: string;
  summary: string;
  estimatedMinutes: number;
  sources: string[];
  track?: "manual";
  stage?: ManualStageName;
};

export type ManualStageName =
  | "The basics"
  | "Your first trade"
  | "Reading the market"
  | "Managing risk"
  | "Common mistakes"
  | "Investing in the UK";

export type ManualStage = {
  name: ManualStageName;
  summary: string;
  lessons: ManualLesson[];
};

export type ManualLesson = Lesson & {
  track: "manual";
  stage: ManualStageName;
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

export const manualStages: ManualStage[] = [
  {
    name: "The basics",
    summary: "Know what you own and how a share changes hands.",
    lessons: [
      {
        slug: "manual-what-is-a-stock",
        title: "What is a stock?",
        summary: "A share is a small ownership claim in a company, with a value that can rise or fall.",
        estimatedMinutes: 7,
        stage: "The basics",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/investment-products/stocks"],
      },
      {
        slug: "manual-how-markets-work",
        title: "How the market works",
        summary: "Learn how exchanges, brokers, buyers and sellers connect.",
        estimatedMinutes: 8,
        stage: "The basics",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work"],
      },
    ],
  },
  {
    name: "Your first trade",
    summary: "Understand the instructions behind a trade before placing one.",
    lessons: [
      {
        slug: "manual-order-types",
        title: "Market orders and limit orders",
        summary: "Compare an order to trade now with an order that sets a price boundary.",
        estimatedMinutes: 8,
        stage: "Your first trade",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders"],
      },
    ],
  },
  {
    name: "Reading the market",
    summary: "Read a quote and a chart without mistaking data for a forecast.",
    lessons: [
      {
        slug: "manual-reading-quotes",
        title: "Reading a stock quote",
        summary: "Make sense of price, daily change, volume, high, low and previous close.",
        estimatedMinutes: 8,
        stage: "Reading the market",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work"],
      },
      {
        slug: "manual-reading-charts",
        title: "Reading a stock chart",
        summary: "Understand time ranges, price axes and why a chart cannot tell you what comes next.",
        estimatedMinutes: 9,
        stage: "Reading the market",
        track: "manual",
        sources: ["https://www.finra.org/investors/insights/how-read-stock-chart"],
      },
    ],
  },
  {
    name: "Managing risk",
    summary: "Think about what could go wrong, and how much exposure you can carry.",
    lessons: [
      {
        slug: "manual-diversification",
        title: "Diversification in practice",
        summary: "See how spreading exposure can reduce reliance on one company or sector.",
        estimatedMinutes: 8,
        stage: "Managing risk",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/asset-allocation-diversification"],
      },
      {
        slug: "manual-position-sizing",
        title: "Risk and position size",
        summary: "Use a simple loss-limit example to understand the effect of position size.",
        estimatedMinutes: 8,
        stage: "Managing risk",
        track: "manual",
        sources: ["https://www.finra.org/investors/investing/investment-products/stocks"],
      },
    ],
  },
  {
    name: "Common mistakes",
    summary: "Account for costs, local tax rules and the habits that can undermine a plan.",
    lessons: [
      {
        slug: "manual-fees-and-taxes",
        title: "Fees and taxes",
        summary: "Understand where investment costs and tax rules can affect a result.",
        estimatedMinutes: 9,
        stage: "Common mistakes",
        track: "manual",
        sources: ["https://www.investor.gov/introduction-investing/investing-basics/fees-and-expenses"],
      },
      {
        slug: "manual-beginner-mistakes",
        title: "Common beginner mistakes",
        summary: "Recognise chasing headlines, overtrading and investing money needed soon.",
        estimatedMinutes: 8,
        stage: "Common mistakes",
        track: "manual",
        sources: ["https://www.finra.org/investors/insights/investing-basics"],
      },
    ],
  },
  {
    name: "Investing in the UK",
    summary: "Understand UK accounts, pensions, tax basics and platform charges without product recommendations.",
    lessons: [
      {
        slug: "uk-stocks-and-shares-isas",
        title: "Stocks and Shares ISAs",
        summary: "Learn how the ISA tax wrapper and annual allowance work, and what they do not protect against.",
        estimatedMinutes: 8,
        stage: "Investing in the UK",
        track: "manual",
        sources: ["https://www.gov.uk/individual-savings-accounts/how-isas-work"],
      },
      {
        slug: "uk-lifetime-isas",
        title: "Lifetime ISAs",
        summary: "Understand the Lifetime ISA bonus, eligible uses and withdrawal conditions.",
        estimatedMinutes: 8,
        stage: "Investing in the UK",
        track: "manual",
        sources: ["https://www.gov.uk/lifetime-isa"],
      },
      {
        slug: "uk-sipps-and-personal-pensions",
        title: "SIPPs and personal pensions",
        summary: "Explore investment choice, pension tax relief and contribution limits.",
        estimatedMinutes: 9,
        stage: "Investing in the UK",
        track: "manual",
        sources: [
          "https://www.gov.uk/tax-on-your-private-pension/pension-tax-relief",
          "https://www.gov.uk/tax-on-your-private-pension/annual-allowance",
        ],
      },
      {
        slug: "uk-workplace-pensions",
        title: "Workplace pensions and auto-enrolment",
        summary: "See how qualifying earnings and employer contributions fit into workplace pensions.",
        estimatedMinutes: 8,
        stage: "Investing in the UK",
        track: "manual",
        sources: ["https://www.gov.uk/workplace-pensions/what-you-your-employer-and-the-government-pay"],
      },
      {
        slug: "uk-investing-tax-basics",
        title: "UK investing tax basics",
        summary: "Learn the basics of capital gains, dividends and allowances outside tax-advantaged accounts.",
        estimatedMinutes: 9,
        stage: "Investing in the UK",
        track: "manual",
        sources: [
          "https://www.gov.uk/capital-gains-tax/allowances",
          "https://www.gov.uk/tax-on-dividends",
        ],
      },
      {
        slug: "uk-platforms-and-fees",
        title: "Choosing a platform and understanding fees",
        summary: "Compare common investment platform and fund charges without being directed to a provider.",
        estimatedMinutes: 8,
        stage: "Investing in the UK",
        track: "manual",
        sources: ["https://www.moneyhelper.org.uk/en/savings/types-of-savings/investing-beginners-guide"],
      },
    ],
  },
];

export const manualLessons = manualStages.flatMap((stage) => stage.lessons);

export function getLessonBySlug(slug: string) {
  return [...lessons, ...manualLessons].find((lesson) => lesson.slug === slug);
}

export function getLessonProgress(slug: string) {
  const manualIndex = manualLessons.findIndex((lesson) => lesson.slug === slug);
  const lessonList = manualIndex >= 0 ? manualLessons : lessons;
  const index = manualIndex >= 0 ? manualIndex : lessonList.findIndex((lesson) => lesson.slug === slug);

  if (index < 0) {
    return { current: 0, total: lessonList.length, percent: 0 };
  }

  return {
    current: index + 1,
    total: lessonList.length,
    percent: Math.round(((index + 1) / lessonList.length) * 100),
  };
}
