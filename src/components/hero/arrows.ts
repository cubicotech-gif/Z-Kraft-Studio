/**
 * Imperative arrow engine. Dynamically imported on first interaction (or idle) so the
 * animation code is never part of the initial bundle. Arrows are plain DOM nodes inside
 * an aria-hidden, pointer-events:none layer, so they can never block a CTA.
 */
import { animate } from "motion/mini";

const MAX_ARROWS = 14;
const ARROW_W = 84;
const ARROW_H = 18;

// Sleek vector bolt: magenta vanes, light shaft, cyan head. Tip sits on the right edge.
const ARROW_SVG = `<svg viewBox="0 0 84 18" width="${ARROW_W}" height="${ARROW_H}" xmlns="http://www.w3.org/2000/svg">
<path d="M0 2h9l6 7-6 7H0l6-7z" fill="#ff2bd6"/><path d="M11 3h6l5 6-5 6h-6l5-6z" fill="#ff2bd6" opacity=".6"/>
<path d="M14 9h54" stroke="#f2ecff" stroke-width="2.5" stroke-linecap="round"/>
<path d="M66 2l18 7-18 7 4-7z" fill="#22e6ff"/>
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
  arrow.style.cssText = `position:absolute;left:${-ARROW_W}px;top:${-ARROW_H / 2}px;width:${ARROW_W}px;height:${ARROW_H}px;transform-origin:100% 50%;transform:rotate(${angle}deg);filter:drop-shadow(0 0 5px rgba(34,230,255,.8));`;
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
