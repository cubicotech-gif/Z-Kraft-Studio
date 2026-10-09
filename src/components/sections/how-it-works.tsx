import { Brush, Gamepad2, ImagePlus, PackageCheck } from "lucide-react";
import { HOW_STEPS } from "@/lib/site";

const ICONS = [Gamepad2, ImagePlus, Brush, PackageCheck];

/** The 4-step quest, as a numbered grid. Mirrors the order form's steps. */
export function HowItWorksSteps() {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {HOW_STEPS.map((s, i) => {
        const Icon = ICONS[i];
        return (
          <li key={s.title} className="relative border border-void-600 bg-void-900 p-6">
            <span aria-hidden className="absolute right-4 top-3 font-display text-5xl font-extrabold text-void-700">
              {i + 1}
            </span>
            <Icon className="size-7 text-neon-cyan" aria-hidden />
            <h3 className="mt-4 font-display text-xl font-extrabold">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-dim">{s.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
