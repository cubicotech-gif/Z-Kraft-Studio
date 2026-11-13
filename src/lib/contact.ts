/** Studio contact details. Change them here and every page (footer, /contact, order page) updates. */
export const CONTACT = {
  phoneDisplay: "+1 346 772 7552",
  phoneHref: "tel:+13467727552",
  /** Same number is on WhatsApp. */
  whatsappHref: `https://wa.me/13467727552?text=${encodeURIComponent("Hi Z Kraft Studio, I'd like to start a quest.")}`,
  email: "info@zkraftstudio.com",
  street: "17965 SW I st Street",
  city: "Pembroke Pines",
  region: "FL",
  postal: "33029",
} as const;

export const ADDRESS_LINE = `${CONTACT.street}, ${CONTACT.city}, ${CONTACT.region} ${CONTACT.postal}`;
export const MAPS_HREF = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS_LINE)}`;
