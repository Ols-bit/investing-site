"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLessonProgress, type RiskProfileResult } from "@/components/lesson-progress";

const questions = [
  {
    prompt: "What would you most like investing to help you understand?",
    options: [
      ["I am exploring; I do not have a set goal yet.", 0],
      ["A goal several years away, such as a home or education.", 1],
      ["Long-term growth for a goal many years away.", 2],
      ["I am learning how different strategies behave.", 3],
    ],
  },
  {
    prompt: "When might you need the money you are thinking about investing?",
    options: [
      ["Within the next few years.", 0],
      ["In around five to ten years.", 1],
      ["More than ten years from now.", 2],
      ["I am not sure yet; I want to learn first.", 3],
    ],
  },
  {
    prompt: "How would you describe your investing experience?",
    options: [
      ["I have not invested before.", 0],
      ["I have read about it or used a savings account.", 1],
      ["I have invested a little and want to understand more.", 2],
      ["I have tried different investments and like comparing them.", 3],
    ],
  },
  {
    prompt: "If an investment fell noticeably in value, what would concern you most?",
    options: [
      ["I might need the money before it recovered.", 0],
      ["I would want to understand what caused the fall.", 1],
      ["I would focus on the long-term goal and review my plan.", 2],
      ["I would be curious to compare how different investments reacted.", 3],
    ],
  },
  {
    prompt: "How do you feel about uncertainty in investment values?",
    options: [
      ["I would prefer to learn about lower fluctuations first.", 0],
      ["Some changes seem manageable if I understand the risks.", 1],
      ["I can accept ups and downs for a long-term goal.", 2],
      ["I want to learn how different risk levels compare.", 3],
    ],
  },
  {
    prompt: "How much time would you like to spend learning about investments?",
    options: [
      ["A little at a time, starting with the basics.", 0],
      ["Enough to make sense of a simple plan.", 1],
      ["I am happy to study long-term investing ideas.", 2],
      ["I enjoy exploring details, data and different approaches.", 3],
    ],
  },
  {
    prompt: "What would help you feel more confident before making a decision?",
    options: [
      ["Understanding what a share is and what can go wrong.", 0],
      ["Learning how diversification and time horizons work.", 1],
      ["Connecting risk, goals and long-term growth.", 2],
      ["Practising how to read market information and compare choices.", 3],
    ],
  },
  {
    prompt: "Which next step sounds most useful to you?",
    options: [
      ["Build a foundation before thinking about investments.", 0],
      ["Understand how to spread risk across investments.", 1],
      ["Learn how to make a steady long-term plan.", 2],
      ["Learn the mechanics of markets and evaluate information.", 3],
    ],
  },
] as const;

const resultDetails: Record<
  RiskProfileResult["type"],
  { title: string; description: string; lessons: { slug: string; title: string }[] }
> = {
  "careful-planner": {
    title: "The careful planner",
    description:
      "You value clarity and want to understand what could happen before making decisions. Start with the fundamentals and remember that money needed soon may not suit investments that can fall in value.",
    lessons: [
      { slug: "manual-what-is-a-stock", title: "What is a stock?" },
      { slug: "manual-how-markets-work", title: "How the market works" },
      { slug: "manual-diversification", title: "Diversification in practice" },
    ],
  },
  "steady-builder": {
    title: "The steady builder",
    description:
      "You are interested in a measured approach and want to connect goals with risk. Learn how time, diversification and costs can affect an investing plan.",
    lessons: [
      { slug: "building-a-simple-plan", title: "Building a simple plan" },
      { slug: "manual-diversification", title: "Diversification in practice" },
      { slug: "manual-fees-and-taxes", title: "Fees and taxes" },
    ],
  },
  "long-view-explorer": {
    title: "The long-view explorer",
    description:
      "You are curious about long-term growth and understand that prices can move up and down along the way. Explore how time, risk and regular contributions interact.",
    lessons: [
      { slug: "why-invest", title: "Why invest" },
      { slug: "risk-return-and-diversification", title: "Risk, return and diversification" },
      { slug: "building-a-simple-plan", title: "Building a simple plan" },
    ],
  },
  "curious-learner": {
    title: "The curious learner",
    description:
      "You like exploring how markets and investment information work. Keep building your understanding of orders, quotes and the limits of market data.",
    lessons: [
      { slug: "manual-order-types", title: "Market orders and limit orders" },
      { slug: "manual-reading-quotes", title: "Reading a stock quote" },
      { slug: "manual-reading-charts", title: "Reading a stock chart" },
    ],
  },
};

function profileType(total: number): RiskProfileResult["type"] {
  if (total <= 8) return "careful-planner";
  if (total <= 15) return "steady-builder";
  if (total <= 21) return "long-view-explorer";
  return "curious-learner";
}

