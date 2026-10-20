import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';

/* ============================================================
   TraderWatch · "How does AI send you a signal?"
   Faithful port of traderwatch-ai-signal-apple.html
   1080x1920 · single-page layout with step-based reveals
   ============================================================ */

const GLOW = '#3dffa0';
const BLUE = '#6ea8ff';
const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

// HTML --u = clientWidth/100 = 1080/100 = 10.8px
const u = (n: number) => n * 10.8;

/* --- step timing straight from the HTML (ms → frames @30fps) --- */
const STEP_MS = [4200, 4800, 4800, 4800, 4800, 5200, 8000];
const STEP_F = STEP_MS.map((m) => Math.round((m / 1000) * 30));
const START = STEP_F.reduce<number[]>((acc, _, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + STEP_F[i - 1]);
  return acc;
}, []);
export const AISignalFrames = STEP_F.reduce((a, b) => a + b, 0);

/* --- chart path (identical PTS + Catmull-Rom-to-Bézier from HTML) --- */
const VW = 320;
const VH = 210;
const PTS: [number, number][] = [
  [8, 112], [40, 142], [66, 126], [92, 170], [118, 136], [144, 152],
  [168, 170], [192, 188], [212, 152], [228, 162], [246, 134],
];

const smooth = (p: [number, number][]) => {
  let d = `M${p[0][0]} ${p[0][1]}`;
  for (let i = 0; i < p.length - 1; i++) {
    const a = p[i - 1] || p[i];
    const b = p[i];
    const c = p[i + 1];
    const e = p[i + 2] || c;
    d += `C${b[0] + (c[0] - a[0]) / 6} ${b[1] + (c[1] - a[1]) / 6} ` +
         `${c[0] - (e[0] - b[0]) / 6} ${c[1] - (e[1] - b[1]) / 6} ${c[0]} ${c[1]}`;
  }
  return d;
};

const LINE_D = smooth(PTS);
const AREA_D = `${LINE_D}L246 210L8 210Z`;

/* Sample the actual cubic path so the white head stays on the curve. */
const cubicPoint = (p0: [number, number], p1: [number, number], p2: [number, number], p3: [number, number], t: number): [number, number] => {
  const m = 1 - t;
  return [
    m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0],
    m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1],
  ];
};
const PATH_SAMPLES: [number, number][] = [];
for (let i = 0; i < PTS.length - 1; i++) {
  const a = PTS[i - 1] || PTS[i];
  const b = PTS[i];
  const c = PTS[i + 1];
  const e = PTS[i + 2] || c;
  const c1: [number, number] = [b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6];
  const c2: [number, number] = [c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6];
  for (let j = 0; j <= 32; j++) PATH_SAMPLES.push(cubicPoint(b, c1, c2, c, j / 32));
}
const yAt = (x: number) => {
  let best = PATH_SAMPLES[0];
  for (const p of PATH_SAMPLES) {
    if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
  }
  return best[1];
};

/* --- reveal targets per step: R=[0,168,168,246,246,246,246] --- */
const R = [0, 168, 168, 246, 246, 246, 246];
const REVEAL_FRAMES = 72; // 2400ms in the HTML

/* --- Hermes avatar choreography: [top%, scale, labelTop%] --- */
const HM: [number, number, number][] = [
  [64, 1.0, 82],
  [88, 0.3, 95],
  [88, 0.3, 95],
  [88, 0.3, 95],
  [88, 0.3, 95],
  [69, 0.5, 95],
  [69, 0.2, 95],
];

const easeCI = (k: number) => (k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2);
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/* ============================================================
   Scene copy — verbatim from the HTML
   ============================================================ */
const SCENES = [
  {a: 'How does AI', b: 'send you a signal?', p: ''},
  {a: 'It watches.', b: 'All day. Every day.', p: 'XAUUSD · EURUSD · GBPUSD'},
  {a: 'It reads structure.', b: 'Like a trader would.', p: 'Liquidity. Order blocks. Zones.'},
  {a: 'It confirms.', b: 'Or it waits.', p: 'A sweep, then a reaction. No confirmation, no signal.'},
  {a: 'It builds it.', b: 'Entry. Stop. Target.', p: 'Risk to reward, calculated.'},
  {a: 'It sends it.', b: 'You decide.', p: 'The AI finds the setup. You decide the trade.'},
];

