"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/markets", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/learn", label: "Learn" },
  { href: "/tools", label: "Tools" },
];

function isCurrentPage(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNavigation() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/85 dark:shadow-black/20">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="text-lg font-semibold tracking-tight text-slate-950 transition-colors hover:text-teal-700 dark:text-white dark:hover:text-teal-300"
          onClick={() => setMenuOpen(false)}
        >
          Investing Basics
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {navigationLinks.map(({ href, label }) => {
            const current = isCurrentPage(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  current
                    ? "bg-teal-100 text-teal-950 dark:bg-teal-300/15 dark:text-teal-200"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-xl text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:text-slate-200 dark:hover:bg-white/10 dark:focus-visible:outline-teal-300 sm:hidden"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="size-5"
          >
            {menuOpen ? (
              <path d="m6 6 12 12M18 6 6 18" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div id="mobile-navigation" className="border-t border-slate-200 bg-white px-4 py-3 dark:border-white/10 dark:bg-slate-950 sm:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1">
            {navigationLinks.map(({ href, label }) => {
              const current = isCurrentPage(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={current ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    current
                      ? "bg-teal-100 text-teal-950 dark:bg-teal-300/15 dark:text-teal-200"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-white/10 dark:hover:text-white"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
