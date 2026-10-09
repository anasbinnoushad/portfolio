/* ────────────────────────────────────────────
   src/lib/scroll.tsx
   Lenis smooth-scroll wrapper + scrollToTarget
   ──────────────────────────────────────────── */
"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function scrollToTarget(target: string | HTMLElement, offset = 0) {
  const lenis = getLenis();
  if (!lenis) return;
  lenis.scrollTo(target, { offset, duration: 1.2 });
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenisInstance = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

/**
 * Stop / resume Lenis (for modals, etc.)
 */
export function lockScroll() {
  getLenis()?.stop();
}
export function unlockScroll() {
  getLenis()?.start();
}
