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
import {CandleShape, Level} from './sweepParts';
import {Header, Headline, W, H} from './sweepChrome';

const FONT = 'Inter, Arial, sans-serif';
const STEP0 = 90;
const STEPLEN = 140;
const RESULT = STEP0 + 5 * STEPLEN; // 790
const END = RESULT + 200; // 990
const DURATION = END + 190; // 1180

/* fade helper */
const op = (f: number, from: number, dur = 18) =>
  interpolate(f, [from, from + dur], [0, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

/* which step is active */
const stepActive = (f: number, s: number) =>
  f >= STEP0 + s * STEPLEN && f < STEP0 + (s + 1) * STEPLEN;

/* ---------------------------------------------------------------- */
/* Reason card                                                        */
/* ---------------------------------------------------------------- */
const Reason: React.FC<{
  step: number; from: number;
  title: string; body: string;
}> = ({step, from, title, body}) => {
  const f = useCurrentFrame();
  const fade = op(f, from);
  return (
    <div
      style={{
        position: 'absolute', top: 1250, left: 84, right: 84,
        opacity: fade,
      }}
    >
      <div
        style={{
          display: 'inline-block', padding: '12px 26px', borderRadius: 999,
          background: INK, color: '#fff', fontSize: 26, fontWeight: 900,
          marginBottom: 20,
        }}
      >
        STEP {step + 1} / 5
      </div>
      <div
        style={{
          fontSize: 76, fontWeight: 900, color: NAVY, lineHeight: 1.06,
          letterSpacing: -1,
        }}
      >
        {title}
      </div>
      <div
        style={{
          marginTop: 18, fontSize: 38, lineHeight: 1.48,
          color: '#3a4a66',
        }}
      >
        {body}
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Dots                                                               */
/* ---------------------------------------------------------------- */
const Dots: React.FC<{active: number}> = ({active}) => {
  const f = useCurrentFrame();
  const fade = op(f, STEP0);
  return (
    <div
      style={{
        position: 'absolute', bottom: 80, left: 0, right: 0,
        display: 'flex', justifyContent: 'center', gap: 14, opacity: fade,
      }}
    >
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          style={{
            width: active === i ? 44 : 12,
            height: 12,
            borderRadius: active === i ? 6 : 6,
            background: active === i ? BLUE : '#dbe3f0',
            transition: 'all 0.35s',
          }}
        />
      ))}
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* Chart card                                                         */
/* ---------------------------------------------------------------- */
const ChartCard: React.FC<{step: number}> = ({step}) => {
  const f = useCurrentFrame();

  /* camera zoom-out: frame 0-60 zoomed in, 60-150 zoomed out */
  const zoom = interpolate(f, [0, 60, 150], [1.65, 1.65, 1], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const ox = interpolate(f, [0, 60, 150], [72, 72, 50], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });
  const oy = interpolate(f, [0, 60, 150], [88, 88, 50], {
    extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
  });

  const showBox = (s: number) =>
    interpolate(f, [STEP0 + s * STEPLEN, STEP0 + s * STEPLEN + 12], [0, 1], {
      extrapolateLeft: 'clamp', extrapolateRight: 'clamp',
    });

  return (
    <div
      style={{
        position: 'absolute',
        left: 70, top: 430,
        width: 940, height: 780,
        borderRadius: 60,
        background: CARD,
        boxShadow: '0 24px 80px rgba(42,109,240,0.14)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: '100%', height: '100%',
          transformOrigin: `${ox}% ${oy}%`,
          transform: `scale(${zoom})`,
        }}
      >
        <svg width={1080} height={760} viewBox={`0 0 1080 760`}>
          <defs>
            <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={BLUE} stopOpacity="0.18" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* grid */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <line
              key={i}
              x1={0} y1={Y(PMIN + i * ((PMAX - PMIN) / 5))}
              x2={1080} y2={Y(PMIN + i * ((PMAX - PMIN) / 5))}
              stroke="#eef2f8" strokeWidth={1.8}
            />
          ))}

          {/* candles */}
          {CANDLES.map((c, i) => (
            <CandleShape
              key={i}
              c={c}
              i={i}
              hi={i === SWEEP_I}
            />
          ))}

          {/* area fill */}
          <path
            d={`${CANDLES.map((c, i) =>
              `${i === 0 ? 'M' : 'L'}${X(i)} ${Y(c.c)}`
            ).join(' ')} L ${X(39)} 760 L ${X(0)} 760 Z`}
            fill="url(#bg)"
          />

          {/* LIQUIDITY LEVEL — always visible after zoom out */}
          {step >= 0 && (
            <Level
              price={LIQ}
              label="LIQUIDITY"
              color={RED}
              from={8}
              to={SWEEP_I + 6}
              dash="16 10"
            />
          )}

          {/* SWEEP WICK annotation */}
          {step >= 1 && (
            <g>
              <line
                x1={X(SWEEP_I) - 30} y1={Y(SWEEP_LOW)}
                x2={X(SWEEP_I) + 30} y2={Y(SWEEP_LOW)}
                stroke={RED} strokeWidth={5} strokeLinecap="round"
                opacity={showBox(1)}
              />
              <text
                x={X(SWEEP_I) - 28} y={Y(SWEEP_LOW) - 14}
                fill={RED} fontSize={17} fontWeight={800}
                opacity={showBox(1)}
              >
                SWEEP
              </text>
            </g>
          )}

          {/* RECLAIM line */}
          {step >= 2 && (
            <Level
              price={LIQ + 4}
              label="RECLAIM"
              color={BLUE}
              from={SWEEP_I}
              to={39}
              dash="10 8"
            />
          )}

          {/* Entry / Stop / TP */}
          {step >= 3 && (
            <g opacity={showBox(3)}>
              {/* green zone: entry → TP */}
              <rect
                x={X(SWEEP_I)} y={Y(TARGET)}
                width={X(39) - X(SWEEP_I)}
                height={Y(ENTRY) - Y(TARGET)}
                fill="rgba(31,169,113,0.13)"
                stroke={GREEN} strokeWidth={2.4}
              />
              {/* red zone: entry → stop */}
              <rect
                x={X(SWEEP_I)} y={Y(STOP)}
                width={X(39) - X(SWEEP_I)}
                height={Y(ENTRY) - Y(STOP)}
                fill="rgba(229,72,77,0.13)"
                stroke={RED} strokeWidth={2.4}
              />
              {/* labels */}
              <text x={X(36)} y={Y(TARGET) + 22} fill={GREEN} fontSize={17} fontWeight={800}>
                TARGET 1:2
              </text>
              <text x={X(36)} y={Y(STOP) + 22} fill={RED} fontSize={17} fontWeight={800}>
                STOP
              </text>
              <text x={X(SWEEP_I) + 8} y={Y(ENTRY) - 12} fill={BLUE} fontSize={17} fontWeight={800}>
                BUY ENTRY
              </text>
            </g>
          )}

          {/* TP line */}
          {step >= 4 && (
            <Level price={TARGET} label={`TP ${TARGET}`} color={GREEN} from={0} to={39} />
          )}
        </svg>
      </div>
    </div>
  );
};