export const AISignalApple: React.FC = () => {
  const f = useCurrentFrame();

  // which step are we in, and how far through it
  let step = 0;
  for (let i = 0; i < STEP_F.length; i++) if (f >= START[i]) step = i;
  const local = f - START[step];

  // visibility: shown while step >= a && step < b

  // Mirrors the HTML's `.on` class semantics: adding the class fades the layer
  // in over .8s, removing it fades it out over .8s. Both layers are on screen
  // during the hand-off, which is what makes the crossfade work.
  const layer = (a: number, b: number) => {
    if (step === a) return clamp01(local / 24);
    if (step > a && step < b) return 1;
    if (step === b) return 1 - clamp01(local / 24);
    return 0;
  };

  /* --- chart reveal --- */
  const target = R[step];
  const prev = step === 0 ? 0 : R[step - 1];
  const cw = prev + (target - prev) * easeCI(clamp01(local / REVEAL_FRAMES));

  /* --- Hermes position (1.2s cubic-bezier(.6,0,.2,1)) --- */
  const t = easeCI(clamp01(local / 36));
  const from = HM[step === 0 ? 0 : step - 1];
  const to = HM[step];
  const hmTop = from[0] + (to[0] - from[0]) * t;
  const hmScale = from[1] + (to[1] - from[1]) * t;
  // CSS `.fl` runs 0 → -6 → 0 over 3s. Convert SVG user units to
  // screen pixels; the later outer scale naturally scales this offset too.
  const bobPhase = (f % 90) / 90;
  const hmBob = -19.94 * (0.5 - 0.5 * Math.cos(bobPhase * Math.PI * 2));
  const hmOpacity = layer(0, 6);
  const chartOpacity = layer(1, 5);
  const structureOpacity = layer(2, 5);
  const sweepOpacity = layer(3, 5);
  const levelsOpacity = layer(4, 5);
  const telegramOpacity = layer(5, 6);
  const ctaOpacity = layer(6, 99);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#000', color: '#f5f5f7'}}>

      {/* ---------- background (verbatim) ---------- */}
      <div style={{
        position: 'absolute', inset: 0,
        background:
          'radial-gradient(ellipse 90% 45% at 50% 105%,rgba(30,110,255,.32),transparent 70%),' +
          'radial-gradient(ellipse 70% 30% at 50% -5%,rgba(61,255,160,.12),transparent 70%)',
      }} />

      {/* ---------- #brand : centered, top 6% ---------- */}
      <div style={{
        position: 'absolute', top: '6%', left: 0, right: 0,
        textAlign: 'center',
        fontSize: u(3.6), fontWeight: 600, letterSpacing: '.01em',
        fontFamily: FONT,
      }}>
        <span style={{
          display: 'inline-block',
          width: u(1.3), height: u(1.3),
          background: GLOW, borderRadius: '50%',
          marginRight: u(1.2),
          verticalAlign: 'middle',
        }} />
        TraderWatch
      </div>

      {/* ---------- #tx : top 13%, left/right 8%, height 26% ---------- */}
      <div style={{
        position: 'absolute', top: '13%', left: '8%', right: '8%', height: '26%',
      }}>
        {SCENES.map((s, i) => {
          const active = layer(i, i + 1);
          const entering = step === i;
          const exitP = step === i + 1 ? 1 - clamp01(local / 24) : 1;
          const p1 = active * (entering ? clamp01(local / 27) : exitP);
          const p2 = active * (entering ? clamp01((local - 5) / 27) : exitP);
          const p3 = active * (entering ? clamp01((local - 12) / 27) : exitP);
          return (
            <div key={i} style={{position: 'absolute', inset: 0, textAlign: 'center', opacity: active > 0 ? 1 : 0}}>
              <h2 style={{
                margin: 0, fontSize: u(8), lineHeight: 1.06,
                fontWeight: 700, letterSpacing: '-.04em', fontFamily: FONT,
              }}>
                <span style={{
                  display: 'block',
                  background: 'linear-gradient(180deg,#fff,#c9c9ce)',
                  WebkitBackgroundClip: 'text', backgroundClip: 'text',
                  color: 'transparent',
                  opacity: p1, transform: `translateY(${(1 - p1) * u(2.5)}px)`, filter: `blur(${(1 - p1) * 8}px)`,
                }}>{s.a}</span>
                <span style={{
                  display: 'block', color: '#6e6e73',
                  opacity: p2, transform: `translateY(${(1 - p2) * u(2.5)}px)`, filter: `blur(${(1 - p2) * 8}px)`,
                }}>{s.b}</span>
              </h2>
              {s.p ? (
                <p style={{
                  margin: `${u(3.4)}px 0 0`, fontSize: u(3.8),
                  color: '#a1a1a6', fontWeight: 500, letterSpacing: '-.01em',
                  fontFamily: FONT,
                  opacity: p3, transform: `translateY(${(1 - p3) * u(2.5)}px)`, filter: `blur(${(1 - p3) * 8}px)`,
                }}>{s.p}</p>
              ) : null}
            </div>
          );
        })}
      </div>

      {/* ---------- #chart : top 41%, left/right 5%, height 34% ---------- */}
      <div style={{
        position: 'absolute', top: '41%', left: '5%', right: '5%', height: '34%',
        opacity: chartOpacity,
      }}>
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%" height="100%"
          style={{overflow: 'visible'}}
        >
          <defs>
            <linearGradient id="ls" x1="0" x2="1">
              <stop offset="0" stopColor={BLUE} />
              <stop offset="1" stopColor={GLOW} />
            </linearGradient>
            <linearGradient id="ar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={GLOW} stopOpacity=".22" />
              <stop offset="1" stopColor={GLOW} stopOpacity="0" />
            </linearGradient>
            <filter id="gl" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <clipPath id="cp">
              <rect id="cr" x="0" y="0" width={cw + 2} height={VH} />
            </clipPath>
          </defs>

          <g stroke="#fff" strokeOpacity=".07">
            <line x1="0" x2={VW} y1="40" y2="40" />
            <line x1="0" x2={VW} y1="100" y2="100" />
            <line x1="0" x2={VW} y1="160" y2="160" />
          </g>

          <g clipPath="url(#cp)">
            <path d={AREA_D} fill="url(#ar)" />
            <path d={LINE_D} fill="none" stroke="url(#ls)" strokeWidth="5" filter="url(#gl)" opacity=".7" />
            <path d={LINE_D} fill="none" stroke="url(#ls)" strokeWidth="2.4" strokeLinecap="round" />
          </g>

          {/* head dot — follows chart reveal */}
          <circle
            cx={cw} cy={yAt(cw)} r="4.5" fill="#fff"
            opacity={cw > 10 ? 1 : 0}
          />

          {/* structure annotations — visible steps 2,3,4 */}
          <g opacity={structureOpacity}>
            <line x1="66" x2="312" y1="170" y2="170" stroke={BLUE} strokeDasharray="3 4" strokeOpacity=".8" />
            <text x="312" y="183" textAnchor="end" fill={BLUE} fontSize="8.5" fontWeight="600" fontFamily={FONT}>Liquidity</text>
            <rect x="206" y="146" width="26" height="22" rx="4" fill={BLUE} fillOpacity=".2" stroke={BLUE} strokeOpacity=".8" />
            <text x="219" y="138" textAnchor="middle" fill="#a8c8ff" fontSize="8.5" fontWeight="600" fontFamily={FONT}>Order block</text>
          </g>

          {/* sweep ring — visible steps 3,4 */}
          <g opacity={sweepOpacity}>
            <circle cx="192" cy="188" r="5" fill="none" stroke={GLOW} strokeWidth="1.6" />
            <circle
              cx="192" cy="188"
              r={5 * (0.5 + ((f % 54) / 54) * 1.9)}
              fill="none" stroke={GLOW} strokeWidth="1"
              opacity={0.9 * (1 - (f % 54) / 54)}
            />
            <text x="192" y="204" textAnchor="middle" fill={GLOW} fontSize="8.5" fontWeight="600" fontFamily={FONT}>Sweep</text>
            <text x="312" y="14" textAnchor="end" fill={GLOW} fontSize="11" fontWeight="600" fontFamily={FONT}>✓ Confirmed</text>
          </g>

          {/* levels — visible step 4 */}
          <g opacity={levelsOpacity}>
            <rect x="176" y="62" width="136" height="88" fill={GLOW} fillOpacity=".1" />
            <rect x="176" y="150" width="136" height="44" fill="#ff6b6b" fillOpacity=".12" />
            <line x1="176" x2="312" y1="62" y2="62" stroke={GLOW} />
            <line x1="176" x2="312" y1="150" y2="150" stroke="#fff" strokeDasharray="4 3" />
            <line x1="176" x2="312" y1="194" y2="194" stroke="#ff6b6b" />
            <text x="310" y="56" textAnchor="end" fill={GLOW} fontSize="8.5" fontWeight="600" fontFamily={FONT}>Take profit</text>
            <text x="310" y="144" textAnchor="end" fill="#fff" fontSize="8.5" fontWeight="600" fontFamily={FONT}>Entry</text>
            <text x="310" y="208" textAnchor="end" fill="#ff8a8a" fontSize="8.5" fontWeight="600" fontFamily={FONT}>Stop loss</text>
            <text x="180" y="106" fill={GLOW} fontSize="12" fontWeight="700" fontFamily={FONT}>1 : 2</text>
          </g>
        </svg>
      </div>

      {/* ---------- #hm : Hermes agent avatar ---------- */}
      <div style={{
        position: 'absolute',
        left: '50%',
        width: u(80),
        marginLeft: u(-40),
        top: `${hmTop}%`,
        transform: `translateY(-50%) scale(${hmScale}) translateY(${hmBob}px)`,
        opacity: hmOpacity,
        pointerEvents: 'none',
      }}>
        <svg viewBox="-130 -70 260 140" style={{width: '100%', display: 'block', overflow: 'visible'}}>
          <defs>
            <radialGradient id="og" cx=".35" cy=".3" r=".8">
              <stop offset="0" stopColor="#fff" />
              <stop offset=".35" stopColor="#b9ffe0" />
              <stop offset="1" stopColor="#1fb97a" />
            </radialGradient>
            <linearGradient id="wg" x1="0" x2="1">
              <stop offset="0" stopColor="#fff" />
              <stop offset="1" stopColor="#8fd8ff" stopOpacity="0" />
            </linearGradient>
            <filter id="bl" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          <circle r="46" fill={GLOW} opacity=".55" filter="url(#bl)" />

          <g fill="none" stroke="url(#wg)" strokeWidth="3.5" strokeLinecap="round">
            <path d="M42 -10Q84 -42 124 -36" />
            <path d="M44 2Q92 -10 130 6" />
            <path d="M42 14Q84 20 110 44" />
            <path d="M42 -10Q84 -42 124 -36" transform="scale(-1,1)" />
            <path d="M44 2Q92 -10 130 6" transform="scale(-1,1)" />
            <path d="M42 14Q84 20 110 44" transform="scale(-1,1)" />
          </g>

          <circle r="40" fill="url(#og)" />
          <ellipse cx="-12" cy="-22" rx="16" ry="8" fill="#fff" opacity=".45" />
          <rect x="-21" y="-6" width="42" height="15" rx="7.5" fill="#06121a" opacity=".92" />
          <circle cx="-7" cy="1.5" r="2.8" fill={GLOW} />
          <circle cx="7" cy="1.5" r="2.8" fill={GLOW} />
        </svg>
      </div>

      {/* ---------- #nt : Telegram notification (step 5) ---------- */}
      <div style={{
        position: 'absolute',
        left: '7%', right: '7%', top: '42%',
        display: 'flex', gap: u(3.4),
        padding: u(3.6),
        borderRadius: u(6),
        background: 'rgba(255,255,255,.14)',
        backdropFilter: 'blur(24px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,.2)',
        boxShadow: '0 20px 60px rgba(0,0,0,.5)',
        opacity: telegramOpacity,
        transform: `translateY(${(1 - telegramOpacity) * u(-10)}px) scale(${0.94 + telegramOpacity * 0.06})`,
      }}>
        <div style={{
          flex: 'none',
          width: u(11), height: u(11),
          borderRadius: u(2.6),
          background: '#0a0f1a',
          border: '1px solid rgba(255,255,255,.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: u(6.4), color: GLOW,
          fontFamily: FONT, position: 'relative',
        }}>
          T
          <div style={{
            position: 'absolute',
            right: u(1.6), bottom: u(1.6),
            width: u(1.8), height: u(1.8),
            background: GLOW,
          }} />
        </div>
        <div style={{flex: 1}}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            fontSize: u(3.2), color: '#c7c7cc', fontFamily: FONT,
          }}>
            <b style={{color: '#fff', fontWeight: 700, fontSize: u(3.4)}}>Traderwatch AI Agents</b>
            <span>now</span>
          </div>
          <div style={{
            fontSize: u(3.7), fontWeight: 600, margin: `${u(0.8)}px 0`,
            fontFamily: FONT, color: '#fff',
          }}>New signal · XAUUSD Buy</div>
          <div style={{fontSize: u(3.3), color: '#c7c7cc', fontFamily: FONT}}>
            Entry, SL and TP are ready.
          </div>
        </div>
      </div>

      {/* ---------- #cta : final screen (step 6) ---------- */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        background: 'radial-gradient(ellipse 80% 50% at 50% 100%,rgba(61,255,160,.22),#000 70%)',
        opacity: ctaOpacity,
        transform: `scale(${1.04 - ctaOpacity * 0.04})`,
      }}>
        <Img
          src={staticFile('traderwatch-ai-agents-logo.png')}
          style={{
            width: u(30), height: u(30), objectFit: 'contain',
            opacity: 1,
          }}
        />

        <div style={{
          fontSize: u(4.2), fontWeight: 600,
          margin: `${u(3)}px 0 ${u(14)}px`,
          fontFamily: FONT, color: '#f5f5f7',
          opacity: 1,
        }}>TraderWatch</div>

        <div style={{
          fontSize: u(6.6), fontWeight: 700, letterSpacing: '-.03em',
          color: '#a1a1a6', fontFamily: FONT,
          opacity: 1,
        }}>Ready to trade?</div>

        <div style={{
          fontSize: u(10.5), fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.05,
          background: 'linear-gradient(90deg,#3dffa0,#8fd8ff)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
          fontFamily: FONT,
          opacity: 1,
        }}>First $30<br />on us.</div>

        <div style={{
          fontSize: u(3.3), color: '#86868b',
          margin: `${u(3)}px 0 ${u(9)}px`,
          fontFamily: FONT,
          opacity: 1,
        }}>$30 starter credit · Limited time only</div>

        <div style={{
          background: '#f5f5f7', color: '#000',
          fontWeight: 700, fontSize: u(4.6),
          padding: `${u(3.4)}px ${u(10)}px`,
          borderRadius: 99,
          fontFamily: FONT,
          opacity: 1,
        }}>Link in bio</div>

        <div style={{
          fontSize: u(3.8), marginTop: u(5), color: '#d2d2d7',
          fontFamily: FONT,
          opacity: 1,
        }}>Comment SIGNAL</div>

        <div style={{
          position: 'absolute', bottom: '4%', left: '10%', right: '10%',
          fontSize: u(2.4), color: '#6e6e73', lineHeight: 1.4,
          fontFamily: FONT,
          opacity: 1,
        }}>
          Education only. Trading involves risk. Not financial advice. No guaranteed returns.
        </div>
      </div>

    </AbsoluteFill>
  );
};
