/* ────────────────────────────────────────────
   src/lib/hooks.ts
   Shared hooks: useInView, useScrollProgress,
   prefersReducedMotion, RevealObserver
   ──────────────────────────────────────────── */
"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Observe when an element enters the viewport.
 * Adds `.is-in` class to elements with `.rv` or `.rv-mask`.
 */
export function useInView(
  options: IntersectionObserverInit = { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Immediate check on mount for Safari above-the-fold elements
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.unobserve(el);
      }
    }, options);

    observer.observe(el);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isInView };
}

/**
 * Observe and apply `.is-in` to all `.rv` and `.rv-mask` children.
 */
export function useRevealChildren(
  rootRef: React.RefObject<HTMLElement | null>,
  threshold = 0.05
) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const targets = root.querySelectorAll(".rv, .rv-mask");
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold, rootMargin: "0px 0px 40px 0px" }
    );

    targets.forEach((t) => observer.observe(t));
    return () => observer.disconnect();
  }, [rootRef, threshold]);
}

/**
 * Track scroll progress through a section (0 → 1).
 * Supports both normal and sticky sections accurately.
 */
export function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf: number;
    const update = () => {
      const rect = el.getBoundingClientRect();
      const viewH = window.innerHeight;
      const totalTravel = rect.height - viewH;

      if (totalTravel > 0) {
        // Sticky or tall section travel
        const scrolled = -rect.top;
        setProgress(Math.min(1, Math.max(0, scrolled / totalTravel)));
      } else {
        // Standard in-viewport section progress
        const total = rect.height + viewH;
        const scrolled = viewH - rect.top;
        setProgress(Math.min(1, Math.max(0, scrolled / total)));
      }
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [ref]);

  return progress;
}

/**
 * Check prefers-reduced-motion.
 */
export function usePrefersReducedMotion() {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}

/**
 * Count-up animation for numbers.
 */
export function useCountUp(
  target: number,
  isVisible: boolean,
  duration = 1400
) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!isVisible || hasRun.current) return;
    hasRun.current = true;

    const start = performance.now();
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const tick = (now: number) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      setCount(Math.round(easeOutQuart(p) * target));

      if (p < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  }, [isVisible, target, duration]);

  return count;
}

/**
 * Track active section from IntersectionObserver.
 */
export function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState(sectionIds[0] || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        { rootMargin: "-30% 0px -50% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);

  return active;
}

/**
 * Global reveal observer — immediately activates elements in view on mount,
 * and attaches IntersectionObserver for scrolling elements.
 */
export function RevealObserver() {
  useEffect(() => {
    const targets = document.querySelectorAll(".rv, .rv-mask");
    if (!targets.length) return;

    // Immediate check for elements already visible or near fold (crucial for Safari)
    const viewH = window.innerHeight;
    targets.forEach((t) => {
      const rect = t.getBoundingClientRect();
      if (rect.top < viewH + 100) {
        t.classList.add("is-in");
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "0px 0px 50px 0px" }
    );

    targets.forEach((t) => {
      if (!t.classList.contains("is-in")) {
        observer.observe(t);
      }
    });

    // Fallback scroll listener for older Safari versions
    const handleScroll = () => {
      targets.forEach((t) => {
        if (!t.classList.contains("is-in")) {
          const rect = t.getBoundingClientRect();
          if (rect.top < window.innerHeight - 30) {
            t.classList.add("is-in");
            observer.unobserve(t);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return null;
}

/**
 * Debounced callback.
 */
export function useDebounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
) {
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => fn(...args), delay);
    },
    [fn, delay]
  );
}
