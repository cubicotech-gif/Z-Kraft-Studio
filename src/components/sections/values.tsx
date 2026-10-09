import { Eye, Layers, RefreshCw, Sparkles } from "lucide-react";

const VALUES = [
  { icon: Sparkles, title: "Built from your references", text: "No templates. Every piece starts from the characters, colours and art you already love." },
  { icon: Eye, title: "Readable at tiny sizes", text: "Emotes and badges are checked at their smallest size, because that is where chat sees them." },
  { icon: Layers, title: "Sets that match", text: "Emote packs, badges and panels share one style and palette, so your channel looks intentional." },
  { icon: RefreshCw, title: "Revisions included", text: "Every quest includes revision rounds, so the final result feels right to you." },
];

export function Values() {
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {VALUES.map(({ icon: Icon, title, text }) => (
        <li key={title} className="chamfer bg-void-800 p-6">
          <Icon className="size-7 text-neon-magenta" aria-hidden />
          <h3 className="mt-4 font-display text-lg font-extrabold">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-dim">{text}</p>
        </li>
      ))}
    </ul>
  );
}
