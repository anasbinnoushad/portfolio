"use client";

import { useState } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROFILE.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderBouncingText = (text: string) => {
    return text.split("").map((char, i) => (
      <span
        key={i}
        className="inline-block transition-transform duration-200 hover:-translate-y-2 whitespace-pre cursor-default"
      >
        {char}
      </span>
    ));
  };

  return (
    <section id="contact" className="section-pad relative w-full overflow-hidden">
      <div className="container-main mx-auto">
        <div className="flex flex-col mb-16">
          <p className="section-tag">06 — Get in touch</p>
          <h2 className="section-heading text-[clamp(2.5rem,6vw,5.5rem)] font-bold tracking-tight mt-4 max-w-5xl leading-none">
            <div className="flex flex-wrap">{renderBouncingText("Let's build ")}</div>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {renderBouncingText("something ")}
              <span className="italic-word font-serif italic text-[var(--color-mute)]">
                {renderBouncingText("together.")}
              </span>
            </div>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start border-t border-[var(--color-line)] pt-12">
          {/* Left info */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-mute)] mb-2">
                Email
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="text-xl md:text-3xl font-bold text-[var(--color-ink)] hover:text-[var(--color-mute)] transition-colors underline decoration-1 underline-offset-4"
                >
                  {PROFILE.email}
                </a>
                <button
                  onClick={handleCopy}
                  className="btn-pill btn-secondary text-xs py-1.5 px-3 font-mono"
                  aria-live="polite"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-mute)] mb-2">
                Phone
              </p>
              <a
                href={PROFILE.phoneHref}
                className="text-xl md:text-2xl font-bold text-[var(--color-ink)] hover:text-[var(--color-mute)] transition-colors font-mono"
              >
                {PROFILE.phone}
              </a>
            </div>

            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-[var(--color-mute)] mb-2">
                Location
              </p>
              <p className="text-base text-[var(--color-ink)] font-medium">
                {PROFILE.location}
              </p>
            </div>
          </div>

          {/* Right Badge + Links */}
          <div className="flex flex-col md:items-end justify-between gap-8">
            <div className="relative w-28 h-28 flex items-center justify-center animate-spin-slow">
              <svg viewBox="0 0 100 100" width="100" height="100" className="overflow-visible">
                <path
                  id="contactCircle"
                  d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                  fill="none"
                />
                <text className="text-[10px] font-mono uppercase tracking-[0.22em] fill-[var(--color-ink)]">
                  <textPath href="#contactCircle" startOffset="0%">
                    say hello • say hello • say hello •
                  </textPath>
                </text>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-[var(--color-ink)]">
                ↗
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href={PROFILE.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-secondary text-xs"
              >
                GitHub ↗
              </a>
              <a
                href={PROFILE.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-secondary text-xs"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full border-t border-[var(--color-line)] mt-24 pt-8 pb-12">
        <div className="container-main mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-mono text-[var(--color-mute)]">
          <p>© 2026 {PROFILE.name}</p>
          <p>Built with Next.js</p>
          <button
            onClick={() => scrollToTarget("body")}
            className="hover:text-[var(--color-ink)] transition-colors inline-flex items-center gap-1"
          >
            Back to top ↑
          </button>
        </div>
      </footer>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </section>
  );
}
