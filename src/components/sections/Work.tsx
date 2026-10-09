"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/data";

export default function Work() {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <section id="work" className="section-pad relative w-full overflow-hidden">
      <div className="container-main mx-auto">
        <div className="flex flex-col mb-12">
          <p className="section-tag">03 — Selected work</p>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight mt-2">
            Things I've <span className="italic-word">built.</span>
          </h2>
        </div>

        <div className="flex flex-col md:flex-row gap-4 w-full h-auto md:h-[min(78svh,600px)]">
          {PROJECTS.map((project, idx) => {
            const isActive = activeIndex === idx;
            const indexStr = (idx + 1).toString().padStart(2, "0");

            return (
              <div
                key={project.id}
                className={`panel group relative flex flex-col md:flex-row overflow-hidden rounded-[24px] bg-white border border-[var(--color-line)] cursor-pointer transition-all duration-500 ease-[var(--ease)] ${
                  isActive
                    ? "flex-[8] h-auto md:h-full card-active"
                    : "flex-[1] h-16 md:h-full hover:border-gray-400"
                }`}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => {
                  if (typeof window !== "undefined" && window.innerWidth >= 768) {
                    setActiveIndex(idx);
                  }
                }}
              >
                {/* Slim View */}
                <div
                  className={`flex md:flex-col justify-between items-center p-4 md:p-6 transition-opacity duration-300 ${
                    isActive
                      ? "md:opacity-0 md:w-0 md:overflow-hidden md:p-0"
                      : "w-full md:w-16 lg:w-20"
                  }`}
                >
                  <span className="font-mono text-[var(--color-mute)] text-sm">
                    {indexStr}
                  </span>
                  <div className="hidden md:flex flex-1 items-center justify-center writing-vertical rotate-180 my-4">
                    <h3 className="text-lg font-bold text-[var(--color-ink)] whitespace-nowrap">
                      {project.title}
                    </h3>
                  </div>
                  <h3 className="md:hidden text-base font-bold text-[var(--color-ink)] whitespace-nowrap">
                    {project.title}
                  </h3>
                  <button
                    className="w-8 h-8 rounded-full border border-[var(--color-line)] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 text-[var(--color-ink)]"
                    aria-label="Expand project"
                  >
                    +
                  </button>
                </div>

                {/* Active View */}
                <div
                  className={`flex flex-col md:flex-row w-full h-full transition-opacity duration-400 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 pointer-events-none absolute inset-0 md:hidden"
                  }`}
                >
                  {/* Left Side: Content */}
                  <div className="flex flex-col justify-between p-6 md:p-8 lg:p-10 w-full md:w-[50%] h-full overflow-y-auto bg-white">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-[var(--color-mute)] text-xs">
                          {indexStr}
                        </span>
                        <span className="text-[var(--color-mute)] text-xs px-2.5 py-0.5 rounded-full bg-[var(--color-paper)] border border-[var(--color-line)] font-mono">
                          {project.kicker}
                        </span>
                      </div>

                      <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[var(--color-ink)] mb-3">
                        {project.title}
                      </h3>

                      <p className="text-[var(--color-mute)] text-sm md:text-base mb-6 leading-relaxed">
                        {project.description}
                      </p>

                      {project.features && (
                        <div className="grid grid-cols-2 gap-2.5 mb-6">
                          {project.features.map((feat, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="text-[var(--color-ink)] text-xs mt-0.5">•</span>
                              <span className="text-xs text-[var(--color-ink-2)]">
                                {feat}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {project.tech.map((t, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-0.5 bg-[var(--color-paper)] text-[var(--color-ink-2)] text-xs font-mono rounded-full border border-[var(--color-line)]"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {project.github && (
                      <div className="pt-4 border-t border-[var(--color-line)] mt-auto">
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-pill btn-secondary text-xs inline-flex items-center gap-2"
                        >
                          View on GitHub ↗
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Illustrative UI */}
                  <div className="hidden md:flex flex-col items-center justify-center w-[50%] h-full bg-[var(--color-paper)] border-l border-[var(--color-line)] p-8 relative overflow-hidden">
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full border border-[var(--color-line)] flex items-center gap-2 z-20">
                      <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-faint)]" />
                      <span className="text-[10px] font-mono text-[var(--color-mute)] uppercase tracking-wider">
                        Illustrative UI · Not a screenshot
                      </span>
                    </div>

                    <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-xl bg-white shadow-sm border border-[var(--color-line)] overflow-hidden flex flex-col">
                      {/* Browser Header */}
                      <div className="h-7 border-b border-[var(--color-line)] bg-gray-50 flex items-center px-3 gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                        <div className="w-2 h-2 rounded-full bg-gray-300" />
                      </div>

                      <div className="flex-1 p-4 bg-white relative flex flex-col justify-center">
                        {project.id === "kalaav-studio" ? (
                          <div className="grid grid-cols-3 gap-2 w-full h-full">
                            <div className="bg-[var(--color-soft)] rounded col-span-2 row-span-2" />
                            <div className="bg-[var(--color-soft)] rounded" />
                            <div className="bg-[var(--color-soft)] rounded" />
                            <div className="bg-[var(--color-soft)] rounded" />
                            <div className="bg-[var(--color-soft)] rounded col-span-2" />
                          </div>
                        ) : project.id === "friday" ? (
                          <div className="flex flex-col justify-end w-full h-full gap-3">
                            <div className="self-end bg-[var(--color-soft)] rounded-xl rounded-tr-sm px-3 py-2 w-2/3 h-8" />
                            <div className="self-start border border-[var(--color-line)] bg-white rounded-xl rounded-tl-sm px-3 py-2 w-3/4 h-12 flex items-center justify-center gap-1">
                              {[12, 24, 18, 28, 16, 22, 14, 20].map((h, i) => (
                                <div
                                  key={i}
                                  className="w-1 bg-[var(--color-faint)] rounded-full animate-wave"
                                  style={{
                                    height: `${h}px`,
                                    animationDelay: `${i * 0.1}s`,
                                  }}
                                />
                              ))}
                            </div>
                            <div className="w-full h-8 rounded-full border border-[var(--color-line)] bg-[var(--color-paper)]" />
                          </div>
                        ) : (
                          <div className="flex w-full h-full gap-3">
                            <div className="w-1/3 h-full border-r border-[var(--color-line)] flex flex-col gap-2 pr-2">
                              <div className="w-full h-6 bg-[var(--color-soft)] rounded flex items-center justify-center text-[10px] font-mono">
                                LAWVIA
                              </div>
                              <div className="w-full h-3 bg-[var(--color-paper)] rounded" />
                              <div className="w-3/4 h-3 bg-[var(--color-paper)] rounded" />
                            </div>
                            <div className="flex-1 flex flex-col gap-2">
                              <div className="w-full h-16 bg-[var(--color-paper)] rounded border border-[var(--color-line)] p-2 flex flex-col gap-1.5">
                                <div className="w-full h-2 bg-gray-200 rounded" />
                                <div className="w-5/6 h-2 bg-gray-200 rounded" />
                              </div>
                              <div className="grid grid-cols-2 gap-2 flex-1">
                                <div className="bg-[var(--color-soft)] rounded" />
                                <div className="bg-[var(--color-soft)] rounded" />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .writing-vertical {
          writing-mode: vertical-rl;
          text-orientation: mixed;
        }
        @keyframes wave {
          0%, 100% { transform: scaleY(0.6); }
          50% { transform: scaleY(1.2); }
        }
        .animate-wave {
          animation: wave 1.2s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
