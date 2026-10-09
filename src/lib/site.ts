import { TIERS, type Faq } from "./services";

export type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };

export const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", children: TIERS.map((t) => ({ label: t.name, href: `/services/${t.slug}` })) },
  { label: "Portfolio", href: "/portfolio" },
  { label: "How it works", href: "/how-it-works" },
  { label: "About", href: "/about" },
];

/** TODO(owner): placeholder studio-wide FAQ. Replace with real policies and terms. */
export const SITE_FAQS: Faq[] = [
  { q: "How does ordering work?", a: "Pick a quest type, upload any inspiration, describe your idea and leave your contact details. We read it, then email you to confirm the details and next steps." },
  { q: "Do I need an account?", a: "No. The whole order takes four short steps and no sign-up." },
  { q: "How and when do I pay?", a: "We confirm the price and payment method by email before any work starts, so there are no surprises." },
  { q: "How long will my order take?", a: "Timelines depend on the quest type and our current queue. We will tell you the expected delivery when we confirm your order." },
  { q: "What if I want changes?", a: "Every quest includes revision rounds (see each service page). Tell us what to adjust and we will refine it." },
  { q: "Can I use the art commercially?", a: "Usage terms are confirmed in your order confirmation. If you have a specific use in mind, such as merch, mention it in your order notes." },
  { q: "Which file formats do I get?", a: "Transparent PNGs in platform-ready sizes for emotes, badges and panels, and high-resolution files for illustrations." },
];

export const HOW_STEPS = [
  { title: "Choose your quest", text: "Single emote, emote pack, badges and panels, or a full illustration." },
  { title: "Share your inspiration", text: "Upload references and tell us about your character, channel and style." },
  { title: "We craft it", text: "We turn your references into concepts, then polish what you approve." },
  { title: "Collect your loot", text: "Final files arrive ready to upload, with revisions to fine-tune." },
];
