import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {EURUSD_M1} from './eurusdM1';

/* ============================================================
   Technical vs Fundamental — Apple-keynote layout
   Same chrome/language as traderwatch-ai-signal-apple:
   centred brand · gradient headline · persistent agent · 41% stage
   1080x1920 · 7 steps · 36.6s
   ============================================================ */

const GLOW = '#3dffa0';
const BLUE = '#6ea8ff';
const GOLD = '#e0a33a';
const CYAN = '#4fc3f7';
const RED = '#ff6b6b';
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const u = (n: number) => n * 10.8; // HTML --u at 1080 wide

/* step timing taken from the signal film so the rhythm matches */
const STEP_MS = [4200, 4800, 4800, 4800, 4800, 5200, 8000];
const STEP_F = STEP_MS.map((m) => Math.round((m / 1000) * 30));
const START = STEP_F.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + STEP_F[i - 1]);
  return acc;
}, []);
export const TAFA_APPLE_FRAMES = STEP_F.reduce((a, b) => a + b, 0);

const easeCI = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ---------- copy, one entry per step ---------- */
const SCENES = [
  {a: 'How do you read', b: 'a market?', p: 'Two lenses. Same chart.'},
  {a: 'It asks why.', b: 'Fundamentals.', p: 'Earnings. Rates. Growth.'},
  {a: 'It asks what now.', b: 'Technicals.', p: 'Structure. Levels. Momentum.'},
  {a: 'One sees value.', b: 'The other sees timing.', p: 'Same asset. Different question.'},
  {a: 'Bias first.', b: 'Then the trigger.', p: 'Fundamentals set direction. Technicals set the entry.'},
  {a: 'The mistake.', b: 'Using one as the other.', p: 'A chart will justify any story you already believe.'},
];

/* ---------- persistent agent choreography [top%, scale] ---------- */
const HM: [number, number][] = [
  [64, 1.0],
  [88, 0.3],
  [88, 0.3],
  [88, 0.3],
  [88, 0.3],
  [69, 0.5],
  [69, 0.2],
];

/* ---------- real candles ---------- */
const BARS = EURUSD_M1.slice(8, 34);

const CandleChart: React.FC<{reveal: number; accent: string; levels?: boolean}> = ({reveal, accent, levels = false}) => {
  const CW = 972, CH = 520;
  const lo = Math.min(...BARS.map((c) => c.l));
  const hi = Math.max(...BARS.map((c) => c.h));
  const pad = (hi - lo) * 0.14;
  const y = (v: number) => CH - ((v - (lo - pad)) / (hi + pad - (lo - pad))) * CH;
  const step = CW / BARS.length;
  const shown = reveal * BARS.length;

  return (
    <svg width={CW} height={CH} style={{overflow: 'visible'}}>
      {[0.22, 0.44, 0.66, 0.88].map((r) => (
        <line key={r} x1={0} x2={CW} y1={CH * r} y2={CH * r} stroke="#fff" strokeOpacity={0.05} strokeDasharray="4 7" />
      ))}
      {BARS.map((c, i) => {
        const grow = Math.max(0, Math.min(1, shown - i));
        if (grow <= 0) return null;
        const up = c.c >= c.o;
        const cx = i * step + step / 2;
        const top = y(Math.max(c.o, c.c));
        const bot = y(Math.min(c.o, c.c));
        const mid = (top + bot) / 2;
        const col = up ? accent : '#5f7f99';
        return (
          <g key={i} opacity={Math.min(1, grow * 2)}>
            <line x1={cx} y1={mid + (y(c.h) - mid) * grow} x2={cx} y2={mid + (y(c.l) - mid) * grow} stroke={col} strokeWidth={2} />
            <rect x={cx - step * 0.27} y={mid + (top - mid) * grow} width={step * 0.54}
              height={Math.max(2.5, (bot - top) * grow)} rx={2} fill={col} opacity={0.9} />
          </g>
        );
      })}
      {levels && (
        <>
          <line x1={0} x2={CW} y1={y(hi - pad * 0.5)} y2={y(hi - pad * 0.5)} stroke={RED} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.75} />
          <line x1={0} x2={CW} y1={y(lo + pad * 0.5)} y2={y(lo + pad * 0.5)} stroke={GLOW} strokeWidth={1.6} strokeDasharray="7 7" opacity={0.75} />
        </>
      )}
    </svg>
  );
};

/* ---------- stage: 41%..75%, same band as the signal film ---------- */
const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{
    position: 'absolute', top: '41%', left: '5%', right: '5%', height: '34%',
    display: 'flex', flexDirection: 'column', justifyContent: 'center',
  }}>{children}</div>
);

