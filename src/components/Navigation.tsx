"use client";

import React, { useState, useEffect, useRef } from "react";
import { PROFILE, NAV } from "@/lib/data";
import { useActiveSection } from "@/lib/hooks";
import { scrollToTarget, lockScroll, unlockScroll } from "@/lib/scroll";

const SECTION_IDS = ["about", "skills", "work", "experience", "achievements", "contact"];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);
  
  const navLinksRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    let animationFrameId: number;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 40);
      
      const docHeight = document.documentElement.scrollHeight;
      const viewH = window.innerHeight;
      const maxScroll = docHeight - viewH;
      const scrollProgress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
      
      setProgress(scrollProgress);
      animationFrameId = requestAnimationFrame(handleScroll);
    };
    
    animationFrameId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    if (navLinksRef.current && activeId) {
      const activeElement = navLinksRef.current.querySelector(`[data-target="${activeId}"]`) as HTMLElement;
      if (activeElement) {
        setIndicatorStyle({
          left: activeElement.offsetLeft,
          width: activeElement.offsetWidth,
          opacity: 1
        });
      } else {
        setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    } else {
      setIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
    }
  }, [activeId, scrolled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const openMenu = () => {
    setMenuOpen(true);
    lockScroll();
  };

  const closeMenu = () => {
    setMenuOpen(false);
    unlockScroll();
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    if (menuOpen) {
      closeMenu();
    }
    scrollToTarget(href);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 py-4 pointer-events-none">
        <div className="absolute top-0 left-0 h-[2px] bg-[var(--color-ink)] z-50" style={{ width: `${progress}%` }} />
        
        <div className="container-main mx-auto flex items-center justify-between pointer-events-auto">
          {/* Logo / Name */}
          <div className="flex items-center gap-3">
            <div className={`logo-mark w-10 h-10 rounded-full border border-[var(--color-ink)] flex items-center justify-center font-mono text-sm transition-all duration-600 ${scrolled ? 'bg-[var(--color-ink)] text-[var(--color-paper)]' : 'bg-transparent text-[var(--color-ink)]'}`}>
              {PROFILE.initials}
            </div>
            <span className={`font-medium transition-opacity duration-300 ${scrolled ? 'opacity-0' : 'opacity-100'}`}>
              {PROFILE.name}
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 -translate-x-1/2">
            <div ref={navLinksRef} className={`relative flex items-center px-2 py-2 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-[12px] border border-[var(--color-line)] rounded-full' : ''}`}>
              <div 
                className="absolute h-7 bg-[var(--color-ink)] rounded-full transition-all duration-300 ease-[var(--ease)] z-0"
                style={{ 
                  left: indicatorStyle.left, 
                  width: indicatorStyle.width, 
                  opacity: indicatorStyle.opacity,
                  transform: 'translateY(0)'
                }} 
              />
              {NAV.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  data-target={item.href.replace('#', '')}
                  onClick={(e) => handleLinkClick(e, item.href)}
                  className={`relative z-10 px-4 py-1 text-sm font-medium transition-colors duration-300 ${activeId === item.href.replace('#', '') ? 'text-[var(--color-paper)]' : 'text-[var(--color-ink)] hover:text-[var(--color-mute)]'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <div className="md:hidden">
            <button 
              onClick={openMenu}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-[12px] border border-[var(--color-line)]' : 'bg-transparent border border-[var(--color-ink)]'}`}
            >
              Menu
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu fixed inset-0 z-[60] bg-[var(--color-paper)] flex flex-col justify-center items-center ${menuOpen ? 'is-open' : ''}`}>
        <button 
          onClick={closeMenu}
          className="absolute top-6 right-[var(--gutter)] w-10 h-10 rounded-full border border-[var(--color-ink)] flex items-center justify-center font-medium"
          aria-label="Close menu"
        >
          ✕
        </button>
        <div className="flex flex-col gap-6 w-full px-[var(--gutter)]">
          {NAV.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleLinkClick(e, item.href)}
              className="menu-link text-4xl font-display font-medium tracking-tight border-b border-[var(--color-line)] pb-4 flex items-baseline gap-4"
              style={{ '--i': i } as React.CSSProperties}
            >
              <span className="font-mono text-sm text-[var(--color-mute)]">{(i + 1).toString().padStart(2, '0')}</span>
              {item.label}
            </a>
          ))}
        </div>
      </div>

      <style jsx>{`
        .logo-mark {
          transition: transform 0.6s var(--ease), background-color 0.3s var(--ease), color 0.3s var(--ease);
        }
        .logo-mark:hover {
          transform: rotate(360deg);
        }
        
        .mobile-menu {
          clip-path: circle(0% at calc(100% - var(--gutter) - 20px) 44px);
          transition: clip-path 0.5s var(--ease);
          pointer-events: none;
        }
        .mobile-menu.is-open {
          clip-path: circle(150% at calc(100% - var(--gutter) - 20px) 44px);
          pointer-events: auto;
        }

        .menu-link {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
          transition-delay: calc(var(--i) * 0.05s);
        }
        .mobile-menu.is-open .menu-link {
          opacity: 1;
          transform: translateY(0);
          transition-delay: calc(0.2s + (var(--i) * 0.05s));
        }
      `}</style>
    </>
  );
}
