import { Suspense } from "react";
import { getSite } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { LogoMark } from "./logo-mark";

function BrandInner({ logo, className }: { logo?: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      {logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={logo} alt="" height={32} className="h-8 w-auto max-w-24 object-contain" />
      ) : (
        <LogoMark className="text-neon-magenta" />
      )}
      <span className="whitespace-nowrap font-display text-sm font-extrabold uppercase tracking-[0.12em] sm:text-base">
        Z Kraft<span className="text-neon-magenta">.</span>
      </span>
    </span>
  );
}

async function BrandLoaded({ className }: { className?: string }) {
  const { slots } = await getSite();
  return <BrandInner logo={slots.logo?.src} className={className} />;
}

/** Logo + wordmark. Uses the uploaded logo when there is one. */
export function Brand({ className }: { className?: string }) {
  return (
    <Suspense fallback={<BrandInner className={className} />}>
      <BrandLoaded className={className} />
    </Suspense>
  );
}
