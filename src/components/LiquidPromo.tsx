import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

/* ============================================================
   TraderWatch promo — liquid morph
   1080x1920 · 8 scenes · 190 frames each
   Motion system: SVG "goo" filter + metaball blobs that merge,
   split and re-form behind every beat.
   ============================================================ */

const NAVY = '#061a31';
const SKY = '#1685cf';
const LIME = '#b7f34b';
const BLUE = '#0d4f91';
const MUTED = '#9db6ca';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const SCENE = 190;
const COUNT = 8;
export const PROMO_FRAMES = SCENE * COUNT;

/* ---------- liquid system ---------- */

type Blob = {x: number; y: number; r: number; ax: number; ay: number; sp: number; ph: number};

const makeBlobs = (n: number, cx: number, cy: number, spread: number, base: number, seed = 0): Blob[] =>
  Array.from({length: n}).map((_, i) => {
    const a = (i / n) * Math.PI * 2 + seed;
    return {
      x: cx + Math.cos(a) * spread * 0.55,
      y: cy + Math.sin(a) * spread * 0.55,
      r: base * (0.75 + ((i * 37) % 10) / 22),
      ax: 34 + ((i * 13) % 30),
      ay: 26 + ((i * 17) % 26),
      sp: 0.018 + ((i * 7) % 9) / 900,
      ph: i * 1.7 + seed,
    };
  });

const Liquid: React.FC<{
  f: number;
  blobs: Blob[];
  color: string;
  opacity?: number;
  blur?: number;
  scale?: number;
  cx?: number;
  cy?: number;
}> = ({f, blobs, color, opacity = 1, blur = 26, scale = 1, cx = 540, cy = 900}) => (
  <g opacity={opacity} transform={`translate(${cx} ${cy}) scale(${scale}) translate(${-cx} ${-cy})`}>
    <g filter="url(#goo)">
      {blobs.map((b, i) => {
        const x = b.x + Math.sin(f * b.sp + b.ph) * b.ax;
        const y = b.y + Math.cos(f * b.sp * 1.23 + b.ph) * b.ay;
        const r = b.r * (0.86 + 0.16 * Math.sin(f * b.sp * 1.6 + b.ph));
        return <circle key={i} cx={x} cy={y} r={r} fill={color} />;
      })}
    </g>
    <defs>
      <filter id="goo" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
        <feColorMatrix
          in="blur"
          mode="matrix"
          values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 26 -12"
          result="goo"
        />
        <feBlend in="SourceGraphic" in2="goo" />
      </filter>
    </defs>
  </g>
);

/* A soft liquid field behind everything: 3 drifting masses */
const Field: React.FC<{f: number; tint?: string}> = ({f, tint = SKY}) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <g filter="url(#fieldgoo)" opacity={0.5}>
        <circle cx={200 + Math.sin(f * 0.012) * 90} cy={420 + Math.cos(f * 0.01) * 70} r={300} fill={tint} opacity={0.30} />
        <circle cx={880 + Math.cos(f * 0.009) * 80} cy={1180 + Math.sin(f * 0.011) * 90} r={340} fill={BLUE} opacity={0.34} />
        <circle cx={520 + Math.sin(f * 0.008 + 2) * 110} cy={1620 + Math.cos(f * 0.013) * 60} r={260} fill={tint} opacity={0.20} />
      </g>
      <defs>
        <filter id="fieldgoo" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation={70} result="b" />
          <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" />
        </filter>
      </defs>
    </svg>
  </AbsoluteFill>
);

/* ---------- chrome ---------- */

