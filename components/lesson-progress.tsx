"use client";

import {
  createContext,
  useSyncExternalStore,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { BADGES, earnedBadgeIds, type Badge } from "@/lib/badges";
import { learningPaths } from "@/content/paths";

const STORAGE_KEY = "investing-site-lesson-progress";
const STORAGE_ERROR =
  "Lesson progress could not be saved in this browser. Allow local storage to keep your progress on this device.";

type LessonProgressRecord = {
  completed: boolean;
  bestQuizScore: number | null;
};

type LessonProgressMap = Record<string, LessonProgressRecord>;

export type RiskProfileResult = {
  type: "careful-planner" | "steady-builder" | "long-view-explorer" | "curious-learner";
  completedAt: string;
};

type LearningData = {
  activityDays: string[];
  quizIds: string[];
  riskProfile: RiskProfileResult | null;
};

type LessonProgressContextValue = {
  progress: LessonProgressMap;
  learning: LearningData;
  badgeToast: Badge | null;
  ready: boolean;
  storageError: string | null;
  markComplete: (lessonId: string) => void;
  recordQuizScore: (lessonId: string, score: number, questionCount: number) => void;
  saveRiskProfile: (result: RiskProfileResult) => void;
  dismissBadgeToast: () => void;
};

const LessonProgressContext = createContext<LessonProgressContextValue | null>(null);

type LessonProgressSnapshot = {
  progress: LessonProgressMap;
  learning: LearningData;
  badgeToast: Badge | null;
  ready: boolean;
  storageError: string | null;
};

const EMPTY_LEARNING_DATA: LearningData = {
  activityDays: [],
  quizIds: [],
  riskProfile: null,
};

const INITIAL_SNAPSHOT: LessonProgressSnapshot = {
  progress: {},
  learning: EMPTY_LEARNING_DATA,
  badgeToast: null,
  ready: false,
  storageError: null,
};
let lessonProgressSnapshot = INITIAL_SNAPSHOT;
let hasInitializedStore = false;
const subscribers = new Set<() => void>();

function isDayKey(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function parseLessonRecords(value: unknown): LessonProgressMap {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Saved lesson progress has an invalid format.");
  }

  const progress: LessonProgressMap = {};
  for (const [lessonId, record] of Object.entries(value)) {
    if (
      !lessonId ||
      record === null ||
      typeof record !== "object" ||
      !("completed" in record) ||
      typeof record.completed !== "boolean" ||
      !("bestQuizScore" in record) ||
      (record.bestQuizScore !== null &&
        (typeof record.bestQuizScore !== "number" ||
          !Number.isInteger(record.bestQuizScore) ||
          record.bestQuizScore < 0 ||
          record.bestQuizScore > 100))
    ) {
      throw new Error("Saved lesson progress has an invalid format.");
    }

    progress[lessonId] = {
      completed: record.completed,
      bestQuizScore: record.bestQuizScore,
    };
  }

  return progress;
}

function parseLearningData(value: unknown): LearningData {
  if (value === undefined) return EMPTY_LEARNING_DATA;
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Saved learning activity has an invalid format.");
  }
  const record = value as Record<string, unknown>;
  const activityDays = record.activityDays;
  const quizIds = record.quizIds;
  const riskProfile = record.riskProfile;
  const validRiskProfile =
    riskProfile === null ||
    (riskProfile !== null &&
      typeof riskProfile === "object" &&
      "type" in riskProfile &&
      [
        "careful-planner",
        "steady-builder",
        "long-view-explorer",
        "curious-learner",
      ].includes(String(riskProfile.type)) &&
      "completedAt" in riskProfile &&
      typeof riskProfile.completedAt === "string" &&
      Number.isFinite(Date.parse(riskProfile.completedAt)));

  if (
    !Array.isArray(activityDays) ||
    !activityDays.every(isDayKey) ||
    !Array.isArray(quizIds) ||
    !quizIds.every((id) => typeof id === "string" && id.length > 0) ||
    !validRiskProfile
  ) {
    throw new Error("Saved learning activity has an invalid format.");
  }

  return {
    activityDays: [...new Set(activityDays)].sort(),
    quizIds: [...new Set(quizIds)],
    riskProfile:
      riskProfile === null
        ? null
        : {
            type: riskProfile.type as RiskProfileResult["type"],
            completedAt: riskProfile.completedAt as string,
          },
  };
}

