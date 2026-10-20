import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

const W = 1920;
const H = 1080;

/* TraderWatch brand tokens (from app.css) */
const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const RED = '#c65349';
const GOLD = '#d89c1d';

/* ------------------------------------------------------------------ */
/* Synthetic XAU/USD path — illustrative only, never real market data  */
/* ------------------------------------------------------------------ */
const PX: [number, number][] = [
  [0, 3380], [5, 3402], [10, 3391], [15, 3425], [20, 3412],
  [25, 3441], [30, 3428], [35, 3396], [40, 3415], [45, 3438],
  [50, 3455], [55, 3442], [60, 3468], [65, 3490], [70, 3477],
  [75, 3502], [80, 3518], [85, 3505], [90, 3529], [95, 3541],
  [100, 3528], [105, 3550], [110, 3567], [115, 3556], [120, 3580],
];

const PMIN = 3350;
const PMAX = 3620;

const chartX = (i: number) => 120 + (i / 120) * 1200;
const chartY = (p: number) => 760 - ((p - PMIN) / (PMAX - PMIN)) * 480;

function priceAt(i: number): number {
  let a = 0;
  while (a + 1 < PX.length - 1 && PX[a + 1][0] < i) a++;
  const [x1, y1] = PX[a];
  const [x2, y2] = PX[a + 1];
  const t = (i - x1) / (x2 - x1 || 1);
  return y1 + (y2 - y1) * t;
}

function pathTo(i: number): string {
  let d = '';
  for (let s = 0; s <= i; s++) {
    d += `${s === 0 ? 'M' : 'L'} ${chartX(s).toFixed(1)} ${chartY(priceAt(s)).toFixed(1)} `;
  }
  return d;
}

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/* ------------------------------------------------------------------ */
/* Background grid                                                     */
/* ------------------------------------------------------------------ */
const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.030) 0 1px, transparent 1px 60px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.024) 0 1px, transparent 1px 60px)`,
    }}
  />
);

/* ------------------------------------------------------------------ */
/* Glow orb                                                            */
/* ------------------------------------------------------------------ */
const Orb: React.FC = () => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 300], [0.85, 1.15], clamp);
  const op = interpolate(f, [0, 120], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 1080,
        top: 300,
        width: 1200,
        height: 1200,
        marginLeft: -600,
        marginTop: -600,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.30), rgba(13,79,145,0.10) 45%, transparent 68%)`,
        transform: `scale(${scale})`,
        opacity: op,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Header bar                                                          */
