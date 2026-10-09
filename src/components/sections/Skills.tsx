"use client";

import React, { useState } from "react";
import { SKILL_GROUPS, SKILL_FAMILIES, SKILL_PROJECTS, Skill } from "@/lib/data";
import { TechLogo } from "@/components/ui/TechLogo";

export default function Skills() {
  const [activeFamily, setActiveFamily] = useState<string | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(SKILL_GROUPS[0]);

  const handleFamilyClick = (family: string) => {
    setActiveFamily(activeFamily === family ? null : family);
  };

  return (
    <section id="skills" className="container-main section-pad rv is-in relative">
      <div className="mb-8">
        <span className="section-tag">02 — Technical skills</span>
        <h2 className="section-heading text-4xl md:text-5xl font-bold tracking-tight mt-2">
          The periodic table of my <span className="italic-word">stack.</span>
        </h2>
      </div>

      {/* Family filter chips */}
      <div className="flex flex-wrap gap-2 mb-12">
        <button
          onClick={() => setActiveFamily(null)}
          className={`btn-pill text-xs py-2 px-4 ${
            !activeFamily ? "btn-primary" : "btn-secondary"
          }`}
        >
          All
        </button>
        {SKILL_FAMILIES.map((family) => (
          <button
            key={family}
            onClick={() => handleFamilyClick(family)}
            className={`btn-pill text-xs py-2 px-4 ${
              activeFamily === family ? "btn-primary" : "btn-secondary"
            }`}
          >
            {family}
          </button>
        ))}
      </div>

      <div className="flex flex-col xl:flex-row gap-8 items-start">
        {/* Periodic Grid */}
        <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 w-full">
          {SKILL_GROUPS.map((skill, index) => {
            const isDimmed = activeFamily && skill.family !== activeFamily;
            const isSelected = selectedSkill?.name === skill.name;

            return (
              <div
                key={skill.name}
                className={`skill-card card p-4 cursor-pointer transition-all duration-300 relative group flex flex-col justify-between min-h-[120px] ${
                  isDimmed
                    ? "opacity-20 pointer-events-none"
                    : isSelected
                    ? "card-active border-2 border-[var(--color-ink)]"
                    : "hover:-translate-y-1 hover:shadow-md"
                }`}
                style={{
                  animationDelay: `${index * 40}ms`,
                }}
                onClick={() => setSelectedSkill(skill)}
                onMouseEnter={() => setSelectedSkill(skill)}
                onFocus={() => setSelectedSkill(skill)}
                tabIndex={0}
                role="button"
                aria-label={`Skill: ${skill.name}`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono text-[var(--color-mute)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-[8px] font-mono text-[var(--color-faint)] uppercase">
                    {skill.family}
                  </span>
                </div>

                <div className="text-center my-1">
                  <div className="text-2xl font-bold font-mono tracking-tight text-[var(--color-ink)] group-hover:scale-105 transition-transform">
                    {skill.symbol}
                  </div>
                  <div className="text-xs font-medium text-[var(--color-ink-2)] mt-0.5">
                    {skill.name}
                  </div>
                </div>

                <div className="h-1 w-full bg-[var(--color-soft)] rounded-full overflow-hidden">
                  <div className="h-full bg-[var(--color-ink)] w-full opacity-60" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Inspector Panel */}
        <div className="w-full xl:w-[320px] xl:sticky top-[120px] shrink-0">
          <div className="card p-6 min-h-[340px] flex flex-col items-center justify-between relative bg-white">
            {selectedSkill ? (
              <div className="flex flex-col items-center w-full">
                <div className="w-24 h-24 flex items-center justify-center mb-4 logo-pop">
                  <TechLogo name={selectedSkill.name} size={72} />
                </div>

                <h3 className="text-2xl font-bold text-[var(--color-ink)] mb-1">
                  {selectedSkill.name}
                </h3>
                <span className="text-xs font-mono text-[var(--color-mute)] mb-4 px-3 py-1 bg-[var(--color-paper)] rounded-full">
                  {selectedSkill.family}
                </span>

                <div className="w-full border-t border-[var(--color-line)] pt-4 mt-2">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-mute)] mb-2 text-center">
                    Used In Projects
                  </h4>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {SKILL_PROJECTS[selectedSkill.name]?.map((proj, i) => (
                      <span
                        key={i}
                        className="text-xs bg-[var(--color-paper)] text-[var(--color-ink)] border border-[var(--color-line)] px-2.5 py-1 rounded-full font-medium"
                      >
                        {proj}
                      </span>
                    )) || (
                      <span className="text-xs text-[var(--color-faint)] italic">
                        Featured in stack
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center text-[var(--color-mute)] font-mono text-xs">
                Hover or tap a skill tile to inspect details
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .logo-pop {
          animation: pop 0.35s var(--ease);
        }
        @keyframes pop {
          0% {
            transform: scale(0.8);
            opacity: 0;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
}
