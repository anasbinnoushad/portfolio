/* ───────────────────────────────────────────────
   src/lib/data.ts — single source of truth
   All content comes from Anas NS's résumé.
   ─────────────────────────────────────────────── */

// ── Profile ──────────────────────────────────
export const PROFILE = {
  name: "Anas NS",
  firstName: "Anas",
  initials: "AN",
  role: "Full-Stack Python Developer",
  email: "muhammedanaskarette@gmail.com",
  phone: "+91 6282964517",
  phoneHref: "tel:+916282964517",
  location: "Trivandrum, India",
  resumeSummary:
    "Detail-oriented and highly motivated Computer Science Engineering graduate with a strong foundation in full-stack web development. Proficient in designing responsive user interfaces, writing clean and scalable code, and building efficient server-side applications. Proven ability to architect dynamic web apps with seamless data persistence and optimized performance. Eager to contribute technical skills and a collaborative mindset to a dynamic development team.",
  github: "https://github.com/anasbinnoushad",
  linkedin: "https://www.linkedin.com/in/anas-n-s-952564351/",
  resume: "/resume.pdf",
} as const;

// ── Navigation ───────────────────────────────
export const NAV = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Achievements", href: "#achievements" },
  { label: "Contact", href: "#contact" },
] as const;

// ── Skills ───────────────────────────────────
export interface Skill {
  name: string;
  symbol: string;
  family: string;
}

export const SKILL_FAMILIES = [
  "Languages",
  "Frameworks",
  "Tools",
  "Databases",
] as const;

export const SKILL_GROUPS: Skill[] = [
  { name: "Python", symbol: "Py", family: "Languages" },
  { name: "SQL", symbol: "Sq", family: "Languages" },
  { name: "HTML", symbol: "Ht", family: "Languages" },
  { name: "CSS", symbol: "Cs", family: "Languages" },
  { name: "Django", symbol: "Dj", family: "Frameworks" },
  { name: "Postman", symbol: "Pm", family: "Tools" },
  { name: "Git", symbol: "Gi", family: "Tools" },
  { name: "GitHub", symbol: "Gh", family: "Tools" },
  { name: "MySQL", symbol: "My", family: "Databases" },
];

// Map skills to projects that use them
export const SKILL_PROJECTS: Record<string, string[]> = {
  Python: ["Kalaav Studio", "Friday", "Lawvia AI"],
  SQL: ["Kalaav Studio"],
  HTML: ["Kalaav Studio", "Friday"],
  CSS: ["Kalaav Studio", "Friday"],
  Django: ["Kalaav Studio", "Friday"],
  Postman: ["Kalaav Studio"],
  Git: ["Kalaav Studio", "Friday", "Lawvia AI"],
  GitHub: ["Kalaav Studio", "Friday", "Lawvia AI"],
  MySQL: ["Kalaav Studio"],
};

// ── Projects ─────────────────────────────────
export interface Project {
  id: string;
  index: string;
  title: string;
  kicker: string;
  description: string;
  features: string[];
  tech: string[];
  github: string;
}

export const PROJECTS: Project[] = [
  {
    id: "kalaav-studio",
    index: "01",
    title: "Kalaav Studio",
    kicker: "Live Client Project",
    description:
      "A live full-stack web application hosted on Render with custom SSL domain integration. Features a secure administrative dashboard for client content management, automated email notification workflows, and a fully responsive mobile-first UI.",
    features: [
      "Custom admin dashboard",
      "Dynamic portfolio uploading",
      "Work categorization & gallery",
      "Email notification workflows",
      "Password recovery system",
      "Lightbox media preview",
      "WhatsApp Business API",
      "Smooth scroll animations",
    ],
    tech: ["Python", "Django", "HTML", "CSS", "MySQL", "Git"],
    github: "https://github.com/anasbinnoushad",
  },
  {
    id: "friday",
    index: "02",
    title: "Friday",
    kicker: "Personal Assistant",
    description:
      "A hands-free, full-stack personal assistant application built with Django, featuring voice listening, smart command routing via regular expressions, and bilingual support for English and Malayalam.",
    features: [
      "Voice listening interface",
      "Smart command routing (regex)",
      "Bilingual support (EN/ML)",
      "Unified user dashboard",
      "Sidebar & chat integration",
      "Recent activity logs",
    ],
    tech: ["Python", "Django", "HTML", "CSS"],
    github: "https://github.com/anasbinnoushad",
  },
  {
    id: "lawvia-ai",
    index: "03",
    title: "Lawvia AI",
    kicker: "Engineering Capstone",
    description:
      "An award-winning legal platform designed to bridge the gap between everyday citizens and India's legal system. Leverages NLP models, automated internal routing, and integrated mapping APIs.",
    features: [
      "NLP-powered legal analysis",
      "Automated internal routing",
      "Mapping API integration",
      "1st position in capstone",
      "International journal publication",
      "Team collaboration",
    ],
    tech: ["Python", "Django", "Git"],
    github: "https://github.com/anasbinnoushad",
  },
];

