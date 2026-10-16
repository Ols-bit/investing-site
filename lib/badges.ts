import type { RiskProfileResult } from "@/components/lesson-progress";
import type { LearningPath } from "@/content/paths";
import { getStreakStats } from "@/lib/learning-stats";

export type BadgeId =
  | "first-lesson"
  | "first-quiz"
  | "five-lessons"
  | "three-day-streak"
  | "path-finished"
  | "risk-quiz";

export type Badge = {
  id: BadgeId;
  title: string;
  description: string;
};

export const BADGES: Badge[] = [
  { id: "first-lesson", title: "First lesson", description: "Completed your first lesson." },
  { id: "first-quiz", title: "First quiz", description: "Finished a lesson quiz." },
  { id: "five-lessons", title: "Five lessons", description: "Completed five lessons." },
  { id: "three-day-streak", title: "Three-day streak", description: "Learned on three consecutive days." },
  { id: "path-finished", title: "Path finisher", description: "Completed every lesson in a learning path." },
  { id: "risk-quiz", title: "Risk reflection", description: "Completed the educational risk exercise." },
];

export function earnedBadgeIds(
  progress: Record<string, { completed: boolean; bestQuizScore: number | null }>,
  learning: { activityDays: string[]; quizIds: string[]; riskProfile: RiskProfileResult | null },
  paths: LearningPath[],
  now: Date,
): Set<BadgeId> {
  const completeCount = Object.values(progress).filter((record) => record.completed).length;
  const earned = new Set<BadgeId>();
  if (completeCount >= 1) earned.add("first-lesson");
  if (
    learning.quizIds.length > 0 ||
    Object.values(progress).some((record) => record.bestQuizScore !== null)
  ) {
    earned.add("first-quiz");
  }
  if (completeCount >= 5) earned.add("five-lessons");
  if (getStreakStats(learning.activityDays, now).best >= 3) earned.add("three-day-streak");
  if (paths.some((path) => path.lessonSlugs.length > 0 && path.lessonSlugs.every((slug) => progress[slug]?.completed))) {
    earned.add("path-finished");
  }
  if (learning.riskProfile) earned.add("risk-quiz");
  return earned;
}
