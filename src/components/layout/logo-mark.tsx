import { cn } from "@/lib/utils";

/** Default mark (used until a logo is uploaded in /admin → Site): an angular Z with a slash. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)} fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="miter" strokeLinecap="square">
      <path d="M5 6h22L8 26h19" />
      <path d="M14 16h8" strokeWidth="2" opacity=".7" />
    </svg>
  );
}
