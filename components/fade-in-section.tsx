"use client";

import { useEffect, useRef, type ReactNode } from "react";

type FadeInSectionProps = {
  children: ReactNode;
  className?: string;
};

export function FadeInSection({ children, className = "" }: FadeInSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;

    if (!section || !("IntersectionObserver" in window)) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    if (section.getBoundingClientRect().top <= window.innerHeight) {
      section.dataset.reveal = "visible";
      return;
    }

    section.dataset.reveal = "hidden";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          section.dataset.reveal = "visible";
          observer.unobserve(section);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -32px 0px" },
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={sectionRef}
      className={`transition-all duration-350 ease-out motion-reduce:transition-none data-[reveal=hidden]:translate-y-2 data-[reveal=hidden]:opacity-0 ${className}`}
    >
      {children}
    </div>
  );
}
