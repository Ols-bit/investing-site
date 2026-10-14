import type { Metadata } from "next";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { AgeGroupProvider, ChangeAgeGroupButton } from "@/components/age-group-provider";
import { LessonProgressProvider } from "@/components/lesson-progress";
import { MarketTicker } from "@/components/market-ticker";
import { SiteNavigation } from "@/components/site-navigation";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const display = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Investing Basics",
  description: "Plain-English lessons on investing, risk, markets, and long-term thinking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${display.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-teal-300 selection:text-slate-950">
        <AgeGroupProvider>
          <LessonProgressProvider>
            <div className="flex min-h-screen flex-1 flex-col">
              <SiteNavigation />
              <MarketTicker />
              {children}
              <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-600">
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
