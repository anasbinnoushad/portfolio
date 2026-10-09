"use client";

import React, { useState, useEffect, useRef } from "react";
import { PROFILE } from "@/lib/data";
import { scrollToTarget } from "@/lib/scroll";

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [, setIsPlaying] = useState(false);
  const [canUnmute, setCanUnmute] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const tryPlay = async () => {
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        // Autoplay blocked
        video.muted = true;
        setIsMuted(true);
        video.play().catch(() => {});
        setCanUnmute(true);
      }
    };

    tryPlay();
  }, []);

  useEffect(() => {
    const unlockSound = () => {
      if (videoRef.current && isMuted && canUnmute) {
        videoRef.current.muted = false;
        setIsMuted(false);
        setCanUnmute(false);
      }
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
      document.removeEventListener("touchend", unlockSound);
    };

    document.addEventListener("pointerdown", unlockSound);
    document.addEventListener("keydown", unlockSound);
    document.addEventListener("touchend", unlockSound);

    return () => {
      document.removeEventListener("pointerdown", unlockSound);
      document.removeEventListener("keydown", unlockSound);
      document.removeEventListener("touchend", unlockSound);
    };
  }, [isMuted, canUnmute]);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video
              .play()
              .then(() => setIsPlaying(true))
              .catch(() => {});
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const toggleSound = () => {
    if (!videoRef.current) return;
    const newMutedState = !isMuted;
    videoRef.current.muted = newMutedState;
    setIsMuted(newMutedState);
    if (canUnmute) setCanUnmute(false);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100svh] flex flex-col items-center justify-between pt-24 pb-12 overflow-hidden"
      ref={containerRef}
    >
      {/* Ghost Word */}
      <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none select-none">
        <span className="hero-text-ghost font-display font-bold uppercase tracking-[-0.05em] whitespace-nowrap">
          {PROFILE.firstName}
        </span>
      </div>

      {/* Video */}
      <div className="relative z-10 w-full flex-1 flex items-center justify-center my-auto">
        <div className="relative hero-video-wrapper">
          <video
            ref={videoRef}
            className="w-full h-full object-cover rounded-2xl"
            muted={isMuted}
            loop
            playsInline
            preload="auto"
          >
            <source src="/hero/hero.webm" type="video/webm" />
            <source src="/hero/hero.mp4" type="video/mp4" />
          </video>

          {/* Sound control */}
          <button
            onClick={toggleSound}
            className="absolute bottom-3 right-3 w-[44px] h-[44px] rounded-full bg-[var(--color-ink)] flex items-center justify-center text-white cursor-pointer z-20 transition-transform duration-200 hover:scale-105"
            aria-label={isMuted ? "Unmute intro video" : "Mute intro video"}
          >
            {canUnmute && isMuted && (
              <span className="absolute inset-0 rounded-full border-2 border-[var(--color-ink)] animate-ping-soft pointer-events-none" />
            )}
            {isMuted ? (
              <svg width="12" height="14" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14 8L0.5 15.7942L0.5 0.205771L14 8Z" fill="currentColor" />
              </svg>
            ) : (
              <svg width="12" height="14" viewBox="0 0 12 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="4" height="16" fill="currentColor" />
                <rect x="8" width="4" height="16" fill="currentColor" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Heading & CTAs */}
      <div className="relative z-10 text-center flex flex-col items-center gap-4 max-w-3xl mx-auto px-4 mt-4">
        <h1 className="section-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[var(--color-ink)] font-display font-bold tracking-tight">
          {PROFILE.role}.
        </h1>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#work");
            }}
            className="btn-pill btn-primary text-xs sm:text-sm"
          >
            Explore work
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              scrollToTarget("#contact");
            }}
            className="btn-pill btn-secondary text-xs sm:text-sm"
          >
            Let's talk
          </button>
          <a
            href={PROFILE.resume}
            download
            className="btn-pill btn-secondary text-xs sm:text-sm"
          >
            Résumé ↓
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-text-ghost {
          font-size: clamp(140px, 22vw, 380px);
          -webkit-text-stroke: 1.5px var(--color-soft);
          color: transparent;
        }

        .hero-video-wrapper {
          aspect-ratio: 768/960;
          height: clamp(340px, 58vh, 680px);
          mix-blend-mode: multiply;
        }

        @media (max-width: 767px) {
          .hero-video-wrapper {
            height: 52vh;
          }
        }

        @keyframes ping-soft {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .animate-ping-soft {
          animation: ping-soft 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
}
