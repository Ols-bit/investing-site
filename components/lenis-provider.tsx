"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      anchors: true,
      autoRaf: true,
      lerp: 0.1,
    });

    return () => lenis.destroy();
  }, []);

  return children;
}