// ── Experience (professional) ────────────────
export interface Experience {
  type: "work" | "education" | "certification";
  title: string;
  org: string;
  location?: string;
  period: string;
  year: number;
  details: string[];
  url?: string;
}

export const EXPERIENCE: Experience[] = [
  {
    type: "education",
    title: "12th Standard",
    org: "Janatha Higher Secondary School",
    period: "Completed",
    year: 2022,
    details: [],
  },
  {
    type: "education",
    title: "B.Tech in Computer Science and Engineering",
    org: "Kerala Technical University — St Thomas Institute of Science and Technology",
    location: "Trivandrum, Kerala",
    period: "September 2022 – May 2026",
    year: 2026,
    details: [
      "Computer Science and Engineering",
      "Engineering Capstone: Lawvia AI — 1st Position",
    ],
  },
  {
    type: "certification",
    title: "Python Full-Stack Development Internship",
    org: "Kompetenzen Technologies OPC Pvt. Ltd.",
    location: "Trivandrum, Kerala",
    period: "June 2025 – July 2026",
    year: 2025,
    details: ["Full-stack Python and Django development training"],
  },
  {
    type: "work",
    title: "Full-Stack Django Developer",
    org: "Kalaav Studio",
    period: "August 2026 – September 2026",
    year: 2026,
    url: "https://kalaav.com",
    details: [
      'Developing "Friday," a hands-free personal assistant with voice listening and bilingual support',
      "Designing a unified user dashboard integrating modern CSS layout into Django templates",
      "Merged sidebar, chat window, and recent logs into a single, cohesive UI",
    ],
  },
  {
    type: "work",
    title: "Full-Stack Python Developer",
    org: "Independent Developer — Kalaav Studio",
    period: "September 2026 – October 2026",
    year: 2026,
    url: "https://kalaav.com",
    details: [
      "Architected and deployed a live full-stack web application on Render with custom SSL domain",
      "Engineered secure custom administrative dashboard for content management",
      "Implemented automated email workflows and password recovery systems",
      "Designed responsive, mobile-first UI with smooth scroll animations and WhatsApp API integration",
    ],
  },
];

// ── Achievements (combined with certifications) ──
export interface Achievement {
  label: string;
  caption: string;
  detail: string;
  number: number;
  suffix: string;
  platform?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    label: "Position",
    caption: "Lawvia AI · Engineering Capstone",
    detail: "Award-winning legal platform — 1st place",
    number: 1,
    suffix: "st",
    platform: "capstone",
  },
  {
    label: "International Publication",
    caption: "Lawvia AI Research Paper",
    detail: "Published in an international journal",
    number: 1,
    suffix: "",
    platform: "publication",
  },
  {
    label: "Months of Training",
    caption: "Python Full-Stack Development",
    detail: "Kompetenzen Technologies OPC Pvt. Ltd.",
    number: 13,
    suffix: "+",
    platform: "certification",
  },
];

// ── Quick facts (for About section) ──────────
export const QUICK_FACTS = [
  { label: "Location", value: "Trivandrum, India" },
  { label: "Education", value: "B.Tech in CSE, Kerala Technical University" },
  { label: "Current Role", value: "Full-Stack Django Developer at Kalaav Studio" },
  { label: "Email", value: PROFILE.email },
] as const;

// ── ID card back lines ───────────────────────
export const ID_BACK_LINES = [
  "Full-Stack Python Developer",
  "B.Tech in Computer Science & Engineering",
  "Projects: Kalaav Studio · Friday · Lawvia AI",
  "Honours: 1st Position — Engineering Capstone",
  "International Journal Publication",
] as const;
