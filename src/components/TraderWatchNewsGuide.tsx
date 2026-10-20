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

const CW = 952;
const CH = 440;
const chartX = (i: number) => (i / 120) * CW;
const chartY = (p: number) => CH - ((p - PMIN) / (PMAX - PMIN)) * (CH - 60) - 30;

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
        position: 'absolute', left: W / 2, top: cy,
        width: 1400, height: 1400, marginLeft: -700, marginTop: -700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.28), rgba(13,79,145,0.10) 46%, transparent 68%)`,
        transform: `scale(${scale})`, opacity: op,
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
        position: 'absolute', top: 74, left: 64, right: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: op,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 58, height: 58, borderRadius: 16, background: NAVY,
            border: '1.5px solid rgba(183,243,75,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 27, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
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
          FUNDAMENTAL
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — hook: price reacts to data                                */
/* ------------------------------------------------------------------ */
const SceneHook: React.FC = () => {
  const f = useCurrentFrame();

  const drawPct = interpolate(f, [24, 200], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drawnIndex = Math.floor(drawPct * 120);

  const line1 = interpolate(f, [10, 42], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line1Y = interpolate(f, [10, 42], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const line2 = interpolate(f, [42, 74], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line2Y = interpolate(f, [42, 74], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const subOp = interpolate(f, [80, 108], [0, 1], clamp);
  const cardOp = interpolate(f, [12, 48], [0, 1], clamp);
  const cardY = interpolate(f, [12, 52], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const sceneOut = interpolate(f, [288, 316], [1, 0], clamp);

  const markerIn = interpolate(f, [150, 186], [0, 1], clamp);
  const pulse = 1 + 0.35 * Math.abs(Math.sin((f - 150) / 9));
  const idx = Math.min(drawnIndex, 120);
  const lastX = chartX(idx);
  const lastY = chartY(priceAt(idx));

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={820} />

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
          FUNDAMENTAL NEWS
        </div>
      </div>

      <div style={{position: 'absolute', top: 330, left: 64, width: 952}}>
        <div
          style={{
            opacity: line1, transform: `translateY(${line1Y}px)`,
            fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em',
            color: '#fff', fontFamily: 'Arial, sans-serif',
          }}
        >
          Big moves start
        </div>
        <div
          style={{
            opacity: line2, transform: `translateY(${line2Y}px)`,
            fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em',
            color: GREEN, fontFamily: 'Arial, sans-serif', marginTop: 6,
          }}
        >
          with data.
        </div>
        <div
          style={{
            opacity: subOp, fontSize: 29, lineHeight: 1.45, color: '#c4d9ea',
            marginTop: 24, maxWidth: 900, fontFamily: 'Arial, sans-serif',
          }}
        >
          High-impact USD releases move gold, indices and the dollar. Know the time before the candle prints.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 770, left: 64, width: 952,
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
          <div style={{fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
            ILLUSTRATIVE
          </div>
        </div>

        <svg width={CW} height={CH + 40} viewBox={`0 0 ${CW} ${CH + 40}`}>
          <defs>
            <linearGradient id="nFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.26" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={0} x2={CW} y1={80 + g * 100} y2={80 + g * 100} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          ))}

          {drawnIndex > 2 && (
            <path d={`${pathTo(drawnIndex)} L ${lastX} ${CH + 40} L 0 ${CH + 40} Z`} fill="url(#nFill)" />
          )}
          {drawnIndex > 0 && (
            <path d={pathTo(drawnIndex)} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          )}

          {/* release marker */}
          <g opacity={markerIn}>
            <line
              x1={chartX(72)}
              x2={chartX(72)}
              y1={20}
              y2={CH + 20}
              stroke={RED}
              strokeWidth={2.5}
              strokeDasharray="10 7"
            />
            <circle cx={chartX(72)} cy={chartY(priceAt(72))} r={26 * pulse} fill="none" stroke={RED} strokeWidth={2} opacity={0.5} />
            <circle cx={chartX(72)} cy={chartY(priceAt(72))} r={9} fill={RED} />
            <text x={chartX(72) - 16} y={44} textAnchor="end" fill={RED} fontSize={22} fontWeight={800} fontFamily="Arial, sans-serif">
              USD DATA
            </text>
          </g>

          {drawnIndex > 0 && drawnIndex < 121 && (
            <>
              <circle cx={lastX} cy={lastY} r={16} fill={GOLD} opacity={0.25} />
              <circle cx={lastX} cy={lastY} r={6} fill="#fff" />
            </>
          )}
        </svg>
      </div>

      <div style={{position: 'absolute', top: 1400, left: 64, width: 952, fontSize: 19, color: '#8fa8c0', opacity: cardOp, fontFamily: 'Arial, sans-serif'}}>
        Synthetic chart — timing is illustrative, not a forecast.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — the calendar panel                                        */
/* ------------------------------------------------------------------ */
const EVENTS = [
  {t: '13:30', c: 'USD', n: 'CPI m/m', s: 'High'},
  {t: '15:00', c: 'USD', n: 'Non-Farm Payrolls', s: 'High'},
  {t: '19:00', c: 'USD', n: 'FOMC Rate Decision', s: 'High'},
  {t: '21:00', c: 'USD', n: 'Retail Sales', s: 'High'},
];

const SceneCalendar: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 300;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [560, 590], [1, 0], clamp);
  const panelIn = spring({frame: Math.max(0, local - 14), fps, config: {damping: 19, stiffness: 85, mass: 0.9}});
  const panelY = interpolate(panelIn, [0, 1], [70, 0]);
  const panelOp = interpolate(local, [14, 32], [0, 1], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={540} />

      <div style={{position: 'absolute', top: 226, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          THE CALENDAR
        </div>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Only what moves USD.
        </div>
        <div style={{fontSize: 26, color: '#c4d9ea', marginTop: 14, fontFamily: 'Arial, sans-serif'}}>
          Filtered to high-impact releases, in one place.
        </div>
      </div>

      {/* calendar panel — mirrors the site's news panel */}
      <div
        style={{
          position: 'absolute', top: 500, left: 64, width: 952,
          borderRadius: 26, background: '#061a31',
          border: '1px solid #173b5e',
          boxShadow: '0 30px 80px rgba(2,12,26,0.55)',
          overflow: 'hidden', opacity: panelOp, transform: `translateY(${panelY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '24px 28px', borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
            High-impact USD calendar
          </div>
          <div
            style={{
              display: 'flex', alignItems: 'center', gap: 9,
              border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '8px 16px',
            }}
          >
            <div style={{width: 7, height: 7, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`}} />
            <div style={{fontSize: 14, fontWeight: 800, color: '#dceeff', letterSpacing: '0.05em', fontFamily: 'Arial, sans-serif'}}>
              USD · HIGH IMPACT
            </div>
          </div>
        </div>

        <div style={{padding: '8px 28px 22px'}}>
          {EVENTS.map((e, i) => {
            const a = interpolate(local, [34 + i * 13, 56 + i * 13], [0, 1], clamp);
            const y = interpolate(local, [34 + i * 13, 56 + i * 13], [24, 0], clamp);
            return (
              <div
                key={e.n}
                style={{
                  opacity: a, transform: `translateY(${y}px)`,
                  display: 'flex', alignItems: 'center', gap: 20,
                  padding: '24px 0',
                  borderBottom: i === EVENTS.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <div
                  style={{
                    flex: '0 0 96px', fontSize: 30, fontWeight: 800, color: '#fff',
                    fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {e.t}
                </div>
                <div
                  style={{
                    flex: '0 0 74px', textAlign: 'center', fontSize: 16, fontWeight: 900,
                    letterSpacing: '0.06em', color: '#dceeff',
                    background: 'rgba(22,133,207,0.22)', border: '1px solid rgba(22,133,207,0.45)',
                    borderRadius: 9, padding: '7px 0', fontFamily: 'Arial, sans-serif',
                  }}
                >
                  {e.c}
                </div>
                <div style={{flex: 1, fontSize: 27, fontWeight: 700, color: '#eaf4fc', fontFamily: 'Arial, sans-serif'}}>
                  {e.n}
                </div>
                <div
                  style={{
                    flex: '0 0 auto', fontSize: 15, fontWeight: 900, letterSpacing: '0.06em',
                    color: RED, background: 'rgba(198,83,73,0.18)',
                    border: '1px solid rgba(198,83,73,0.42)',
                    borderRadius: 8, padding: '6px 12px', fontFamily: 'Arial, sans-serif',
                  }}
                >
                  HIGH
                </div>
              </div>
            );
          })}
        </div>

        <div
          style={{
            padding: '14px 28px 18px', borderTop: '1px solid rgba(255,255,255,0.10)',
            fontSize: 17, color: '#9db6ca', fontFamily: 'Arial, sans-serif',
          }}
        >
          Illustrative example — always check the live calendar and your own time zone.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — how to use it                                             */
/* ------------------------------------------------------------------ */
const STEPS = [
  {n: '01', t: 'Check the day', p: 'Scan the high-impact USD releases before you open a chart.'},
  {n: '02', t: 'Convert the time', p: 'Calendar times are not your time zone. Confirm it.'},
  {n: '03', t: 'Respect the release', p: 'Spreads widen and stops slip when data prints.'},
  {n: '04', t: 'Wait for the close', p: 'Let the reaction settle, then read the structure.'},
];

const SceneSteps: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 566;
  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [742, 772], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={560} />
      <div style={{position: 'absolute', top: 232, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          USING THE CALENDAR
        </div>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Context before the candle.
        </div>
      </div>

      <div style={{position: 'absolute', top: 470, left: 64, width: 952}}>
        {STEPS.map((s, i) => {
          const a = interpolate(local, [14 + i * 13, 38 + i * 13], [0, 1], clamp);
          const y = interpolate(local, [14 + i * 13, 38 + i * 13], [30, 0], clamp);
          return (
            <div
              key={s.n}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', gap: 24, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 22, padding: '28px 30px', marginBottom: 22,
              }}
            >
              <div
                style={{
                  flex: '0 0 auto', width: 60, height: 60, borderRadius: 16,
                  background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 23, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
                }}
              >
                {s.n}
              </div>
              <div>
                <div style={{fontSize: 33, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
                  {s.t}
                </div>
                <div style={{fontSize: 22, color: '#a9c1d6', marginTop: 7, lineHeight: 1.4, fontFamily: 'Arial, sans-serif'}}>
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
/* Scene 4 — end card (same site CTA)                                  */
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
          See the week before it moves.
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
          Educational context only. Trading is risky; no outcomes are guaranteed.
          Calendar times and prices shown are illustrative.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main — 900 frames @ 30fps = 30s, portrait 1080x1920                  */
/* Scenes gated by absolute frame so no opaque backdrop covers them.    */
/* ------------------------------------------------------------------ */
export const TraderWatchNewsGuide: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 320 && <Header />}
      {f < 320 && <SceneHook />}
      {f >= 292 && f < 592 && <SceneCalendar />}
      {f >= 562 && f < 774 && <SceneSteps />}
      {f >= 742 && <SceneEnd />}
    </AbsoluteFill>
  );
};
