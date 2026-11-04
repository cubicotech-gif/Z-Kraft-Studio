import { Star } from "lucide-react";

export function Stars({ value, className = "size-4" }: { value: number; className?: string }) {
  return (
    <span role="img" aria-label={`${value} out of 5 stars`} className="inline-flex gap-0.5 text-neon-amber">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} aria-hidden className={`${className} ${n <= value ? "fill-current" : "opacity-25"}`} />
      ))}
    </span>
  );
}
