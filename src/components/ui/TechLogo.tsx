"use client";

import React from "react";

interface TechLogoProps {
  name: string;
  size?: number;
  className?: string;
}

const BRAND_MAP: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  Python: (props) => (
    <svg viewBox="0 0 110 110" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M53.8681 12.0006C38.2706 12.0006 35.1506 18.7306 35.1506 18.7306L35.0331 29.8056H54.4081V32.9056H25.0781C25.0781 32.9056 12 34.5056 12 52.8806C12 71.2556 22.8256 73.1181 22.8256 73.1181H30.4056V62.4331C30.4056 62.4331 30.6631 49.3331 43.8331 49.3331H55.4056C55.4056 49.3331 66.8656 49.0356 66.8656 37.6656V23.7181C66.8656 23.7181 68.3281 12.0006 53.8681 12.0006ZM39.9556 18.8231C42.0681 18.8231 43.7781 20.5331 43.7781 22.6456C43.7781 24.7581 42.0681 26.4681 39.9556 26.4681C37.8431 26.4681 36.1331 24.7581 36.1331 22.6456C36.1331 20.5331 37.8431 18.8231 39.9556 18.8231ZM56.1281 97.9956C71.7256 97.9956 74.8456 91.2656 74.8456 91.2656L74.9631 80.1906H55.5881V77.0906H84.9181C84.9181 77.0906 97.9956 75.4906 97.9956 57.1156C97.9956 38.7406 87.1706 36.8781 87.1706 36.8781H79.5906V47.5631C79.5906 47.5631 79.3331 60.6631 66.1631 60.6631H54.5906C54.5906 60.6631 43.1306 60.9606 43.1306 72.3306V86.2781C43.1306 86.2781 41.6681 97.9956 56.1281 97.9956ZM70.0406 91.1731C67.9281 91.1731 66.2181 89.4631 66.2181 87.3506C66.2181 85.2381 67.9281 83.5281 70.0406 83.5281C72.1531 83.5281 73.8631 85.2381 73.8631 87.3506C73.8631 89.4631 72.1531 91.1731 70.0406 91.1731Z"
        fill="url(#paint0_linear)"
      />
      <defs>
        <linearGradient id="paint0_linear" x1="12" y1="12" x2="97.9956" y2="97.9956" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3776AB" />
          <stop offset="1" stopColor="#FFD43B" />
        </linearGradient>
      </defs>
    </svg>
  ),
  Django: (props) => (
    <svg viewBox="0 0 100 100" fill="#092E20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="16" />
      <path
        d="M32 25v50h10V25H32zm16 12v38h10V37H48zm16 0v26c0 6 4 12 12 12s12-6 12-12V37H78v26c0 3-1 4-4 4s-4-1-4-4V37H64z"
        fill="#FFF"
      />
    </svg>
  ),
  HTML: (props) => (
    <svg viewBox="0 0 100 100" fill="#E34F26" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 15l7 75 28 8 28-8 7-75H15zm57 20H43l1 12h27l-2 20-19 6-19-6-1-12h11l1 5 8 2 8-2 1-9H31l-3-28h45l-1 12z" />
    </svg>
  ),
  CSS: (props) => (
    <svg viewBox="0 0 100 100" fill="#1572B6" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M15 15l7 75 28 8 28-8 7-75H15zm57 20l-1 12H43l1 12h27l-2 20-19 6-19-6-1-12h11l1 5 8 2 8-2 1-9H31l-3-28h45z" />
    </svg>
  ),
  SQL: (props) => (
    <svg viewBox="0 0 100 100" fill="#CC2927" xmlns="http://www.w3.org/2000/svg" {...props}>
      <ellipse cx="50" cy="25" rx="35" ry="15" />
      <path d="M15 25v50c0 8.3 15.7 15 35 15s35-6.7 35-15V25c0 8.3-15.7 15-35 15S15 33.3 15 25z" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="35" ry="15" opacity="0.6" />
    </svg>
  ),
  MySQL: (props) => (
    <svg viewBox="0 0 100 100" fill="#4479A1" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="16" />
      <text x="50" y="58" fill="white" fontSize="20" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
        SQL
      </text>
    </svg>
  ),
  Postman: (props) => (
    <svg viewBox="0 0 100 100" fill="#FF6C37" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="50" cy="50" r="45" />
      <path d="M40 35h15c10 0 15 5 15 15s-5 15-15 15H40V35zm10 20h5c4 0 6-2 6-5s-2-5-6-5h-5v10z" fill="#FFF" />
    </svg>
  ),
  Git: (props) => (
    <svg viewBox="0 0 100 100" fill="#F05032" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="100" height="100" rx="16" />
      <path
        d="M50 20L20 50l30 30 30-30-30-30zm-8 40a6 6 0 110-12 6 6 0 010 12zm16-12a6 6 0 110-12 6 6 0 010 12z"
        fill="#FFF"
      />
    </svg>
  ),
  GitHub: (props) => (
    <svg viewBox="0 0 100 100" fill="#181717" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M50 15C30.7 15 15 30.7 15 50c0 15.5 10 28.6 23.9 33.2 1.8.3 2.4-.8 2.4-1.7v-6.2c-9.7 2.1-11.8-4.7-11.8-4.7-1.6-4.1-3.9-5.2-3.9-5.2-3.2-2.2.2-2.1.2-2.1 3.5.2 5.4 3.6 5.4 3.6 3.1 5.3 8.2 3.8 10.2 2.9.3-2.3 1.2-3.8 2.2-4.7-7.8-.9-15.9-3.9-15.9-17.3 0-3.8 1.4-6.9 3.6-9.4-.4-.9-1.6-4.4.3-9.3 0 0 2.9-.9 9.6 3.6 2.8-.8 5.8-1.2 8.7-1.2s5.9.4 8.7 1.2c6.7-4.5 9.6-3.6 9.6-3.6 1.9 4.9.7 8.4.3 9.3 2.3 2.5 3.6 5.6 3.6 9.4 0 13.4-8.2 16.4-16 17.2 1.3 1.1 2.4 3.3 2.4 6.6v9.8c0 .9.6 2 2.4 1.7C75 78.6 85 65.5 85 50c0-19.3-15.7-35-35-35z"
      />
    </svg>
  ),
};

export function isBrand(name: string): boolean {
  return !!BRAND_MAP[name];
}

export function TechLogo({ name, size = 24, className = "" }: TechLogoProps) {
  const Logo = BRAND_MAP[name];
  if (!Logo) {
    return (
      <div
        className={`flex items-center justify-center rounded-full bg-gray-100 text-gray-500 font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {name.slice(0, 2).toUpperCase()}
      </div>
    );
  }

  return <Logo width={size} height={size} className={className} />;
}
