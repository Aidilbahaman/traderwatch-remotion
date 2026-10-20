import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';
import {CANDLES} from './xauH4Oct';

const W = 1080;

/* TraderWatch brand tokens — same values as app.css / index.html */
const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const RED = '#c65349';

const UP = '#35a86b';
const DOWN = '#d9635a';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

export type LiveEvent = {t: string; d: string; n: string; fc?: string; pv?: string};
export type ChartVariant = 'area' | 'candle';
export type ChartReelProps = {
  events: LiveEvent[];
  fetched: string;
  range: string;
  count: number;
  variant: ChartVariant;
};

/* ------------------------------------------------------------------ */
/* geometry — one source of truth for both chart styles                */
/* ------------------------------------------------------------------ */
const CONTENT_W = 952;
const PLOT_W = 848;
const PLOT_H = 560;
const AXIS_W = 56;
const PAD_X = 22;
const PAD_Y = 22;

const BAR_W = (PLOT_W - PAD_X * 2) / CANDLES.length;
const BODY_W = Math.max(2.6, BAR_W * 0.56);

const RAW_MIN = Math.min(...CANDLES.map((c) => c.l));
const RAW_MAX = Math.max(...CANDLES.map((c) => c.h));
const SPAN = RAW_MAX - RAW_MIN;
const LO = RAW_MIN - SPAN * 0.09;
const HI = RAW_MAX + SPAN * 0.09;

const cx = (i: number) => PAD_X + (i + 0.5) * BAR_W;
const cy = (p: number) => PAD_Y + ((HI - p) / (HI - LO)) * (PLOT_H - PAD_Y * 2);

const LEVELS = [0, 0.25, 0.5, 0.75, 1].map((k) => LO + (HI - LO) * k);
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DATE_TICKS = [0, 32, 64, CANDLES.length - 1].map((i) => {
  const d = new Date(CANDLES[Math.min(i, CANDLES.length - 1)].t);
  return {i, label: `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]}`};
});

const CLOSE_PATH = CANDLES.map((c, i) => `${i === 0 ? 'M' : 'L'} ${cx(i).toFixed(2)} ${cy(c.c).toFixed(2)}`).join(' ');

/* ------------------------------------------------------------------ */
/* chrome                                                             */
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

