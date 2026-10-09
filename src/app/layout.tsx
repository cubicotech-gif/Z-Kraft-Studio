import type { Metadata, Viewport } from "next";
import { Pixelify_Sans, Silkscreen, Geist } from "next/font/google";
import { SoundProvider } from "@/components/fx/sound-provider";
import { SmoothScroll } from "@/components/fx/smooth-scroll";
import "./globals.css";

const body = Geist({ variable: "--f-body", subsets: ["latin"], display: "swap" });
const display = Pixelify_Sans({ variable: "--f-display", subsets: ["latin"], display: "swap" });
const hud = Silkscreen({ variable: "--f-hud", subsets: ["latin"], weight: ["400", "700"], display: "swap" });

export const metadata: Metadata = {
  title: "Z Kraft Studio — Custom art for gamers & streamers",
  description:
    "Emotes, sub badges, stream panels and character illustrations built from your own inspirations. Accept the quest.",
};

export const viewport: Viewport = {
  themeColor: "#07050f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${body.variable} ${display.variable} ${hud.variable} antialiased`}>
      <body className="min-h-dvh">
        <SoundProvider>
          <SmoothScroll />
          {children}
        </SoundProvider>
      </body>
    </html>
  );
}
