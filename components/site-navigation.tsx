"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE_NAME } from "@/lib/site";

const navigationLinks = [
  { href: "/", label: "Home" },
  { href: "/manual", label: "Manual" },
  { href: "/markets", label: "Markets" },
  { href: "/news", label: "News" },
  { href: "/glossary", label: "Glossary" },
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
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;
  const [hidden, setHidden] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const lastPathname = useRef(pathname);

  useEffect(() => {
    if (lastPathname.current === pathname) return;
    lastPathname.current = pathname;
    const frame = requestAnimationFrame(() => setOpenPath(null));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let frame = 0;

    function updateVisibility() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        const movingDown = scrollY > lastScrollY;
        setHidden(scrollY > 120 && movingDown && !menuOpen);
        lastScrollY = scrollY;
      });
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateVisibility);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;

    const menu = menuRef.current;
    const focusable = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    focusable?.[0]?.focus();
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu();
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function closeMenu() {
    setOpenPath(null);
  }

  return (
    <>
      <a
        href="#main-content"
        className="sr-only fixed left-4 top-4 z-[80] bg-slate-950 px-4 py-3 font-bold text-white focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-teal-300"
      >
        Skip to content
      </a>
      <header
        className={`sticky top-0 z-50 border-b border-slate-300 bg-slate-50 transition-transform duration-200 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        }`}
      >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8"
      >
        <Link
          href="/"
          className="shrink-0 font-display text-xl font-extrabold tracking-tight text-slate-950 transition-colors hover:text-teal-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          onClick={closeMenu}
        >
          {SITE_NAME}
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navigationLinks.map(({ href, label }) => {
            const current = isCurrentPage(pathname, href);

            return (
              <Link
                key={href}
                href={href}
                aria-current={current ? "page" : undefined}
                className={`border-b-2 px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                  current
                    ? "border-teal-700 bg-teal-50 text-slate-950"
                    : "border-transparent text-slate-600 hover:border-teal-700 hover:text-slate-950"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/manual"
            className="inline-flex min-h-11 items-center justify-center bg-slate-950 px-5 text-sm font-bold text-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            Start learning
          </Link>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setOpenPath((path) => (path === pathname ? null : pathname))}
          className="inline-flex size-11 items-center justify-center text-slate-950 transition-colors hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 lg:hidden"
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-6">
            {menuOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-x-0 bottom-0 top-16 z-50 overflow-y-auto border-t border-slate-300 bg-slate-50 px-6 py-8 lg:hidden"
        >
          <div className="mx-auto flex min-h-full max-w-xl flex-col">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl font-extrabold text-slate-950">{SITE_NAME}</span>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  menuButtonRef.current?.focus();
                }}
                className="inline-flex min-h-11 items-center gap-2 border-2 border-slate-950 px-4 text-sm font-bold text-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700"
              >
                <span>Close</span>
                <span aria-hidden="true">×</span>
              </button>
            </div>
            {navigationLinks.map(({ href, label }) => {
              const current = isCurrentPage(pathname, href);

              return (
                <Link
                  key={href}
                  href={href}
                  aria-current={current ? "page" : undefined}
                  onClick={closeMenu}
                  className={`border-b border-slate-300 px-2 py-5 font-display text-3xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 ${
                    current
                      ? "border-l-4 border-l-teal-700 bg-teal-50 pl-4 text-slate-950"
                      : "text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
            <Link
              href="/manual"
              onClick={closeMenu}
              className="mt-8 inline-flex min-h-14 items-center justify-center bg-slate-950 px-6 text-base font-bold text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
            >
              Start learning
            </Link>
          </div>
        </div>
      )}
      </header>
    </>
  );
}