const Orb: React.FC<{y?: number}> = ({y = 960}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 600], [0.92, 1.12], clamp);
  const op = interpolate(f, [0, 60], [0.55, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute', left: W / 2, top: y,
        width: 1500, height: 1500, marginLeft: -750, marginTop: -750,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.30), rgba(13,79,145,0.10) 46%, transparent 68%)`,
        transform: `scale(${scale})`, opacity: op,
      }}
    />
  );
};

/* every scene sits in this vertically-centred column */
const Stage: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
    <div style={{width: CONTENT_W, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </AbsoluteFill>
);

const Kicker: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif', opacity}}>
    {children}
  </div>
);

const Title: React.FC<{children: React.ReactNode; size?: number}> = ({children, size = 58}) => (
  <div style={{fontSize: size, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 12, lineHeight: 1.06, fontFamily: 'Arial, sans-serif'}}>
    {children}
  </div>
);

const Explain: React.FC<{children: React.ReactNode; opacity?: number}> = ({children, opacity = 1}) => (
  <div style={{display: 'flex', gap: 16, marginTop: 18, opacity}}>
    <div style={{flex: '0 0 4px', borderRadius: 2, background: 'rgba(183,243,75,0.55)'}} />
    <div style={{fontSize: 24, lineHeight: 1.45, color: '#c4d9ea', fontFamily: 'Arial, sans-serif'}}>{children}</div>
  </div>
);

/* ------------------------------------------------------------------ */
/* Scene 0 — cover                                                     */
/* ------------------------------------------------------------------ */
const SceneCover: React.FC<ChartReelProps> = ({range, count}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 96], [1, 1.02], clamp);
  const barW = interpolate(f, [0, 26], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sceneOut = interpolate(f, [84, 96], [1, 0], clamp);

  return (
    <Stage opacity={sceneOut}>
      <div style={{transform: `scale(${drift})`, transformOrigin: 'center center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14, marginBottom: 54}}>
          <div style={{width: 62, height: 62, borderRadius: 17, background: NAVY, border: '1.5px solid rgba(183,243,75,0.40)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif'}}>TW</div>
          <div style={{fontSize: 30, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>TraderWatch</div>
        </div>

        <div style={{display: 'inline-flex', alignItems: 'center', gap: 10, border: '1px solid rgba(255,255,255,0.30)', borderRadius: 99, padding: '11px 20px', alignSelf: 'flex-start'}}>
          <div style={{width: 8, height: 8, borderRadius: '50%', background: GREEN}} />
          <div style={{fontSize: 18, fontWeight: 800, letterSpacing: '0.14em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
            FUNDAMENTAL NEWS · USD
          </div>
        </div>

        <div style={{fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: '#fff', marginTop: 30, fontFamily: 'Arial, sans-serif'}}>The week</div>
        <div style={{fontSize: 150, fontWeight: 800, lineHeight: 0.95, letterSpacing: '-0.055em', color: GREEN, fontFamily: 'Arial, sans-serif'}}>ahead.</div>

        <div style={{width: 520 * barW, height: 10, borderRadius: 6, background: `linear-gradient(90deg, ${GREEN}, rgba(183,243,75,0.15))`, marginTop: 34}} />

        <div style={{fontSize: 32, color: '#d6e7f5', marginTop: 32, fontFamily: 'Arial, sans-serif'}}>{count} high-impact USD events.</div>
        <div style={{fontSize: 26, color: '#9fb6cc', marginTop: 8, fontFamily: 'Arial, sans-serif'}}>{range} · times in UTC</div>

        <div style={{fontSize: 25, color: '#c4d9ea', marginTop: 44, lineHeight: 1.45, fontFamily: 'Arial, sans-serif'}}>
          The calendar tells you when. The chart tells you where.
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18}}>
          <div style={{fontSize: 20, color: '#8fa8c0', fontFamily: 'Arial, sans-serif'}}>Know the time before the candle prints.</div>
          <div style={{fontSize: 18, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>H4 · XAU/USD</div>
        </div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — the chart (area or candles, same geometry)                */
/* ------------------------------------------------------------------ */
const SceneChart: React.FC<{variant: ChartVariant}> = ({variant}) => {
  const f = useCurrentFrame();
  const local = f - 96;
  const {fps} = useVideoConfig();

  const headIn = interpolate(local, [0, 24], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const headY = interpolate(local, [0, 24], [26, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const explainIn = interpolate(local, [36, 64], [0, 1], clamp);

  const cardIn = spring({frame: Math.max(0, local - 8), fps, config: {damping: 20, stiffness: 85, mass: 1}});
  const cardY = interpolate(cardIn, [0, 1], [50, 0]);
  const cardOp = interpolate(local, [8, 26], [0, 1], clamp);

  /* zoomed out: the whole 97-bar range stays visible, camera creeps 1.00 → 1.02 */
  const zoom = interpolate(local, [10, 236], [1.0, 1.02], clamp);
  const draw = interpolate(local, [16, 158], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shown = Math.floor(draw * CANDLES.length);
  const headIdx = Math.max(0, Math.min(CANDLES.length - 1, shown - 1));
  const headX = cx(headIdx);
  const headP = CANDLES[headIdx].c;

  const liveOp = interpolate(local, [150, 172], [0, 1], clamp);
  const pulse = 1 + 0.42 * Math.abs(Math.sin((local - 152) / 9));
  const sceneOut = interpolate(f, [316, 336], [1, 0], clamp);

  const last = CANDLES[CANDLES.length - 1];
  const upBars = CANDLES.filter((c) => c.c >= c.o).length;

  return (
    <Stage opacity={sceneOut}>
      <div style={{opacity: headIn, transform: `translateY(${headY}px)`}}>
        <Kicker>THE CHART</Kicker>
        <Title size={56}>Read the structure.</Title>
      </div>

      <Explain opacity={explainIn}>
        Two weeks of H4. {variant === 'area' ? 'The close shows the trend at a glance.' : 'Each candle carries open, high, low and close.'} Read it before the release, not during it.
      </Explain>

      <div
        style={{
          marginTop: 30, width: CONTENT_W, borderRadius: 26, background: '#0b2138',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 22px', borderBottom: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
            <div style={{fontSize: 23, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>XAU/USD</div>
            <div style={{fontSize: 15, fontWeight: 800, color: '#8fa8c0', letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif'}}>H4 · {CANDLES.length} BARS</div>
          </div>
          <div style={{fontSize: 14, fontWeight: 800, color: '#8fa8c0', letterSpacing: '0.06em', fontFamily: 'Arial, sans-serif'}}>1 – 16 OCT 2026</div>
        </div>

        <div style={{position: 'relative', width: PLOT_W + AXIS_W, height: PLOT_H, margin: '0 auto'}}>
          <div style={{position: 'absolute', inset: 0, transform: `scale(${zoom})`, transformOrigin: 'center center'}}>
            <svg width={PLOT_W + AXIS_W} height={PLOT_H} viewBox={`0 0 ${PLOT_W + AXIS_W} ${PLOT_H}`}>
              <defs>
                <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SKY} stopOpacity="0.40" />
                  <stop offset="72%" stopColor={SKY} stopOpacity="0.09" />
                  <stop offset="100%" stopColor={SKY} stopOpacity="0" />
                </linearGradient>
                <clipPath id="revealClip">
                  <rect x={0} y={0} width={Math.max(0, PAD_X + shown * BAR_W)} height={PLOT_H} />
                </clipPath>
              </defs>

              {LEVELS.map((lv, i) => (
                <g key={i}>
                  <line x1={0} x2={PLOT_W} y1={cy(lv)} y2={cy(lv)} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
                  <text x={PLOT_W + 12} y={cy(lv) + 5} fill="#7f97ae" fontSize={14} fontFamily="Arial, sans-serif">{lv.toFixed(0)}</text>
                </g>
              ))}

              {DATE_TICKS.map((t) => (
                <g key={t.label}>
                  <line x1={cx(t.i)} x2={cx(t.i)} y1={0} y2={PLOT_H} stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
                  <text x={cx(t.i)} y={PLOT_H - 8} fill="#6f88a6" fontSize={13} textAnchor="middle" fontFamily="Arial, sans-serif">{t.label}</text>
                </g>
              ))}

              {variant === 'area' ? (
                <g clipPath="url(#revealClip)">
                  <path d={`${CLOSE_PATH} L ${cx(CANDLES.length - 1)} ${PLOT_H} L ${cx(0)} ${PLOT_H} Z`} fill="url(#areaFill)" />
                  <path d={CLOSE_PATH} fill="none" stroke={SKY} strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
                  <path d={CLOSE_PATH} fill="none" stroke={SKY} strokeWidth={11} strokeLinejoin="round" opacity={0.15} />
                </g>
              ) : (
                CANDLES.slice(0, shown).map((c, i) => {
                  const up = c.c >= c.o;
                  const col = up ? UP : DOWN;
                  const grow = Math.min(1, (shown - i) / 2.5);
                  const top = cy(Math.max(c.o, c.c));
                  const h = Math.max(1.8, Math.abs(cy(c.c) - cy(c.o)));
                  return (
                    <g key={c.t} opacity={Math.min(1, grow * 1.2)}>
                      <line x1={cx(i)} x2={cx(i)} y1={cy(c.h)} y2={cy(c.h) + (cy(c.l) - cy(c.h)) * grow} stroke={col} strokeWidth={1.6} />
                      <rect x={cx(i) - BODY_W / 2} y={top} width={BODY_W} height={h * grow} fill={col} />
                    </g>
                  );
                })
              )}

              <line
                x1={headX} x2={headX} y1={0} y2={PLOT_H}
                stroke="rgba(255,255,255,0.16)" strokeWidth={1}
                opacity={draw > 0.02 && draw < 0.99 ? 1 : 0}
              />
            </svg>

            <div style={{position: 'absolute', left: headX, top: cy(headP), opacity: draw > 0.02 ? 1 : 0}}>
              <div style={{position: 'absolute', width: 26 * (draw >= 1 ? pulse : 1), height: 26 * (draw >= 1 ? pulse : 1), left: -13, top: -13, borderRadius: '50%', border: `2px solid ${draw >= 1 ? 'rgba(53,168,107,0.6)' : 'rgba(22,133,207,0.55)'}`}} />
              <div style={{position: 'absolute', width: 9, height: 9, left: -4.5, top: -4.5, borderRadius: '50%', background: draw >= 1 ? UP : SKY, border: '2px solid #0b2138'}} />
              <div
                style={{
                  position: 'absolute', left: headX > PLOT_W - 130 ? -108 : 16, top: -16,
                  background: draw >= 1 ? UP : BLUE, color: '#fff', fontSize: 17, fontWeight: 800,
                  padding: '4px 9px', borderRadius: 6, fontVariantNumeric: 'tabular-nums',
                  fontFamily: 'Arial, sans-serif', whiteSpace: 'nowrap',
                }}
              >
                {headP.toFixed(1)}
              </div>
            </div>
          </div>
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 22px', borderTop: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
            <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <div style={{width: 10, height: 10, borderRadius: 2, background: UP}} />
              <div style={{fontSize: 14, color: '#9fb6cc', fontFamily: 'Arial, sans-serif'}}>{upBars} up</div>
            </div>
            <div style={{display: 'flex', alignItems: 'center', gap: 7}}>
              <div style={{width: 10, height: 10, borderRadius: 2, background: DOWN}} />
              <div style={{fontSize: 14, color: '#9fb6cc', fontFamily: 'Arial, sans-serif'}}>{CANDLES.length - upBars} down</div>
            </div>
          </div>
          <div style={{fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '0.08em', fontFamily: 'Arial, sans-serif'}}>
            {variant === 'area' ? 'LINE / AREA' : 'CANDLESTICK'} · {shown}/{CANDLES.length}
          </div>
        </div>
      </div>

      <div
        style={{
          marginTop: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 16, padding: '16px 22px', opacity: liveOp,
        }}
      >
        <div style={{fontSize: 18, color: '#9fb6cc', fontFamily: 'Arial, sans-serif'}}>Last close · 16 Oct</div>
        <div style={{fontSize: 30, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif'}}>{last.c.toFixed(1)}</div>
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — calendar                                                  */
/* ------------------------------------------------------------------ */
const SceneCalendar: React.FC<ChartReelProps> = ({events, fetched}) => {
  const f = useCurrentFrame();
  const local = f - 330;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 20], [0, 1], clamp);
  const explainIn = interpolate(local, [16, 42], [0, 1], clamp);
  const sceneOut = interpolate(f, [700, 720], [1, 0], clamp);
  const panelIn = spring({frame: Math.max(0, local - 12), fps, config: {damping: 19, stiffness: 85, mass: 0.9}});
  const panelY = interpolate(panelIn, [0, 1], [60, 0]);
  const panelOp = interpolate(local, [12, 28], [0, 1], clamp);

  const shown = events.slice(0, 6);

  return (
    <Stage opacity={sceneOut}>
      <div style={{opacity: headOp}}>
        <Kicker>THIS MONTH ON THE CALENDAR</Kicker>
        <Title>Only what moves USD.</Title>
      </div>

      <Explain opacity={explainIn}>
        Six high-impact releases. Times are UTC — convert them before you plan, and check the live calendar again on the day.
      </Explain>

      <div
        style={{
          marginTop: 28, width: CONTENT_W, borderRadius: 26, background: '#061a31',
          border: '1px solid #173b5e', boxShadow: '0 30px 80px rgba(2,12,26,0.55)',
          overflow: 'hidden', opacity: panelOp, transform: `translateY(${panelY}px)`,
        }}
      >
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid rgba(255,255,255,0.10)'}}>
          <div style={{fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>High-impact USD calendar</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 9, border: '1px solid rgba(255,255,255,0.18)', borderRadius: 999, padding: '7px 14px'}}>
            <div style={{width: 7, height: 7, borderRadius: '50%', background: GREEN, boxShadow: `0 0 10px ${GREEN}`}} />
            <div style={{fontSize: 12, fontWeight: 800, color: '#dceeff', letterSpacing: '0.05em', fontFamily: 'Arial, sans-serif'}}>USD · HIGH IMPACT</div>
          </div>
        </div>

        <div style={{padding: '2px 24px 8px'}}>
          {shown.map((e, i) => {
            const a = interpolate(local, [24 + i * 11, 44 + i * 11], [0, 1], clamp);
            const y = interpolate(local, [24 + i * 11, 44 + i * 11], [20, 0], clamp);
            return (
              <div
                key={`${e.d}-${e.n}-${i}`}
                style={{
                  opacity: a, transform: `translateY(${y}px)`,
                  display: 'flex', alignItems: 'center', gap: 16, padding: '17px 0',
                  borderBottom: i === shown.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.07)',
                }}
              >
                <div style={{flex: '0 0 122px'}}>
                  <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums', fontFamily: 'Arial, sans-serif'}}>{e.t}</div>
                  <div style={{fontSize: 13, fontWeight: 700, color: '#7f97ae', marginTop: 2, fontFamily: 'Arial, sans-serif'}}>{e.d}</div>
                </div>
                <div style={{flex: '0 0 auto', fontSize: 14, fontWeight: 900, letterSpacing: '0.06em', color: '#dceeff', background: 'rgba(22,133,207,0.22)', border: '1px solid rgba(22,133,207,0.45)', borderRadius: 8, padding: '6px 10px', fontFamily: 'Arial, sans-serif'}}>USD</div>
                <div style={{flex: 1, minWidth: 0}}>
                  <div style={{fontSize: 24, fontWeight: 700, color: '#eaf4fc', lineHeight: 1.2, fontFamily: 'Arial, sans-serif'}}>{e.n}</div>
                  {(e.fc || e.pv) && (
                    <div style={{fontSize: 14, color: '#8fa8c0', marginTop: 3, fontFamily: 'Arial, sans-serif'}}>
                      {e.fc ? `forecast ${e.fc}` : ''}{e.fc && e.pv ? ' · ' : ''}{e.pv ? `previous ${e.pv}` : ''}
                    </div>
                  )}
                </div>
                <div style={{flex: '0 0 auto', fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', color: RED, background: 'rgba(198,83,73,0.18)', border: '1px solid rgba(198,83,73,0.42)', borderRadius: 8, padding: '5px 10px', fontFamily: 'Arial, sans-serif'}}>HIGH</div>
              </div>
            );
          })}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 24px 13px', borderTop: '1px solid rgba(255,255,255,0.10)', fontSize: 14, color: '#9db6ca', fontFamily: 'Arial, sans-serif'}}>
          <span>Times in UTC · data by TradingView</span>
          <span style={{color: '#7f97ae'}}>{fetched}</span>
        </div>
      </div>
    </Stage>
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
  const cardY = interpolate(cardIn, [0, 1], [50, 0]);
  const cardOp = interpolate(local, [12, 30], [0, 1], clamp);
  const bars = interpolate(local, [40, 84], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});

  const points = [
    {t: 'Above forecast', p: 'Stronger USD data. Hawkish read.', c: UP},
    {t: 'Below forecast', p: 'Weaker USD data. Dovish read.', c: RED},
    {t: 'Price trades the gap', p: 'Not the number itself — the surprise.', c: SKY},
  ];

  return (
    <Stage opacity={sceneOut}>
      <div style={{opacity: headOp}}>
        <Kicker>READING A RELEASE</Kicker>
        <Title>Forecast, then actual.</Title>
      </div>

      <Explain opacity={explainIn}>
        The market prices the forecast in advance. What moves price afterwards is the distance between forecast and actual.
      </Explain>

      <div style={{marginTop: 28, width: CONTENT_W, borderRadius: 26, background: '#fff', padding: '30px 32px 26px', boxShadow: '0 26px 64px rgba(3,18,36,0.45)', opacity: cardOp, transform: `translateY(${cardY}px)`}}>
        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between'}}>
          <div>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#60758d', fontFamily: 'Arial, sans-serif'}}>FORECAST</div>
            <div style={{fontSize: 56, fontWeight: 800, color: '#425a73', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>1.3</div>
          </div>
          <div style={{fontSize: 30, color: '#b6c8d8', marginBottom: 14, fontFamily: 'Arial, sans-serif'}}>→</div>
          <div style={{textAlign: 'right'}}>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: '#25804b', fontFamily: 'Arial, sans-serif'}}>ACTUAL</div>
            <div style={{fontSize: 56, fontWeight: 800, color: '#25804b', marginTop: 6, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.03em'}}>1.42</div>
          </div>
        </div>
        <div style={{marginTop: 22, height: 14, borderRadius: 7, background: '#eef3f7', overflow: 'hidden'}}>
          <div style={{width: `${bars * 100}%`, height: '100%', background: 'linear-gradient(90deg, #25804b, #5fd39b)', borderRadius: 7}} />
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 15, color: '#7b8fa5', fontFamily: 'Arial, sans-serif'}}>
          <span>Illustrative figures</span>
          <span>surprise +9.2%</span>
        </div>
      </div>

      <div style={{marginTop: 24}}>
        {points.map((p, i) => {
          const a = interpolate(local, [64 + i * 14, 86 + i * 14], [0, 1], clamp);
          const y = interpolate(local, [64 + i * 14, 86 + i * 14], [22, 0], clamp);
          return (
            <div key={p.t} style={{opacity: a, transform: `translateY(${y}px)`, display: 'flex', alignItems: 'center', gap: 18, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 18, padding: '18px 22px', marginBottom: 14}}>
              <div style={{flex: '0 0 auto', width: 8, height: 50, borderRadius: 4, background: p.c}} />
              <div>
                <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>{p.t}</div>
                <div style={{fontSize: 19, color: '#a9c1d6', marginTop: 3, fontFamily: 'Arial, sans-serif'}}>{p.p}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
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
    <Stage opacity={sceneOut}>
      <div style={{opacity: headOp}}>
        <Kicker>USING THE CALENDAR</Kicker>
        <Title>Context before the candle.</Title>
      </div>

      <Explain opacity={explainIn}>
        The calendar is a schedule, not a signal. Use it to prepare, then let the chart decide.
      </Explain>

      <div style={{marginTop: 28}}>
        {STEPS.map((s, i) => {
          const a = interpolate(local, [16 + i * 13, 40 + i * 13], [0, 1], clamp);
          const y = interpolate(local, [16 + i * 13, 40 + i * 13], [26, 0], clamp);
          return (
            <div key={s.n} style={{opacity: a, transform: `translateY(${y}px)`, display: 'flex', gap: 24, alignItems: 'flex-start', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 22, padding: '24px 26px', marginBottom: 20}}>
              <div style={{flex: '0 0 auto', width: 58, height: 58, borderRadius: 16, background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif'}}>{s.n}</div>
              <div>
                <div style={{fontSize: 31, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>{s.t}</div>
                <div style={{fontSize: 21, color: '#a9c1d6', marginTop: 6, lineHeight: 1.4, fontFamily: 'Arial, sans-serif'}}>{s.p}</div>
              </div>
            </div>
          );
        })}
      </div>
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 5 — end card                                                  */
/* ------------------------------------------------------------------ */
const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 1290;

  const logoOp = interpolate(local, [0, 18], [0, 1], clamp);
  const logoScale = interpolate(local, [0, 26], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const ctaOp = interpolate(local, [18, 40], [0, 1], clamp);
  const discOp = interpolate(local, [36, 58], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, #12376e 0%, ${NAVY_DEEP} 58%, #04101f 100%)`, justifyContent: 'center', alignItems: 'center'}}>
      <Grid />
      <Orb y={960} />
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 72px'}}>
        <div style={{opacity: logoOp, transform: `scale(${logoScale})`, width: 142, height: 142, borderRadius: 34, background: NAVY, border: '2.5px solid rgba(183,243,75,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 58, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif', boxShadow: '0 0 90px rgba(183,243,75,0.22)'}}>TW</div>
        <div style={{opacity: logoOp, fontSize: 86, fontWeight: 800, color: '#fff', marginTop: 30, letterSpacing: '-0.03em', fontFamily: 'Arial, sans-serif'}}>TraderWatch</div>
        <div style={{opacity: ctaOp, fontSize: 33, fontWeight: 700, color: '#a9c1d6', marginTop: 16, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>See the week before it moves.</div>
        <div style={{opacity: ctaOp, marginTop: 46, display: 'inline-flex', alignItems: 'center', gap: 12, background: GREEN, color: '#193414', fontSize: 30, fontWeight: 800, padding: '24px 52px', borderRadius: 16, fontFamily: 'Arial, sans-serif'}}>Explore market setups →</div>
        <div style={{opacity: discOp, fontSize: 19, color: '#6f88a6', marginTop: 62, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>
          Educational context only. Trading is risky; no outcomes are guaranteed.
          Chart shows 4H gold data; release figures are illustrative.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main — 1440 frames @ 30fps = 48s, portrait 1080x1920                 */
/* Every scene is vertically centred inside the frame.                  */
/* ------------------------------------------------------------------ */
export const TraderWatchChartReel: React.FC<ChartReelProps> = ({events, fetched, range, count, variant}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 96 && <SceneCover events={events} fetched={fetched} range={range} count={count} variant={variant} />}
      {f >= 96 && f < 336 && <SceneChart variant={variant} />}
      {f >= 330 && f < 720 && <SceneCalendar events={events} fetched={fetched} range={range} count={count} variant={variant} />}
      {f >= 720 && f < 1020 && <SceneSurprise />}
      {f >= 1020 && f < 1296 && <SceneSteps />}
      {f >= 1290 && <SceneEnd />}
    </AbsoluteFill>
  );
};
