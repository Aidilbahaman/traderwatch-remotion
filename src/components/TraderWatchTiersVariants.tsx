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

const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);

/* ------------------------------------------------------------------ */
/* shared plan data                                                    */
/* ------------------------------------------------------------------ */
type Tier = {
  key: 'free' | 'pro' | 'max';
  name: string;
  price: number;
  oldPrice?: number;
  priceNote: string;
  tag: string;
  badge?: string;
  accent: string;
  features: string[];
};

const FREE_FEATURES = [
  'Limit 3 signal refresh every 4 hours',
  '3 hot pairs',
  'Live TradingView charts',
  'Access to Telegram',
];

const TIERS: Tier[] = [
  {
    key: 'free', name: 'Free', price: 0, priceNote: 'forever', tag: 'START HERE', accent: SKY,
    features: FREE_FEATURES,
  },
  {
    key: 'pro', name: 'Pro', price: 20, priceNote: 'per billing period', tag: 'MOST DETAIL', accent: LIME,
    features: [
      '10 signal refresh every 4 hours',
      '6 hot pairs',
      'Entry, stop loss and take profit',
      'Member dashboard and charts',
      'Access to automated Telegram signal',
    ],
  },
  {
    key: 'max', name: 'Max', price: 30, oldPrice: 50, priceNote: 'per billing period', tag: 'FULL ACCESS',
    badge: 'LIMITED OFFER', accent: GOLD,
    features: [
      'Unlimited verified signals',
      '6 hot pairs',
      'H1 and M1 setups when available',
      'Member dashboard and charts',
      'Priority access to new setups',
      'Access to automated Telegram signal',
    ],
  },
];

/* ------------------------------------------------------------------ */
const Backdrop: React.FC<{tint?: string}> = ({tint}) => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 720], [0, -110], clamp);
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, ${NAVY_DEEP} 0%, ${NAVY} 46%, ${BLUE} 100%)`}}>
      <AbsoluteFill
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0 1px, transparent 1px 64px),
            repeating-linear-gradient(90deg, rgba(255,255,255,0.026) 0 1px, transparent 1px 64px)`,
          backgroundPosition: `${drift}px ${drift}px`,
        }}
      />
      <div
        style={{
          position: 'absolute', left: W * 0.5, top: H * 0.45,
          width: 1400, height: 1400, marginLeft: -700, marginTop: -700,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${tint ?? 'rgba(22,133,207,0.34)'}, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Check: React.FC<{p: number; color: string; size?: number}> = ({p, color, size = 24}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{flex: '0 0 auto', marginTop: 3}}>
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={0.35 * p} />
    <path
      d="M 8.5 15.5 L 13 20 L 21.5 10.5" fill="none" stroke={color} strokeWidth={3}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)}
    />
  </svg>
);

