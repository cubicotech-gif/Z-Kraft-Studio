import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { ArtistCard } from "@/components/artists/artist-card";
import { DiscordCard } from "@/components/feedback/discord-card";
import { getArtists } from "@/lib/artists-data";
import { getFeedback } from "@/lib/feedback-data";

export const metadata: Metadata = {
  title: "Affiliated artists",
  description: "Trusted artists we work with. Find their specialities and reach them on Discord.",
};

async function Roster() {
  const [artists, { discord }] = await Promise.all([getArtists(), getFeedback()]);
  return (
    <>
      {artists.length === 0 ? (
        <p className="border border-dashed border-void-600 p-8 text-center font-hud text-sm uppercase tracking-[0.2em] text-ink-dim">Our artist roster is coming soon.</p>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {artists.map((a) => (
            <li key={a.id}><ArtistCard a={a} /></li>
          ))}
        </ul>
      )}
      <div className="mt-10"><DiscordCard discord={discord} /></div>
    </>
  );
}

export default function ArtistsPage() {
  return (
    <main>
      <PageHeader kicker="ZONE 05 · THE GUILD" title="Affiliated artists" crumbs={[{ label: "Home", href: "/" }, { label: "Artists" }]}>
        Trusted artists we work with. Need a style or skill outside our own range? Meet the guild and message them on Discord.
      </PageHeader>
      <Section bordered={false} className="!pt-10">
        <Suspense fallback={<div className="min-h-64 border border-void-700 bg-void-900" aria-hidden />}>
          <Roster />
        </Suspense>
      </Section>
      <CtaBand title="Not sure who fits?" text="Start a quest and tell us what you need. We'll point you to the right artist." />
    </main>
  );
}
