"use client";

import { useRef } from "react";
import { EXPERIENCE } from "@/lib/data";
import { useScrollProgress } from "@/lib/hooks";
import { scrollToTarget } from "@/lib/scroll";

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);

  const WorkIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );

  const EduIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );

  const CertIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );

  return (
    <section id="experience" ref={sectionRef} className="section-pad relative w-full overflow-hidden">
      <div className="container-main mx-auto">
        <div className="flex flex-col mb-16">
          <p className="section-tag">04 — Experience</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight mt-2">
            The path <span className="italic-word">so far.</span>
          </h2>
        </div>

        <div className="relative max-w-4xl mx-auto pb-16">
          {/* Spine */}
          <div className="absolute left-[18px] md:left-1/2 top-0 bottom-0 w-[2px] bg-[var(--color-soft)] md:-translate-x-1/2 rounded-full overflow-hidden">
            <div
              className="w-full bg-[var(--color-ink)] origin-top transition-transform duration-100"
              style={{ height: "100%", transform: `scaleY(${progress})` }}
            />
          </div>

          <div className="flex flex-col gap-10 md:gap-16 relative z-10">
            {EXPERIENCE.map((item, idx) => {
              const isEven = idx % 2 === 0;
              const threshold = (idx + 0.5) / (EXPERIENCE.length + 1);
              const isActive = progress >= threshold;

              return (
                <div
                  key={idx}
                  className={`relative flex flex-col md:flex-row items-start md:items-center w-full ${
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Dot on Spine */}
                  <div className="absolute left-[18px] md:left-1/2 top-6 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-10">
                    <div
                      className={`w-3 h-3 rounded-full border-2 border-[var(--color-ink)] transition-colors duration-300 ${
                        isActive ? "bg-[var(--color-ink)]" : "bg-white"
                      }`}
                    />
                  </div>

                  {/* Year / Period (Desktop) */}
                  <div
                    className={`hidden md:flex w-1/2 ${
                      isEven ? "justify-end pr-12 text-right" : "justify-start pl-12 text-left"
                    }`}
                  >
                    <div
                      className={`transition-all duration-500 ${
                        isActive
                          ? "opacity-100 translate-y-0"
                          : "opacity-40 translate-y-2"
                      }`}
                    >
                      <p className="font-mono text-xl font-bold text-[var(--color-ink)]">
                        {item.year}
                      </p>
                      <p className="text-xs text-[var(--color-mute)] font-mono mt-0.5">
                        {item.period}
                      </p>
                    </div>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`w-full md:w-1/2 pl-12 md:pl-0 ${
                      isEven ? "md:pl-12" : "md:pr-12"
                    }`}
                  >
                    <div
                      className={`card p-6 transition-all duration-500 ${
                        isActive
                          ? "card-active translate-y-0 opacity-100"
                          : "opacity-60 translate-y-2"
                      }`}
                    >
                      {/* Mobile period */}
                      <div className="md:hidden mb-2 font-mono text-xs text-[var(--color-mute)] flex items-center justify-between">
                        <span>{item.period}</span>
                        <span className="font-bold text-[var(--color-ink)]">{item.year}</span>
                      </div>

                      <div className="flex items-start gap-3.5">
                        <div className="w-10 h-10 rounded-full bg-[var(--color-paper)] border border-[var(--color-line)] flex items-center justify-center text-[var(--color-ink)] shrink-0 mt-0.5">
                          {item.type === "work" ? (
                            <WorkIcon />
                          ) : item.type === "education" ? (
                            <EduIcon />
                          ) : (
                            <CertIcon />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-[var(--color-ink)]">
                            {item.title}
                          </h3>
                          <h4 className="text-xs font-mono text-[var(--color-mute)] mb-3">
                            {item.org}
                            {item.location ? ` · ${item.location}` : ""}
                          </h4>

                          {item.details && item.details.length > 0 && (
                            <ul className="space-y-1.5 text-xs text-[var(--color-ink-2)]">
                              {item.details.map((detail, dIdx) => (
                                <li key={dIdx} className="flex items-start gap-2">
                                  <span className="text-[var(--color-mute)] mt-0.5">•</span>
                                  <span>{detail}</span>
                                </li>
                              ))}
                            </ul>
                          )}

                          {item.url && (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-block mt-3 text-xs text-[var(--color-ink)] font-mono underline hover:text-[var(--color-mute)]"
                            >
                              Visit site ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Next card */}
            <div className="relative flex items-center justify-center w-full pl-12 md:pl-0 mt-4">
              <div className="card border-2 border-dashed border-[var(--color-line)] p-8 max-w-sm w-full text-center bg-transparent">
                <h3 className="text-xl font-bold text-[var(--color-ink)] mb-2">
                  Next — Your team?
                </h3>
                <p className="text-xs text-[var(--color-mute)] mb-4">
                  Open for full-time opportunities & projects.
                </p>
                <button
                  onClick={() => scrollToTarget("#contact")}
                  className="btn-pill btn-primary text-xs mx-auto"
                >
                  Let's talk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
