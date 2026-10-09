/**
 * The four services, shown as loot rarities. One entry drives the home overview, the
 * /services index, each /services/<slug> page, the order form and the portfolio pairing.
 *
 * TODO(owner): ALL PRICES, DELIVERABLES, SPECS AND POLICY COPY BELOW ARE PLACEHOLDERS.
 * Replace with the studio's real numbers and terms before launch.
 * `id` doubles as the `?tier=` value the order form reads.
 */
export type Faq = { q: string; a: string };

export type Tier = {
  id: "common" | "rare" | "epic" | "legendary";
  slug: string;
  rarity: string;
  name: string;
  tagline: string;
  priceFrom: number;
  /** One-line bullets for cards. */
  includes: string[];
  /** Service page */
  intro: string;
  perfectFor: string[];
  deliverables: string[];
  specs: { label: string; value: string }[];
  steps: { title: string; text: string }[];
  faqs: Faq[];
};

const refsQ: Faq = {
  q: "Can I send reference images?",
  a: "Yes, and we encourage it. The order form lets you upload up to five images (characters, colours, art you love) and write a description alongside them.",
};

export const TIERS: Tier[] = [
  {
    id: "common",
    slug: "single-emote",
    rarity: "Common",
    name: "Single Emote",
    tagline: "One custom emote, made from your idea.",
    priceFrom: 12,
    includes: ["1 custom emote", "Twitch / Discord-ready sizes", "Transparent PNG files", "1 revision"],
    intro:
      "The fastest way to get something that is unmistakably yours: one emote designed around a chat in-joke, a catchphrase or your own face, drawn to stay readable at tiny sizes.",
    perfectFor: ["A chat meme or catchphrase that needs a face", "Trying the studio before commissioning a full set", "Filling one missing reaction in your lineup"],
    deliverables: ["1 custom emote, designed from your brief", "Transparent PNGs in platform-ready sizes", "Original high-resolution file", "1 revision round"],
    specs: [
      { label: "Format", value: "Transparent PNG" },
      { label: "Sizes", value: "Platform-ready (e.g. 112, 56 and 28 px)" },
      { label: "Revisions", value: "1 round" },
      { label: "Best for", value: "Twitch, Discord, YouTube" },
    ],
    steps: [
      { title: "Send the idea", text: "Describe the emote and add any reference images." },
      { title: "We sketch", text: "You see a rough concept before we polish anything." },
      { title: "Polish & revise", text: "We refine the line, colour and readability at small sizes." },
      { title: "Loot delivered", text: "Final files in every size, ready to upload." },
    ],
    faqs: [
      refsQ,
      { q: "Can the emote be animated?", a: "Single Emote is a static design by default. If you want animation, mention it in your order notes and we will confirm what is possible." },
      { q: "What if it does not read well in chat?", a: "Emotes are checked at their smallest size before delivery, and your revision round is there to fine-tune anything that is not landing." },
    ],
  },
  {
    id: "rare",
    slug: "emote-pack",
    rarity: "Rare",
    name: "Emote Pack",
    tagline: "A matching set that reads clearly in chat.",
    priceFrom: 45,
    includes: ["5 custom emotes", "One consistent style", "All platform sizes", "2 revisions"],
    intro:
      "A full reaction set in one cohesive style: the hype, the rage, the shock, the GG. Designed together so your chat feels like one brand instead of a patchwork.",
    perfectFor: ["New channels building their first emote lineup", "Affiliates getting ready for more sub slots", "Refreshing a mismatched set with one consistent look"],
    deliverables: ["5 custom emotes in one consistent style", "Transparent PNGs in all platform sizes", "Original high-resolution files", "2 revision rounds across the set"],
    specs: [
      { label: "Format", value: "Transparent PNG" },
      { label: "Quantity", value: "5 emotes" },
      { label: "Sizes", value: "Platform-ready for each emote" },
      { label: "Revisions", value: "2 rounds" },
    ],
    steps: [
      { title: "Pick your five", text: "Tell us the reactions you need and your channel's vibe." },
      { title: "Style test", text: "We lock the look on one emote first, so the set stays consistent." },
      { title: "Build the set", text: "The remaining emotes follow in the approved style." },
      { title: "Loot delivered", text: "Every emote, every size, ready to upload." },
    ],
    faqs: [
      refsQ,
      { q: "Can I choose which five emotes?", a: "Yes. List the reactions you want in your description; if you are unsure, we can suggest a mix that works well in chat." },
      { q: "Can I add more than five later?", a: "Absolutely. Order a Single Emote in the same style whenever your set needs to grow." },
    ],
  },
  {
    id: "epic",
    slug: "badges-and-panels",
    rarity: "Epic",
    name: "Badges + Panels",
    tagline: "Sub badges and stream panels, one theme.",
    priceFrom: 90,
    includes: ["Sub badge set", "3 stream panels", "Matching colour theme", "2 revisions"],
    intro:
      "Give your whole channel page a look: loyalty badges for your subscribers plus stream panels that match, built on one colour theme so everything feels intentional.",
    perfectFor: ["Channels leveling up from a default page", "Partners with sub tiers to reward", "A rebrand that needs everything to match at once"],
    deliverables: ["Sub badge set in required sizes", "3 stream panels (e.g. About, Schedule, Rules)", "Matching colour theme across all pieces", "2 revision rounds"],
    specs: [
      { label: "Badges", value: "Set sized for the platform's badge slots" },
      { label: "Panels", value: "3, sized for the channel page" },
      { label: "Format", value: "PNG (transparent where needed)" },
      { label: "Revisions", value: "2 rounds" },
    ],
    steps: [
      { title: "Share your brand", text: "Colours, logo, tone: whatever already represents the channel." },
      { title: "Theme first", text: "We propose one palette and style for badges and panels together." },
      { title: "Build the pieces", text: "Badges and panels are made to match, then revised once approved." },
      { title: "Loot delivered", text: "Everything sized and named, ready to upload to your channel." },
    ],
    faqs: [
      refsQ,
      { q: "Which panels do I get?", a: "Three panels of your choice, commonly About, Schedule and Rules. Tell us what you need in the description." },
      { q: "How many badge tiers are included?", a: "The set covers your platform's subscriber badge tiers; the exact number is confirmed when we review your order." },
    ],
  },
  {
    id: "legendary",
    slug: "full-illustration",
    rarity: "Legendary",
    name: "Full Illustration",
    tagline: "A one-of-a-kind character illustration.",
    priceFrom: 180,
    includes: ["1 detailed character illustration", "Built from your references", "High-res files", "3 revisions"],
    intro:
      "Your character, fully realised. A detailed illustration built from your own references and lore, for banners, overlays, merch ideas or simply a piece you are proud of.",
    perfectFor: ["Your persona, OC or VTuber-style character", "Channel banners, offline screens and overlays", "A hero piece your whole brand can build on"],
    deliverables: ["1 detailed character illustration", "High-resolution final file", "Transparent-background version where applicable", "3 revision rounds across sketch and colour"],
    specs: [
      { label: "Format", value: "High-res PNG" },
      { label: "Scope", value: "1 character, detailed" },
      { label: "Process", value: "Sketch, colour, polish" },
      { label: "Revisions", value: "3 rounds" },
    ],
    steps: [
      { title: "Tell us the lore", text: "Character details, outfit, mood, colours, plus all your references." },
      { title: "Sketch approval", text: "You approve the pose and composition before colour begins." },
      { title: "Colour & render", text: "Full rendering with your palette, lighting and effects." },
      { title: "Loot delivered", text: "High-res files ready for overlays, banners and more." },
    ],
    faqs: [
      refsQ,
      { q: "Can you draw my existing character?", a: "Yes. Upload your reference sheet and describe anything the references do not show; the illustration is built from them." },
      { q: "What are the usage terms?", a: "Usage rights are confirmed in your order confirmation email before work starts. Ask about anything specific, such as merch, in your notes." },
    ],
  },
];

export const tierBySlug = (slug: string) => TIERS.find((t) => t.slug === slug);
