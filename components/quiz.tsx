"use client";

import { useId, useState } from "react";

import { Recap } from "@/components/lesson-recap";
import { useLessonProgress } from "@/components/lesson-progress";
import { getLessonBySlug } from "@/lib/lessons";

export type QuizQuestion = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
};

type QuizProps = {
  lessonId: string;
  questions: QuizQuestion[];
};

export function Quiz({ lessonId, questions }: QuizProps) {
  const headingId = useId();
  const { progress, recordQuizScore } = useLessonProgress();
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (
    questions.length === 0 ||
    questions.some(
      (question) =>
        question.options.length === 0 ||
        !Number.isInteger(question.correctAnswerIndex) ||
        question.correctAnswerIndex < 0 ||
        question.correctAnswerIndex >= question.options.length,
    )
  ) {
    return (
      <p className="my-6 border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm text-rose-950" role="alert">
        This quiz needs at least one question and a valid correct answer for every question.
      </p>
    );
  }

  const question = questions[questionIndex];
  const isCorrect = selectedOption === question.correctAnswerIndex;
  const percent = Math.round((score / questions.length) * 100);

  function continueQuiz() {
    if (selectedOption === null) {
      return;
    }

    const finalScore = score + (isCorrect ? 1 : 0);
    if (questionIndex === questions.length - 1) {
      setScore(finalScore);
      recordQuizScore(lessonId, finalScore, questions.length);
      setFinished(true);
      return;
    }

    setScore(finalScore);
    setQuestionIndex((current) => current + 1);
    setSelectedOption(null);
  }

  function retryQuiz() {
    setQuestionIndex(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
  }

  return (
    <section
      aria-labelledby={headingId}
      className="my-8 border-l-4 border-amber-300 bg-teal-50 p-5 text-slate-800 sm:p-7"
    >
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-800">
        Knowledge check
      </p>
      <h2 id={headingId} className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
        Lesson quiz
      </h2>

      {finished ? (
        <div className="mt-5 border-t-2 border-slate-950 bg-white p-5">
          <p className="text-lg font-semibold text-slate-950 dark:text-white">
            You scored {score} out of {questions.length} ({percent}%)
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300" role="status">
            {score >= Math.ceil((questions.length * 2) / 3)
              ? "Well done. This lesson has been marked complete."
              : "Keep learning, then try again. Two-thirds correct marks this lesson complete."}
          </p>
          {progress[lessonId]?.bestQuizScore !== null &&
            progress[lessonId]?.bestQuizScore !== undefined && (
              <p className="mt-2 text-sm font-medium text-teal-800 dark:text-teal-200">
                Best quiz score: {progress[lessonId].bestQuizScore}%
              </p>
            )}
          <button
            type="button"
            onClick={retryQuiz}
            className="mt-5 inline-flex min-h-11 items-center justify-center border border-teal-700 px-5 py-2.5 text-sm font-bold text-teal-900 transition-colors hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
          >
            Retry quiz
          </button>
        </div>
      ) : (
        <div className="mt-5">
          <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-600 dark:text-slate-300">
            <span className="font-bold uppercase tracking-wide">Question {questionIndex + 1} of {questions.length}</span>
            <span>{score} correct so far</span>
          </div>
          <div
            aria-label={`Question ${questionIndex + 1} of ${questions.length}`}
            aria-valuemax={questions.length}
            aria-valuemin={0}
            aria-valuenow={questionIndex + 1}
            className="mb-5 h-2 overflow-hidden bg-slate-200"
            role="progressbar"
          >
            <div
              className="h-full bg-teal-700 transition-all duration-300"
              style={{ width: `${((questionIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
          <h3 className="text-lg font-semibold leading-7 text-slate-950 dark:text-white">
            {question.question}
          </h3>
          <div className="mt-4 grid gap-3">
            {question.options.map((option, index) => {
              const selected = selectedOption === index;
              const correctAnswer = selectedOption !== null && index === question.correctAnswerIndex;
              const incorrectAnswer = selected && !isCorrect;
              return (
                <button
                  key={`${index}-${option}`}
                  type="button"
                  aria-pressed={selected}
                  disabled={selectedOption !== null}
                  onClick={() => setSelectedOption(index)}
                  className={`min-h-12 border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-default ${
                    correctAnswer
                      ? "border-emerald-500 bg-emerald-50 text-emerald-950 dark:border-emerald-300/50 dark:bg-emerald-300/10 dark:text-emerald-100"
                      : incorrectAnswer
                        ? "border-rose-400 bg-rose-50 text-rose-950 dark:border-rose-300/50 dark:bg-rose-300/10 dark:text-rose-100"
                        : "border-slate-200 bg-white text-slate-800 hover:border-teal-400 hover:bg-teal-50 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-100 dark:hover:border-teal-300/50 dark:hover:bg-teal-300/[0.08]"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <div
              className={`mt-4 border-l-4 p-4 ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : "border-rose-300 bg-rose-50 text-rose-950"
              }`}
              role="status"
            >
              <p className="font-semibold">{isCorrect ? "That’s right!" : "Not quite."}</p>
              <p className="mt-1 text-sm leading-6">{question.explanation}</p>
              <button
                type="button"
                onClick={continueQuiz}
                className="mt-4 inline-flex min-h-10 items-center justify-center bg-teal-800 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-teal-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                {questionIndex === questions.length - 1 ? "See my score" : "Next question"}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export function LessonQuiz(props: QuizProps) {
  const summary = getLessonBySlug(props.lessonId)?.summary;

  return (
    <>
      <Recap label="Remember this">
        {summary ?? "Keep the key ideas from this lesson in mind as you check your understanding."}
      </Recap>
      <Quiz {...props} />
    </>
  );
}