function parseProgress(rawValue: string | null): Pick<LessonProgressSnapshot, "progress" | "learning"> {
  if (rawValue === null) {
    return { progress: {}, learning: EMPTY_LEARNING_DATA };
  }

  const value: unknown = JSON.parse(rawValue);
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Saved lesson progress has an invalid format.");
  }

  if ("version" in value && "lessons" in value) {
    if (value.version !== 2) {
      throw new Error("Saved learning data uses an unsupported version.");
    }
    return {
      progress: parseLessonRecords(value.lessons),
      learning: parseLearningData("learning" in value ? value.learning : undefined),
    };
  }

  return { progress: parseLessonRecords(value), learning: EMPTY_LEARNING_DATA };
}

function localDayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function withActivity(learning: LearningData) {
  return {
    ...learning,
    activityDays: [...new Set([...learning.activityDays, localDayKey()])].sort(),
  };
}

function getSnapshot() {
  return lessonProgressSnapshot;
}

function getServerSnapshot() {
  return INITIAL_SNAPSHOT;
}

function updateSnapshot(snapshot: LessonProgressSnapshot) {
  lessonProgressSnapshot = snapshot;
  subscribers.forEach((subscriber) => subscriber());
}

function subscribe(subscriber: () => void) {
  subscribers.add(subscriber);

  if (!hasInitializedStore) {
    hasInitializedStore = true;
    try {
      lessonProgressSnapshot = {
        ...parseProgress(window.localStorage.getItem(STORAGE_KEY)),
        badgeToast: null,
        ready: true,
        storageError: null,
      };
    } catch (error) {
      console.error("Unable to load saved lesson progress.", error);
      lessonProgressSnapshot = {
        progress: {},
        learning: EMPTY_LEARNING_DATA,
        badgeToast: null,
        ready: true,
        storageError: STORAGE_ERROR,
      };
    }
  }

  return () => subscribers.delete(subscriber);
}

function saveProgress(nextProgress: LessonProgressMap, nextLearning = lessonProgressSnapshot.learning) {
  try {
    const now = new Date();
    const previouslyEarned = earnedBadgeIds(
      lessonProgressSnapshot.progress,
      lessonProgressSnapshot.learning,
      learningPaths,
      now,
    );
    const nextEarned = earnedBadgeIds(nextProgress, nextLearning, learningPaths, now);
    const newlyEarned = BADGES.find(
      (badge) => nextEarned.has(badge.id) && !previouslyEarned.has(badge.id),
    );
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, lessons: nextProgress, learning: nextLearning }),
    );
    updateSnapshot({
      progress: nextProgress,
      learning: nextLearning,
      badgeToast: newlyEarned ?? null,
      ready: true,
      storageError: null,
    });
  } catch (error) {
    console.error("Unable to save lesson progress.", error);
    updateSnapshot({
      progress: nextProgress,
      learning: nextLearning,
      badgeToast: null,
      ready: true,
      storageError: STORAGE_ERROR,
    });
  }
}

