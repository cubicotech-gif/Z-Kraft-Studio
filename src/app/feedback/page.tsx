import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { DiscordCard } from "@/components/feedback/discord-card";
import { ReviewCard } from "@/components/feedback/review-card";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { getFeedback } from "@/lib/feedback-data";

export const metadata: Metadata = {
  title: "Feedback",
  description: "What players say about Z Kraft Studio. Leave your own feedback, or reach us on Discord.",
};

async function Wall() {
  const { reviews, discord } = await getFeedback();
  return (
    <>
      <DiscordCard discord={discord} />
      {reviews.length === 0 ? (
        <p className="mt-10 border border-dashed border-void-600 p-8 text-center font-hud text-sm uppercase tracking-[0.2em] text-ink-dim">Be the first to leave feedback.</p>
      ) : (
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id}><ReviewCard r={r} /></li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function FeedbackPage() {
  return (
    <main>
      <PageHeader kicker="ZONE 04 · PLAYER REVIEWS" title="Feedback" crumbs={[{ label: "Home", href: "/" }, { label: "Feedback" }]}>
        Real words from the players we&apos;ve crafted for. Worked with us? Add yours below.
      </PageHeader>
      <Section bordered={false} className="!pt-10">
        <Suspense fallback={<div className="min-h-64 border border-void-700 bg-void-900" aria-hidden />}>
          <Wall />
        </Suspense>
      </Section>
      <Section id="leave" kicker="YOUR TURN" title="Leave feedback" lede="Add your Discord handle so people can see you're real. New feedback appears after a quick check.">
        <div className="max-w-xl">
          <FeedbackForm />
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
