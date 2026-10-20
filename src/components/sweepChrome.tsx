import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';
import {
  BLUE, NAVY, INK, MUTED, GREEN, RED, CARD,
  CANDLES, X, Y, SWEEP_I, LIQ, SWEEP_LOW, ENTRY, STOP, TARGET,
} from './sweepData';
import {CandleShape, Level, cam, ease, FONT} from './sweepParts';

const W = 1080;
const H = 1920;

/* ---------------------------------------------------------------- */
/* Header                                                           */
/* ---------------------------------------------------------------- */
const Header: React.FC<{title: string}> = ({title}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', top: 96, left: 84, opacity: op}}>
      <div style={{fontSize: 38, fontWeight: 700, color: MUTED}}>@traderwatch</div>
      <div
        style={{
          marginTop: 20, display: 'inline-block', padding: '12px 26px',
          borderRadius: 999, background: BLUE, color: '#fff',
          fontSize: 26, fontWeight: 800, letterSpacing: 0.5,
        }}
      >
        {title}
      </div>
      <div style={{marginTop: 16, fontSize: 26, fontWeight: 700, color: '#9fb3d6'}}>
        XAUUSD · 1H · illustrative
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Big headline that swaps per beat                                 */
/* ---------------------------------------------------------------- */
const Headline: React.FC<{from: number; children: React.ReactNode; accent?: string}> = ({
  from, children, accent,
}) => {
  const f = useCurrentFrame();
  const op = interpolate(f, [from, from + 14], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ty = interpolate(f, [from, from + 14], [26, 0], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        position: 'absolute', top: 330, left: 84, right: 84, opacity: op,
        transform: `translateY(${ty}px)`,
        fontSize: 86, fontWeight: 900, color: NAVY, lineHeight: 1.06,
        letterSpacing: -1.5,
      }}
    >
      {children}
      {accent ? <span style={{color: accent}}>{accent}</span> : null}
    </div>
  );
};

export {Header, Headline, W, H};
