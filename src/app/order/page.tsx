import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CONTACT } from "@/lib/contact";
import { OrderForm } from "@/components/quest/order-form";

export const metadata: Metadata = {
  title: "Start your quest",
  description: "Order custom emotes, sub badges, stream panels or a character illustration in four quick steps. No account needed.",
};

export default function OrderPage() {
  return (
    <main>
      <PageHeader kicker="ZONE 03 · QUEST LOG" title="Start your quest" crumbs={[{ label: "Home", href: "/" }, { label: "Order" }]}>
        Four quick steps, no account needed. Tell us what you want and we&apos;ll take it from there.
      </PageHeader>
      <section className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-2xl">
          {/* useSearchParams (for ?tier=) needs a Suspense boundary to keep the page static */}
          <Suspense fallback={<div className="min-h-[28rem] border border-void-700 bg-void-900" aria-hidden />}>
            <OrderForm />
          </Suspense>
          <p className="mt-8 text-sm text-ink-dim">
            Prefer to talk first? Message us on{" "}
            <a href={CONTACT.whatsappHref} target="_blank" rel="noopener noreferrer" className="text-neon-cyan underline underline-offset-4 hover:text-ink">WhatsApp</a>
            , call{" "}
            <a href={CONTACT.phoneHref} className="text-neon-cyan underline underline-offset-4 hover:text-ink">{CONTACT.phoneDisplay}</a>
            {" "}or email{" "}
            <a href={`mailto:${CONTACT.email}`} className="text-neon-cyan underline underline-offset-4 hover:text-ink">{CONTACT.email}</a>.
          </p>
        </div>
      </section>
    </main>
  );
}
