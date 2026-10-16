import type { Metadata } from "next";
import { ProfileOverview } from "@/components/profile";
import { createPageMetadata } from "@/lib/site";

export const metadata: Metadata = createPageMetadata(
  "Your learning profile",
  "Review lesson progress, quiz scores, daily learning streaks and earned badges.",
  "/profile",
);

export default function ProfilePage() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <header className="mb-10 border-b-2 border-slate-950 pb-8">
        <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">Your progress · Saved on this device</p>
        <h1 className="font-display text-5xl font-extrabold tracking-tight text-slate-950 sm:text-6xl">Learning profile.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-slate-700">See the lessons you have completed, quiz results and milestones along the way.</p>
      </header>
      <ProfileOverview />
    </main>
  );
}
