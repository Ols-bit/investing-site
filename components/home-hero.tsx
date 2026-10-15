"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const slowY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const fastY = useTransform(scrollYProgress, [0, 1], [0, -220]);
  const slowRotate = useTransform(scrollYProgress, [0, 1], [0, 16]);

  return (
    <section
      ref={heroRef}
      aria-labelledby="home-title"
      className="relative isolate overflow-hidden bg-slate-50"
    >
      <div className="mx-auto grid min-h-[39rem] w-full max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 sm:py-20 lg:min-h-[43rem] lg:grid-cols-[1.05fr_0.95fr] lg:gap-4 lg:px-10">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="relative z-10"
        >
          <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-teal-800">
            A clear-eyed guide to investing
          </p>
          <h1
            id="home-title"
            className="max-w-4xl font-display text-6xl font-extrabold leading-[0.9] tracking-[-0.06em] text-slate-950 sm:text-7xl lg:text-[6.5rem]"
          >
            Know the market.
            <br />
            Keep your head.
          </h1>
          <p className="mt-7 max-w-xl text-base leading-7 text-slate-700 sm:text-lg sm:leading-8">
            Straightforward lessons on shares, risk and the choices behind investing.
          </p>
          <Link
            href="/manual"
            className="mt-9 inline-flex min-h-14 items-center justify-center gap-5 bg-slate-950 px-7 text-base font-bold text-white transition-transform hover:translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-700"
          >
            Start learning
            <span aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none relative mx-auto aspect-square w-full max-w-[30rem] lg:-mr-12"
        >
          <motion.div
            className="absolute inset-[10%] rounded-full bg-teal-300"
            style={reduceMotion ? undefined : { y: slowY, rotate: slowRotate }}
          />
          <motion.div
            className="absolute right-[8%] top-[8%] h-[28%] w-[28%] rounded-full border-[3px] border-slate-950"
            style={reduceMotion ? undefined : { y: fastY }}
          />
          <motion.div
            className="absolute bottom-[12%] left-[4%] grid aspect-square w-[30%] place-items-center bg-amber-300"
            style={reduceMotion ? undefined : { y: slowY }}
          >
            <svg viewBox="0 0 100 100" className="w-1/2" fill="none">
              <path d="M12 72 37 54l17 8 31-35" stroke="#183027" strokeWidth="7" />
              <path d="M67 27h18v18" stroke="#183027" strokeWidth="7" />
            </svg>
          </motion.div>
          <motion.svg
            viewBox="0 0 120 120"
            className="absolute right-[10%] top-[45%] w-[23%]"
            fill="none"
            style={reduceMotion ? undefined : { y: fastY, rotate: slowRotate }}
          >
            <path d="M60 4 70 43l38-17-27 32 35 22-41-3-5 39-15-38-36 20 22-34-35-23 41 5L60 4Z" fill="#ED6246" />
          </motion.svg>
          <div className="absolute inset-[19%] rounded-full border border-slate-950/30" />
        </div>
      </div>
    </section>
  );
}