const Chrome: React.FC<{section: string; p: number}> = ({section, p}) => (
  <>
    <div style={{position: 'absolute', top: 64, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: p}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Img src={staticFile('logo-mark.png')} style={{height: 56, width: 60, objectFit: 'contain'}} />
        <div style={{fontSize: 19, fontWeight: 900, letterSpacing: '.16em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>TRADERWATCH</div>
      </div>
      <div style={{fontSize: 15, fontWeight: 800, letterSpacing: '.18em', color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position: 'absolute', top: 138, left: 72, right: 72, height: 1, background: 'rgba(255,255,255,.13)', opacity: p}} />
  </>
);

const Dots: React.FC<{index: number}> = ({index}) => (
  <div style={{position: 'absolute', bottom: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 9}}>
    {Array.from({length: COUNT}).map((_, i) => (
      <div key={i} style={{
        width: i === index ? 40 : 10, height: 10, borderRadius: 999,
        background: i === index ? LIME : 'rgba(255,255,255,.22)',
        boxShadow: i === index ? '0 0 16px rgba(183,243,75,.6)' : 'none',
      }} />
    ))}
  </div>
);

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 936, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </AbsoluteFill>
);

const Kicker: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color = LIME}) => (
  <div style={{
    display: 'inline-flex', alignItems: 'center', gap: 10, alignSelf: 'flex-start',
    padding: '8px 16px', borderRadius: 999, background: 'rgba(183,243,75,.12)',
    border: '1px solid rgba(183,243,75,.30)', opacity: p,
    transform: `translateY(${(1 - p) * 14}px)`,
  }}>
    <span style={{width: 7, height: 7, borderRadius: 99, background: color, boxShadow: `0 0 12px ${color}`}} />
    <span style={{fontSize: 16, fontWeight: 900, letterSpacing: '.18em', color, fontFamily: 'Arial,sans-serif'}}>{children}</span>
  </div>
);

const Head: React.FC<{p: number; size?: number; children: React.ReactNode}> = ({p, size = 82, children}) => (
  <div style={{
    fontSize: size, lineHeight: 1.05, letterSpacing: '-.05em', color: '#fff', fontWeight: 800,
    marginTop: 26, fontFamily: 'Arial,sans-serif', opacity: p,
    transform: `translateY(${(1 - p) * 30}px)`,
  }}>{children}</div>
);

const Sub: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{
    marginTop: 26, fontSize: 28, lineHeight: 1.45, color: '#a9c1d6',
    fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 18}px)`,
  }}>{children}</div>
);

/* ---------- scenes ---------- */

const Cover: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 34], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [22, 60], [0, 1], {...clamp, easing: easeOut});
  const c = interpolate(l, [46, 86], [0, 1], {...clamp, easing: easeOut});
  const rule = interpolate(l, [64, 112], [0, 1], {...clamp, easing: easeInOut});
  const f = l;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(7, 540, 640, 300, 150, 0.4)} color={LIME} opacity={0.16} blur={30} />
      </svg>
      <div style={{width: 960, textAlign: 'center', marginTop: -40}}>
        <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '.30em', color: MUTED, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          TRADERWATCH
        </div>
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1.02, marginTop: 34, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          Read the market.
        </div>
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1.02, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          Trade with a plan.
        </div>
        <div style={{width: 460 * rule, height: 5, borderRadius: 3, margin: '42px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.05))`}} />
        <div style={{fontSize: 27, lineHeight: 1.5, color: '#a9c1d6', marginTop: 32, opacity: c, fontFamily: 'Arial,sans-serif'}}>
          Education, structured setups and risk tools<br />in one place.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* 1 — the problem: pieces everywhere */
