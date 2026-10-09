import type { MetadataRoute } from "next";
import { TIERS } from "@/lib/services";

// Set NEXT_PUBLIC_SITE_URL in production (Vercel's production URL is used automatically if present).
const base = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/services", ...TIERS.map((t) => `/services/${t.slug}`), "/portfolio", "/how-it-works", "/about", "/order"];
  return paths.map((p) => ({ url: `${base}${p}` }));
}
