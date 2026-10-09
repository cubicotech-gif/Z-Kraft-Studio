/**
 * Imperative arrow engine. Dynamically imported on first interaction (or idle) so the
 * animation code is never part of the initial bundle. Arrows are plain DOM nodes inside
 * an aria-hidden, pointer-events:none layer, so they can never block a CTA.
 */
import { animate } from "motion/mini";

const MAX_ARROWS = 14;
const ARROW_W = 64;
const ARROW_H = 28;

const ARROW_SVG = `<svg viewBox="0 0 16 7" width="${ARROW_W}" height="${ARROW_H}" shape-rendering="crispEdges" xmlns="http://www.w3.org/2000/svg">
<g fill="#ff2bd6"><rect x="0" y="0" width="1" height="1"/><rect x="1" y="1" width="1" height="1"/><rect x="2" y="2" width="1" height="1"/><rect x="0" y="6" width="1" height="1"/><rect x="1" y="5" width="1" height="1"/><rect x="2" y="4" width="1" height="1"/></g>
<rect x="3" y="3" width="10" height="1" fill="#f2ecff"/>
<g fill="#22e6ff"><rect x="13" y="1" width="1" height="5"/><rect x="14" y="2" width="1" height="3"/><rect x="15" y="3" width="1" height="1"/></g>
</svg>`;

export type Fire = { layer: HTMLElement; shake: HTMLElement; x: number; y: number; reduced: boolean };

export function fireArrow({ layer, shake, x, y, reduced }: Fire) {
  const { width, height } = layer.getBoundingClientRect();

  // Launch from just below the arena, slightly off to a random side of the target.
  const sx = x + (Math.random() - 0.5) * Math.min(width, 520);
  const sy = height + 60;
  const angle = (Math.atan2(y - sy, x - sx) * 180) / Math.PI;

  const wrap = document.createElement("div");
  wrap.style.cssText = `position:absolute;left:${x}px;top:${y}px;width:0;height:0;`;
  const arrow = document.createElement("div");
  arrow.style.cssText = `position:absolute;left:${-ARROW_W}px;top:${-ARROW_H / 2}px;width:${ARROW_W}px;height:${ARROW_H}px;transform-origin:100% 50%;transform:rotate(${angle}deg);filter:drop-shadow(0 0 6px rgba(34,230,255,.7));`;
  arrow.innerHTML = ARROW_SVG;
  wrap.appendChild(arrow);
  layer.appendChild(wrap);

  // Cap the number of stuck arrows: fade out + drop the oldest.
  const live = Array.from(layer.children).filter((c) => !(c as HTMLElement).dataset.fading) as HTMLElement[];
  while (live.length > MAX_ARROWS) {
    const old = live.shift()!;
    old.dataset.fading = "1";
    animate(old, { opacity: [1, 0] }, { duration: 0.25 }).finished.then(() => old.remove());
  }

  const land = () => {
    if (!reduced) {
      animate(
        shake,
        {
          transform: [
            "translate(0px,0px)",
            "translate(-7px,4px)",
            "translate(6px,-5px)",
            "translate(-4px,3px)",
            "translate(2px,-1px)",
            "translate(0px,0px)",
          ],
        },
        { duration: 0.3, ease: "easeOut" },
      );
      // little wobble as the shaft settles
      animate(arrow, { transform: [`rotate(${angle - 5}deg)`, `rotate(${angle + 3}deg)`, `rotate(${angle}deg)`] }, { duration: 0.25 });
    }
  };

  if (reduced) {
    land();
    return Promise.resolve();
  }
  return animate(
    wrap,
    { translate: [`${sx - x}px ${sy - y}px`, "0px 0px"] },
    { duration: 0.2, ease: "easeIn" },
  ).finished.then(land);
}
