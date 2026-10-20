import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import {
  BLUE, NAVY, INK, MUTED, GREEN, RED, CARD,
  CANDLES, X, Y, CW, SWEEP_I, LIQ, SWEEP_LOW, ENTRY, STOP, TARGET,
  PMIN, PMAX, type Candle,
} from './sweepData';

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

const FONT = 'Inter, Arial, sans-serif';

/* ---------------------------------------------------------------- */
/* Camera: animates the SVG viewBox so the chart pans and zooms.    */
/* ---------------------------------------------------------------- */
const cam = (frame: number, from: number, to: number) => {
  const t = ease(interpolate(frame, [from, to], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  }));
  // wide  ->  tight on the sweep
  const x = 0 + (X(SWEEP_I) - 210 - 0) * t;
  const y = 0 + (Y(SWEEP_LOW) - 150 - 0) * t;
  const w = 1080 + (430 - 1080) * t;
  const h = 760 + (300 - 760) * t;
  return `${x.toFixed(1)} ${y.toFixed(1)} ${w.toFixed(1)} ${h.toFixed(1)}`;
};

/* ---------------------------------------------------------------- */
/* A single candle, wick + body                                     */
/* ---------------------------------------------------------------- */
const CandleShape: React.FC<{c: Candle; i: number; hi?: boolean}> = ({c, i, hi}) => {
  const up = c.c >= c.o;
  const col = hi ? BLUE : up ? GREEN : RED;
  const top = Y(Math.max(c.o, c.c));
  const bot = Y(Math.min(c.o, c.c));
  const bodyH = Math.max(3, bot - top);
  return (
    <g>
      <line
        x1={X(i)} y1={Y(c.h)} x2={X(i)} y2={Y(c.l)}
        stroke={col} strokeWidth={2.4} strokeLinecap="round"
      />
      <rect
        x={X(i) - CW / 2} y={top} width={CW} height={bodyH}
        rx={2} fill={col} opacity={up ? 1 : 0.92}
      />
    </g>
  );
};

/* ---------------------------------------------------------------- */
/* Level line + label                                               */
/* ---------------------------------------------------------------- */
const Level: React.FC<{
  price: number; label: string; color: string;
  from?: number; to?: number; dash?: string;
}> = ({price, label, color, from = 0, to = 39, dash = '14 10'}) => (
  <g>
    <line
      x1={X(from)} y1={Y(price)} x2={X(to)} y2={Y(price)}
      stroke={color} strokeWidth={3} strokeDasharray={dash} opacity={0.9}
    />
    <text
      x={X(to) + 8} y={Y(price) + 7}
      fill={color} fontSize={17} fontWeight={800}
    >
      {label}
    </text>
  </g>
);

export { CandleShape, Level, cam, ease, FONT };
export const W = 1080;
export const H = 1920;
