export const W = 1080;
export const H = 1920;
export const BLUE = '#2a6df0';
export const NAVY = '#07122a';
export const INK = '#0b1b3a';
export const MUTED = '#7a869a';
export const GREEN = '#1fa971';
export const RED = '#e5484d';
export const CARD = '#f3f7ff';

/* synthetic, illustrative price path — never real market data */
export const PMIN = 2615;
export const PMAX = 2710;

export const CLOSES = [
  2652, 2649, 2647, 2646, 2648, 2651, 2656, 2660, 2664, 2662,
  2658, 2654, 2650, 2646, 2643, 2644, 2647, 2650, 2654, 2658,
  2656, 2652, 2649, 2647, 2650, 2654, 2648, 2652, 2658, 2664,
  2668, 2665, 2670, 2674, 2676, 2672, 2678, 2674, 2676, 2680,
];

export const SWEEP_I = 26;
export const LIQ = 2642;
export const SWEEP_LOW = 2626;
export const ENTRY = 2650;
export const STOP = 2624;
export const TARGET = 2702;

export type Candle = {o: number; h: number; l: number; c: number};

const rnd = (i: number, seed: number) =>
  Math.abs((Math.sin(i * 12.9898 + seed) * 43758.5453) % 1);

export const CANDLES: Candle[] = CLOSES.map((c, i) => {
  const o = i === 0 ? c + 1.5 : CLOSES[i - 1];
  let h = Math.max(o, c) + rnd(i, 1.7) * 3.2;
  let l = Math.min(o, c) - rnd(i, 9.3) * 3.2;
  if (i === SWEEP_I) {
    l = SWEEP_LOW;
    h = Math.max(o, c) + 1.6;
  }
  return {o, h, l, c};
});

export const X = (i: number) => 40 + i * 20;
export const Y = (p: number) => 700 - ((p - PMIN) / (PMAX - PMIN)) * 660;
export const CW = 11;