/* ================================================================== */
/* VARIANT A — "Deck": cards dealt from a stack, 3D rotateY            */
/* ================================================================== */
const DeckCard: React.FC<{tier: Tier; i: number; g: number; focus: number; dim: number}> = ({tier, i, g, focus, dim}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, g - (14 + i * 5)), fps, config: {damping: 18, stiffness: 80, mass: 1}});
  const y = interpolate(s, [0, 1], [420, 0]);
  const rotY = interpolate(s, [0, 1], [i === 0 ? 26 : i === 1 ? 0 : -26, 0]);
  const rotZ = interpolate(s, [0, 1], [i === 0 ? -7 : i === 1 ? 0 : 7, 0]);
  const op = interpolate(g, [14 + i * 5, 40 + i * 5], [0, 1], clamp);

  const isMax = tier.key === 'max';
  const isPro = tier.key === 'pro';
  const bg = isMax ? 'linear-gradient(160deg,#0b2138,#061a31)' : isPro ? '#fff' : 'rgba(255,255,255,0.08)';
  const text = isPro ? NAVY : '#fff';
  const muted = isPro ? '#60758d' : isMax ? '#9fb6cc' : '#c4d9ea';
  const line = isPro ? '#e6eef6' : 'rgba(255,255,255,0.12)';

  return (
    <div
      style={{
        position: 'absolute', width: 700, height: 720, left: (W - 700) / 2, top: (H - 720) / 2,
        opacity: op * (1 - dim * 0.5),
        transform: `translateY(${y}px) rotateY(${rotY}deg) rotateZ(${rotZ}deg) scale(${0.86 + focus * 0.06})`,
        transformStyle: 'preserve-3d',
        perspective: 1200,
      }}
    >
      <div style={{position: 'absolute', inset: -26, borderRadius: 46, background: `radial-gradient(circle at 50% 40%, ${tier.accent}55, transparent 70%)`, opacity: focus * 0.7, filter: 'blur(26px)'}} />
      <div
        style={{
          position: 'relative', width: '100%', height: '100%', borderRadius: 30, background: bg,
          border: isMax ? `1px solid rgba(216,156,29,${0.35 + 0.4 * focus})` : isPro ? `1px solid rgba(183,243,75,${0.25 + 0.5 * focus})` : '1px solid rgba(255,255,255,0.16)',
          boxShadow: '0 40px 90px rgba(2,12,26,0.6)', overflow: 'hidden', padding: '40px 38px 34px',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}22)`}} />
        <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '0.16em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>{tier.tag}</div>
        <div style={{fontSize: 62, fontWeight: 800, letterSpacing: '-0.04em', color: text, marginTop: 14, fontFamily: 'Arial, sans-serif'}}>{tier.name}</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 2}}>
          <div style={{fontSize: 84, fontWeight: 800, letterSpacing: '-0.05em', color: tier.oldPrice ? GOLD : text, fontFamily: 'Arial, sans-serif'}}>${tier.price}</div>
          {tier.oldPrice && <div style={{fontSize: 30, fontWeight: 800, color: muted, textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>${tier.oldPrice}</div>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 4}}>
          <div style={{fontSize: 16, color: muted, fontFamily: 'Arial, sans-serif'}}>{tier.priceNote}</div>
          {tier.badge && <div style={{fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', color: '#193414', background: GOLD, borderRadius: 999, padding: '5px 12px', fontFamily: 'Arial, sans-serif'}}>{tier.badge}</div>}
        </div>
        <div style={{height: 1, background: line, margin: '24px 0 22px'}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 16}}>
          {tier.features.map((ft, k) => {
            const p = interpolate(g, [40 + i * 5 + k * 7, 56 + i * 5 + k * 7], [0, 1], clamp);
            return (
              <div key={ft} style={{display: 'flex', gap: 14, opacity: p, transform: `translateX(${(1 - p) * -18}px)`}}>
                <Check p={p} color={tier.accent} />
                <div style={{fontSize: 22, lineHeight: 1.3, color: isPro ? '#33475e' : '#dbe9f5', fontFamily: 'Arial, sans-serif'}}>{ft}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TiersDeck: React.FC = () => {
  const f = useCurrentFrame();
  const g = f - 110;

  const introOut = interpolate(f, [96, 110], [1, 0], clamp);
  const l1 = interpolate(f, [2, 26], [0, 1], {...clamp, easing: easeOut});
  const l2 = interpolate(f, [12, 38], [0, 1], {...clamp, easing: easeOut});

  const spread = interpolate(g, [110, 150], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const focusFree = interpolate(g, [150, 176, 240, 258], [0, 1, 1, 0], clamp);
  const focusPro = interpolate(g, [250, 276, 340, 358], [0, 1, 1, 0], clamp);
  const focusMax = interpolate(g, [350, 376, 448, 466], [0, 1, 1, 0], clamp);
  const dimFree = Math.max(focusPro, focusMax);
  const dimPro = Math.max(focusFree * 0.85, focusMax * 0.85);
  const dimMax = Math.max(focusFree * 0.85, focusPro * 0.85);

  const wipe = interpolate(g, [470, 482], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ctaOp = interpolate(g, [476, 500], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{width: 900}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', color: '#dceeff', fontFamily: 'Arial, sans-serif', opacity: l1}}>TRADERWATCH · MEMBERSHIP</div>
          <div style={{fontSize: 128, fontWeight: 800, letterSpacing: '-0.055em', color: '#fff', lineHeight: 0.98, marginTop: 26, opacity: l1, transform: `translateY(${(1 - l1) * 40}px)`, fontFamily: 'Arial, sans-serif'}}>Pick a tier.</div>
          <div style={{fontSize: 128, fontWeight: 800, letterSpacing: '-0.055em', color: LIME, lineHeight: 0.98, opacity: l2, transform: `translateY(${(1 - l2) * 40}px)`, fontFamily: 'Arial, sans-serif'}}>Keep the method.</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill>
        {TIERS.map((t, i) => {
          const spreadX = i === 0 ? -190 * spread : i === 1 ? 0 : 190 * spread;
          const spreadY = i === 0 ? -120 * spread : i === 1 ? 0 : 120 * spread;
          return (
            <div key={t.key} style={{position: 'absolute', inset: 0, transform: `translate(${spreadX}px, ${spreadY}px)`}}>
              <DeckCard tier={t} i={i} g={g} focus={i === 0 ? focusFree : i === 1 ? focusPro : focusMax} dim={i === 0 ? dimFree : i === 1 ? dimPro : dimMax} />
            </div>
          );
        })}
      </AbsoluteFill>

      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg,${NAVY_DEEP},${NAVY} 55%,${BLUE})`, clipPath: `inset(${100 - wipe * 100}% 0 0 0)`, opacity: wipe > 0.001 ? 1 : 0}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp}}>
        <div style={{textAlign: 'center', padding: '0 90px'}}>
          <div style={{fontSize: 88, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.02, fontFamily: 'Arial, sans-serif'}}>Choose your access.</div>
          <div style={{marginTop: 48, display: 'inline-flex', background: LIME, color: '#193414', fontSize: 28, fontWeight: 900, padding: '26px 48px', borderRadius: 14, fontFamily: 'Arial, sans-serif'}}>Explore market setups →</div>
          <div style={{fontSize: 18, color: '#6f88a6', marginTop: 60, lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>Educational information only. Trading is risky.<br />Plan features as listed at signup; prices in USD.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* VARIANT B — "Columns": three light columns that fill                */
/* ================================================================== */
const COL_W = 296;
const COL_GAP = 34;
const COL_TOP = 560;
const COL_BASE = 1480;

const Column: React.FC<{tier: Tier; i: number; g: number; focus: number}> = ({tier, i, g, focus}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, g - (16 + i * 6)), fps, config: {damping: 20, stiffness: 80, mass: 1}});
  const rise = interpolate(s, [0, 1], [160, 0]);
  const op = interpolate(g, [16 + i * 6, 38 + i * 6], [0, 1], clamp);

  const fill = interpolate(g, [40 + i * 8, 130 + i * 8], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const count = Math.round(fill * tier.price);

  const isMax = tier.key === 'max';
  const isPro = tier.key === 'pro';
  const panelBg = isPro ? 'rgba(255,255,255,0.95)' : isMax ? 'rgba(11,33,56,0.92)' : 'rgba(255,255,255,0.08)';
  const text = isPro ? NAVY : '#fff';
  const muted = isPro ? '#60758d' : '#a9c1d6';

  return (
    <div
      style={{
        width: COL_W, opacity: op, transform: `translateY(${rise}px)`,
      }}
    >
      {/* price + name */}
      <div style={{textAlign: 'center'}}>
        <div style={{fontSize: 14, fontWeight: 900, letterSpacing: '0.16em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>{tier.tag}</div>
        <div style={{fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginTop: 8, fontFamily: 'Arial, sans-serif'}}>{tier.name}</div>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginTop: 2}}>
          <div style={{fontSize: 58, fontWeight: 800, letterSpacing: '-0.05em', color: tier.oldPrice ? GOLD : '#fff', fontFamily: 'Arial, sans-serif', fontVariantNumeric: 'tabular-nums'}}>
            ${tier.price === 0 ? 0 : count}
          </div>
          {tier.oldPrice && <div style={{fontSize: 20, fontWeight: 800, color: '#8fa8c0', textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>${tier.oldPrice}</div>}
        </div>
        {tier.badge && <div style={{display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', color: '#193414', background: GOLD, borderRadius: 999, padding: '4px 10px', fontFamily: 'Arial, sans-serif'}}>{tier.badge}</div>}
      </div>

      {/* the column */}
      <div
        style={{
          position: 'relative', marginTop: 22, height: COL_BASE - COL_TOP, borderRadius: 22,
          background: panelBg, border: `1px solid ${isPro ? '#e6eef6' : isMax ? 'rgba(216,156,29,0.4)' : 'rgba(255,255,255,0.16)'}`,
          overflow: 'hidden', boxShadow: '0 30px 70px rgba(2,12,26,0.5)',
        }}
      >
        {/* fill */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0,
            height: `${fill * 100}%`,
            background: `linear-gradient(180deg, ${tier.accent}22, ${tier.accent}66)`,
          }}
        />
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: `${fill * 100}%`,
            height: 3, background: tier.accent, boxShadow: `0 0 18px ${tier.accent}`,
            opacity: fill > 0.02 ? 1 : 0,
          }}
        />
        {/* features stacked inside */}
        <div style={{position: 'relative', padding: '20px 18px', display: 'flex', flexDirection: 'column', gap: 12}}>
          {tier.features.map((ft, k) => {
            const p = interpolate(g, [46 + i * 8 + k * 6, 62 + i * 8 + k * 6], [0, 1], clamp);
            return (
              <div key={ft} style={{display: 'flex', gap: 9, opacity: p, transform: `translateY(${(1 - p) * 12}px)`}}>
                <Check p={p} color={tier.accent} size={18} />
                <div style={{fontSize: 15, lineHeight: 1.28, color: isPro ? '#33475e' : '#dbe9f5', fontFamily: 'Arial, sans-serif'}}>{ft}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TiersColumns: React.FC = () => {
  const f = useCurrentFrame();
  const g = f - 110;

  const introOut = interpolate(f, [96, 110], [1, 0], clamp);
  const l1 = interpolate(f, [2, 26], [0, 1], {...clamp, easing: easeOut});
  const l2 = interpolate(f, [12, 38], [0, 1], {...clamp, easing: easeOut});

  const focusFree = interpolate(g, [150, 176, 240, 258], [0, 1, 1, 0], clamp);
  const focusPro = interpolate(g, [250, 276, 340, 358], [0, 1, 1, 0], clamp);
  const focusMax = interpolate(g, [350, 376, 448, 466], [0, 1, 1, 0], clamp);

  const lift = interpolate(g, [110, 150], [0, -34], {...clamp, easing: Easing.out(Easing.cubic)});
  const wipe = interpolate(g, [470, 482], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ctaOp = interpolate(g, [476, 500], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{width: 900, textAlign: 'center'}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', color: '#dceeff', fontFamily: 'Arial, sans-serif', opacity: l1}}>TRADERWATCH · MEMBERSHIP</div>
          <div style={{fontSize: 120, fontWeight: 800, letterSpacing: '-0.055em', color: '#fff', lineHeight: 0.98, marginTop: 24, opacity: l1, fontFamily: 'Arial, sans-serif'}}>How much</div>
          <div style={{fontSize: 120, fontWeight: 800, letterSpacing: '-0.055em', color: LIME, lineHeight: 0.98, opacity: l2, fontFamily: 'Arial, sans-serif'}}>access?</div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: COL_GAP, transform: `translateY(${lift}px)`}}>
          {TIERS.map((t, i) => (
            <div key={t.key} style={{transform: `scale(${1 + (i === 0 ? focusFree : i === 1 ? focusPro : focusMax) * 0.035})`}}>
              <Column tier={t} i={i} g={g} focus={i === 0 ? focusFree : i === 1 ? focusPro : focusMax} />
            </div>
          ))}
        </div>
      </AbsoluteFill>

      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg,${NAVY_DEEP},${NAVY} 55%,${BLUE})`, clipPath: `inset(${100 - wipe * 100}% 0 0 0)`, opacity: wipe > 0.001 ? 1 : 0}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp}}>
        <div style={{textAlign: 'center', padding: '0 90px'}}>
          <div style={{fontSize: 88, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.02, fontFamily: 'Arial, sans-serif'}}>Choose your access.</div>
          <div style={{marginTop: 48, display: 'inline-flex', background: LIME, color: '#193414', fontSize: 28, fontWeight: 900, padding: '26px 48px', borderRadius: 14, fontFamily: 'Arial, sans-serif'}}>Explore market setups →</div>
          <div style={{fontSize: 18, color: '#6f88a6', marginTop: 60, lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>Educational information only. Trading is risky.<br />Plan features as listed at signup; prices in USD.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* ================================================================== */
/* VARIANT C — "Spotlight": giant type behind, one card in front       */
/* ================================================================== */
const SpotlightCard: React.FC<{tier: Tier; index: number; g: number; start: number; end: number}> = ({tier, index, g, start, end}) => {
  const {fps} = useVideoConfig();
  const local = g - start;
  const s = spring({frame: Math.max(0, local), fps, config: {damping: 17, stiffness: 85, mass: 0.95}});
  const y = interpolate(s, [0, 1], [200, 0]);
  const op = interpolate(g, [start, start + 16, end - 12, end], [0, 1, 1, 0], clamp);

  const isMax = tier.key === 'max';
  const isPro = tier.key === 'pro';
  const bg = isMax ? 'linear-gradient(160deg,#0b2138,#061a31)' : isPro ? '#fff' : 'rgba(255,255,255,0.09)';
  const text = isPro ? NAVY : '#fff';
  const muted = isPro ? '#60758d' : '#a9c1d6';

  return (
    <div style={{position: 'absolute', left: (W - 760) / 2, top: 470, width: 760, height: 800, opacity: op, transform: `translateY(${y}px)`}}>
      <div style={{position: 'absolute', inset: -30, borderRadius: 48, background: `radial-gradient(circle at 50% 45%, ${tier.accent}66, transparent 70%)`, filter: 'blur(30px)'}} />
      <div
        style={{
          position: 'relative', width: '100%', height: '100%', borderRadius: 30, background: bg,
          border: isMax ? '1px solid rgba(216,156,29,0.55)' : isPro ? '1px solid rgba(183,243,75,0.5)' : '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 46px 100px rgba(2,12,26,0.65)', overflow: 'hidden', padding: '42px 40px 36px',
          display: 'flex', flexDirection: 'column',
        }}
      >
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 7, background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}22)`}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 16, fontWeight: 900, letterSpacing: '0.16em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>{tier.tag}</div>
          <div style={{fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', color: muted, fontFamily: 'Arial, sans-serif'}}>0{index + 1}</div>
        </div>
        <div style={{fontSize: 66, fontWeight: 800, letterSpacing: '-0.04em', color: text, marginTop: 16, fontFamily: 'Arial, sans-serif'}}>{tier.name}</div>
        <div style={{display: 'flex', alignItems: 'baseline', gap: 12}}>
          <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.055em', color: tier.oldPrice ? GOLD : text, fontFamily: 'Arial, sans-serif'}}>${tier.price}</div>
          {tier.oldPrice && <div style={{fontSize: 32, fontWeight: 800, color: muted, textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>${tier.oldPrice}</div>}
        </div>
        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 4}}>
          <div style={{fontSize: 17, color: muted, fontFamily: 'Arial, sans-serif'}}>{tier.priceNote}</div>
          {tier.badge && <div style={{fontSize: 12, fontWeight: 900, letterSpacing: '0.1em', color: '#193414', background: GOLD, borderRadius: 999, padding: '5px 12px', fontFamily: 'Arial, sans-serif'}}>{tier.badge}</div>}
        </div>
        <div style={{height: 1, background: isPro ? '#e6eef6' : 'rgba(255,255,255,0.14)', margin: '24px 0 22px'}} />
        <div style={{display: 'flex', flexDirection: 'column', gap: 17}}>
          {tier.features.map((ft, k) => {
            const p = interpolate(g, [start + 14 + k * 7, start + 30 + k * 7], [0, 1], clamp);
            return (
              <div key={ft} style={{display: 'flex', gap: 14, opacity: p, transform: `translateX(${(1 - p) * -18}px)`}}>
                <Check p={p} color={tier.accent} />
                <div style={{fontSize: 23, lineHeight: 1.3, color: isPro ? '#33475e' : '#dbe9f5', fontFamily: 'Arial, sans-serif'}}>{ft}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TiersSpotlight: React.FC = () => {
  const f = useCurrentFrame();
  const g = f - 110;

  const introOut = interpolate(f, [96, 110], [1, 0], clamp);
  const l1 = interpolate(f, [2, 26], [0, 1], {...clamp, easing: easeOut});
  const l2 = interpolate(f, [12, 38], [0, 1], {...clamp, easing: easeOut});

  const beats: [number, number][] = [[130, 258], [262, 366], [370, 466]];
  const bigTypeIdx = g < 262 ? 0 : g < 370 ? 1 : 2;
  const typeShift = interpolate(g, [252, 276, 360, 384], [0, 1, 0, 1], clamp);
  const spotX = interpolate(g, [130, 258, 262, 366, 370, 466], [0.3, 0.3, 0.5, 0.5, 0.7, 0.7], {...clamp, easing: Easing.inOut(Easing.cubic)});

  const wipe = interpolate(g, [470, 482], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ctaOp = interpolate(g, [476, 500], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <AbsoluteFill style={{background: '#04101f'}}>
        <div
          style={{
            position: 'absolute', left: `${spotX * 100}%`, top: '42%',
            width: 1200, height: 1200, marginLeft: -600, marginTop: -600, borderRadius: '50%',
            background: `radial-gradient(circle, rgba(22,133,207,0.30), rgba(13,79,145,0.10) 45%, transparent 70%)`,
          }}
        />
        <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.03) 0 1px, transparent 1px 64px)'}} />
      </AbsoluteFill>

      {/* giant background type */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: interpolate(g, [110, 140], [0, 1], clamp) * interpolate(g, [466, 486], [1, 0], clamp)}}>
        <div
          style={{
            fontSize: 300, fontWeight: 800, letterSpacing: '-0.06em',
            color: 'rgba(255,255,255,0.055)', fontFamily: 'Arial, sans-serif',
            transform: `translateX(${typeShift * -60}px)`,
            whiteSpace: 'nowrap',
          }}
        >
          {['FREE', 'PRO', 'MAX'][bigTypeIdx]}
        </div>
      </AbsoluteFill>

      {/* intro */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{textAlign: 'center'}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', color: '#dceeff', fontFamily: 'Arial, sans-serif', opacity: l1}}>TRADERWATCH · MEMBERSHIP</div>
          <div style={{fontSize: 132, fontWeight: 800, letterSpacing: '-0.055em', color: '#fff', lineHeight: 0.98, marginTop: 24, opacity: l1, fontFamily: 'Arial, sans-serif'}}>Three ways</div>
          <div style={{fontSize: 132, fontWeight: 800, letterSpacing: '-0.055em', color: LIME, lineHeight: 0.98, opacity: l2, fontFamily: 'Arial, sans-serif'}}>in.</div>
        </div>
      </AbsoluteFill>

      {TIERS.map((t, i) => (
        <SpotlightCard key={t.key} tier={t} index={i} g={g} start={beats[i][0]} end={beats[i][1]} />
      ))}

      <div style={{position: 'absolute', inset: 0, background: `linear-gradient(160deg,${NAVY_DEEP},${NAVY} 55%,${BLUE})`, clipPath: `inset(${100 - wipe * 100}% 0 0 0)`, opacity: wipe > 0.001 ? 1 : 0}} />
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp}}>
        <div style={{textAlign: 'center', padding: '0 90px'}}>
          <div style={{fontSize: 88, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.02, fontFamily: 'Arial, sans-serif'}}>Choose your access.</div>
          <div style={{marginTop: 48, display: 'inline-flex', background: LIME, color: '#193414', fontSize: 28, fontWeight: 900, padding: '26px 48px', borderRadius: 14, fontFamily: 'Arial, sans-serif'}}>Explore market setups →</div>
          <div style={{fontSize: 18, color: '#6f88a6', marginTop: 60, lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>Educational information only. Trading is risky.<br />Plan features as listed at signup; prices in USD.</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
