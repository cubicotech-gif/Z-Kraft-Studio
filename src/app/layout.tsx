import type { Metadata, Viewport } from "next";
import { Oxanium, Chakra_Petch, Geist } from "next/font/google";
import { SoundProvider } from "@/components/fx/sound-provider";
import { PressStart } from "@/components/intro/press-start";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import "./globals.css";

const body = Geist({ variable: "--f-body", subsets: ["latin"], display: "swap" });
const display = Oxanium({ variable: "--f-display", subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const hud = Chakra_Petch({ variable: "--f-hud", subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Z Kraft Studio — Custom art for gamers & streamers",
  description:
    "Emotes, sub badges, stream panels and character illustrations built from your own inspirations. Accept the quest.",
};

/**
 * Runs before first paint: flag the intro only for first visit of the session and never
 * for reduced-motion users. No JS => no flag => intro never shows.
 */
const INTRO_BOOT = `try{if(!sessionStorage.getItem("zk-intro")&&!matchMedia("(prefers-reduced-motion: reduce)").matches)document.documentElement.dataset.intro="1"}catch(e){}`;

export const viewport: Viewport = {
  themeColor: "#07050f",
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
          <PressStart />
          <SmoothScroll />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
