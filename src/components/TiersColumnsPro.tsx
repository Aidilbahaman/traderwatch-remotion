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

type Tier = {
  key: 'free' | 'pro' | 'max';
  name: string;
  price: number;
  oldPrice?: number;
  note: string;
  tag: string;
  badge?: string;
  accent: string;
  metric: string;
  metricLabel: string;
  fill: number;           /* how much of the column this tier unlocks */
  features: string[];
};

const TIERS: Tier[] = [
  {
    key: 'free', name: 'Free', price: 0, note: 'forever', tag: 'START HERE', accent: SKY,
    metric: '3', metricLabel: 'signals / 4h', fill: 0.42,
    features: [
      'Limit 3 signal refresh every 4 hours',
      '3 hot pairs',
      'Live TradingView charts',
      'Access to Telegram',
    ],
  },
  {
    key: 'pro', name: 'Pro', price: 20, note: 'per billing period', tag: 'MOST DETAIL', accent: LIME,
    metric: '10', metricLabel: 'signals / 4h', fill: 0.74,
    features: [
      '10 signal refresh every 4 hours',
      '6 hot pairs',
      'Entry, stop loss and take profit',
      'Member dashboard and charts',
      'Access to automated Telegram signal',
    ],
  },
  {
    key: 'max', name: 'Max', price: 30, oldPrice: 50, note: 'per billing period', tag: 'FULL ACCESS',
    badge: 'LIMITED OFFER', accent: GOLD,
    metric: '∞', metricLabel: 'no limit', fill: 1,
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

const COL_W = 300;
const COL_GAP = 30;
const COL_H = 800;

/* ------------------------------------------------------------------ */
const Backdrop: React.FC = () => {
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
          position: 'absolute', left: W * 0.5, top: H * 0.46,
          width: 1500, height: 1500, marginLeft: -750, marginTop: -750, borderRadius: '50%',
          background: `radial-gradient(circle, rgba(22,133,207,0.32), rgba(13,79,145,0.10) 45%, transparent 70%)`,
        }}
      />
    </AbsoluteFill>
  );
};

const Check: React.FC<{p: number; color: string; size?: number}> = ({p, color, size = 19}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{flex: '0 0 auto', marginTop: 3}}>
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={0.3 * p} />
    <path
      d="M 8.5 15.5 L 13 20 L 21.5 10.5" fill="none" stroke={color} strokeWidth={3.4}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
