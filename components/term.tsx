"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type ReactNode,
} from "react";

import { findGlossaryEntry } from "@/lib/glossary";

export function Term({ children }: { children: ReactNode }) {
  const label = typeof children === "string" ? children.trim() : "";
  const entry = findGlossaryEntry(label);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  if (!entry) {
    return <>{children}</>;
  }

  useEffect(() => {
    if (!open) {
      return;
    }

    function closeOnOutsidePress(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", closeOnOutsidePress);
    return () => document.removeEventListener("pointerdown", closeOnOutsidePress);
  }, [open]);

  function closeIfFocusLeaves(event: FocusEvent<HTMLSpanElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  return (
    <span
      ref={containerRef}
      className="relative inline-flex"
      onPointerEnter={() => setOpen(true)}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") {
          return;
        }
        if (!containerRef.current?.contains(document.activeElement)) {
          setOpen(false);
        }
      }}
      onBlur={closeIfFocusLeaves}
    >
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
        }}
        className="cursor-help border-b-2 border-dotted border-teal-800 bg-transparent p-0 font-semibold text-inherit focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
      >
        {children}
      </button>
      {open && (
        <span
          id={`term-${entry.id}-definition`}
          role="dialog"
          aria-label={`${entry.term} definition`}
          className="absolute bottom-full left-0 z-30 mb-2 w-64 max-w-[calc(100vw-2rem)] border-2 border-slate-950 bg-amber-100 p-4 text-left text-sm leading-6 text-slate-950 sm:left-1/2 sm:-translate-x-1/2"
        >
          <span className="block font-bold">{entry.term}</span>
          <span className="mt-1 block">{entry.definition}</span>
          <Link
            href={`/glossary#term-${entry.id}`}
            className="mt-2 inline-flex font-bold text-teal-900 underline decoration-teal-800 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-800"
          >
            Read the glossary entry
          </Link>
        </span>
      )}
    </span>
  );
}