const Pieces: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const s = interpolate(l, [30, 72], [0, 1], {...clamp, easing: easeOut});
  const merge = interpolate(l, [74, 150], [0, 1], {...clamp, easing: easeInOut});
  const n = interpolate(l, [120, 160], [0, 1], clamp);

  // 6 scattered fragments drift toward a single mass
  const frags = Array.from({length: 6}).map((_, i) => {
    const a = (i / 6) * Math.PI * 2;
    const rx = 300 * (1 - merge) + 40;
    const ry = 210 * (1 - merge) + 30;
    return {
      x: 540 + Math.cos(a + l * 0.01) * rx,
      y: 1230 + Math.sin(a + l * 0.012) * ry,
      r: 46 + 26 * (1 - merge),
    };
  });

  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <g filter="url(#piecesgoo)" opacity={0.85}>
          {frags.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r={p.r} fill={LIME} opacity={0.55} />)}
        </g>
        <defs>
          <filter id="piecesgoo" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation={18} result="b" />
            <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -9" />
          </filter>
        </defs>
      </svg>
      <Stage>
        <Kicker p={k}>THE PROBLEM</Kicker>
        <Head p={h}>Learning arrives<br />in <span style={{color: LIME}}>pieces.</span></Head>
        <Sub p={s}>A video here. A thread there. A screenshot with no context.</Sub>
        <div style={{marginTop: 60, opacity: n, fontSize: 26, color: '#cfe1f2', fontFamily: 'Arial,sans-serif'}}>
          <span style={{color: LIME, fontWeight: 800}}>→</span> So we put it in one place.
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 2 — education hub */
const Hub: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const card = interpolate(l, [30, 78], [0, 1], {...clamp, easing: easeOut});
  const s = interpolate(l, [96, 140], [0, 1], clamp);
  const f = l;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(6, 540, 1180, 250, 120, 1.2)} color={SKY} opacity={0.22} blur={28} />
      </svg>
      <Stage>
        <Kicker p={k}>NEW · EDUCATION HUB</Kicker>
        <Head p={h}>Lessons sized<br />for a <span style={{color: LIME}}>coffee break.</span></Head>
        <div style={{
          marginTop: 52, borderRadius: 26, padding: '34px 34px 30px',
          background: 'rgba(6,26,49,.78)', border: '1px solid rgba(183,243,75,.22)',
          boxShadow: '0 30px 70px rgba(0,0,0,.45)', opacity: card,
          transform: `translateY(${(1 - card) * 40}px)`,
        }}>
          <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '.18em', color: LIME, fontFamily: 'Arial,sans-serif'}}>
            LEARNING HUB
          </div>
          <div style={{fontSize: 40, fontWeight: 800, letterSpacing: '-.03em', color: '#fff', marginTop: 14, fontFamily: 'Arial,sans-serif'}}>
            Short, plain-English lessons
          </div>
          <div style={{fontSize: 24, lineHeight: 1.5, color: MUTED, marginTop: 14, fontFamily: 'Arial,sans-serif'}}>
            How the market, charts and risk work — written for members, not for search engines.
          </div>
          <div style={{display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap'}}>
            {['Basics', 'Charts & price action', 'Fundamentals', 'Strategy'].map((t, i) => {
              const q = interpolate(l, [70 + i * 10, 96 + i * 10], [0, 1], clamp);
              return (
                <div key={t} style={{
                  padding: '9px 16px', borderRadius: 999, fontSize: 17, fontWeight: 800,
                  color: '#d6ff8f', background: 'rgba(183,243,75,.12)',
                  border: '1px solid rgba(183,243,75,.35)', fontFamily: 'Arial,sans-serif',
                  opacity: q, transform: `scale(${0.9 + q * 0.1})`,
                }}>{t}</div>
              );
            })}
          </div>
        </div>
        <Sub p={s}>Eight lessons at launch. Read one in five minutes.</Sub>
      </Stage>
    </AbsoluteFill>
  );
};

