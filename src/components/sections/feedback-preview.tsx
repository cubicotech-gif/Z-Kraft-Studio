import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getFeedback } from "@/lib/feedback-data";
import { DiscordCard } from "@/components/feedback/discord-card";
import { ReviewCard } from "@/components/feedback/review-card";

/** Home teaser: latest 3 approved reviews + Discord contact. Renders nothing while there is nothing to show. */
export async function FeedbackPreview() {
  const { reviews, discord } = await getFeedback();
  if (!reviews.length && !discord.handle && !discord.invite) return null;
  return (
    <section id="feedback" aria-labelledby="feedback-title" className="scroll-mt-24 border-t border-void-700 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">PLAYER REVIEWS</p>
        <h2 id="feedback-title" className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">What players say</h2>
        {reviews.length > 0 && (
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 3).map((r) => (
              <li key={r.id}><ReviewCard r={r} /></li>
            ))}
          </ul>
        )}
        <div className="mt-8"><DiscordCard discord={discord} /></div>
        <Link href="/feedback" className="mt-8 inline-flex min-h-11 items-center gap-2 font-hud text-xs font-bold uppercase tracking-[0.22em] text-neon-cyan hover:text-ink">
          All feedback &amp; leave yours <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}