const fadeIn = (p: number) => ({opacity: p, transform: `translateY(${(1 - p) * u(2.5)}px)`, filter: `blur(${(1 - p) * 6}px)`});

/* ============================================================ */
export const TechVsFundApple: React.FC = () => {
  const f = useCurrentFrame();

  let step = 0;
  for (let i = 0; i < STEP_F.length; i++) if (f >= START[i]) step = i;
  const local = f - START[step];

  // .on semantics: fade in at the step, fade out as the next one arrives
  const layer = (a: number, b: number) => {
    if (step === a) return clamp01(local / 24);
    if (step > a && step < b) return 1;
    if (step === b) return 1 - clamp01(local / 24);
    return 0;
  };

  const t = easeCI(clamp01(local / 36));
  const from = HM[step === 0 ? 0 : step - 1];
  const to = HM[step];
  const hmTop = from[0] + (to[0] - from[0]) * t;
  const hmScale = from[1] + (to[1] - from[1]) * t;
  const bob = -19.94 * (0.5 - 0.5 * Math.cos(((f % 90) / 90) * Math.PI * 2));
  const hmOpacity = layer(0, 6);

  const chartReveal = easeCI(clamp01(local / 72));

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000', color: '#f5f5f7'}}>

      {/* ---------- background ---------- */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 90% 45% at 50% 105%,rgba(30,110,255,.32),transparent 70%),' +
          'radial-gradient(ellipse 70% 30% at 50% -5%,rgba(61,255,160,.12),transparent 70%)',
      }} />

      {/* ---------- brand : centred, top 6% ---------- */}
      <div style={{
        position: 'absolute', top: '6%', left: 0, right: 0, textAlign: 'center',
        fontSize: u(3.6), fontWeight: 600, letterSpacing: '.01em', fontFamily: FONT,
      }}>
        <span style={{
          display: 'inline-block', width: u(1.3), height: u(1.3),
          background: GLOW, borderRadius: '50%', marginRight: u(1.2), verticalAlign: 'middle',
        }} />
        TraderWatch
      </div>

      {/* ---------- headline : top 13% ---------- */}
      <div style={{position: 'absolute', top: '13%', left: '8%', right: '8%', height: '26%'}}>
        {SCENES.map((s, i) => {
          const active = layer(i, i + 1);
          const entering = step === i;
          const exitP = step === i + 1 ? 1 - clamp01(local / 24) : 1;
          const p1 = active * (entering ? clamp01(local / 27) : exitP);
          const p2 = active * (entering ? clamp01((local - 5) / 27) : exitP);
          const p3 = active * (entering ? clamp01((local - 12) / 27) : exitP);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, textAlign: 'center', opacity: active > 0 ? 1 : 0}}>
              <h2 style={{margin: 0, fontSize: u(8), lineHeight: 1.06, fontWeight: 700, letterSpacing: '-.04em', fontFamily: FONT}}>
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(180deg,#fff,#c9c9ce)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
                  ...fadeIn(p1),
                }}>{s.a}</span>
                <span style={{display: 'block', color: '#6e6e73', ...fadeIn(p2)}}>{s.b}</span>
              </h2>
              {s.p ? (
                <p style={{
                  margin: `${u(3.4)}px 0 0`, fontSize: u(3.8), color: '#a1a1a6',
                  fontWeight: 500, letterSpacing: '-.01em', fontFamily: FONT, ...fadeIn(p3),
                }}>{s.p}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ---------- stage : 41% band ---------- */}

      {/* 0 — cover: two lenses */}
      <div style={{...stageWrap, opacity: layer(0, 1)}}>
        <div style={{display: 'flex', gap: 20 * clamp01(local / 60)}}>
          {[
            ['TECHNICAL', 'Price', CYAN, 'rgba(79,195,247,'],
            ['FUNDAMENTAL', 'Value', GOLD, 'rgba(224,163,58,'],
          ].map(([tag, big, col, bg], i) => (
            <div key={tag} style={{
              flex: 1, padding: '34px 22px', borderRadius: 22, textAlign: 'center',
              background: `${bg}.13)`, border: `1.5px solid ${bg}.55)`,
              transform: `scale(${0.95 + clamp01(local / 60) * 0.05})`,
            }}>
              <div style={{fontSize: u(1.5), fontWeight: 900, letterSpacing: '.14em', color: col, fontFamily: FONT}}>{tag}</div>
              <div style={{marginTop: 12, fontSize: u(4.6), fontWeight: 800, letterSpacing: '-.04em', color: '#fff', fontFamily: FONT}}>{big}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 1 — fundamentals rows */}
      <div style={{...stageWrap, opacity: layer(1, 2)}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {[
            ['Earnings', 'Is the business making money?', 0.84],
            ['Interest rates', 'What does money cost?', 0.62],
            ['Growth', 'Is the economy speeding up?', 0.44],
          ].map(([n, d, v], i) => {
            const q = clamp01((local - i * 14) / 34);
            return (
              <div key={n as string} style={{
                padding: '24px 26px', borderRadius: 20,
                background: 'rgba(224,163,58,.10)', border: '1px solid rgba(224,163,58,.30)',
                ...fadeIn(q),
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <div style={{fontSize: u(2.5), fontWeight: 800, color: '#ffe6bd', fontFamily: FONT}}>{n as string}</div>
                  <div style={{fontSize: u(1.5), color: '#a08355', fontFamily: FONT}}>slow signal</div>
                </div>
                <div style={{fontSize: u(1.8), color: '#c0a980', marginTop: 6, fontFamily: FONT}}>{d as string}</div>
                <div style={{marginTop: 14, height: 8, borderRadius: 5, background: 'rgba(255,255,255,.09)', overflow: 'hidden'}}>
                  <div style={{height: '100%', width: `${(v as number) * 100 * q}%`, background: GOLD, borderRadius: 5}} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2 — technicals chart */}
      <div style={{...stageWrap, opacity: layer(2, 3)}}>
        <CandleChart reveal={chartReveal} accent={CYAN} levels />
        <div style={{textAlign: 'center', fontSize: u(1.55), color: '#6f8aa6', marginTop: 16, fontFamily: FONT}}>
          EUR/USD · M1 · real OHLC
        </div>
      </div>

      {/* 3 — two columns */}
      <div style={{...stageWrap, opacity: layer(3, 4)}}>
        <div style={{display: 'flex', gap: 18}}>
          {[
            ['FUNDAMENTAL', 'Why is it worth this?', 'Months to years', GOLD, 'rgba(224,163,58,'],
            ['TECHNICAL', 'What is it doing now?', 'Minutes to weeks', CYAN, 'rgba(79,195,247,'],
          ].map(([tag, q, h, col, bg], i) => {
            const p = clamp01((local - i * 16) / 34);
            return (
              <div key={tag} style={{
                flex: 1, padding: '30px 24px', borderRadius: 22,
                background: `${bg}.10)`, border: `1.5px solid ${bg}.45)`,
                ...fadeIn(p),
              }}>
                <div style={{fontSize: u(1.5), fontWeight: 900, letterSpacing: '.13em', color: col, fontFamily: FONT}}>{tag}</div>
                <div style={{marginTop: 16, fontSize: u(2.7), fontWeight: 700, lineHeight: 1.25, color: '#fff', fontFamily: FONT}}>{q}</div>
                <div style={{marginTop: 16, fontSize: u(1.9), color: '#8fa8c0', fontFamily: FONT}}>{h}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4 — bias then trigger */}
      <div style={{...stageWrap, opacity: layer(4, 5)}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
          {[
            ['01', 'BIAS', 'Fundamentals', GOLD, 'rgba(224,163,58,'],
            ['02', 'TRIGGER', 'Technicals', CYAN, 'rgba(79,195,247,'],
            ['03', 'RISK', 'Position size', GLOW, 'rgba(61,255,160,'],
          ].map(([n, ttl, sub, col, bg], i) => {
            const p = clamp01((local - i * 18) / 34);
            return (
              <React.Fragment key={ttl}>
                {i > 0 && (
                  <div style={{fontSize: u(3), color: '#4a5a6a', opacity: clamp01((local - i * 18) / 30), fontFamily: FONT}}>→</div>
                )}
                <div style={{
                  flex: 1, padding: '28px 18px', borderRadius: 20, textAlign: 'center',
                  background: `${bg}.10)`, border: `1.5px solid ${bg}.45)`,
                  ...fadeIn(p),
                }}>
                  <div style={{fontSize: u(1.4), fontWeight: 900, color: col, letterSpacing: '.12em', fontFamily: FONT}}>{n}</div>
                  <div style={{marginTop: 10, fontSize: u(2.5), fontWeight: 800, color: '#fff', fontFamily: FONT}}>{ttl}</div>
                  <div style={{marginTop: 6, fontSize: u(1.6), color: '#8fa8c0', fontFamily: FONT}}>{sub}</div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* 5 — the mistake */}
      <div style={{...stageWrap, opacity: layer(5, 6)}}>
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {[
            ['A chart to justify a story', 'It always fits what you already believe.'],
            ['A valuation to time an entry', 'Cheap can stay cheap for a very long time.'],
          ].map(([ttl, d], i) => {
            const p = clamp01((local - i * 22) / 34);
            return (
              <div key={ttl} style={{
                padding: '26px 28px', borderRadius: 20,
                background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.30)',
                display: 'flex', gap: 18, alignItems: 'flex-start', ...fadeIn(p),
              }}>
                <div style={{fontSize: u(2.4), color: RED, fontWeight: 900, lineHeight: 1, fontFamily: FONT}}>✕</div>
                <div>
                  <div style={{fontSize: u(2.4), fontWeight: 800, color: '#ffd9db', fontFamily: FONT}}>{ttl}</div>
                  <div style={{fontSize: u(1.8), color: '#c9a3a6', marginTop: 7, lineHeight: 1.4, fontFamily: FONT}}>{d}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- persistent agent ---------- */}
      <div style={{
        position: 'absolute', left: '50%', width: u(80), marginLeft: u(-40),
        top: `${hmTop}%`,
        transform: `translateY(-50%) scale(${hmScale}) translateY(${bob}px)`,
        opacity: hmOpacity, pointerEvents: 'none',
      }}>
        <svg viewBox="-130 -70 260 140" style={{width: '100%', display: 'block', overflow: 'visible'}}>
          <defs>
            <radialGradient id="ogT" cx=".35" cy=".3" r=".8">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".35" stopColor="#b9ffe0" />
              <stop offset="1" stopColor="#1fb97a" />
            </radialGradient>
            <linearGradient id="wgT" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#8fd8ff" stopOpacity="0" />
            </linearGradient>
            <filter id="blT" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          <circle r="46" fill={GLOW} opacity=".55" filter="url(#blT)" />
          <g fill="none" stroke="url(#wgT)" strokeWidth="3.5" strokeLinecap="round">
            <path d="M42 -10Q84 -42 124 -36" />
            <path d="M44 2Q92 -10 130 6" />
            <path d="M42 14Q84 20 110 44" />
            <path d="M42 -10Q84 -42 124 -36" transform="scale(-1,1)" />
            <path d="M44 2Q92 -10 130 6" transform="scale(-1,1)" />
            <path d="M42 14Q84 20 110 44" transform="scale(-1,1)" />
          </g>
          <circle r="40" fill="url(#ogT)" />
          <ellipse cx="-12" cy="-22" rx="16" ry="8" fill="#fff" opacity=".45" />
          <rect x="-21" y="-6" width="42" height="15" rx="7.5" fill="#06121a" opacity=".92" />
          <circle cx="-7" cy="1.5" r="2.8" fill={GLOW} />
          <circle cx="7" cy="1.5" r="2.8" fill={GLOW} />
        </svg>
      </div>

      {/* ---------- end card ---------- */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%,rgba(61,255,160,.22),#000 70%)',
        opacity: layer(6, 99),
        transform: `scale(${1.04 - layer(6, 99) * 0.04})`,
      }}>
        <Img
          src={staticFile('traderwatch-ai-agents-logo.png')}
          style={{width: u(30), height: u(30), objectFit: 'contain'}}
        />
        <div style={{fontSize: u(4.2), fontWeight: 600, margin: `${u(3)}px 0 ${u(12)}px`, color: '#f5f5f7', fontFamily: FONT}}>
          TraderWatch
        </div>
        <div style={{fontSize: u(6.2), fontWeight: 700, letterSpacing: '-.03em', color: '#a1a1a6', fontFamily: FONT}}>
          Trade with a plan.
        </div>
        <div style={{
          fontSize: u(9.4), fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.05, marginTop: 14,
          background: 'linear-gradient(90deg,#3dffa0,#8fd8ff)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', fontFamily: FONT,
        }}>
          Bias. Trigger.<br />Risk.
        </div>
        <div style={{fontSize: u(3.2), color: '#86868b', marginTop: 22, fontFamily: FONT}}>
          Fundamentals and technicals, together.
        </div>
        <div style={{
          position: 'absolute', bottom: '4%', left: '10%', right: '10%',
          fontSize: u(2.3), color: '#6e6e73', lineHeight: 1.4, fontFamily: FONT,
        }}>
          Educational content only. Not financial advice. Trading involves risk.
        </div>
      </div>

    </AbsoluteFill>
  );
};

const stageWrap: React.CSSProperties = {
  position: 'absolute', top: '41%', left: '5%', right: '5%', height: '34%',
  display: 'flex', flexDirection: 'column', justifyContent: 'center',
};
