import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { SoundProvider } from "@/components/fx/sound-provider";
import { Suspense } from "react";
import { IntroLoader } from "@/components/intro/intro-loader";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import "./globals.css";

// Self-hosted (latin subset, variable weight): no Google Fonts request at build or runtime.
const body = localFont({ src: "./fonts/source-serif-4-latin-wght-normal.woff2", variable: "--f-body", weight: "200 900", display: "swap" });
const display = localFont({ src: "./fonts/lexend-latin-wght-normal.woff2", variable: "--f-display", weight: "100 900", display: "swap" });
const hud = localFont({ src: "./fonts/kumbh-sans-latin-wght-normal.woff2", variable: "--f-hud", weight: "100 900", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Z Kraft Studio — Custom art for gamers & streamers", template: "%s | Z Kraft Studio" },
  description:
    "Emotes, sub badges, stream panels and character illustrations built from your own inspirations. Accept the quest.",
};

/**
 * Runs before first paint: flag the intro only for first visit of the session and never
 * for reduced-motion users. No JS => no flag => intro never shows.
 */
const INTRO_BOOT = `try{if(!sessionStorage.getItem("zk-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="1"}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#0b0810",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${body.variable} ${display.variable} ${hud.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOT }} />
      </head>
      <body className="min-h-dvh">
        <SoundProvider>
          <Suspense fallback={null}>
            <IntroLoader />
          </Suspense>
          <SmoothScroll />
          <SiteHeader />
          {children}
          <SiteFooter />
        </SoundProvider>
      </body>
    </html>
  );
}
