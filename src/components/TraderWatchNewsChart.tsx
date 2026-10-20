import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {TRACE} from './chartTrace';
import {CANDLES} from './xauH4';

const W = 1080;

/* TraderWatch brand tokens — same values as app.css / index.html */
const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const RED = '#c65349';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export type LiveEvent = {t: string; d: string; n: string; fc?: string; pv?: string};
export type ChartReelProps = {
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

/* small shared type helpers so every scene reads the same way */
const Kicker: React.FC<{children: React.ReactNode; op?: number}> = ({children, op = 1}) => (
  <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif', opacity: op}}>
    {children}
  </div>
);

const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 58}) => (
  <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 12, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
    {children}
  </div>
);

/* explanation line under the headline of every scene */
const Explain: React.FC<{children: React.ReactNode; op: number; top: number}> = ({children, op, top}) => (
  <div
    style={{
      position: 'absolute', top, left: 64, width: 952,
      display: 'flex', gap: 16, opacity: op,
    }}
  >
    <div style={{flex: '0 0 4px', borderRadius: 2, background: 'rgba(183,243,75,0.55)', marginTop: 4}} />
    <div style={{fontSize: 25, lineHeight: 1.45, color: '#c4d9ea', fontFamily: 'Arial, sans-serif'}}>
      {children}
    </div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 0 — cover / thumbnail (visible on frame 0)                    */
/* ------------------------------------------------------------------ */
const SceneCover: React.FC<ChartReelProps> = ({range, count}) => {
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

      <div style={{position: 'absolute', top: 440, left: 72, right: 72}}>
        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.30)', borderRadius: 99, padding: '11px 20px'}}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: GREEN}} />
          <div style={{fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
            FUNDAMENTAL NEWS · USD
          </div>
        </div>

        <div style={{fontSize: 158, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: '#fff', marginTop: 34, fontFamily: 'Arial, sans-serif'}}>
          The week
        </div>
        <div style={{fontSize: 158, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: GREEN, fontFamily: 'Arial, sans-serif'}}>
          ahead.
        </div>

        <div style={{width: 520 * barW, height: 10, borderRadius: 6, background: `linear-gradient(90deg, ${GREEN}, rgba(183,243,75,0.15))`, marginTop: 36}} />

        <div style={{fontSize: 33, color: '#d6e7f5', marginTop: 34, lineHeight: 1.45, fontFamily: 'Arial, sans-serif'}}>
          {count} high-impact USD events.
        </div>
        <div style={{fontSize: 27, color: '#9fb6cc', marginTop: 8, fontFamily: 'Arial, sans-serif'}}>
          {range} · times in UTC
        </div>
      </div>

      <div style={{position: 'absolute', bottom: 118, left: 72, right: 72}}>
        <div style={{fontSize: 26, color: '#c4d9ea', lineHeight: 1.45, fontFamily: 'Arial, sans-serif'}}>
          The calendar tells you when. The chart tells you where.
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14}}>
          <div style={{fontSize: 21, color: '#8fa8c0', fontFamily: 'Arial, sans-serif'}}>
            Know the time before the candle prints.
          </div>
          <div style={{fontSize: 19, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
            ILLUSTRATIVE
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — real XAU/USD H4 candles, drawing themselves               */
/* ------------------------------------------------------------------ */

const PLOT_W = 872;
const PLOT_H = 500;
const AXIS_W = 64;
const BAR_W = PLOT_W / CANDLES.length;

const P_MIN = Math.min(...CANDLES.map((c) => c.l));
const P_MAX = Math.max(...CANDLES.map((c) => c.h));
const PAD = (P_MAX - P_MIN) * 0.04;
const LO = P_MIN - PAD;
const HI = P_MAX + PAD;

const px = (i: number) => (i + 0.5) * BAR_W;
const py = (p: number) => PLOT_H - ((p - LO) / (HI - LO)) * PLOT_H;

const LEVELS = [0, 0.25, 0.5, 0.75, 1].map((k) => LO + (HI - LO) * k);

const DATE_TICKS = (() => {
  const out: {i: number; label: string}[] = [];
  const seen = new Set<string>();
  CANDLES.forEach((c, i) => {
    const d = new Date(c.t);
    const key = `${d.getUTCDate()}`;
    if (d.getUTCDate() % 14 === 1 && !seen.has(key)) {
      seen.add(key);
      out.push({i, label: `${d.getUTCDate()} ${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d.getUTCMonth()]}`});
    }
  });
  return out.slice(0, 4);
})();

const SceneChart: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 96;
  const {fps} = useVideoConfig();

  const headIn = interpolate(local, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const headY = interpolate(local, [0, 26], [34, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const explainIn = interpolate(local, [40, 70], [0, 1], clamp);

  const cardIn = spring({frame: Math.max(0, local - 8), fps, config: {damping: 20, stiffness: 85, mass: 1}});
  const cardY = interpolate(cardIn, [0, 1], [70, 0]);
  const cardOp = interpolate(local, [8, 28], [0, 1], clamp);

  /* candles print left to right, then the camera creeps */
  const draw = interpolate(local, [14, 150], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shown = Math.floor(draw * CANDLES.length);
  const zoom = interpolate(local, [14, 236], [1.0, 1.035], clamp);

  const last = CANDLES[CANDLES.length - 1];
  const pulse = 1 + 0.4 * Math.abs(Math.sin((local - 150) / 8));
  const liveOp = interpolate(local, [148, 168], [0, 1], clamp);
  const sceneOut = interpolate(f, [316, 336], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={900} />

      <div style={{position: 'absolute', top: 190, left: 64, width: 952, opacity: headIn, transform: `translateY(${headY}px)`}}>
        <Kicker>THE CHART</Kicker>
        <Title size={60}>Read the structure.</Title>
      </div>

      <Explain op={explainIn} top={312}>
        Forty-five days of H4 candles. Note where price sat before the release, then read how it reacted.
      </Explain>

      <div
        style={{
          position: 'absolute', top: 460, left: 64, width: 952,
          borderRadius: 26, background: '#0b2138',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 14}}>
            <div style={{fontSize: 23, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>XAU/USD</div>
            <div style={{fontSize: 16, fontWeight: 800, color: '#8fa8c0', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif'}}>H4 · {CANDLES.length} bars</div>
          </div>
          <div style={{fontSize: 15, fontWeight: 800, color: '#8fa8c0', letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif'}}>
            1 SEP — 16 OCT 2026
          </div>
        </div>

        <div style={{position: 'relative', height: PLOT_H + 46, padding: '10px 8px 0 8px'}}>
          <div style={{position: 'relative', width: PLOT_W + AXIS_W, transform: `scale(${zoom})`, transformOrigin: 'center center'}}>
            <svg width={PLOT_W + AXIS_W} height={PLOT_H + 30} viewBox={`0 0 ${PLOT_W + AXIS_W} ${PLOT_H + 30}`}>
              {/* grid + price axis */}
              {LEVELS.map((lv, i) => (
                <g key={i}>
                  <line x1={0} x2={PLOT_W} y1={py(lv)} y2={py(lv)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                  <text x={PLOT_W + 10} y={py(lv) + 6} fill="#7f97ae" fontSize={15} fontFamily="Arial, sans-serif">
                    {lv.toFixed(0)}
                  </text>
                </g>
              ))}

              {/* date ticks */}
              {DATE_TICKS.map((t) => (
                <g key={t.label}>
                  <line x1={px(t.i)} x2={px(t.i)} y1={0} y2={PLOT_H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  <text x={px(t.i)} y={PLOT_H + 22} fill="#7f97ae" fontSize={14} textAnchor="middle" fontFamily="Arial, sans-serif">
                    {t.label}
                  </text>
                </g>
              ))}

              {/* candles */}
              {CANDLES.slice(0, shown).map((c, i) => {
                const up = c.c >= c.o;
                const col = up ? '#35a86b' : '#d9635a';
                const appear = Math.min(1, (shown - i) / 3);
                const bodyTop = py(Math.max(c.o, c.c));
                const bodyH = Math.max(1.6, Math.abs(py(c.c) - py(c.o)));
                return (
                  <g key={c.t} opacity={appear}>
                    <line
                      x1={px(i)} x2={px(i)}
                      y1={py(c.h)} y2={py(c.h) + (py(c.l) - py(c.h)) * appear}
                      stroke={col} strokeWidth={1.4}
                    />
                    <rect x={px(i) - 1.5} y={bodyTop} width={3} height={bodyH * appear} fill={col} />
                  </g>
                );
              })}
            </svg>
          {/* live marker on the last bar */}
          <div
            style={{
              position: 'absolute', top: py(last.c), left: px(CANDLES.length - 1),
              opacity: liveOp, pointerEvents: 'none',
            }}
          >
            <div style={{position: 'absolute', width: 34 * pulse, height: 34 * pulse, left: -17, top: -17, borderRadius: '50%', border: '2px solid rgba(53,168,107,0.55)'}} />
            <div style={{position: 'absolute', width: 10, height: 10, left: -5, top: -5, borderRadius: '50%', background: '#35a86b', border: '2px solid #0b2138'}} />
            <div style={{position: 'absolute', left: -150, top: -18, width: 132, textAlign: 'right', fontSize: 20, fontWeight: 800, color: '#35a86b', fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif'}}>
              {last.c.toFixed(1)}
            </div>
          </div>
          </div>

        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderTop: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{fontSize: 15, color: '#8fa8c0', fontFamily: 'Arial, sans-serif'}}>
            4H gold data · educational use only
          </div>
          <div style={{fontSize: 14, fontWeight: 800, color: '#b7f34b', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif'}}>
            {shown} / {CANDLES.length} BARS
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — the live calendar                                         */
/* ------------------------------------------------------------------ */
const SceneCalendar: React.FC<ChartReelProps> = ({events, fetched}) => {
  const f = useCurrentFrame();
  const local = f - 330;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const explainIn = interpolate(local, [16, 42], [0, 1], clamp);
  const sceneOut = interpolate(f, [700, 720], [1, 0], clamp);
  const panelIn = spring({frame: Math.max(0, local - 12), fps, config: {damping: 19, stiffness: 85, mass: 0.9}});
  const panelY = interpolate(panelIn, [0, 1], [70, 0]);
  const panelOp = interpolate(local, [12, 28], [0, 1], clamp);

  const shown = events.slice(0, 6);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={680} />

      <div style={{position: 'absolute', top: 132, left: 64, width: 952, opacity: headOp}}>
        <Kicker>THIS MONTH ON THE CALENDAR</Kicker>
        <Title>Only what moves USD.</Title>
      </div>

      <Explain op={explainIn} top={252}>
        Six high-impact releases. Times are UTC — convert them before you plan, and check the live calendar again on the day.
      </Explain>

      <div
        style={{
          position: 'absolute', top: 400, left: 56, width: 968,
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
                  <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif'}}>{e.t}</div>
                  <div style={{fontSize: 13, fontWeight: 700, color: '#7f97ae', marginTop: 2, letterSpacing: '0.04em', fontFamily: 'Arial, sans-serif'}}>{e.d}</div>
                </div>
                <div style={{flex: '0 0 auto', textAlign: 'center', fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', color: '#dceeff', background: 'rgba(22,133,207,0.22)', border: '1px solid rgba(22,133,207,0.45)', borderRadius: 8, padding: '6px 10px', fontFamily: 'Arial, sans-serif'}}>
                  USD
                </div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: '#eaf4fc', lineHeight: 1.2, fontFamily: 'Arial, sans-serif'}}>{e.n}</div>
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
  const explainIn = interpolate(local, [16, 42], [0, 1], clamp);
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
      <Orb cy={620} />

      <div style={{position: 'absolute', top: 150, left: 64, width: 952, opacity: headOp}}>
        <Kicker>READING A RELEASE</Kicker>
        <Title>Forecast, then actual.</Title>
      </div>

      <Explain op={explainIn} top={268}>
        The market prices the forecast in advance. What moves price afterwards is the distance between forecast and actual.
      </Explain>

      <div
        style={{
          position: 'absolute', top: 400, left: 64, width: 952,
          borderRadius: 26, background: '#fff', padding: '32px 34px 28px',
          boxShadow: '0 26px 64px rgba(3,18,36,0.45)',
          opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#60758d', fontFamily: 'Arial, sans-serif'}}>FORECAST</div>
            <div style={{fontSize: 58, fontWeight: 800, color: '#425a73', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>1.3</div>
          </div>
          <div style={{fontSize: 32, color: '#b6c8d8', marginBottom: 16, fontFamily: 'Arial, sans-serif'}}>→</div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#25804b', fontFamily: 'Arial, sans-serif'}}>ACTUAL</div>
            <div style={{fontSize: 58, fontWeight: 800, color: '#25804b', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>1.42</div>
          </div>
        </div>

        <div style={{marginTop: 24, height: 14, borderRadius: 7, background: '#eef3f7', overflow: 'hidden'}}>
          <div style={{width: `${bars * 100}%`, height: '100%', background: 'linear-gradient(90deg, #25804b, #5fd39b)', borderRadius: 7}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 15, color: '#7b8fa5', fontFamily: 'Arial, sans-serif'}}>
          <span>Illustrative figures</span>
          <span>surprise +9.2%</span>
        </div>
      </div>

      <div style={{position: 'absolute', top: 760, left: 64, width: 952}}>
        {points.map((p, i) => {
          const a = interpolate(local, [64 + i * 14, 86 + i * 14], [0, 1], clamp);
          const y = interpolate(local, [64 + i * 14, 86 + i * 14], [26, 0], clamp);
          return (
            <div
              key={p.t}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', alignItems: 'center', gap: 18,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 18, padding: '19px 24px', marginBottom: 14,
              }}
            >
              <div style={{flex: '0 0 auto', width: 8, height: 54, borderRadius: 4, background: p.c}} />
              <div>
                <div style={{fontSize: 27, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>{p.t}</div>
                <div style={{fontSize: 19, color: '#a9c1d6', marginTop: 3, fontFamily: 'Arial, sans-serif'}}>{p.p}</div>
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
  {n: '03', t: 'Mark the chart', p: 'Note where price sits before the release prints.'},
  {n: '04', t: 'Wait for the close', p: 'Let the reaction settle, then read the structure.'},
];

const SceneSteps: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 1020;
  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const explainIn = interpolate(local, [14, 40], [0, 1], clamp);
  const sceneOut = interpolate(f, [1276, 1296], [1, 0], clamp);

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={600} />
      <div style={{position: 'absolute', top: 150, left: 64, width: 952, opacity: headOp}}>
        <Kicker>USING THE CALENDAR</Kicker>
        <Title>Context before the candle.</Title>
      </div>

      <Explain op={explainIn} top={268}>
        The calendar is a schedule, not a signal. Use it to prepare, then let the chart decide.
      </Explain>

      <div style={{position: 'absolute', top: 400, left: 64, width: 952}}>
        {STEPS.map((s, i) => {
          const a = interpolate(local, [16 + i * 13, 40 + i * 13], [0, 1], clamp);
          const y = interpolate(local, [16 + i * 13, 40 + i * 13], [30, 0], clamp);
          return (
            <div
              key={s.n}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', gap: 24, alignItems: 'flex-start',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 22, padding: '26px 28px', marginBottom: 20,
              }}
            >
              <div style={{flex: '0 0 auto', width: 58, height: 58, borderRadius: 16, background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif'}}>
                {s.n}
              </div>
              <div>
                <div style={{fontSize: 32, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>{s.t}</div>
                <div style={{fontSize: 21, color: '#a9c1d6', marginTop: 6, lineHeight: 1.4, fontFamily: 'Arial, sans-serif'}}>{s.p}</div>
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
        <div style={{opacity: logoOp, fontSize: 86, fontWeight: 800, color: '#fff', marginTop: 30, letterSpacing: '-0.03em', fontFamily: 'Arial, sans-serif'}}>
          TraderWatch
        </div>
        <div style={{opacity: ctaOp, fontSize: 33, fontWeight: 700, color: '#a9c1d6', marginTop: 16, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
          See the week before it moves.
        </div>
        <div style={{opacity: ctaOp, marginTop: 46, display: 'inline-flex', alignItems: 'center', gap: 12, background: GREEN, color: '#193414', fontSize: 30, fontWeight: 800, padding: '24px 52px', borderRadius: 16, fontFamily: 'Arial, sans-serif'}}>
          Explore market setups →
        </div>
        <div style={{opacity: discOp, fontSize: 19, color: '#6f88a6', marginTop: 62, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>
          Educational context only. Trading is risky; no outcomes are guaranteed.
          Calendar data is real; the chart and release figures are illustrative.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main — 1440 frames @ 30fps = 48s, portrait 1080x1920                 */
/* ------------------------------------------------------------------ */
export const TraderWatchNewsChart: React.FC<ChartReelProps> = ({events, fetched, range, count}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 96 && <SceneCover events={events} fetched={fetched} range={range} count={count} />}
      {f >= 96 && f < 336 && <SceneChart />}
      {f >= 330 && f < 720 && <SceneCalendar events={events} fetched={fetched} range={range} count={count} />}
      {f >= 720 && f < 1020 && <SceneSurprise />}
      {f >= 1020 && f < 1296 && <SceneSteps />}
      {f >= 1290 && <SceneEnd />}
    </AbsoluteFill>
  );
};
