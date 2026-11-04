import { cleanHandle } from "@/lib/feedback";

export type ArtistImg = { path: string; src: string };
export type Availability = "open" | "busy";
export type Artist = {
  id: string;
  name: string;
  discord: string;
  specialities: string[];
  bio: string;
  availability: Availability;
  link: string;
  avatar?: ArtistImg;
  samples: ArtistImg[];
};
export type ArtistInput = {
  name: string;
  discord: string;
  specialities: string[];
  bio: string;
  availability: Availability;
  link: string;
  avatarPath: string | null;
  samplePaths: string[];
};

export const ARTIST_LIMITS = { specialities: 6, specLen: 24, bio: 400, samples: 3 } as const;
export const IMAGE_PATH = /^items\/[0-9a-f-]{36}\/[A-Za-z0-9_-]{1,60}\.(png|jpg|webp|gif)$/;

/** "Emotes, Chibi , VTuber models" -> ["Emotes", "Chibi", "VTuber models"] */
export function parseSpecialities(text: string) {
  return [...new Set(text.split(/[,\n]/).map((s) => s.trim().slice(0, ARTIST_LIMITS.specLen)).filter(Boolean))].slice(0, ARTIST_LIMITS.specialities);
}

export function validateArtist(i: ArtistInput): string | null {
  const name = String(i.name ?? "").trim();
  if (!name || name.length > 80) return "Enter the artist's name (up to 80 characters).";
  if (!/^[A-Za-z0-9_.#-]{2,40}$/.test(cleanHandle(i.discord))) return "Enter a valid Discord handle (letters, numbers, . _ - only).";
  if (!i.specialities.length) return "Add at least one speciality.";
  if (String(i.bio ?? "").length > ARTIST_LIMITS.bio) return `Keep the bio under ${ARTIST_LIMITS.bio} characters.`;
  if (i.availability !== "open" && i.availability !== "busy") return "Pick an availability.";
  if (i.link && (!/^https?:\/\/[^\s]+$/i.test(i.link) || i.link.length > 200)) return "The link must start with http:// or https://";
  if (i.avatarPath && !IMAGE_PATH.test(i.avatarPath)) return "Invalid avatar.";
  if (i.samplePaths.length > ARTIST_LIMITS.samples || i.samplePaths.some((p) => !IMAGE_PATH.test(p))) return `Up to ${ARTIST_LIMITS.samples} valid sample images.`;
  return null;
}
