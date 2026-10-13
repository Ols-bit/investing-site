import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        <SiteNavigation />
        {children}
        <footer className="mt-auto border-t border-slate-200 bg-white px-4 py-5 text-center text-sm text-slate-600">
          Educational purposes only. Not financial advice.
        </footer>
      </body>
    </html>
  );
}
