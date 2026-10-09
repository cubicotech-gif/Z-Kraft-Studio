import { SiteHeader } from "@/components/layout/site-header";
import { Hero } from "@/components/hero/hero";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <Hero />
      </main>
    </>
  );
}
