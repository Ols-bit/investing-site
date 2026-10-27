"use client";

import { useEffect, useState } from "react";

type LessonSection = {
  id: string;
  title: string;
};

export function LessonSectionProgress() {
  const [sections, setSections] = useState<LessonSection[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const headings = Array.from(
      document.querySelectorAll<HTMLHeadingElement>(".lesson-note-content h2[id]"),
    );
    const lessonSections = headings.map((heading) => ({
      id: heading.id,
      title: heading.textContent?.trim() || "Lesson section",
    }));
    const renderFrame = window.requestAnimationFrame(() => setSections(lessonSections));

    if (headings.length === 0 || !("IntersectionObserver" in window)) {
      return () => window.cancelAnimationFrame(renderFrame);
    }

    const sectionIndex = new Map(headings.map((heading, index) => [heading.id, index]));
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleHeading = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0];
        const index = visibleHeading
          ? sectionIndex.get((visibleHeading.target as HTMLHeadingElement).id)
          : undefined;
        if (index !== undefined) {
          setActiveIndex(index);
        }
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => {
      window.cancelAnimationFrame(renderFrame);
      observer.disconnect();
    };
  }, []);

  if (sections.length === 0) {
    return null;
  }

  return (
    <nav aria-label="Lesson sections" className="mb-7 flex items-center gap-2">
      <span className="sr-only">
        Section {activeIndex + 1} of {sections.length}
      </span>
      {sections.map((section, index) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          aria-label={`Go to section ${index + 1}: ${section.title}`}
          aria-current={index === activeIndex ? "location" : undefined}
          className={`size-3 rounded-full border-2 border-slate-950 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 dark:border-slate-100 ${
            index === activeIndex ? "bg-amber-400" : "bg-transparent"
          }`}
        />
      ))}
    </nav>
  );
}