const Column: React.FC<{tier: Tier; i: number; g: number; focus: number; dim: number}> = ({tier, i, g, focus, dim}) => {
  const {fps} = useVideoConfig();

  const rise = spring({frame: Math.max(0, g - (16 + i * 7)), fps, config: {damping: 20, stiffness: 78, mass: 1}});
  const y = interpolate(rise, [0, 1], [180, 0]);
  const op = interpolate(g, [16 + i * 7, 40 + i * 7], [0, 1], clamp);

  /* price counts up while the column fills */
  const countP = interpolate(g, [30 + i * 10, 120 + i * 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const shownPrice = Math.round(countP * tier.price);

  const fillP = interpolate(g, [40 + i * 10, 150 + i * 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const fill = fillP * tier.fill;

  const isPro = tier.key === 'pro';
  const isMax = tier.key === 'max';
  const boxBg = isPro ? 'rgba(255,255,255,0.96)' : isMax ? 'rgba(11,33,56,0.94)' : 'rgba(255,255,255,0.07)';
  const boxBorder = isPro
    ? `1px solid rgba(183,243,75,${0.3 + 0.45 * focus})`
    : isMax
    ? `1px solid rgba(216,156,29,${0.3 + 0.45 * focus})`
    : `1px solid rgba(255,255,255,${0.14 + 0.3 * focus})`;

  return (
    <div
      style={{
        width: COL_W,
        opacity: op * (1 - dim * 0.42),
        transform: `translateY(${y + focus * -18}px) scale(${1 + focus * 0.045})`,
      }}
    >
      {/* header */}
      <div style={{textAlign: 'center', height: 196}}>
        <div style={{fontSize: 13, fontWeight: 900, letterSpacing: '0.16em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>{tier.tag}</div>
        <div style={{fontSize: 40, fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', marginTop: 6, fontFamily: 'Arial, sans-serif'}}>{tier.name}</div>
        <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 7, marginTop: 2}}>
          <div
            style={{
              fontSize: 54, fontWeight: 800, letterSpacing: '-0.05em',
              color: tier.oldPrice ? GOLD : '#fff', fontFamily: 'Arial, sans-serif',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            ${shownPrice}
          </div>
          {tier.oldPrice && (
            <div style={{fontSize: 19, fontWeight: 800, color: '#8fa8c0', textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>${tier.oldPrice}</div>
          )}
        </div>
        <div style={{fontSize: 13, color: '#8fa8c0', marginTop: 1, fontFamily: 'Arial, sans-serif'}}>{tier.note}</div>
        {tier.badge && (
          <div style={{display: 'inline-block', marginTop: 8, fontSize: 11, fontWeight: 900, letterSpacing: '0.08em', color: '#193414', background: GOLD, borderRadius: 999, padding: '4px 10px', fontFamily: 'Arial, sans-serif'}}>
            {tier.badge}
          </div>
        )}
      </div>

      {/* the column */}
      <div
        style={{
          position: 'relative', height: COL_H, borderRadius: 24, background: boxBg, border: boxBorder,
          overflow: 'hidden', boxShadow: '0 30px 70px rgba(2,12,26,0.5)',
        }}
      >
        {/* fill */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: 0, height: `${fill * 100}%`,
            background: `linear-gradient(180deg, ${tier.accent}18, ${tier.accent}70)`,
          }}
        />
        {/* glowing fill line + metric pill riding on it */}
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: `${fill * 100}%`, height: 2,
            background: tier.accent, boxShadow: `0 0 22px ${tier.accent}`,
            opacity: fillP > 0.02 ? 1 : 0,
          }}
        />
        <div
          style={{
            position: 'absolute', left: 0, right: 0, bottom: `${fill * 100}%`, transform: 'translateY(-50%)',
            display: 'flex', justifyContent: 'center', opacity: fillP > 0.05 ? 1 : 0,
          }}
        >
          <div
            style={{
              display: 'flex', alignItems: 'baseline', gap: 5,
              background: tier.accent, color: '#10243b',
              borderRadius: 999, padding: '5px 12px',
              fontSize: 15, fontWeight: 900, fontFamily: 'Arial, sans-serif',
              boxShadow: '0 6px 18px rgba(2,12,26,0.35)',
            }}
          >
            <span style={{fontSize: 19}}>{tier.metric}</span>
            <span style={{fontSize: 11, fontWeight: 800, letterSpacing: '0.04em'}}>{tier.metricLabel}</span>
          </div>
        </div>

        {/* features sit above the fill */}
        <div style={{position: 'relative', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 13}}>
          {tier.features.map((ft, k) => {
            const p = interpolate(g, [46 + i * 10 + k * 7, 64 + i * 10 + k * 7], [0, 1], clamp);
            return (
              <div key={ft} style={{display: 'flex', gap: 8, opacity: p, transform: `translateY(${(1 - p) * 10}px)`}}>
                <Check p={p} color={tier.accent} />
                <div style={{fontSize: 14.5, lineHeight: 1.3, color: isPro ? '#33475e' : '#e2eef8', fontFamily: 'Arial, sans-serif'}}>{ft}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA under the column */}
      <div
        style={{
          marginTop: 18, height: 48, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: tier.key === 'free' ? 'rgba(255,255,255,0.10)' : tier.accent,
          border: tier.key === 'free' ? '1px solid rgba(255,255,255,0.22)' : 'none',
          color: tier.key === 'free' ? '#fff' : '#193414',
          fontSize: 16, fontWeight: 900, fontFamily: 'Arial, sans-serif',
          opacity: interpolate(g, [90 + i * 10, 120 + i * 10], [0, 1], clamp),
        }}
      >
        {tier.key === 'free' ? 'Continue with Free' : `Subscribe to ${tier.name}`}
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
export const TiersColumnsPro: React.FC = () => {
  const f = useCurrentFrame();
  const g = f - 110;

  const introOut = interpolate(f, [96, 110], [1, 0], clamp);
  const l1 = interpolate(f, [2, 26], [0, 1], {...clamp, easing: easeOut});
  const l2 = interpolate(f, [12, 38], [0, 1], {...clamp, easing: easeOut});
  const ruleW = interpolate(f, [10, 48], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  const focusFree = interpolate(g, [160, 186, 246, 264], [0, 1, 1, 0], clamp);
  const focusPro = interpolate(g, [256, 282, 340, 358], [0, 1, 1, 0], clamp);
  const focusMax = interpolate(g, [350, 376, 444, 462], [0, 1, 1, 0], clamp);
  const dimFree = Math.max(focusPro, focusMax);
  const dimPro = Math.max(focusFree * 0.85, focusMax * 0.85);
  const dimMax = Math.max(focusFree * 0.85, focusPro * 0.85);

  const camScale = interpolate(g, [110, 170, 250, 360, 460, 500], [0.98, 1.0, 1.02, 1.02, 1.0, 1.03], {...clamp, easing: easeOut});
  const camY = interpolate(g, [110, 170, 250, 360, 460, 500], [10, 0, -6, -6, 0, 0], {...clamp, easing: easeOut});

  const wipe = interpolate(g, [470, 482], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ctaOp = interpolate(g, [466, 486], [0, 1], clamp);
  const ctaY = interpolate(g, [466, 486], [28, 0], {...clamp, easing: easeOut});
  const discOp = interpolate(g, [500, 528], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />

      {/* cover */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{width: 920, textAlign: 'center'}}>
          <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.2em', color: '#dceeff', fontFamily: 'Arial, sans-serif', opacity: l1}}>
            TRADERWATCH · MEMBERSHIP
          </div>
          <div style={{fontSize: 124, fontWeight: 800, letterSpacing: '-0.055em', color: '#fff', lineHeight: 0.98, marginTop: 24, opacity: l1, fontFamily: 'Arial, sans-serif'}}>
            How much
          </div>
          <div style={{fontSize: 124, fontWeight: 800, letterSpacing: '-0.055em', color: LIME, lineHeight: 0.98, opacity: l2, fontFamily: 'Arial, sans-serif'}}>
            access?
          </div>
          <div style={{width: 460 * ruleW, height: 5, borderRadius: 3, background: `linear-gradient(90deg, ${LIME}, rgba(183,243,75,0.1))`, margin: '36px auto 0'}} />
          <div style={{fontSize: 23, color: '#a9c1d6', marginTop: 30, opacity: l2, fontFamily: 'Arial, sans-serif'}}>
            Free to start. Pro for levels. Max for everything.
          </div>
        </div>
      </AbsoluteFill>

      {/* columns */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div style={{display: 'flex', gap: COL_GAP, transform: `translateY(${camY}px) scale(${camScale})`, transformOrigin: 'center center'}}>
          {TIERS.map((t, i) => (
            <Column
              key={t.key}
              tier={t}
              i={i}
              g={g}
              focus={i === 0 ? focusFree : i === 1 ? focusPro : focusMax}
              dim={i === 0 ? dimFree : i === 1 ? dimPro : dimMax}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* closing */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg,${NAVY_DEEP},${NAVY} 55%,${BLUE})`,
          clipPath: `inset(${100 - wipe * 100}% 0 0 0)`,
          opacity: wipe > 0.001 ? 1 : 0,
        }}
      />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp, transform: `translateY(${ctaY}px)`}}>
        <div style={{textAlign: 'center', padding: '0 90px'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 44}}>
            <div style={{width: 66, height: 66, borderRadius: 18, background: NAVY, border: '1.5px solid rgba(183,243,75,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900, color: LIME, fontFamily: 'Arial, sans-serif'}}>TW</div>
            <div style={{fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif'}}>TraderWatch</div>
          </div>
          <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', lineHeight: 1.02, fontFamily: 'Arial, sans-serif'}}>
            Choose your access.
          </div>
          <div style={{marginTop: 46, display: 'inline-flex', background: LIME, color: '#193414', fontSize: 28, fontWeight: 900, padding: '26px 48px', borderRadius: 14, fontFamily: 'Arial, sans-serif'}}>
            Explore market setups →
          </div>
          <div style={{opacity: discOp, fontSize: 18, color: '#6f88a6', marginTop: 58, lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>
            Educational information only. Trading is risky; no outcomes are guaranteed.<br />
            Plan features as listed at signup; prices in USD.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
