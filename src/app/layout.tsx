import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";

/* ─── Self-hosted fonts ─── */
const interTight = localFont({
  src: [
    { path: "../fonts/InterTight-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InterTight-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

const instrumentSerif = localFont({
  src: [
    { path: "../fonts/InstrumentSerif-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/InstrumentSerif-Italic.woff2", weight: "400", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../fonts/JetBrainsMono-Regular.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-mono",
  display: "swap",
});

/* ─── Metadata ─── */
export const metadata: Metadata = {
  metadataBase: new URL("https://anas-portfolio.dev"),
  title: "Anas NS — Full-Stack Python Developer",
  description:
    "Detail-oriented and highly motivated Computer Science Engineering graduate with a strong foundation in full-stack web development.",
  openGraph: {
    title: "Anas NS — Full-Stack Python Developer",
    description:
      "Detail-oriented and highly motivated CS graduate. Full-stack web development with Python, Django, and modern UI.",
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
    type: "website",
  },
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  themeColor: "#f4f2ee",
  width: "device-width",
  initialScale: 1,
};

/* ─── Root Layout ─── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${interTight.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
