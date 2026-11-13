import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { ADDRESS_LINE, CONTACT, MAPS_HREF } from "@/lib/contact";

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

/** Compact list for the footer. Every row is a real link (tap to call, chat, mail or open the map). */
export function ContactList({ linkClass }: { linkClass: string }) {
  return (
    <ul className="mt-3">
      <li>
        <a href={CONTACT.phoneHref} className={linkClass}>
          <Phone className="mr-2 size-4 shrink-0 text-neon-cyan" aria-hidden />
          {CONTACT.phoneDisplay}
        </a>
      </li>
      <li>
        <a href={CONTACT.whatsappHref} {...ext} className={linkClass}>
          <MessageCircle className="mr-2 size-4 shrink-0 text-neon-cyan" aria-hidden />
          WhatsApp
        </a>
      </li>
      <li>
        <a href={`mailto:${CONTACT.email}`} className={linkClass}>
          <Mail className="mr-2 size-4 shrink-0 text-neon-cyan" aria-hidden />
          {CONTACT.email}
        </a>
      </li>
      <li>
        <a href={MAPS_HREF} {...ext} className={linkClass + " !items-start py-1.5"}>
          <MapPin className="mr-2 mt-0.5 size-4 shrink-0 text-neon-cyan" aria-hidden />
          <span>
            {CONTACT.street}
            <br />
            {CONTACT.city}, {CONTACT.region} {CONTACT.postal}
          </span>
        </a>
      </li>
    </ul>
  );
}

const card = "chamfer block h-full bg-void-700 p-px transition-[filter] hover:brightness-125";

/** Four big contact cards for the /contact page. */
export function ContactCards() {
  const items = [
    { icon: Phone, title: "Call us", value: CONTACT.phoneDisplay, href: CONTACT.phoneHref, note: "Tap to call from your phone." },
    { icon: MessageCircle, title: "WhatsApp", value: CONTACT.phoneDisplay, href: CONTACT.whatsappHref, note: "Same number. Message us any time.", external: true },
    { icon: Mail, title: "Email", value: CONTACT.email, href: `mailto:${CONTACT.email}`, note: "Send references and details." },
    { icon: MapPin, title: "Studio address", value: ADDRESS_LINE, href: MAPS_HREF, note: "Open in Maps.", external: true },
  ];
  return (
    <ul className="grid gap-4 sm:grid-cols-2">
      {items.map(({ icon: Icon, title, value, href, note, external }) => (
        <li key={title}>
          <a href={href} {...(external ? ext : {})} className={card}>
            <span className="chamfer flex h-full flex-col gap-3 bg-void-900 p-5">
              <Icon className="size-6 text-neon-magenta" aria-hidden />
              <span className="font-hud text-xs font-bold uppercase tracking-[0.25em] text-neon-lime">{title}</span>
              <span className="break-words font-display text-lg font-bold leading-snug">{value}</span>
              <span className="text-sm text-ink-dim">{note}</span>
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
