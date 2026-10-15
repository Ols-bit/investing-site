import type { Metadata } from "next";
import Link from "next/link";
import { Bricolage_Grotesque, Geist } from "next/font/google";
import { AgeGroupProvider, ChangeAgeGroupButton } from "@/components/age-group-provider";
import { LessonProgressProvider } from "@/components/lesson-progress";
import { LenisProvider } from "@/components/lenis-provider";
import { SiteNavigation } from "@/components/site-navigation";
import { SITE_NAME } from "@/lib/site";
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
  title: SITE_NAME,
  description: "Plain-English lessons on investing, risk, markets, and long-term thinking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${display.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-900 selection:bg-teal-300 selection:text-slate-950">
        <AgeGroupProvider>
          <LessonProgressProvider>
            <LenisProvider>
              <div className="flex min-h-screen flex-1 flex-col">
                <SiteNavigation />
                <div id="main-content" tabIndex={-1} className="flex flex-1 flex-col scroll-mt-20">
                  {children}
                </div>
                <footer className="mt-auto bg-slate-950 px-5 py-12 text-white sm:px-8">
                  <div className="mx-auto grid max-w-7xl gap-9 sm:grid-cols-[1fr_auto] sm:items-end">
                    <div>
                      <Link href="/" className="font-display text-3xl font-extrabold tracking-tight text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300">
                        {SITE_NAME}
                      </Link>
                      <p className="mt-4 max-w-lg text-sm leading-6 text-slate-200">
                        For education, not financial advice. Investing involves risk, including the loss of capital.
                      </p>
                      <ChangeAgeGroupButton />
                    </div>
                    <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm font-semibold sm:grid-cols-3">
                      {[
                        ["/manual", "Manual"],
                        ["/markets", "Markets"],
                        ["/news", "News"],
                        ["/about", "About"],
                        ["/disclaimer", "Disclaimer"],
                        ["/privacy", "Privacy"],
                        ["/terms", "Terms"],
                      ].map(([href, label]) => (
                        <Link key={href} href={href} className="text-slate-100 underline decoration-slate-500 underline-offset-4 hover:decoration-teal-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-300">
                          {label}
                        </Link>
                      ))}
                    </nav>
                  </div>
                </footer>
              </div>
            </LenisProvider>
          </LessonProgressProvider>
        </AgeGroupProvider>
      </body>
    </html>
  );
}
