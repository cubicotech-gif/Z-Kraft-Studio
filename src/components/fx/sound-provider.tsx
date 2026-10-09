"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";

export type Sfx = "click" | "lever" | "levelup" | "hit";

type SoundCtx = {
  muted: boolean;
  toggle: () => void;
  play: (sfx: Sfx) => void;
};

const Ctx = createContext<SoundCtx>({ muted: true, toggle: () => {}, play: () => {} });
export const useSound = () => useContext(Ctx);

const STORE_KEY = "zk-sound";

/** Tiny square-wave synth: no audio files to download, so zero payload. */
const SFX: Record<Sfx, Array<[freq: number, start: number, dur: number]>> = {
  click: [[880, 0, 0.05], [1320, 0.04, 0.06]],
  lever: [[220, 0, 0.1], [147, 0.08, 0.16]],
  levelup: [[523, 0, 0.09], [659, 0.09, 0.09], [784, 0.18, 0.09], [1047, 0.27, 0.22]],
  hit: [[110, 0, 0.07], [70, 0.04, 0.1]],
};

// Preference store: server + first client render say "muted", then the saved choice applies.
const listeners = new Set<() => void>();
let memOn: boolean | null = null; // fallback when storage is blocked
const readOn = () => {
  if (memOn !== null) return memOn;
  try {
    return localStorage.getItem(STORE_KEY) === "on";
  } catch {
    return false;
  }
};
const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => void listeners.delete(cb);
};

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const on = useSyncExternalStore(subscribe, readOn, () => false);
  const muted = !on;
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(true);
  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const play = useCallback((sfx: Sfx) => {
    if (mutedRef.current) return;
    try {
      const ac = (ctxRef.current ??= new AudioContext());
      if (ac.state === "suspended") void ac.resume();
      const t0 = ac.currentTime;
      for (const [freq, start, dur] of SFX[sfx]) {
        const osc = ac.createOscillator();
        const gain = ac.createGain();
        osc.type = "square";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, t0 + start);
        gain.gain.exponentialRampToValueAtTime(0.06, t0 + start + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
        osc.connect(gain).connect(ac.destination);
        osc.start(t0 + start);
        osc.stop(t0 + start + dur + 0.02);
      }
    } catch {}
  }, []);

  const toggle = useCallback(() => {
    const next = readOn() ? "off" : "on";
    memOn = next === "on";
    try {
      localStorage.setItem(STORE_KEY, next);
    } catch {}
    mutedRef.current = next === "off";
    listeners.forEach((l) => l());
    if (next === "on") play("levelup"); // audible confirmation (also unlocks audio on iOS)
  }, [play]);

  const value = useMemo(() => ({ muted, toggle, play }), [muted, toggle, play]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