export function LessonProgressProvider({ children }: { children: ReactNode }) {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    function syncProgress(event: StorageEvent) {
      if (event.key !== STORAGE_KEY && event.key !== null) {
        return;
      }

      try {
        updateSnapshot({
          ...parseProgress(event.newValue),
          badgeToast: null,
          ready: true,
          storageError: null,
        });
      } catch (error) {
        console.error("Unable to read updated lesson progress.", error);
        updateSnapshot({
          ...lessonProgressSnapshot,
          storageError: STORAGE_ERROR,
        });
      }
    }

    window.addEventListener("storage", syncProgress);
    return () => window.removeEventListener("storage", syncProgress);
  }, []);

  const markComplete = useCallback(
    (lessonId: string) => {
      const previous = lessonProgressSnapshot.progress[lessonId] ?? {
        completed: false,
        bestQuizScore: null,
      };
      saveProgress({
        ...lessonProgressSnapshot.progress,
        [lessonId]: { ...previous, completed: true },
      }, previous.completed ? lessonProgressSnapshot.learning : withActivity(lessonProgressSnapshot.learning));
    },
    [],
  );

  const recordQuizScore = useCallback(
    (lessonId: string, score: number, questionCount: number) => {
      if (questionCount < 1 || score < 0 || score > questionCount) {
        throw new Error("Quiz score must be between zero and the question count.");
      }

      const currentProgress = lessonProgressSnapshot.progress;
      const previous = currentProgress[lessonId] ?? {
        completed: false,
        bestQuizScore: null,
      };
      const scorePercent = Math.round((score / questionCount) * 100);
      const passingScore = Math.ceil((questionCount * 2) / 3);
      const nextLearning = withActivity({
        ...lessonProgressSnapshot.learning,
        quizIds: [...new Set([...lessonProgressSnapshot.learning.quizIds, lessonId])],
      });
      saveProgress({
        ...currentProgress,
        [lessonId]: {
          completed: previous.completed || score >= passingScore,
          bestQuizScore: Math.max(previous.bestQuizScore ?? 0, scorePercent),
        },
      }, nextLearning);
    },
    [],
  );

  const saveRiskProfile = useCallback((result: RiskProfileResult) => {
    saveProgress(
      lessonProgressSnapshot.progress,
      withActivity({
        ...lessonProgressSnapshot.learning,
        riskProfile: result,
      }),
    );
  }, []);

  const contextValue = useMemo(
    () => ({
      progress: snapshot.progress,
      learning: snapshot.learning,
      ready: snapshot.ready,
      storageError: snapshot.storageError,
      markComplete,
      recordQuizScore,
      saveRiskProfile,
      badgeToast: snapshot.badgeToast,
      dismissBadgeToast: () => updateSnapshot({ ...lessonProgressSnapshot, badgeToast: null }),
    }),
    [snapshot, markComplete, recordQuizScore, saveRiskProfile],
  );

  return (
    <LessonProgressContext.Provider value={contextValue}>
      {children}
    </LessonProgressContext.Provider>
  );
}

export function useLessonProgress() {
  const context = useContext(LessonProgressContext);
  if (!context) {
    throw new Error("Lesson progress must be used within LessonProgressProvider.");
  }
  return context;
}

export function LessonCompletionButton({ lessonId }: { lessonId: string }) {
  const { progress, ready, storageError, markComplete } = useLessonProgress();
  const lessonProgress = progress[lessonId];
  const isComplete = lessonProgress?.completed ?? false;

  return (
    <div className="mt-6 border-t border-slate-200 pt-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {isComplete ? "Lesson completed" : "Finished this lesson?"}
          </p>
          {lessonProgress?.bestQuizScore !== null &&
            lessonProgress?.bestQuizScore !== undefined && (
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Best quiz score: {lessonProgress.bestQuizScore}%
              </p>
            )}
        </div>
        <button
          type="button"
          disabled={!ready || isComplete}
          onClick={() => markComplete(lessonId)}
          className="inline-flex min-h-11 items-center justify-center bg-teal-700 px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 disabled:cursor-default disabled:bg-teal-100 disabled:text-teal-950"
        >
          {isComplete ? "Complete" : "Mark lesson as complete"}
        </button>
      </div>
      {storageError && (
        <p className="mt-4 border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950" role="alert">
          {storageError}
        </p>
      )}
    </div>
  );
}

export function LessonCompletionBadge({ lessonId }: { lessonId: string }) {
  const { progress, ready } = useLessonProgress();

  if (!ready || !progress[lessonId]?.completed) {
    return null;
  }

  return (
    <span className="border-l-2 border-teal-700 pl-2 text-xs font-bold uppercase tracking-wide text-teal-800">
      Completed
    </span>
  );
}

export function LearningProgressSummary({ lessonIds }: { lessonIds: string[] }) {
  const { progress, ready, storageError } = useLessonProgress();
  const completedCount = lessonIds.filter((lessonId) => progress[lessonId]?.completed).length;
  const percent = lessonIds.length === 0 ? 0 : Math.round((completedCount / lessonIds.length) * 100);

  return (
    <section
      aria-label="Your lesson progress"
      aria-busy={!ready}
      className="mb-8 border-y border-slate-300 bg-teal-50 px-5 py-5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-sm font-semibold text-teal-950 dark:text-teal-100">
        <span className="font-display text-lg">Your learning progress</span>
        <span>{completedCount} of {lessonIds.length} lessons complete ({percent}%)</span>
      </div>
      <div
        aria-label={`${percent}% of lessons completed`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={percent}
        className="h-2.5 w-full overflow-hidden bg-slate-200"
        role="progressbar"
      >
        <div
          className="h-full bg-teal-700 transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {storageError && (
        <p className="mt-4 border-l-4 border-rose-500 bg-rose-50 px-4 py-3 text-sm leading-6 text-rose-950" role="alert">
          {storageError}
        </p>
      )}
    </section>
  );
}
