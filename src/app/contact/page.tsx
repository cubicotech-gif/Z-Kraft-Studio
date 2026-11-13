import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Section } from "@/components/sections/section";
import { CtaBand } from "@/components/sections/cta-band";
import { ContactCards } from "@/components/contact/contact-links";
import { DiscordCard } from "@/components/feedback/discord-card";
import { getFeedback } from "@/lib/feedback-data";
import { CONTACT } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Call, WhatsApp, email or message Z Kraft Studio on Discord. Pembroke Pines, Florida.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Z Kraft Studio",
  description: "Custom emotes, sub badges, stream panels and character illustrations for gamers and streamers.",
  telephone: CONTACT.phoneHref.replace("tel:", ""),
  email: CONTACT.email,
  address: { "@type": "PostalAddress", streetAddress: CONTACT.street, addressLocality: CONTACT.city, addressRegion: CONTACT.region, postalCode: CONTACT.postal, addressCountry: "US" },
};

async function Discord() {
  const { discord } = await getFeedback();
  return <DiscordCard discord={discord} />;
}

export default function ContactPage() {
  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHeader kicker="ZONE 06 · SAY HELLO" title="Contact" crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}>
        Questions before you start a quest? Reach us the way that suits you.
      </PageHeader>
      <Section bordered={false} className="!pt-10">
        <ContactCards />
        <div className="mt-10">
          <Suspense fallback={null}>
            <Discord />
          </Suspense>
        </div>
      </Section>
      <CtaBand />
    </main>
  );
}