/* ---------------------------------------------------------------- */
/* End card                                                          */
/* ---------------------------------------------------------------- */
const EndCard: React.FC = () => (
  <div
    style={{
      position: 'absolute', inset: 0, background: NAVY, color: '#fff',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', textAlign: 'center', padding: '0 80px',
    }}
  >
    <div style={{fontSize: 108, fontWeight: 900, letterSpacing: -2}}>
      READY TO TRADE?
    </div>
    <div style={{fontSize: 60, color: BLUE, fontWeight: 900, marginTop: 30}}>
      FIRST $30 ON US
    </div>
    <div style={{marginTop: 60, fontSize: 36, color: '#9fb3d6', letterSpacing: 2}}>
      LINK IN BIO · LIMITED TIME ONLY
    </div>
    <div
      style={{
        position: 'absolute', bottom: 110, fontSize: 22, color: '#6f87b0',
        lineHeight: 1.6,
      }}
    >
      Charts are illustrative. Trading involves risk. Not financial advice.
    </div>
  </div>
);

/* ---------------------------------------------------------------- */
/* Main composition                                                   */
/* ---------------------------------------------------------------- */
export const LiquiditySweep: React.FC = () => {
  const frame = useCurrentFrame();

  const activeStep = Math.floor(
    Math.max(0, frame - STEP0) / STEPLEN
  );

  return (
    <AbsoluteFill style={{background: '#fff', fontFamily: FONT}}>
      {/* Header */}
      <Sequence from={0} durationInFrames={300}>
        <Header title="LIQUIDITY SWEEP" />
      </Sequence>

      {/* Headlines */}
      <Sequence from={0} durationInFrames={60}>
        <Headline from={0}>This is the <span style={{color: RED}}>trap.</span></Headline>
      </Sequence>
      <Sequence from={60} durationInFrames={90}>
        <Headline from={60}>The low gets <span style={{color: RED}}>taken.</span></Headline>
      </Sequence>
      <Sequence from={150} durationInFrames={60}>
        <Headline from={150}>How a <span style={{color: BLUE}}>sweep</span> works</Headline>
      </Sequence>

      {/* Chart card — always visible */}
      <ChartCard step={activeStep} />

      {/* Step reason cards */}
      {[
        {title: 'Equal lows build', body: 'The market keeps dipping to the same low. Buyers are defending it. That level is the liquidity pool.'},
        {title: 'Stops pile up', body: 'Every trader knows that low. Stops sit just underneath it. That is the fuel for the sweep.'},
        {title: 'The low breaks', body: 'Price spikes through the level, grabs the stops, and snaps right back. A wick — not a close. The level held.'},
        {title: 'Sellers are trapped', body: 'With the stops gone, the pressure flips. Price reclaims the level and keeps going.'},
        {title: 'Wait for the reclaim', body: 'Entry above the reclaim. Stop under the sweep wick. Target the other side of the range. Simple.'},
      ].map((s, i) => (
        <Sequence
          key={i}
          from={STEP0 + i * STEPLEN}
          durationInFrames={STEPLEN}
        >
          <Reason
            step={i}
            from={0}
            title={s.title}
            body={s.body}
          />
        </Sequence>
      ))}

      {/* Dots */}
      <Dots active={activeStep} />

      {/* End card */}
      <Sequence from={RESULT} durationInFrames={DURATION - RESULT}>
        <EndCard />
      </Sequence>
    </AbsoluteFill>
  );
};

export default LiquiditySweep;