/* ------------------------------------------------------------------ */
const Header: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 18], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 54,
        left: 80,
        right: 80,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: op,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 14,
            background: NAVY,
            border: `1.5px solid rgba(183,243,75,0.35)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 26,
            fontWeight: 900,
            color: GREEN,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          TW
        </div>
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: '#ffffff',
            fontFamily: 'Manrope, Inter, Arial, sans-serif',
            letterSpacing: '-0.02em',
          }}
        >
          TraderWatch
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 999,
          padding: '10px 22px',
        }}
      >
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: GREEN,
            boxShadow: `0 0 12px ${GREEN}`,
          }}
        />
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#dceeff',
            letterSpacing: '0.08em',
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          XAU/USD · GOLD
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — chart draws itself + headline                             */
/* ------------------------------------------------------------------ */
const SceneChart: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // chart draws from frame 10 to 200
  const drawPct = interpolate(f, [10, 210], [0, 1], {
    ...clamp,
    easing: Easing.out(Easing.cubic),
  });
  const drawnIndex = Math.floor(drawPct * 120);

  // headline
  const line1 = interpolate(f, [20, 55], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line1Y = interpolate(f, [20, 55], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const line2 = interpolate(f, [65, 100], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line2Y = interpolate(f, [65, 100], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});

  // fade whole scene out at end
  const sceneOut = interpolate(f, [215, 250], [1, 0], clamp);

  const lastX = chartX(Math.min(drawnIndex, 120));
  const lastY = chartY(priceAt(Math.min(drawnIndex, 120)));

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb />

      {/* Eyebrow — same pill as the site hero */}
      <div
        style={{
          position: 'absolute', top: 132, left: 100,
          display: 'inline-flex', alignItems: 'center', gap: 9,
          border: '1px solid rgba(255,255,255,0.28)', borderRadius: 99,
          padding: '8px 14px', opacity: line1,
        }}
      >
        <div style={{width: 7, height: 7, borderRadius: '50%', background: GREEN}} />
        <div style={{fontSize: 13, fontWeight: 800, letterSpacing: '0.09em', color: '#dceeff', fontFamily: 'Inter, Arial, sans-serif'}}>
          BUILT FOR MORE INFORMED TRADING
        </div>
      </div>

      {/* Headline */}
      <div style={{position: 'absolute', top: 200, left: 100, width: 780}}>
        <div
          style={{
            opacity: line1,
            transform: `translateY(${line1Y}px)`,
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.045em',
            color: '#ffffff',
            fontFamily: 'Manrope, Inter, Arial, sans-serif',
          }}
        >
          Read the market.
        </div>
        <div
          style={{
            opacity: line2,
            transform: `translateY(${line2Y}px)`,
            fontSize: 86,
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.045em',
            color: GREEN,
            fontFamily: 'Manrope, Inter, Arial, sans-serif',
            marginTop: 8,
          }}
        >
          Trade with a plan.
        </div>
      </div>

      {/* Chart panel */}
      <div
        style={{
          position: 'absolute',
          left: 960,
          top: 250,
          width: 860,
          height: 560,
          borderRadius: 24,
          background: 'rgba(9,40,76,0.72)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 30px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden',
          opacity: interpolate(f, [0, 30], [0, 1], clamp),
        }}
      >
        {/* panel header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '18px 26px',
            borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#ffffff',
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            XAU/USD · 1H
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: GREEN,
              letterSpacing: '0.10em',
              fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            ILLUSTRATIVE
          </div>
        </div>

        <svg width={860} height={500} viewBox="0 0 1440 500" preserveAspectRatio="none">
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.28" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* horizontal gridlines */}
          {[0, 1, 2, 3, 4].map((g) => (
            <line
              key={g}
              x1={0}
              x2={1440}
              y1={100 + g * 95}
              y2={100 + g * 95}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={1}
            />
          ))}

          {/* area fill */}
          {drawnIndex > 2 && (
            <path
              d={`${pathTo(drawnIndex)} L ${lastX} 500 L 120 500 Z`}
              fill="url(#chartFill)"
            />
          )}

          {/* price line */}
          {drawnIndex > 0 && (
            <path
              d={pathTo(drawnIndex)}
              fill="none"
              stroke={GOLD}
              strokeWidth={4}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* leading dot */}
          {drawnIndex > 0 && drawnIndex < 121 && (
            <>
              <circle cx={lastX} cy={lastY} r={14} fill={GOLD} opacity={0.25} />
              <circle cx={lastX} cy={lastY} r={6} fill="#fff" />
            </>
          )}
        </svg>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — signal cards                                              */
/* ------------------------------------------------------------------ */
type Sig = {pair: string; dir: string; entry: string; sl: string; tp: string; delay: number};

const SIGNALS: Sig[] = [
  {pair: 'XAU/USD', dir: 'LONG', entry: '3,524.50', sl: '3,512.00', tp: '3,556.00', delay: 0},
  {pair: 'EUR/USD', dir: 'SHORT', entry: '1.0842', sl: '1.0878', tp: '1.0762', delay: 14},
  {pair: 'GBP/JPY', dir: 'LONG', entry: '198.42', sl: '197.65', tp: '199.90', delay: 28},
];

const SignalCard: React.FC<{sig: Sig; base: number}> = ({sig, base}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, f - base);

  const s = spring({frame: local, fps, config: {damping: 18, stiffness: 90, mass: 0.9}});
  const y = interpolate(s, [0, 1], [50, 0]);
  const op = interpolate(local, [0, 14], [0, 1], clamp);

  const isGold = sig.pair === 'XAU/USD';
  const accent = isGold ? GOLD : SKY;
  const dirColor = sig.dir === 'LONG' ? GREEN : RED;

  const rowOp = (n: number) => interpolate(local, [12 + n * 6, 24 + n * 6], [0, 1], clamp);

  return (
    <div
      style={{
        opacity: op,
        transform: `translateY(${y}px)`,
        width: 400,
        borderRadius: 20,
        background: '#ffffff',
        padding: '0 26px 24px',
        overflow: 'hidden',
        boxShadow: '0 22px 60px rgba(3,18,36,0.45)',
      }}
    >
      <div style={{height: 6, margin: '0 -26px 20px', background: `linear-gradient(90deg, ${accent}, ${accent}88)`}} />

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <div
            style={{
              width: 40, height: 40, borderRadius: 11,
              background: isGold ? '#fff5d9' : '#eaf4fc',
              color: isGold ? '#9a6900' : BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, fontFamily: 'Inter, Arial, sans-serif',
            }}
          >
            {isGold ? 'AU' : 'FX'}
          </div>
          <div style={{fontSize: 26, fontWeight: 800, color: NAVY, fontFamily: 'Manrope, Inter, Arial, sans-serif', letterSpacing: '-0.02em'}}>
            {sig.pair}
          </div>
        </div>
        <div
          style={{
            fontSize: 13, fontWeight: 900, letterSpacing: '0.08em',
            padding: '7px 14px', borderRadius: 999,
            background: `${dirColor}22`, color: dirColor,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          {sig.dir}
        </div>
      </div>

      <div style={{marginTop: 22, display: 'grid', gap: 12}}>
        {[
          {k: 'ENTRY', v: sig.entry, c: NAVY},
          {k: 'STOP LOSS', v: sig.sl, c: RED},
          {k: 'TAKE PROFIT', v: sig.tp, c: '#13724c'},
        ].map((row, i) => (
          <div
            key={row.k}
            style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              opacity: rowOp(i),
              borderTop: i === 0 ? 'none' : '1px solid #e6eef6',
              paddingTop: i === 0 ? 0 : 12,
            }}
          >
            <div style={{fontSize: 14, fontWeight: 800, color: '#60758d', letterSpacing: '0.06em', fontFamily: 'Inter, Arial, sans-serif'}}>
              {row.k}
            </div>
            <div style={{fontSize: 25, fontWeight: 800, color: row.c, fontFamily: 'Manrope, Inter, Arial, sans-serif', fontVariantNumeric: 'tabular-nums'}}>
              {row.v}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SceneSignals: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 260;
  const headOp = interpolate(local, [0, 24], [0, 1], clamp);
  const sceneOut = interpolate(f, [450, 490], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb />
      <div style={{position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', opacity: headOp}}>
        <div
          style={{
            fontSize: 20, fontWeight: 800, letterSpacing: '0.16em',
            color: SKY, fontFamily: 'Inter, Arial, sans-serif', marginBottom: 20,
          }}
        >
          STRUCTURED SETUPS
        </div>
        <div
          style={{
            fontSize: 78, fontWeight: 800, letterSpacing: '-0.04em',
            color: '#ffffff', fontFamily: 'Manrope, Inter, Arial, sans-serif',
          }}
        >
          Risk levels, clearly laid out.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 430, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 34,
        }}
      >
        {SIGNALS.map((sig) => (
          <SignalCard key={sig.pair} sig={sig} base={275 + sig.delay} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — process steps                                             */
/* ------------------------------------------------------------------ */
const STEPS = [
  {n: '01', t: 'Learn the context', p: 'Build market-reading skills.'},
  {n: '02', t: 'Review structured setups', p: 'Entry, stop loss and take profit together.'},
  {n: '03', t: 'Manage risk first', p: 'Size positions before any order.'},
  {n: '04', t: 'Decisions stay yours', p: 'Verify against your own chart and plan.'},
];

const SceneSteps: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 495;
  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [700, 740], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb />
      <div style={{position: 'absolute', top: 140, left: 100, opacity: headOp}}>
        <div style={{fontSize: 20, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Inter, Arial, sans-serif', marginBottom: 18}}>
          A CLEARER PROCESS
        </div>
        <div style={{fontSize: 72, fontWeight: 800, letterSpacing: '-0.04em', color: '#ffffff', fontFamily: 'Manrope, Inter, Arial, sans-serif'}}>
          Less guessing. More understanding.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 400, left: 100, right: 100,
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28,
        }}
      >
        {STEPS.map((s, i) => {
          const appear = interpolate(local, [18 + i * 14, 42 + i * 14], [0, 1], clamp);
          const rise = interpolate(local, [18 + i * 14, 42 + i * 14], [26, 0], clamp);
          return (
            <div
              key={s.n}
              style={{
                opacity: appear,
                transform: `translateY(${rise}px)`,
                background: 'rgba(255,255,255,0.045)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18,
                padding: '26px 30px',
              }}
            >
              <div style={{fontSize: 17, fontWeight: 900, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Inter, Arial, sans-serif'}}>
                {s.n}
              </div>
              <div style={{fontSize: 32, fontWeight: 800, color: '#ffffff', marginTop: 12, fontFamily: 'Manrope, Inter, Arial, sans-serif', letterSpacing: '-0.02em'}}>
                {s.t}
              </div>
              <div style={{fontSize: 19, color: '#a9c1d6', marginTop: 10, lineHeight: 1.45, fontFamily: 'Inter, Arial, sans-serif'}}>
                {s.p}
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4 — end card                                                  */
/* ------------------------------------------------------------------ */
const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 745;

  const logoOp = interpolate(local, [0, 22], [0, 1], clamp);
  const logoScale = interpolate(local, [0, 30], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const ctaOp = interpolate(local, [24, 50], [0, 1], clamp);
  const discOp = interpolate(local, [45, 70], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #12376e 0%, ${NAVY_DEEP} 58%, #04101f 100%)`,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid />
      <Orb />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: -40}}>
        <div
          style={{
            opacity: logoOp,
            transform: `scale(${logoScale})`,
            width: 108,
            height: 108,
            borderRadius: 26,
            background: NAVY,
            border: '2px solid rgba(183,243,75,0.45)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 46,
            fontWeight: 900,
            color: GREEN,
            fontFamily: 'Inter, Arial, sans-serif',
            boxShadow: `0 0 70px rgba(183,243,75,0.20)`,
          }}
        >
          TW
        </div>

        <div
          style={{
            opacity: logoOp,
            fontSize: 84,
            fontWeight: 800,
            color: '#ffffff',
            marginTop: 30,
            letterSpacing: '-0.03em',
            fontFamily: 'Manrope, Inter, Arial, sans-serif',
          }}
        >
          TraderWatch
        </div>

        <div
          style={{
            opacity: ctaOp,
            fontSize: 34,
            fontWeight: 700,
            color: '#a9c1d6',
            marginTop: 14,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          Read the market. Trade with a plan.
        </div>

        <div
          style={{
            opacity: ctaOp,
            marginTop: 44,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            background: GREEN,
            color: '#193414',
            fontSize: 26,
            fontWeight: 800,
            padding: '20px 52px',
            borderRadius: 12,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          Explore market setups →
        </div>

        <div
          style={{
            opacity: discOp,
            fontSize: 16,
            color: '#6f88a6',
            marginTop: 64,
            textAlign: 'center',
            maxWidth: 900,
            lineHeight: 1.6,
            fontFamily: 'Inter, Arial, sans-serif',
          }}
        >
          Educational information only. Trading is risky; no outcomes are guaranteed.
          Prices shown are illustrative and are not trade recommendations.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main composition — 900 frames @ 30fps = 30s                         */
/* ------------------------------------------------------------------ */
export const TraderWatchHero: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(115deg, #08284d 0%, #0d4f91 65%, #1685cf 100%)`}}>
      <Grid />
      {f < 262 && <Header />}
      {f < 262 && <SceneChart />}
      {f >= 252 && f < 496 && <SceneSignals />}
      {f >= 488 && f < 746 && <SceneSteps />}
      {f >= 738 && <SceneEnd />}
    </AbsoluteFill>
  );
};
