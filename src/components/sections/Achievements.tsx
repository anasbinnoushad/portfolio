"use client";

import { useRef, useEffect, useState } from "react";
import { ACHIEVEMENTS, Achievement } from "@/lib/data";
import { useScrollProgress, useCountUp } from "@/lib/hooks";

function AchievementCard({
  item,
  index,
  total,
}: {
  item: Achievement;
  index: number;
  total: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const count = useCountUp(item.number, isVisible, 1400);

  const Icon = () => {
    if (item.platform === "capstone") {
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
          <path d="M6 12v5c3 3 9 3 12 0v-5" />
        </svg>
      );
    }
    if (item.platform === "publication") {
      return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
    }
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="8" r="7" />
        <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
      </svg>
    );
  };

  return (
    <div
      ref={cardRef}
      className="shrink-0 w-[clamp(300px,36vw,480px)] h-[clamp(240px,32vh,290px)] bg-white rounded-[28px] p-7 flex flex-col justify-between border border-[var(--color-line)] shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex justify-between items-start w-full">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-[var(--color-ink)] bg-[var(--color-paper)] border border-[var(--color-line)]">
          <Icon />
        </div>
        <span className="font-mono text-xs text-[var(--color-faint)]">
          {(index + 1).toString().padStart(2, "0")} / {total.toString().padStart(2, "0")}
        </span>
      </div>

      <div className="flex justify-between items-end w-full gap-4">
        <div className="flex flex-col gap-1 max-w-[65%]">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-mute)]">
            {item.label}
          </span>
          <h3 className="text-lg md:text-xl font-bold text-[var(--color-ink)] leading-snug">
            {item.caption}
          </h3>
          <p className="text-xs text-[var(--color-mute)] mt-0.5">
            {item.detail}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[clamp(44px,6vw,72px)] font-bold text-[var(--color-ink)] leading-none font-mono tracking-tighter">
            {count}
            <span className="text-2xl md:text-3xl font-normal text-[var(--color-mute)]">
              {item.suffix}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Achievements() {
  const containerRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(containerRef);

  return (
    <section
      id="achievements"
      ref={containerRef}
      className="relative w-full h-[220vh]"
    >
      <div className="sticky top-0 w-full h-[100svh] overflow-hidden flex flex-col justify-between bg-[var(--color-paper)] py-16">
        {/* Progress bar */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-[var(--color-ink)] z-50 origin-left"
          style={{ width: "100%", transform: `scaleX(${progress})` }}
        />

        <div className="container-main mx-auto w-full">
          <p className="section-tag">05 — Milestones</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Milestones <span className="italic-word">reached.</span>
          </h2>
        </div>

        <div className="w-full flex items-center overflow-x-auto custom-scrollbar my-auto py-8">
          <div
            className="flex gap-6 md:gap-8 px-[var(--gutter)] will-change-transform"
            style={{
              transform: `translateX(${-progress * 40}%)`,
              transition: "transform 0.1s linear",
            }}
          >
            {ACHIEVEMENTS.map((item, i) => (
              <AchievementCard
                key={i}
                item={item}
                index={i}
                total={ACHIEVEMENTS.length}
              />
            ))}

            <div className="shrink-0 w-[clamp(200px,24vw,280px)] h-[clamp(240px,32vh,290px)] rounded-[28px] border-2 border-dashed border-[var(--color-line)] flex items-center justify-center p-6 text-center">
              <span className="text-base font-mono text-[var(--color-mute)]">
                and counting →
              </span>
            </div>
          </div>
        </div>

        <div className="container-main mx-auto text-xs font-mono text-[var(--color-faint)]">
          Scroll down to explore milestones
        </div>
      </div>
    </section>
  );
}
