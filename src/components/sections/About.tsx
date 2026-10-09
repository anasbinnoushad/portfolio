"use client";

import React, { useRef, useEffect, useState } from "react";
import { PROFILE, QUICK_FACTS, ID_BACK_LINES } from "@/lib/data";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [flipped, setFlipped] = useState(false);
  const [angle, setAngle] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // pendulum motion simulation
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const velocityRef = useRef(0);
  const mousePosRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let animationFrameId: number;

    const animate = (time: number) => {
      if (!isHovered) {
        targetAngleRef.current = Math.sin(time / 600) * 2;
      }

      const spring = 0.08;
      const damping = 0.92;

      const force = (targetAngleRef.current - currentAngleRef.current) * spring;
      velocityRef.current = (velocityRef.current + force) * damping;
      currentAngleRef.current += velocityRef.current;

      setAngle(currentAngleRef.current);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { clientX, clientY } = e;
    const dx = clientX - mousePosRef.current.x;

    if (Math.abs(dx) > 1) {
      targetAngleRef.current = Math.min(Math.max(dx * 0.5, -20), 20);
    } else {
      targetAngleRef.current = 0;
    }

    mousePosRef.current = { x: clientX, y: clientY };
  };

  return (
    <section
      id="about"
      className="container-main section-pad rv is-in relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      ref={containerRef}
    >
      <div className="mb-12">
        <span className="section-tag">01 — About me</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_320px_minmax(0,1fr)] gap-8 md:gap-16 items-start relative z-10">
        {/* Left Column */}
        <div className="flex flex-col gap-6 rv is-in" style={{ "--i": 1 } as React.CSSProperties}>
          <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight">
            Hi, I'm {PROFILE.firstName}.
          </h2>
          <div className="text-[var(--color-mute)] text-lg leading-relaxed whitespace-pre-wrap">
            {PROFILE.resumeSummary}
          </div>

          <div className="flex flex-wrap gap-4 mt-4">
            {PROFILE.resume && (
              <a
                href={PROFILE.resume}
                download
                className="btn-pill btn-secondary"
              >
                Résumé ↓
              </a>
            )}
            {PROFILE.github && (
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-secondary"
              >
                GitHub ↗
              </a>
            )}
            {PROFILE.linkedin && (
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noreferrer"
                className="btn-pill btn-secondary"
              >
                LinkedIn ↗
              </a>
            )}
          </div>
        </div>

        {/* Center Column: ID Card */}
        <div className="flex justify-center md:-mt-12 rv is-in" style={{ "--i": 2 } as React.CSSProperties}>
          <div
            className="relative flex flex-col items-center origin-top cursor-pointer focus:outline-none"
            style={{
              transform: `rotate(${angle}deg)`,
              WebkitTransform: `rotate(${angle}deg)`,
            }}
            onClick={() => setFlipped(!flipped)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") setFlipped(!flipped);
            }}
            tabIndex={0}
            aria-label="Developer ID card, click or press enter to flip"
          >
            {/* Lanyard Strap */}
            <div className="w-[30px] h-[56px] bg-[var(--color-ink)] text-[var(--color-paper)] overflow-hidden relative flex flex-col justify-center rounded-t-sm">
              <div className="lanyard-marquee flex flex-col whitespace-nowrap text-[10px] font-mono font-bold tracking-widest px-1 text-center">
                <span>{PROFILE.name.toUpperCase()}</span>
                <span className="opacity-60 text-[8px] mt-1">{PROFILE.role.toUpperCase()}</span>
              </div>
            </div>

            {/* Metal Clip */}
            <div className="w-5 h-4 bg-gradient-to-b from-gray-200 to-gray-400 rounded-sm shadow-sm z-10 -mt-1 -mb-1 border border-gray-400" />

            {/* ID Card 3D Container */}
            <div
              className={`id-card-wrap relative w-[300px] h-[404px] ${
                flipped ? "is-flipped" : ""
              }`}
            >
              <div className="id-card-body w-full h-full relative">
                {/* Front */}
                <div className="id-face id-front absolute inset-0 bg-white rounded-2xl shadow-lg border border-[var(--color-line)] overflow-hidden flex flex-col justify-between">
                  <div className="bg-[var(--color-ink)] text-[var(--color-paper)] py-2 px-4 text-center font-mono font-bold tracking-widest text-xs">
                    DEVELOPER ID
                  </div>

                  <div className="flex-1 flex flex-col items-center p-5 gap-3">
                    <div className="w-[128px] h-[156px] rounded-xl border border-gray-200 shadow-sm overflow-hidden relative group bg-[var(--color-paper)]">
                      <img
                        src="/portrait-bust.webp"
                        alt={PROFILE.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>

                    <div className="text-center w-full">
                      <h3 className="font-bold text-lg text-[var(--color-ink)]">{PROFILE.name}</h3>
                      <p className="text-[var(--color-mute)] text-xs font-mono">{PROFILE.role}</p>
                    </div>

                    <div className="w-full space-y-1 text-xs text-[var(--color-ink)] font-mono">
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-1">
                        <span className="text-[var(--color-mute)]">ID No.</span>
                        <span className="font-semibold">ANS-2026-001</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-1">
                        <span className="text-[var(--color-mute)]">Dept.</span>
                        <span>Computer Science</span>
                      </div>
                      <div className="flex justify-between border-b border-[var(--color-line)] pb-1">
                        <span className="text-[var(--color-mute)]">Valid till</span>
                        <span>2026</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Barcode + Hologram */}
                  <div className="h-10 bg-gray-50 flex items-center justify-between px-5 border-t border-[var(--color-line)]">
                    <div className="flex h-5 items-center gap-[2px]">
                      {[4, 2, 6, 1, 5, 2, 4, 3, 1, 6, 2, 5, 3, 1, 4, 2, 5, 1, 3, 4, 2].map((w, i) => (
                        <div
                          key={i}
                          className="bg-gray-400 h-full"
                          style={{ width: `${w}px` }}
                        />
                      ))}
                    </div>
                    <div className="w-6 h-6 rounded-full border border-gray-300 relative overflow-hidden bg-gradient-to-tr from-gray-200 via-white to-gray-300">
                      <div className="holo-sheen absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent" />
                    </div>
                  </div>
                </div>

                {/* Back */}
                <div className="id-face id-back absolute inset-0 bg-white rounded-2xl shadow-lg border border-[var(--color-line)] p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm uppercase tracking-wider text-[var(--color-ink)] border-b border-[var(--color-line)] pb-2 mb-4 font-mono">
                      What I am
                    </h3>
                    <ul className="space-y-2 text-xs text-[var(--color-ink-2)]">
                      {ID_BACK_LINES.map((line, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-[var(--color-mute)]">•</span>
                          <span>{line}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-dashed border-[var(--color-line)] text-center">
                    <p className="font-serif italic text-2xl text-[var(--color-ink)] mb-1">
                      {PROFILE.name}
                    </p>
                    <p className="text-[10px] text-[var(--color-mute)] font-mono">
                      If found, say hello · {PROFILE.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6 rv is-in" style={{ "--i": 3 } as React.CSSProperties}>
          <div>
            <h3 className="section-tag mb-4">Quick facts</h3>
            <div className="space-y-4">
              {QUICK_FACTS.map((fact, i) => (
                <div key={i} className="flex flex-col border-b border-[var(--color-line)] pb-3">
                  <span className="text-[11px] text-[var(--color-mute)] uppercase tracking-wider font-mono">
                    {fact.label}
                  </span>
                  <span className="text-[var(--color-ink)] font-medium text-sm mt-0.5">
                    {fact.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-l-2 border-[var(--color-ink)] pl-4">
            <p className="font-serif italic text-lg text-[var(--color-ink-2)] leading-relaxed">
              "Eager to contribute technical skills and a collaborative mindset to a dynamic development team."
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .lanyard-marquee {
          animation: marquee 6s linear infinite;
        }
        @keyframes marquee {
          0% {
            -webkit-transform: translateY(100%);
            transform: translateY(100%);
          }
          100% {
            -webkit-transform: translateY(-100%);
            transform: translateY(-100%);
          }
        }
        .id-card-wrap {
          -webkit-perspective: 1000px;
          perspective: 1000px;
          -webkit-transform: translateZ(0);
          transform: translateZ(0);
        }
        .id-card-body {
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
          transition: -webkit-transform 0.7s var(--ease), transform 0.7s var(--ease);
        }
        .id-card-wrap:hover .id-card-body,
        .id-card-wrap.is-flipped .id-card-body {
          -webkit-transform: rotateY(180deg);
          transform: rotateY(180deg);
        }
        .id-face {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
          -webkit-transform-style: preserve-3d;
          transform-style: preserve-3d;
        }
        .id-front {
          -webkit-transform: rotateY(0deg) translateZ(1px);
          transform: rotateY(0deg) translateZ(1px);
        }
        .id-back {
          -webkit-transform: rotateY(180deg) translateZ(1px);
          transform: rotateY(180deg) translateZ(1px);
        }
        .holo-sheen {
          animation: holo 3s linear infinite;
        }
        @keyframes holo {
          0% {
            -webkit-transform: translateX(-100%) rotate(45deg);
            transform: translateX(-100%) rotate(45deg);
          }
          100% {
            -webkit-transform: translateX(200%) rotate(45deg);
            transform: translateX(200%) rotate(45deg);
          }
        }
      `}</style>
    </section>
  );
}
