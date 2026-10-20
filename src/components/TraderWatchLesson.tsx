import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  Sequence,
  useCurrentFrame,
} from 'remotion';

const W = 1080;
const H = 1920;
const BLUE = '#2a6df0';
const NAVY = '#07122a';
const INK = '#0b1b3a';
const MUTED = '#7a869a';
const GREEN = '#1fa971';
const RED = '#e5484d';

/* ------------------------------------------------------------------ */
/* Synthetic price data — illustrative only, never real market data    */
/* ------------------------------------------------------------------ */
const PX: [number, number][] = [
  [0, 2622], [6, 2648], [12, 2632], [18, 2686], [24, 2660],
  [30, 2748], [36, 2712], [42, 2672], [48, 2646], [54, 2652],
  [58, 2646], [64, 2612], [70, 2576],
];

const svgX = (i: number) => 60 + i * (960 / 70);
const svgY = (p: number) =>
  1240 - ((p - 2560) / (2760 - 2560)) * 980;

function priceAt(i: number): number {
  let a = 0;
  while (a + 1 < PX.length - 1 && PX[a + 1][0] < i) a++;
  const [x1, y1] = PX[a];
  const [x2, y2] = PX[a + 1];
  const t = (i - x1) / (x2 - x1 || 1);
  return y1 + (y2 - y1) * t;
}

const linePath = (a: number, b: number) => {
  let d = '';
  for (let i = a; i <= b; i++) {
    d += `${i === 0 ? 'M' : 'L'} ${svgX(i)} ${svgY(priceAt(i))} `;
    if (i === 0 && a > 0) d = `M ${svgX(a)} ${svgY(priceAt(a))} `;
  }
  return d;
};

/* ------------------------------------------------------------------ */
/* Header (constant across the video)                                  */
/* ------------------------------------------------------------------ */
const Header: React.FC<{fadeAt: number}> = ({fadeAt}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [fadeAt, fadeAt + 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div style={{position: 'absolute', top: 110, left: 90, opacity: op}}>
      <div style={{fontSize: 40, fontWeight: 800, color: MUTED}}>@traderwatch</div>
      <div style={{fontSize: 26, fontWeight: 700, color: '#9fb3d6', marginTop: 10}}>
        BOS · Break of Structure {` `}
        <span style={{color: MUTED}}>|</span> XAUUSD 1H
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Chart card                                                          */
/* ------------------------------------------------------------------ */
const Step1MarkHigh: React.FC = () => (
  <Sequence from={30} durationInFrames={150}>
    <div
      style={{
        position: 'absolute', left: 70, top: 420, width: 940, height: 820,
        borderRadius: 60, background: '#f3f7ff', padding: 40, boxSizing: 'border-box',
      }}
    >
      <svg width={860} height={740} viewBox="0 0 860 740">
        <defs>
          <linearGradient id="bg" x1="0" y1="1" x2="0" y2="0">
            <stop offset="0" stopColor={BLUE} stopOpacity="0.18" />
            <stop offset="1" stopColor={BLUE} stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0, 1, 2, 3, 4, 5].map((v) => {
          void v;
          return null;
        })}
        {/* full history line */}
        <path d={linePath(0, 70)} fill="none" stroke={BLUE} strokeWidth={10} strokeLinecap="round" />
        <path d={linePath(0, 46)} stroke={GREEN} strokeWidth={10} fill="none" strokeLinecap="round" />
        <path d={`${linePath(0, 42)} L ${svgX(42)} 700 L ${svgX(0)} 700 Z`} fill="url(#bg)" />
      </svg>
    </div>
  </Sequence>
);

/* ------------------------------------------------------------------ */
/* Reason card + dots                                                  */
/* ------------------------------------------------------------------ */
const StepReason: React.FC<{step: number; from: number; title: string; body: string}> = ({
  step, from, title, body,
}) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [from, from + 12], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const bg = !!step ? GREEN : BLUE;
  void bg;
  return (
    <div style={{position: 'absolute', top: 1330, left: 90, right: 90, opacity: op}}>
      <div
        style={{
          display: 'inline-block', padding: '14px 28px', borderRadius: 999,
          background: INK, color: '#fff', fontSize: 26, fontWeight: 900,
        }}
      >
        STEP {step + 1} / 5
      </div>
      <div style={{fontSize: 74, fontWeight: 900, marginTop: 30, color: NAVY, lineHeight: 1.1}}>
        {title}
      </div>
      <div style={{fontSize: 38, lineHeight: 1.45, color: '#3a4a66', marginTop: 20}}>
        {body}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Main composition                                                    */
/* ------------------------------------------------------------------ */
export const TraderWatchLesson: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: 'Inter, Arial, sans-serif'}}>
      <Header fadeAt={5} />

      {/* Chart card (always visible) */}
      <div
        style={{
          position: 'absolute', left: 70, top: 420, width: 940, height: 820,
          borderRadius: 60, background: '#f3f7ff', overflow: 'hidden',
          boxShadow: '0 24px 80px rgba(42,109,240,0.14)',
        }}
      >
        <svg width={940} height={820} viewBox="0 0 940 820">
          <defs>
            <linearGradient id="bg" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={BLUE} stopOpacity="0.2" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* price history line */}
          <path d={linePath(0, 70)} fill="none" stroke={BLUE} strokeWidth={10} strokeLinecap="round" />
          <path d={`${linePath(0, 42)} L ${svgX(42)} 780 L ${svgX(0)} 780 Z`} fill="url(#bg)" />
        </svg>
      </div>

      {/* Steps */}
      <Sequence from={30} durationInFrames={150}>
        <StepReason
          step={0}
          from={0}
          title="Mark the swing high"
          body="Price rallies, then pulls back. That peak is the reference."
        />
      </Sequence>
      <Sequence from={160} durationInFrames={150}>
        <StepReason
          step={1}
          from={0}
          title="Hold the low"
          body="The pullback holds above the previous low. Buyers keep control."
        />
      </Sequence>
      <Sequence from={290} durationInFrames={150}>
        <StepReason
          step={2}
          from={0}
          title="The break"
          body="A candle closes above the reference. Structure has continued."
        />
      </Sequence>
      <Sequence from={420} durationInFrames={150}>
        <StepReason
          step={3}
          from={0}
          title="The retest"
          body="Price returns to the broken level. Old resistance, new support."
        />
      </Sequence>
      <Sequence from={550} durationInFrames={150}>
        <StepReason
          step={4}
          from={0}
          title="Read the close"
          body="A wick is not enough — the close confirms the step."
        />
      </Sequence>

      {/* End CTA */}
      <Sequence from={700} durationInFrames={240}>
        <div
          style={{
            position: 'absolute', inset: 0, background: NAVY, color: '#fff',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', textAlign: 'center',
          }}
        >
          <div style={{fontSize: 92, fontWeight: 900}}>
            READY TO TRADE?
          </div>
          <div style={{fontSize: 54, color: BLUE, fontWeight: 900, marginTop: 30}}>
            FIRST $30 ON US
          </div>
          <div style={{fontSize: 32, color: '#9fb3d6', marginTop: 30}}>
            LINK IN BIO · LIMITED TIME ONLY
          </div>
          <div
            style={{
              position: 'absolute', bottom: 120, padding: '0 60px',
              fontSize: 24, color: '#6f87b0', lineHeight: 1.6,
            }}
          >
            Charts are illustrative. Trading involves risk. Not financial advice.
          </div>
        </div>
      </Sequence>
    </AbsoluteFill>
  );
};