/* 3 — lesson list */
const Lessons: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const items = [
    ['What is forex?', '5 min'],
    ['Pips, lots and leverage', '6 min'],
    ['Risk management 101', '8 min'],
    ['Reading candlesticks', '7 min'],
    ['Support and resistance', '9 min'],
    ['Backtesting basics', '11 min'],
  ];
  const f = l;
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(5, 800, 520, 220, 110, 2.1)} color={LIME} opacity={0.12} blur={30} />
      </svg>
      <Stage>
        <Kicker p={k}>THE LIBRARY</Kicker>
        <Head p={h} size={74}>Start anywhere.<br /><span style={{color: LIME}}>Read in order.</span></Head>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 46}}>
          {items.map((it, i) => {
            const q = interpolate(l, [34 + i * 14, 64 + i * 14], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={it[0]} style={{
                height: 78, borderRadius: 18, display: 'flex', alignItems: 'center',
                justifyContent: 'space-between', padding: '0 24px',
                background: 'rgba(255,255,255,.055)', border: '1px solid rgba(255,255,255,.12)',
                opacity: q, transform: `translateX(${(1 - q) * 34}px)`,
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                  <div style={{width: 10, height: 10, borderRadius: 99, background: LIME, boxShadow: '0 0 10px rgba(183,243,75,.7)'}} />
                  <div style={{fontSize: 26, fontWeight: 700, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{it[0]}</div>
                </div>
                <div style={{fontSize: 19, fontWeight: 700, color: '#8fa8c0', fontFamily: 'Arial,sans-serif'}}>{it[1]}</div>
              </div>
            );
          })}
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 4 — practice games */
const Practice: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const s = interpolate(l, [100, 144], [0, 1], clamp);
  const f = l;
  const games = ['Read a candle', 'Count pips', 'Size a position', 'Match terms', 'Session times', 'Work out R:R', 'Spot a zone'];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(7, 540, 1250, 280, 95, 3.3)} color={SKY} opacity={0.20} blur={24} />
      </svg>
      <Stage>
        <Kicker p={k}>PRACTICE</Kicker>
        <Head p={h}>Seven games.<br /><span style={{color: LIME}}>Two minutes each.</span></Head>
        <div style={{display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 52}}>
          {games.map((g, i) => {
            const q = interpolate(l, [36 + i * 12, 66 + i * 12], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={g} style={{
                padding: '16px 22px', borderRadius: 999, fontSize: 22, fontWeight: 800,
                color: '#eaf6ff', background: 'rgba(22,133,207,.16)',
                border: '1px solid rgba(22,133,207,.45)', fontFamily: 'Arial,sans-serif',
                opacity: q, transform: `translateY(${(1 - q) * 22}px) scale(${0.92 + q * 0.08})`,
              }}>{g}</div>
            );
          })}
        </div>
        <Sub p={s}>Learn by doing, not by watching someone else do it.</Sub>
      </Stage>
    </AbsoluteFill>
  );
};

/* 5 — the four steps */
const Steps: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const f = l;
  const rows = [
    ['01', 'Learn the context', 'Build market-reading skills first.'],
    ['02', 'Review structured setups', 'Entry, stop and target, side by side.'],
    ['03', 'Manage risk first', 'Size the position before the order.'],
    ['04', 'Keep decisions yours', 'Verify the setup against your plan.'],
  ];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(5, 300, 1400, 240, 120, 4.4)} color={BLUE} opacity={0.30} blur={34} />
      </svg>
      <Stage>
        <Kicker p={k}>HOW IT WORKS</Kicker>
        <Head p={h} size={72}>A clearer<br /><span style={{color: LIME}}>process.</span></Head>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 44}}>
          {rows.map((r, i) => {
            const q = interpolate(l, [34 + i * 16, 66 + i * 16], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={r[0]} style={{
                display: 'flex', alignItems: 'center', gap: 18, padding: '18px 22px',
                borderRadius: 18, background: 'rgba(255,255,255,.05)',
                border: '1px solid rgba(255,255,255,.11)', opacity: q,
                transform: `translateX(${(1 - q) * 30}px)`,
              }}>
                <div style={{
                  width: 54, height: 54, borderRadius: 999, flex: 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(183,243,75,.14)', border: '1px solid rgba(183,243,75,.4)',
                  color: LIME, fontSize: 20, fontWeight: 900, fontFamily: 'Arial,sans-serif',
                }}>{r[0]}</div>
                <div>
                  <div style={{fontSize: 25, fontWeight: 800, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{r[1]}</div>
                  <div style={{fontSize: 19, color: '#8fa8c0', marginTop: 4, fontFamily: 'Arial,sans-serif'}}>{r[2]}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Stage>
    </AbsoluteFill>
  );
};

/* 6 — membership */
const Plans: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 30], [0, 1], clamp);
  const h = interpolate(l, [10, 46], [0, 1], {...clamp, easing: easeOut});
  const s = interpolate(l, [120, 158], [0, 1], clamp);
  const f = l;
  const plans = [
    ['Free', '$0', '3 signals daily'],
    ['Pro', '$20', '10 signals daily'],
    ['Max', '$50', 'Unlimited access'],
  ];
  return (
    <AbsoluteFill>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(6, 540, 1500, 300, 130, 5.1)} color={LIME} opacity={0.14} blur={32} />
      </svg>
      <Stage>
        <Kicker p={k}>MEMBERSHIP</Kicker>
        <Head p={h} size={72}>Start free.<br /><span style={{color: LIME}}>Upgrade later.</span></Head>
        <div style={{display: 'flex', flexDirection: 'column', gap: 12, marginTop: 46}}>
          {plans.map((p, i) => {
            const q = interpolate(l, [34 + i * 18, 68 + i * 18], [0, 1], {...clamp, easing: easeOut});
            const hero = i === 0;
            return (
              <div key={p[0]} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '22px 26px', borderRadius: 20,
                background: hero ? 'rgba(183,243,75,.10)' : 'rgba(255,255,255,.05)',
                border: `1px solid ${hero ? 'rgba(183,243,75,.45)' : 'rgba(255,255,255,.11)'}`,
                opacity: q, transform: `translateY(${(1 - q) * 24}px)`,
              }}>
                <div>
                  <div style={{fontSize: 27, fontWeight: 800, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{p[0]}</div>
                  <div style={{fontSize: 18, color: '#8fa8c0', marginTop: 5, fontFamily: 'Arial,sans-serif'}}>{p[2]}</div>
                </div>
                <div style={{fontSize: 44, fontWeight: 800, letterSpacing: '-.03em', color: hero ? LIME : '#cfe1f2', fontFamily: 'Arial,sans-serif'}}>{p[1]}</div>
              </div>
            );
          })}
        </div>
        <Sub p={s}>Education hub included on every plan.</Sub>
      </Stage>
    </AbsoluteFill>
  );
};

