import { getSite } from "@/lib/site-data";
import { PressStart } from "./press-start";

/** Server wrapper: hands the uploaded logo (if any) to the client loading screen. */
export async function IntroLoader() {
  const { slots } = await getSite();
  return <PressStart logo={slots.logo?.src} />;
}
