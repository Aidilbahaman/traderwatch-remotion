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
const CH = 420;
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

export type LiveEvent = {t: string; d: string; n: string; fc?: string; pv?: string};
export type ReelProps = {
  events: LiveEvent[];
  fetched: string;
  range: string;
  count: number;
};

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
  const scale = interpolate(f, [0, 600], [0.92, 1.12], clamp);
  const op = interpolate(f, [0, 60], [0.55, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute', left: W / 2, top: cy,
        width: 1400, height: 1400, marginLeft: -700, marginTop: -700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.30), rgba(13,79,145,0.10) 46%, transparent 68%)`,
        transform: `scale(${scale})`, opacity: op,
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Scene 0 — cover / thumbnail (fully visible on frame 0)              */
/* ------------------------------------------------------------------ */
const SceneCover: React.FC<ReelProps> = ({range, count}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 96], [1, 1.035], clamp);
  const barW = interpolate(f, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sceneOut = interpolate(f, [84, 96], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={700} />

      <div style={{position: 'absolute', top: 150, left: 72, right: 72, transform: `scale(${drift})`, transformOrigin: 'left top'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{width: 62, height: 62, borderRadius: 17, background: NAVY, border: '1.5px solid rgba(183,243,75,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif'}}>
            TW
          </div>
          <div style={{fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em', fontFamily: 'Arial, sans-serif'}}>
            TraderWatch
          </div>
        </div>
      </div>

      <div style={{position: 'absolute', top: 470, left: 72, right: 72}}>
        <div
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            border: '1px solid rgba(255,255,255,0.30)', borderRadius: 99,
            padding: '11px 20px',
          }}
        >
          <div style={{width: 8, height: 8, borderRadius: '50%', background: GREEN}} />
          <div style={{fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
            FUNDAMENTAL NEWS · USD
          </div>
        </div>

        <div style={{fontSize: 168, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: '#fff', marginTop: 34, fontFamily: 'Arial, sans-serif'}}>
          The week
        </div>
        <div style={{fontSize: 168, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: GREEN, fontFamily: 'Arial, sans-serif'}}>
          ahead.
        </div>

        <div style={{width: 520 * barW, height: 10, borderRadius: 6, background: `linear-gradient(90deg, ${GREEN}, rgba(183,243,75,0.15))`, marginTop: 40}} />

        <div style={{fontSize: 34, color: '#d6e7f5', marginTop: 40, lineHeight: 1.45, fontFamily: 'Arial, sans-serif'}}>
          {count} high-impact USD events.
        </div>
        <div style={{fontSize: 28, color: '#9fb6cc', marginTop: 10, fontFamily: 'Arial, sans-serif'}}>
          {range} · times in UTC
        </div>
      </div>

      <div style={{position: 'absolute', bottom: 120, left: 72, right: 72, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 22, color: '#8fa8c0', fontFamily: 'Arial, sans-serif'}}>
          Know the time before the candle prints.
        </div>
        <div style={{fontSize: 20, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
          ILLUSTRATIVE CHART
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — hook                                                      */
/* ------------------------------------------------------------------ */
const SceneHook: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 96;

  const drawPct = interpolate(local, [20, 190], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drawnIndex = Math.floor(drawPct * 120);
  const line1 = interpolate(local, [0, 30], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line1Y = interpolate(local, [0, 30], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const line2 = interpolate(local, [26, 56], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line2Y = interpolate(local, [26, 56], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const subOp = interpolate(local, [60, 88], [0, 1], clamp);
  const cardOp = interpolate(local, [8, 40], [0, 1], clamp);
  const cardY = interpolate(local, [8, 44], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const sceneOut = interpolate(f, [316, 336], [1, 0], clamp);

  const markerIn = interpolate(local, [130, 166], [0, 1], clamp);
  const pulse = 1 + 0.35 * Math.abs(Math.sin((local - 130) / 9));
  const idx = Math.min(drawnIndex, 120);
  const lastX = chartX(idx);
  const lastY = chartY(priceAt(idx));

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={860} />

      <div style={{position: 'absolute', top: 240, left: 64, width: 952}}>
        <div style={{opacity: line1, transform: `translateY(${line1Y}px)`, fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em', color: '#fff', fontFamily: 'Arial, sans-serif'}}>
          Big moves start
        </div>
        <div style={{opacity: line2, transform: `translateY(${line2Y}px)`, fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em', color: GREEN, fontFamily: 'Arial, sans-serif', marginTop: 6}}>
          with data.
        </div>
        <div style={{opacity: subOp, fontSize: 28, lineHeight: 1.45, color: '#c4d9ea', marginTop: 22, maxWidth: 900, fontFamily: 'Arial, sans-serif'}}>
          High-impact USD releases move gold, indices and the dollar.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 660, left: 64, width: 952,
          borderRadius: 28, background: 'rgba(9,40,76,0.74)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 26px', borderBottom: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{fontSize: 25, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>XAU/USD · 1H</div>
          <div style={{fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>ILLUSTRATIVE</div>
        </div>

        <svg width={CW} height={CH + 40} viewBox={`0 0 ${CW} ${CH + 40}`}>
          <defs>
            <linearGradient id="rFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.26" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={0} x2={CW} y1={80 + g * 95} y2={80 + g * 95} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          ))}
          {drawnIndex > 2 && <path d={`${pathTo(drawnIndex)} L ${lastX} ${CH + 40} L 0 ${CH + 40} Z`} fill="url(#rFill)" />}
          {drawnIndex > 0 && <path d={pathTo(drawnIndex)} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />}
          <g opacity={markerIn}>
            <line x1={chartX(72)} x2={chartX(72)} y1={20} y2={CH + 20} stroke={RED} strokeWidth={2.5} strokeDasharray="10 7" />
            <circle cx={chartX(72)} cy={chartY(priceAt(72))} r={26 * pulse} fill="none" stroke={RED} strokeWidth={2} opacity={0.5} />
            <circle cx={chartX(72)} cy={chartY(priceAt(72))} r={9} fill={RED} />
            <text x={chartX(72) - 16} y={44} textAnchor="end" fill={RED} fontSize={22} fontWeight={800} fontFamily="Arial, sans-serif">USD DATA</text>
          </g>
          {drawnIndex > 0 && drawnIndex < 121 && (
            <>
              <circle cx={lastX} cy={lastY} r={16} fill={GOLD} opacity={0.25} />
              <circle cx={lastX} cy={lastY} r={6} fill="#fff" />
            </>
          )}
        </svg>
      </div>

      <div style={{position: 'absolute', top: 1270, left: 64, width: 952, fontSize: 19, color: '#8fa8c0', opacity: cardOp, fontFamily: 'Arial, sans-serif'}}>
        Synthetic chart — the release timing is the only real input.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — the live calendar (6 rows)                                */
/* ------------------------------------------------------------------ */
const SceneCalendar: React.FC<ReelProps> = ({events, fetched}) => {
  const f = useCurrentFrame();
  const local = f - 330;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const sceneOut = interpolate(f, [700, 720], [1, 0], clamp);
  const panelIn = spring({frame: Math.max(0, local - 12), fps, config: {damping: 19, stiffness: 85, mass: 0.9}});
  const panelY = interpolate(panelIn, [0, 1], [70, 0]);
  const panelOp = interpolate(local, [12, 28], [0, 1], clamp);

  const shown = events.slice(0, 6);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={620} />

      <div style={{position: 'absolute', top: 150, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          THIS MONTH ON THE CALENDAR
        </div>
        <div style={{fontSize: 58, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 12, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Only what moves USD.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 350, left: 56, width: 968,
          borderRadius: 26, background: '#061a31',
          border: '1px solid #173b5e',
          boxShadow: '0 30px 80px rgba(2,12,26,0.55)',
          overflow: 'hidden', opacity: panelOp, transform: `translateY(${panelY}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
            High-impact USD calendar
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: 9, border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '7px 14px'}}>
            <div style={{width: 7, height: 7, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`}} />
            <div style={{fontSize: 12, fontWeight: 800, color: '#dceeff', letterSpacing: '0.05em', fontFamily: 'Arial, sans-serif'}}>
              USD · HIGH IMPACT
            </div>
          </div>
        </div>

        <div style={{padding: '2px 24px 8px'}}>
          {shown.map((e, i) => {
            const a = interpolate(local, [24 + i * 11, 44 + i * 11], [0, 1], clamp);
            const y = interpolate(local, [24 + i * 11, 44 + i * 11], [22, 0], clamp);
            return (
              <div
                key={`${e.d}-${e.n}-${i}`}
                style={{
                  opacity: a, transform: `translateY(${y}px)`,
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '17px 0',
                  borderBottom: i === shown.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{flex: '0 0 122px'}}>
                  <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif'}}>
                    {e.t}
                  </div>
                  <div style={{fontSize: 13, fontWeight: 700, color: '#7f97ae', marginTop: 2, letterSpacing: '0.04em', fontFamily: 'Arial, sans-serif'}}>
                    {e.d}
                  </div>
                </div>
                <div style={{flex: '0 0 auto', textAlign: 'center', fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', color: '#dceeff', background: 'rgba(22,133,207,0.22)', border: '1px solid rgba(22,133,207,0.45)', borderRadius: 8, padding: '6px 10px', fontFamily: 'Arial, sans-serif'}}>
                  USD
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: '#eaf4fc', lineHeight: 1.2, fontFamily: 'Arial, sans-serif'}}>
                    {e.n}
                  </div>
                  {(e.fc || e.pv) && (
                    <div style={{fontSize: 14, color: '#8fa8c0', marginTop: 3, fontFamily: 'Arial, sans-serif'}}>
                      {e.fc ? `forecast ${e.fc}` : ''}{e.fc && e.pv ? ' · ' : ''}{e.pv ? `previous ${e.pv}` : ''}
                    </div>
                  )}
                </div>
                <div style={{flex: '0 0 auto', fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', color: RED, background: 'rgba(198,83,73,0.18)', border: '1px solid rgba(198,83,73,0.42)', borderRadius: 8, padding: '5px 10px', fontFamily: 'Arial, sans-serif'}}>
                  HIGH
                </div>
              </div>
            );
          })}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 24px 13px', borderTop: '1px solid rgba(255,255,255,0.10)', fontSize: 14, color: '#9db6ca', fontFamily: 'Arial, sans-serif'}}>
          <span>Times in UTC · data by TradingView</span>
          <span style={{color: '#7f97ae'}}>{fetched}</span>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — forecast vs actual                                        */
/* ------------------------------------------------------------------ */
const SceneSurprise: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 720;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const sceneOut = interpolate(f, [1000, 1020], [1, 0], clamp);
  const cardIn = spring({frame: Math.max(0, local - 12), fps, config: {damping: 18, stiffness: 90, mass: 0.9}});
  const cardY = interpolate(cardIn, [0, 1], [60, 0]);
  const cardOp = interpolate(local, [12, 30], [0, 1], clamp);

  const bars = interpolate(local, [40, 84], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const points = [
    {t: 'Above forecast', p: 'Stronger USD data. Hawkish read.', c: '#5fd39b'},
    {t: 'Below forecast', p: 'Weaker USD data. Dovish read.', c: RED},
    {t: 'Price trades the gap', p: 'Not the number itself — the surprise.', c: SKY},
  ];

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={560} />

      <div style={{position: 'absolute', top: 170, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          READING A RELEASE
        </div>
        <div style={{fontSize: 58, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 12, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Forecast, then actual.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 360, left: 64, width: 952,
          borderRadius: 26, background: '#fff', padding: '34px 34px 30px',
          boxShadow: '0 26px 64px rgba(3,18,36,0.45)',
          opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#60758d', fontFamily: 'Arial, sans-serif'}}>
              FORECAST
            </div>
            <div style={{fontSize: 62, fontWeight: 800, color: '#425a73', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>
              1.3
            </div>
          </div>
          <div style={{fontSize: 34, color: '#b6c8d8', marginBottom: 18, fontFamily: 'Arial, sans-serif'}}>→</div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#25804b', fontFamily: 'Arial, sans-serif'}}>
              ACTUAL
            </div>
            <div style={{fontSize: 62, fontWeight: 800, color: '#25804b', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>
              1.42
            </div>
          </div>
        </div>

        <div style={{marginTop: 26, height: 14, borderRadius: 7, background: '#eef3f7', overflow: 'hidden'}}>
          <div style={{width: `${bars * 100}%`, height: '100%', background: 'linear-gradient(90deg, #25804b, #5fd39b)', borderRadius: 7}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 15, color: '#7b8fa5', fontFamily: 'Arial, sans-serif'}}>
          <span>Illustrative figures</span>
          <span>surprise +9.2%</span>
        </div>
      </div>

      <div style={{position: 'absolute', top: 800, left: 64, width: 952}}>
        {points.map((p, i) => {
          const a = interpolate(local, [70 + i * 14, 92 + i * 14], [0, 1], clamp);
          const y = interpolate(local, [70 + i * 14, 92 + i * 14], [26, 0], clamp);
          return (
            <div
              key={p.t}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', alignItems: 'center', gap: 18,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18, padding: '20px 24px', marginBottom: 16,
              }}
            >
              <div style={{flex: '0 0 auto', width: 8, height: 56, borderRadius: 4, background: p.c}} />
              <div>
                <div style={{fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>{p.t}</div>
                <div style={{fontSize: 20, color: '#a9c1d6', marginTop: 4, fontFamily: 'Arial, sans-serif'}}>{p.p}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4 — workflow                                                  */
/* ------------------------------------------------------------------ */
const STEPS = [
  {n: '01', t: 'Check the day', p: 'Scan the high-impact USD releases before you open a chart.'},
  {n: '02', t: 'Convert the time', p: 'Calendar times are UTC. Confirm them in your own zone.'},
  {n: '03', t: 'Respect the release', p: 'Spreads widen and stops slip when data prints.'},
  {n: '04', t: 'Wait for the close', p: 'Let the reaction settle, then read the structure.'},
];

const SceneSteps: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 1020;
  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const sceneOut = interpolate(f, [1276, 1296], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={560} />
      <div style={{position: 'absolute', top: 180, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          USING THE CALENDAR
        </div>
        <div style={{fontSize: 58, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 12, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Context before the candle.
        </div>
      </div>

      <div style={{position: 'absolute', top: 400, left: 64, width: 952}}>
        {STEPS.map((s, i) => {
          const a = interpolate(local, [14 + i * 13, 38 + i * 13], [0, 1], clamp);
          const y = interpolate(local, [14 + i * 13, 38 + i * 13], [30, 0], clamp);
          return (
            <div
              key={s.n}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', gap: 24, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 22, padding: '28px 30px', marginBottom: 22,
              }}
            >
              <div style={{flex: '0 0 auto', width: 60, height: 60, borderRadius: 16, background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 23, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif'}}>
                {s.n}
              </div>
              <div>
                <div style={{fontSize: 33, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>{s.t}</div>
                <div style={{fontSize: 22, color: '#a9c1d6', marginTop: 7, lineHeight: 1.4, fontFamily: 'Arial, sans-serif'}}>{s.p}</div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 5 — end card (same site CTA)                                  */
/* ------------------------------------------------------------------ */
const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 1290;

  const logoOp = interpolate(local, [0, 18], [0, 1], clamp);
  const logoScale = interpolate(local, [0, 26], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const ctaOp = interpolate(local, [18, 40], [0, 1], clamp);
  const discOp = interpolate(local, [36, 58], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, #12376e 0%, ${NAVY_DEEP} 58%, #04101f 100%)`, justifyContent: 'center', alignItems: 'center'}}>
      <Grid />
      <Orb cy={760} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 72px'}}>
        <div style={{opacity: logoOp, transform: `scale(${logoScale})`, width: 142, height: 142, borderRadius: 34, background: NAVY, border: '2.5px solid rgba(183,243,75,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif', boxShadow: '0 0 90px rgba(183,243,75,0.22)'}}>
          TW
        </div>
        <div style={{opacity: logoOp, fontSize: 88, fontWeight: 800, color: '#fff', marginTop: 30, letterSpacing: '-0.03em', fontFamily: 'Arial, sans-serif'}}>
          TraderWatch
        </div>
        <div style={{opacity: ctaOp, fontSize: 34, fontWeight: 700, color: '#a9c1d6', marginTop: 16, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
          See the week before it moves.
        </div>
        <div style={{opacity: ctaOp, marginTop: 48, display: 'inline-flex', alignItems: 'center', gap: 12, background: GREEN, color: '#193414', fontSize: 30, fontWeight: 800, padding: '24px 52px', borderRadius: 16, fontFamily: 'Arial, sans-serif'}}>
          Explore market setups →
        </div>
        <div style={{opacity: discOp, fontSize: 19, color: '#6f88a6', marginTop: 68, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>
          Educational context only. Trading is risky; no outcomes are guaranteed.
          Calendar data is real; the chart and the release figures are illustrative.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main — 1440 frames @ 30fps = 48s, portrait 1080x1920                 */
/* ------------------------------------------------------------------ */
export const TraderWatchNewsReel: React.FC<ReelProps> = ({events, fetched, range, count}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 96 && <SceneCover events={events} fetched={fetched} range={range} count={count} />}
      {f >= 96 && f < 336 && <SceneHook />}
      {f >= 330 && f < 720 && <SceneCalendar events={events} fetched={fetched} range={range} count={count} />}
      {f >= 720 && f < 1020 && <SceneSurprise />}
      {f >= 1020 && f < 1296 && <SceneSteps />}
      {f >= 1290 && <SceneEnd />}
    </AbsoluteFill>
  );
};