export function RiskQuiz() {
  const { learning, ready, saveRiskProfile, storageError } = useLessonProgress();
  const [answers, setAnswers] = useState<number[]>([]);
  const [step, setStep] = useState(0);
  const [result, setResult] = useState<RiskProfileResult | null>(null);

  const savedResult = ready ? learning.riskProfile : null;
  const shownResult = result ?? savedResult;
  const total = useMemo(() => answers.reduce((sum, value) => sum + value, 0), [answers]);

  function submitResult() {
    const outcome: RiskProfileResult = {
      type: profileType(total),
      completedAt: new Date().toISOString(),
    };
    saveRiskProfile(outcome);
    setResult(outcome);
  }

  if (shownResult) {
    const detail = resultDetails[shownResult.type];
    return (
      <section className="border-t-2 border-slate-950 pt-8" aria-live="polite">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">Your learning result</p>
        <h2 className="mt-3 font-display text-4xl font-extrabold text-slate-950 sm:text-5xl">{detail.title}</h2>
        <p className="mt-5 max-w-3xl text-base leading-7 text-slate-700">{detail.description}</p>
        <h3 className="mt-9 text-xl font-bold text-slate-950">Recommended lessons</h3>
        <ul className="mt-3 divide-y divide-slate-300 border-y border-slate-300">
          {detail.lessons.map((lesson) => (
            <li key={lesson.slug}>
              <Link className="block py-4 font-semibold text-teal-900 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-teal-700" href={`/lessons/${lesson.slug}`}>
                {lesson.title}
              </Link>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => {
            setAnswers([]);
            setStep(0);
            setResult(null);
          }}
          className="mt-6 min-h-11 border-2 border-slate-950 px-5 font-bold text-slate-950 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
        >
          Retake the exercise
        </button>
        {storageError && <p className="mt-4 text-sm text-rose-800" role="alert">{storageError}</p>}
        <p className="mt-8 border-l-4 border-amber-300 pl-4 text-sm leading-6 text-slate-700">
          This is an educational exercise, not financial advice or a suitability assessment. It does not recommend investments and cannot account for your full circumstances.
        </p>
      </section>
    );
  }

  const question = questions[step];
  return (
    <section className="max-w-3xl border-t-2 border-slate-950 pt-6" aria-labelledby="risk-question">
      <div className="mb-6 flex items-center justify-between gap-4 text-sm font-bold text-slate-600">
        <span>Question {step + 1} of {questions.length}</span>
        <span>{Math.round(((step + 1) / questions.length) * 100)}%</span>
      </div>
      <div className="mb-7 h-2 bg-slate-200" role="progressbar" aria-label="Quiz progress" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step + 1}>
        <div className="h-full bg-teal-700" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
      </div>
      <h2 id="risk-question" className="font-display text-3xl font-extrabold leading-tight text-slate-950 sm:text-4xl">{question.prompt}</h2>
      <div className="mt-6 grid gap-3">
        {question.options.map(([label, score], index) => (
          <button
            key={label}
            type="button"
            aria-pressed={answers[step] === score}
            onClick={() => setAnswers((current) => current.map((answer, answerIndex) => answerIndex === step ? score : answer).concat(current.length <= step ? [score] : []))}
            className={`min-h-14 border-2 px-4 py-3 text-left text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${answers[step] === score ? "border-teal-800 bg-teal-50 text-slate-950" : "border-slate-300 bg-white text-slate-800 hover:border-teal-700"}`}
          >
            <span className="mr-3 inline-block font-bold text-teal-800">{String.fromCharCode(65 + index)}.</span>{label}
          </button>
        ))}
      </div>
      <div className="mt-7 flex justify-between gap-3">
        <button
          type="button"
          disabled={step === 0}
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          className="min-h-11 border border-slate-500 px-5 font-bold text-slate-800 hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-40"
        >
          Back
        </button>
        {step === questions.length - 1 ? (
          <button type="button" disabled={answers[step] === undefined || !ready} onClick={submitResult} className="min-h-11 bg-slate-950 px-5 font-bold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-40">
            See my result
          </button>
        ) : (
          <button type="button" disabled={answers[step] === undefined} onClick={() => setStep((current) => Math.min(questions.length - 1, current + 1))} className="min-h-11 bg-slate-950 px-5 font-bold text-white hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:opacity-40">
            Next question
          </button>
        )}
      </div>
      <p className="mt-8 border-l-4 border-amber-300 pl-4 text-sm leading-6 text-slate-700">
        This is an educational exercise, not financial advice or a suitability assessment.
      </p>
      {storageError && <p className="mt-4 text-sm text-rose-800" role="alert">{storageError}</p>}
    </section>
  );
}
