import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AgeGroupProvider, ChangeAgeGroupButton } from "@/components/age-group-provider";
import { LessonProgressProvider } from "@/components/lesson-progress";
import { SiteNavigation } from "@/components/site-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investing Basics",
  description: "A calm beginner-friendly investing learning path.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-teal-300/40 selection:text-slate-950 dark:bg-[#081522] dark:text-slate-100 dark:selection:bg-teal-300/30 dark:selection:text-white">
        <AgeGroupProvider>
          <LessonProgressProvider>
            <div className="flex min-h-screen flex-1 flex-col">
              <SiteNavigation />
              {children}
              <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                Educational purposes only. Not financial advice.
                <ChangeAgeGroupButton />
              </footer>
            </div>
          </LessonProgressProvider>
        </AgeGroupProvider>
      </body>
    </html>
  );
}
