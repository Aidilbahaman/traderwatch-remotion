import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

const W = 1080;
const H = 1920;

/* TraderWatch brand tokens — same values as app.css / index.html */
const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const RED = '#c65349';
const GOLD = '#d89c1d';

/* Synthetic XAU/USD path — illustrative only, never real market data */
const PX: [number, number][] = [
  [0, 3380], [5, 3402], [10, 3391], [15, 3425], [20, 3412],
  [25, 3441], [30, 3428], [35, 3396], [40, 3415], [45, 3438],
  [50, 3455], [55, 3442], [60, 3468], [65, 3490], [70, 3477],
  [75, 3502], [80, 3518], [85, 3505], [90, 3529], [95, 3541],
  [100, 3528], [105, 3550], [110, 3567], [115, 3556], [120, 3580],
];

const PMIN = 3350;
const PMAX = 3620;

/* chart panel geometry (portrait): 952 x 520 inside a card at x=64 */
const CX0 = 64;
const CY0 = 0;
const CW = 952;
const CH = 470;
const chartX = (i: number) => (i / 120) * CW;
const chartY = (p: number) => CH - ((p - PMIN) / (PMAX - PMIN)) * (CH - 40) - 20;

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
const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.030) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.024) 0 1px, transparent 1px 72px)`,
    }}
  />
);

const Orb: React.FC<{cy?: number}> = ({cy = 620}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 300], [0.9, 1.12], clamp);
  const op = interpolate(f, [0, 90], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: W / 2,
        top: cy,
        width: 1400,
        height: 1400,
        marginLeft: -700,
        marginTop: -700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.28), rgba(13,79,145,0.10) 46%, transparent 68%)`,
        transform: `scale(${scale})`,
        opacity: op,
      }}
    />
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 16], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        top: 74,
        left: 64,
        right: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: op,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: NAVY,
            border: '1.5px solid rgba(183,243,75,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 27,
            fontWeight: 900,
            color: GREEN,
            fontFamily: 'Arial, sans-serif',
          }}
        >
          TW
        </div>
        <div style={{fontSize: 34, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
          TraderWatch
        </div>
      </div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 11,
          border: '1px solid rgba(255,255,255,0.20)', borderRadius: 999, padding: '11px 20px',
        }}
      >
        <div style={{width: 9, height: 9, borderRadius: '50%', background: GREEN, boxShadow: `0 0 12px ${GREEN}`}} />
        <div style={{fontSize: 18, fontWeight: 700, color: '#dceeff', letterSpacing: '0.07em', fontFamily: 'Arial, sans-serif'}}>
          XAU/USD
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — headline + chart that draws itself                        */
/* ------------------------------------------------------------------ */
const SceneChart: React.FC = () => {
  const f = useCurrentFrame();

  const drawPct = interpolate(f, [30, 250], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drawnIndex = Math.floor(drawPct * 120);

  const line1 = interpolate(f, [14, 46], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line1Y = interpolate(f, [14, 46], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const line2 = interpolate(f, [46, 78], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line2Y = interpolate(f, [46, 78], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const subOp = interpolate(f, [86, 116], [0, 1], clamp);
  const cardOp = interpolate(f, [16, 56], [0, 1], clamp);
  const cardY = interpolate(f, [16, 60], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});

  const sceneOut = interpolate(f, [286, 316], [1, 0], clamp);

  const idx = Math.min(drawnIndex, 120);
  const lastX = chartX(idx);
  const lastY = chartY(priceAt(idx));
  const livePx = priceAt(idx).toFixed(1);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={760} />

      {/* eyebrow */}
      <div
        style={{
          position: 'absolute', top: 250, left: 64,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: '1px solid rgba(255,255,255,0.28)', borderRadius: 99,
          padding: '10px 18px', opacity: line1,
        }}
      >
        <div style={{width: 8, height: 8, borderRadius: '50%', background: GREEN}} />
        <div style={{fontSize: 17, fontWeight: 800, letterSpacing: '0.09em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
          BUILT FOR MORE INFORMED TRADING
        </div>
      </div>

      {/* headline */}
      <div style={{position: 'absolute', top: 336, left: 64, width: 952}}>
        <div
          style={{
            opacity: line1, transform: `translateY(${line1Y}px)`,
            fontSize: 104, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em',
            color: '#fff', fontFamily: 'Arial, sans-serif',
          }}
        >
          Read the market.
        </div>
        <div
          style={{
            opacity: line2, transform: `translateY(${line2Y}px)`,
            fontSize: 104, fontWeight: 800, lineHeight: 1.02, letterSpacing: '-0.045em',
            color: GREEN, fontFamily: 'Arial, sans-serif', marginTop: 6,
          }}
        >
          Trade with a plan.
        </div>
        <div
          style={{
            opacity: subOp, fontSize: 30, lineHeight: 1.45, color: '#c4d9ea',
            marginTop: 26, maxWidth: 880, fontFamily: 'Arial, sans-serif',
          }}
        >
          Clear risk levels, market context and practical tools — so the decision stays yours.
        </div>
      </div>

      {/* chart card */}
      <div
        style={{
          position: 'absolute', top: 780, left: 64, width: 952,
          borderRadius: 28, background: 'rgba(9,40,76,0.74)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
            XAU/USD · 1H
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
            <div style={{fontSize: 17, fontWeight: 800, color: GOLD, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
              {livePx}
            </div>
            <div style={{fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
              ILLUSTRATIVE
            </div>
          </div>
        </div>

        <svg width={CW} height={CH + 30} viewBox={`0 0 ${CW} ${CH + 30}`}>
          <defs>
            <linearGradient id="pFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.30" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line
              key={g}
              x1={0}
              x2={CW}
              y1={80 + g * 100}
              y2={80 + g * 100}
              stroke="rgba(255,255,255,0.07)"
              strokeWidth={1}
            />
          ))}
          {drawnIndex > 2 && (
            <path d={`${pathTo(drawnIndex)} L ${lastX} ${CH + 30} L 0 ${CH + 30} Z`} fill="url(#pFill)" />
          )}
          {drawnIndex > 0 && (
            <path
              d={pathTo(drawnIndex)}
              fill="none"
              stroke={GOLD}
              strokeWidth={5}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}
          {drawnIndex > 0 && drawnIndex < 121 && (
            <>
              <circle cx={lastX} cy={lastY} r={18} fill={GOLD} opacity={0.25} />
              <circle cx={lastX} cy={lastY} r={7} fill="#fff" />
            </>
          )}
        </svg>
      </div>

      <div
        style={{
          position: 'absolute', top: 1400, left: 64, width: 952,
          fontSize: 19, color: '#8fa8c0', opacity: cardOp, fontFamily: 'Arial, sans-serif',
        }}
      >
        Illustrative synthetic chart — not live prices.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — signal cards                                              */
/* ------------------------------------------------------------------ */
type Sig = {pair: string; dir: string; entry: string; sl: string; tp: string; delay: number};

const SIGNALS: Sig[] = [
  {pair: 'XAU/USD', dir: 'BUY', entry: '3,524.50', sl: '3,512.00', tp: '3,556.00', delay: 0},
  {pair: 'EUR/USD', dir: 'SELL', entry: '1.0842', sl: '1.0878', tp: '1.0762', delay: 12},
  {pair: 'GBP/JPY', dir: 'BUY', entry: '198.42', sl: '197.65', tp: '199.90', delay: 24},
];

const SignalCard: React.FC<{sig: Sig; base: number; compact?: boolean}> = ({sig, base, compact}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const local = Math.max(0, f - base);
  const s = spring({frame: local, fps, config: {damping: 18, stiffness: 90, mass: 0.9}});
  const y = interpolate(s, [0, 1], [64, 0]);
  const op = interpolate(local, [0, 16], [0, 1], clamp);
  const isGold = sig.pair === 'XAU/USD';
  const accent = isGold ? GOLD : SKY;
  const dirColor = sig.dir === 'BUY' ? GREEN : RED;

  return (
    <div
      style={{
        opacity: op, transform: `translateY(${y}px)`, width: 952,
        borderRadius: 26, background: '#fff', padding: '0 32px 26px',
        overflow: 'hidden', boxShadow: '0 26px 64px rgba(3,18,36,0.45)',
      }}
    >
      <div style={{height: 8, margin: '0 -32px 22px', background: `linear-gradient(90deg, ${accent}, ${accent}66)`}} />

      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div
            style={{
              width: 48, height: 48, borderRadius: 13,
              background: isGold ? '#fff5d9' : '#eaf4fc',
              color: isGold ? '#9a6900' : BLUE,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15, fontWeight: 900, fontFamily: 'Arial, sans-serif',
            }}
          >
            {isGold ? 'AU' : 'FX'}
          </div>
          <div style={{fontSize: 34, fontWeight: 800, color: NAVY, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
            {sig.pair}
          </div>
        </div>
        <div
          style={{
            fontSize: 16, fontWeight: 900, letterSpacing: '0.08em',
            padding: '9px 18px', borderRadius: 999,
            background: `${dirColor}22`, color: dirColor, fontFamily: 'Arial, sans-serif',
          }}
        >
          {sig.dir}
        </div>
      </div>

      <div style={{marginTop: 24, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12}}>
        {[
          {k: 'ENTRY', v: sig.entry, c: NAVY, bg: '#f7fafc'},
          {k: 'SL', v: sig.sl, c: RED, bg: '#fdf1ef'},
          {k: 'TP', v: sig.tp, c: '#25804b', bg: '#eef8f1'},
        ].map((row, i) => (
          <div
            key={row.k}
            style={{
              opacity: interpolate(local, [10 + i * 6, 24 + i * 6], [0, 1], clamp),
              background: row.bg, border: '1px solid #edf2f6', borderRadius: 14, padding: '14px 14px',
            }}
          >
            <div style={{fontSize: 13, fontWeight: 800, color: '#60758d', letterSpacing: '0.07em', fontFamily: 'Arial, sans-serif'}}>
              {row.k}
            </div>
            <div style={{fontSize: 26, fontWeight: 800, color: row.c, marginTop: 5, fontFamily: 'Arial, sans-serif'}}>
              {row.v}
            </div>
          </div>
        ))}
      </div>

      {!compact && (
        <div
          style={{
            marginTop: 18, paddingTop: 14, borderTop: '1px solid #edf1f5',
            fontSize: 15, color: '#7b8fa5', fontFamily: 'Arial, sans-serif',
          }}
        >
          Structured setup · educational example
        </div>
      )}
    </div>
  );
};

const SceneSignals: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 300;
  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [540, 570], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={520} />
      <div style={{position: 'absolute', top: 250, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          STRUCTURED SETUPS
        </div>
        <div style={{fontSize: 66, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Risk levels, clearly laid out.
        </div>
        <div style={{fontSize: 26, color: '#c4d9ea', marginTop: 16, fontFamily: 'Arial, sans-serif'}}>
          Entry, stop and target — always visible.
        </div>
      </div>

      <div style={{position: 'absolute', top: 640, left: 64, display: 'grid', gap: 24}}>
        {SIGNALS.map((sig) => (
          <SignalCard key={sig.pair} sig={sig} base={316 + sig.delay} compact={sig.pair !== 'XAU/USD'} />
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
  const local = f - 556;
  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [742, 772], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={560} />
      <div style={{position: 'absolute', top: 240, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          A CLEARER PROCESS
        </div>
        <div style={{fontSize: 68, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Less guessing. More understanding.
        </div>
      </div>

      <div style={{position: 'absolute', top: 560, left: 64, width: 952}}>
        {STEPS.map((s, i) => {
          const appear = interpolate(local, [16 + i * 12, 40 + i * 12], [0, 1], clamp);
          const rise = interpolate(local, [16 + i * 12, 40 + i * 12], [30, 0], clamp);
          return (
            <div
              key={s.n}
              style={{
                opacity: appear, transform: `translateY(${rise}px)`,
                display: 'flex', gap: 24, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 22, padding: '30px 32px', marginBottom: 22,
              }}
            >
              <div
                style={{
                  flex: '0 0 auto', width: 62, height: 62, borderRadius: 16,
                  background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
                }}
              >
                {s.n}
              </div>
              <div>
                <div style={{fontSize: 34, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
                  {s.t}
                </div>
                <div style={{fontSize: 23, color: '#a9c1d6', marginTop: 8, lineHeight: 1.4, fontFamily: 'Arial, sans-serif'}}>
                  {s.p}
                </div>
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
  const local = f - 748;

  const logoOp = interpolate(local, [0, 20], [0, 1], clamp);
  const logoScale = interpolate(local, [0, 28], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const ctaOp = interpolate(local, [20, 44], [0, 1], clamp);
  const discOp = interpolate(local, [40, 64], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #12376e 0%, ${NAVY_DEEP} 58%, #04101f 100%)`,
        justifyContent: 'center', alignItems: 'center',
      }}
    >
      <Grid />
      <Orb cy={760} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 72px'}}>
        <div
          style={{
            opacity: logoOp, transform: `scale(${logoScale})`,
            width: 150, height: 150, borderRadius: 36,
            background: NAVY, border: '2.5px solid rgba(183,243,75,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 62, fontWeight: 900, color: GREEN,
            fontFamily: 'Arial, sans-serif', boxShadow: '0 0 90px rgba(183,243,75,0.22)',
          }}
        >
          TW
        </div>

        <div style={{opacity: logoOp, fontSize: 92, fontWeight: 800, color: '#fff', marginTop: 34, letterSpacing: '-0.03em', fontFamily: 'Arial, sans-serif'}}>
          TraderWatch
        </div>

        <div style={{opacity: ctaOp, fontSize: 36, fontWeight: 700, color: '#a9c1d6', marginTop: 18, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
          Read the market. Trade with a plan.
        </div>

        <div
          style={{
            opacity: ctaOp, marginTop: 54, display: 'inline-flex', alignItems: 'center', gap: 12,
            background: GREEN, color: '#193414', fontSize: 32, fontWeight: 800,
            padding: '26px 58px', borderRadius: 16, fontFamily: 'Arial, sans-serif',
          }}
        >
          Explore market setups →
        </div>

        <div
          style={{
            opacity: discOp, fontSize: 20, color: '#6f88a6', marginTop: 80,
            textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif',
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
/* Main — 900 frames @ 30fps = 30s, portrait 1080x1920                  */
/* Scenes are gated by absolute frame so no opaque backdrop covers the  */
/* others (see remotion-scene-gating).                                  */
/* ------------------------------------------------------------------ */
export const TraderWatchHeroPortrait: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 320 && <Header />}
      {f < 320 && <SceneChart />}
      {f >= 292 && f < 572 && <SceneSignals />}
      {f >= 548 && f < 774 && <SceneSteps />}
      {f >= 742 && <SceneEnd />}
    </AbsoluteFill>
  );
};