/* 7 — outro */
const Outro: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 38], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [22, 64], [0, 1], {...clamp, easing: easeOut});
  const c = interpolate(l, [56, 104], [0, 1], {...clamp, easing: easeInOut});
  const d = interpolate(l, [86, 132], [0, 1], clamp);
  const f = l;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <Liquid f={f} blobs={makeBlobs(8, 540, 820, 340, 140, 6.2)} color={LIME} opacity={0.18} blur={30} />
      </svg>
      <div style={{width: 960, textAlign: 'center', marginTop: -30}}>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1.04, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          Learn first.
        </div>
        <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1.04, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          Then decide.
        </div>
        <div style={{width: 420 * c, height: 5, borderRadius: 3, margin: '44px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.05))`}} />
        <div style={{marginTop: 34, opacity: d}}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 12,
            padding: '20px 40px', borderRadius: 999,
            background: LIME, color: '#12240a',
            fontSize: 26, fontWeight: 900, letterSpacing: '.04em', fontFamily: 'Arial,sans-serif',
          }}>Start free →</div>
          <Img src={staticFile('logo-mark.png')} style={{height: 84, width: 90, objectFit: 'contain', display: 'block', margin: '38px auto 18px'}} />
          <div style={{fontSize: 30, fontWeight: 900, letterSpacing: '.08em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>@TRADERWATCH</div>
          <div style={{fontSize: 17, color: '#6f8aa6', marginTop: 22, fontFamily: 'Arial,sans-serif', lineHeight: 1.5}}>
            Educational content only. Not financial advice.<br />Trading is risky; no outcomes are guaranteed.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- timeline ---------- */

const op = (f: number, i: number) => {
  const s = i * SCENE;
  const e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 18, e], [1, 0], clamp);
  return Math.min(
    interpolate(f, [s, s + 18], [0, 1], clamp),
    interpolate(f, [e - 18, e], [1, 0], clamp),
  );
};

const SECTIONS = ['INTRO', 'PROBLEM', 'EDUCATION', 'LIBRARY', 'PRACTICE', 'PROCESS', 'PLANS', 'OUTRO'];

export const LiquidPromo: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;
  const push = interpolate(l, [0, SCENE], [1, 1.022], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#01080f'}}>
      {/* base navy field */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#01080f 0%,#03101f 24%,#051a30 48%,#041324 70%,#020c18 88%,#01080f 100%)'}} />
      <Field f={f} tint={SKY} />
      <Chrome section={SECTIONS[idx]} p={idx === 0 ? 1 : interpolate(l, [0, 20], [0.35, 1], clamp)} />

      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 44%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: op(f, 0)}}><Cover l={l} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: op(f, 1)}}><Pieces l={l} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: op(f, 2)}}><Hub l={l} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: op(f, 3)}}><Lessons l={l} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: op(f, 4)}}><Practice l={l} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: op(f, 5)}}><Steps l={l} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: op(f, 6)}}><Plans l={l} /></AbsoluteFill>}
        {idx === 7 && <AbsoluteFill style={{opacity: op(f, 7)}}><Outro l={l} /></AbsoluteFill>}
      </AbsoluteFill>

      <Dots index={idx} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / PROMO_FRAMES) * 100}%`, background: `linear-gradient(90deg,${SKY},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
