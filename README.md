# Anas NS — Personal Portfolio Website

A clean, light, and production-ready portfolio website for **Anas NS** (Full-Stack Python Developer), built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4**, and **Lenis** smooth scrolling.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
npm start
```

---

## 📋 Sections Overview

| # | Section | Component | Description |
|---|---|---|---|
| **00** | **Hero** | `src/components/hero/Hero.tsx` | Seamless looping intro video with sound toggle (`▶`/`❚❚`), background ghost name, and CTA buttons. Pauses automatically on scroll. |
| **01** | **About** | `src/components/sections/About.tsx` | Three-column layout featuring an interactive hanging 3D ID card on a lanyard with pendulum physics, flippable back face, verbatim résumé summary, and quick facts. |
| **02** | **Skills** | `src/components/sections/Skills.tsx` | "Periodic Table of My Stack" with atomic symbols, category filter chips (Languages, Frameworks, Tools, Databases), and an interactive brand logo inspector. |
| **03** | **Work** | `src/components/sections/Work.tsx` | Side-by-side expanding accordion gallery featuring Kalaav Studio, Friday, and Lawvia AI with illustrative UI previews (pure CSS/JSX) and tech chips. |
| **04** | **Experience** | `src/components/sections/Experience.tsx` | Unified chronological timeline with a scroll-drawn spine combining education (B.Tech, 12th) and professional experience (Kalaav Studio, internship). |
| **05** | **Achievements** | `src/components/sections/Achievements.tsx` | Pinned horizontal scrolling milestone gallery with animated ease-out count-up numbers (1st position in capstone, international journal publication, 13+ months training). |
| **06** | **Contact & Footer** | `src/components/sections/Contact.tsx` | Interactive hopping letter typography heading, large email link with one-click copy chip (`Copied ✓`), phone number, rotating "say hello" badge, and clean footer. |

---

## 🎥 Rebuilding the Hero Video

To re-process or adjust the intro video:

```bash
python scripts/build-hero-assets.py "path/to/raw_video.mp4"
```

### What the pipeline does:
1. **Crops & Centres**: Tightly crops around the person head-to-toe and scales to 768 px width.
2. **Whitens Background**: Applies `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98` to blend seamlessly into the warm off-white (`#f4f2ee`) page background.
3. **Seamless Loop**: Cross-fades the first and last 0.5 s of video (via ffmpeg `xfade`) and audio (via sample-accurate `numpy` blending).
4. **Dual Export**: Produces `public/hero/hero.mp4` (H.264, CRF 24, AAC) and `public/hero/hero.webm` (VP9, CRF 36, Opus).
5. **Stills**: Extracts `public/portrait-bust.webp` (480×600) and `public/og.jpg` (1200×630).

---

## 🎨 Design System

- **Background**: `--color-paper: #f4f2ee` (warm off-white)
- **Cards**: `--color-card: #ffffff` (white with 1 px hairline border)
- **Ink / Text**: `--color-ink: #0d0d0d`
- **Mute / Secondary**: `--color-mute: #77756f`
- **Easing**: `--ease: cubic-bezier(.16, 1, .3, 1)`
- **Typography**:
  - Display & Body: **Inter Tight** (self-hosted variable woff2)
  - Heading Accent: **Instrument Serif** (self-hosted regular + italic woff2)
  - Labels & Code: **JetBrains Mono** (self-hosted variable woff2)

---

## 🏷️ Brand Logos & Credits

All tech logos are implemented as pure inline SVGs preserving official brand shapes and colors:

- **Python**: Python Software Foundation (PSF) License
- **Django**: Django Software Foundation (3-Clause BSD)
- **HTML5 & CSS3**: W3C
- **SQL / MySQL**: Oracle Corporation
- **Postman**: Postman Inc.
- **Git**: Git Project (GPLv2)
- **GitHub**: GitHub / Microsoft

---

## ♿ Accessibility & Performance

- **Semantic HTML5** structure (`<main>`, `<nav>`, `<section>`, `<header>`, `<footer>`).
- **prefers-reduced-motion** support: smooth scrolling and decorative motion are disabled when requested.
- **First-load JS**: ~109 kB (well under the 130 kB limit).
- **Self-hosted fonts & assets**: Zero external script or font CDN calls at runtime.
- **Responsive**: Fully responsive from 360 px to 1920 px with zero horizontal overflow.
