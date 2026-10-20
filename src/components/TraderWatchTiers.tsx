import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Easing,
} from 'remotion';

const W = 1920;
const H = 1080;

const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#c65349';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);

/* ------------------------------------------------------------------ */
/* real plan data — mirrors subscribe.html                             */
/* ------------------------------------------------------------------ */
type Tier = {
  key: 'free' | 'pro' | 'max';
  name: string;
  price: string;
  priceNote: string;
  tag: string;
  accent: string;
  features: string[];
  oldPrice?: string;
  badge?: string;
};

const FREE_FEATURES = [
  'Limit 3 signal refresh every 4 hours',
  '3 hot pairs',
  'Live TradingView charts',
  'Access to Telegram',
];

const TIERS: Tier[] = [
  {
    key: 'free',
    name: 'Free',
    price: '$0',
    priceNote: 'forever',
    tag: 'START HERE',
    accent: SKY,
    features: FREE_FEATURES,
  },
  {
    key: 'pro',
    name: 'Pro',
    price: '$20',
    priceNote: 'per billing period',
    tag: 'MOST DETAIL',
    accent: LIME,
    features: [
      '10 signal refresh every 4 hours',
      '6 hot pairs',
      'Entry, stop loss and take profit',
      'Member dashboard and charts',
      'Access to automated Telegram signal',
    ],
  },
  {
    key: 'max',
    name: 'Max',
    price: '$30',
    oldPrice: '$50',
    priceNote: 'per billing period',
    tag: 'FULL ACCESS',
    badge: 'LIMITED OFFER',
    accent: GOLD,
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
/* backdrop                                                            */
/* ------------------------------------------------------------------ */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 720], [0, -110], clamp);
  const glow = interpolate(f, [0, 720], [0.7, 1.12], clamp);
  return (
    <AbsoluteFill style={{background: `linear-gradient(135deg, ${NAVY_DEEP} 0%, ${NAVY} 46%, ${BLUE} 100%)`}}>
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
          position: 'absolute', left: W * 0.5, top: H * 0.42,
          width: 1500, height: 1500, marginLeft: -750, marginTop: -750,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(22,133,207,0.34), rgba(13,79,145,0.10) 46%, transparent 70%)`,
          transform: `scale(${glow})`,
        }}
      />
      <div
        style={{
          position: 'absolute', left: W * 0.18, top: H * 0.8,
          width: 900, height: 900, marginLeft: -450, marginTop: -450,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(183,243,75,0.10), transparent 66%)`,
        }}
      />
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */
const MaskLine: React.FC<{children: React.ReactNode; p: number; size: number; color: string; weight?: number}> = ({
  children,
  p,
  size,
  color,
  weight = 800,
}) => (
  <div style={{overflow: 'hidden', paddingBottom: size * 0.08}}>
    <div
      style={{
        fontSize: size,
        fontWeight: weight,
        letterSpacing: '-0.05em',
        lineHeight: 0.98,
        color,
        fontFamily: 'Arial, sans-serif',
        transform: `translateY(${(1 - p) * 105}%)`,
        opacity: p > 0.01 ? 1 : 0,
      }}
    >
      {children}
    </div>
  </div>
);

const Check: React.FC<{p: number; color: string}> = ({p, color}) => (
  <svg width={30} height={30} viewBox="0 0 30 30" style={{flex: '0 0 auto', marginTop: 4}}>
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={0.35 * p} />
    <path
      d="M 8.5 15.5 L 13 20 L 21.5 10.5"
      fill="none"
      stroke={color}
      strokeWidth={3}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={26}
      strokeDashoffset={26 * (1 - p)}
    />
  </svg>
);

/* ------------------------------------------------------------------ */
/* plan card                                                           */
/* ------------------------------------------------------------------ */
const CARD_W = 452;
const CARD_H = 672;

const PlanCard: React.FC<{
  tier: Tier;
  index: number;
  enter: number;
  focus: number;
  dim: number;
  featStart: number;
  frame: number;
}> = ({tier, index, enter, focus, dim, featStart, frame}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, frame - (12 + index * 6)), fps, config: {damping: 16, stiffness: 90, mass: 0.9}});
  const y = interpolate(s, [0, 1], [180, 0]);
  const rot = interpolate(s, [0, 1], [index === 1 ? 0 : index === 0 ? -9 : 9, 0]);
  const op = interpolate(frame, [12 + index * 6, 34 + index * 6], [0, 1], clamp);

  const lift = interpolate(focus, [0, 1], [0, -26]);
  const glowOp = interpolate(focus, [0, 1], [0, 0.55]);
  const sheen = interpolate(frame, [20 + index * 6, 90 + index * 6], [-140, 620], clamp);

  const isDark = tier.key === 'max';
  const isWhite = tier.key === 'pro';
  const bg = isDark ? 'linear-gradient(160deg, #0b2138, #061a31)' : isWhite ? '#ffffff' : 'rgba(255,255,255,0.07)';
  const textMain = isDark || !isWhite ? '#ffffff' : NAVY;
  const textMuted = isDark ? '#9fb6cc' : isWhite ? '#60758d' : '#c4d9ea';
  const border = isDark
    ? `1px solid rgba(216,156,29,${0.35 + 0.4 * focus})`
    : isWhite
    ? `1px solid rgba(183,243,75,${0.25 + 0.5 * focus})`
    : '1px solid rgba(255,255,255,0.16)';

  return (
    <div
      style={{
        position: 'relative',
        width: CARD_W,
        height: CARD_H,
        opacity: op * (1 - dim * 0.45),
        transform: `translateY(${y + lift}px) rotate(${rot}deg) scale(${1 + focus * 0.02})`,
        filter: dim > 0.5 ? 'saturate(0.7)' : 'none',
      }}
    >
      {/* glow */}
      <div
        style={{
          position: 'absolute', inset: -26, borderRadius: 44,
          background: `radial-gradient(circle at 50% 40%, ${tier.accent}55, transparent 70%)`,
          opacity: glowOp, filter: 'blur(26px)',
        }}
      />

      <div
        style={{
          position: 'relative', width: '100%', height: '100%',
          borderRadius: 30, background: bg, border,
          boxShadow: '0 40px 90px rgba(2,12,26,0.55)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column',
          padding: '32px 34px 28px',
        }}
      >
        {/* sheen */}
        <div
          style={{
            position: 'absolute', top: -160, left: sheen, width: 120, height: 960,
            background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.16), rgba(255,255,255,0))',
            transform: 'rotate(18deg)', pointerEvents: 'none',
          }}
        />

        {/* top accent */}
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}22)`}} />

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 16, fontWeight: 900, letterSpacing: '0.14em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>
            {tier.tag}
          </div>
          <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.10em', color: textMuted, fontFamily: 'Arial, sans-serif'}}>
            0{index + 1}
          </div>
        </div>

        <div style={{marginTop: 16, fontSize: 48, fontWeight: 800, letterSpacing: '-0.03em', color: textMain, fontFamily: 'Arial, sans-serif'}}>
          {tier.name}
        </div>

        <div style={{display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4}}>
          <div style={{fontSize: 66, fontWeight: 800, letterSpacing: '-0.05em', color: tier.oldPrice ? GOLD : textMain, fontFamily: 'Arial, sans-serif'}}>
            {tier.price}
          </div>
          {tier.oldPrice && (
            <div style={{fontSize: 28, fontWeight: 800, color: textMuted, textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>
              {tier.oldPrice}
            </div>
          )}
          <div style={{fontSize: 16, color: textMuted, fontFamily: 'Arial, sans-serif'}}>{tier.priceNote}</div>
        </div>
        {tier.badge && (
          <div
            style={{
              alignSelf: 'flex-start', marginTop: 12,
              fontSize: 13, fontWeight: 900, letterSpacing: '0.10em',
              color: '#193414', background: GOLD, borderRadius: 999,
              padding: '6px 14px', fontFamily: 'Arial, sans-serif',
            }}
          >
            {tier.badge}
          </div>
        )}

        <div style={{height: 1, background: isWhite ? '#e6eef6' : 'rgba(255,255,255,0.12)', margin: '20px 0 18px'}} />

        <div style={{display: 'flex', flexDirection: 'column', gap: 12}}>
          {tier.features.map((f2, i) => {
            const p = interpolate(frame, [featStart + i * 7, featStart + i * 7 + 16], [0, 1], clamp);
            return (
              <div key={f2} style={{display: 'flex', gap: 14, alignItems: 'flex-start', opacity: p, transform: `translateX(${(1 - p) * -18}px)`}}>
                <Check p={p} color={tier.accent} />
                <div style={{fontSize: 19, lineHeight: 1.3, color: isWhite ? '#33475e' : '#dbe9f5', fontFamily: 'Arial, sans-serif'}}>
                  {f2}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{marginTop: 'auto', paddingTop: 20}}>
          <div
            style={{
              height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: tier.key === 'free' ? 'rgba(255,255,255,0.10)' : tier.accent,
              color: tier.key === 'free' ? '#ffffff' : '#193414',
              fontSize: 19, fontWeight: 900, letterSpacing: '0.02em', fontFamily: 'Arial, sans-serif',
              border: tier.key === 'free' ? '1px solid rgba(255,255,255,0.22)' : 'none',
            }}
          >
            {tier.key === 'free' ? 'Continue with Free' : `Subscribe to ${tier.name}`}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* main — 600 frames @ 30fps = 20s                                     */
/* ------------------------------------------------------------------ */
export const TraderWatchTiers: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  /* the cover holds for 4s, then the card timeline starts */
  const g = f - 120;

  /* camera: wide → free → pro → max → wide */
  const camScale = interpolate(
    g,
    [70, 140, 168, 250, 278, 360, 388, 470, 500, 560],
    [1.06, 1.02, 1.34, 1.34, 1.34, 1.34, 1.34, 1.34, 1.02, 1.0],
    {...clamp, easing: easeOut},
  );
  const camX = interpolate(
    g,
    [70, 140, 168, 250, 278, 360, 388, 470, 500, 560],
    [0, 0, CARD_W + 40, CARD_W + 40, 0, 0, -CARD_W - 40, -CARD_W - 40, 0, 0],
    {...clamp, easing: Easing.inOut(Easing.cubic)},
  );

  const focusFree = interpolate(g, [150, 176, 246, 266], [0, 1, 1, 0], clamp);
  const focusPro = interpolate(g, [258, 284, 352, 372], [0, 1, 1, 0], clamp);
  const focusMax = interpolate(g, [368, 394, 466, 486], [0, 1, 1, 0], clamp);
  const dimFree = Math.max(focusPro, focusMax);
  const dimPro = Math.max(focusFree * 0.8, focusMax * 0.8);
  const dimMax = Math.max(focusFree * 0.8, focusPro * 0.8);

  /* intro type */
  const introOut = interpolate(f, [104, 120], [1, 0], clamp);
  const line1 = interpolate(f, [4, 30], [0, 1], {...clamp, easing: easeOut});
  const line2 = interpolate(f, [14, 42], [0, 1], {...clamp, easing: easeOut});
  const kickerOp = interpolate(f, [0, 16], [0, 1], clamp);
  const ruleW = interpolate(f, [8, 46], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  /* wipe transition panel */
  const wipeX = interpolate(g, [490, 500], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  /* closing CTA */
  const ctaOp = interpolate(g, [496, 518], [0, 1], clamp);
  const ctaY = interpolate(g, [496, 518], [34, 0], {...clamp, easing: easeOut});
  const lockOp = interpolate(g, [510, 538], [0, 1], clamp);
  const lockScale = interpolate(g, [510, 542], [0.92, 1], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const discOp = interpolate(g, [538, 566], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />

      {/* ---------------- intro ---------------- */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: kickerOp, marginBottom: 26}}>
            <div style={{width: 10, height: 10, borderRadius: '50%', background: LIME, boxShadow: `0 0 16px ${LIME}`}} />
            <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '0.22em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
              TRADERWATCH · MEMBERSHIP
            </div>
          </div>
          <MaskLine p={line1} size={132} color="#ffffff">Three tiers.</MaskLine>
          <MaskLine p={line2} size={132} color={LIME}>One method.</MaskLine>
          <div style={{width: 560 * ruleW, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${LIME}, rgba(183,243,75,0.1))`, marginTop: 40}} />
        </div>
      </AbsoluteFill>

      {/* ---------------- the cards ---------------- */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            display: 'flex', gap: 40,
            transform: `translateX(${camX}px) scale(${camScale})`,
            transformOrigin: 'center center',
          }}
        >
          {TIERS.map((t, i) => (
            <PlanCard
              key={t.key}
              tier={t}
              index={i}
              enter={1}
              focus={i === 0 ? focusFree : i === 1 ? focusPro : focusMax}
              dim={i === 0 ? dimFree : i === 1 ? dimPro : dimMax}
              featStart={[150, 262, 374][i]}
              frame={g}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* ---------------- per-tier caption ---------------- */}
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 54}}>
        <div style={{display: 'flex', gap: 60, opacity: interpolate(g, [140, 170], [0, 1], clamp) * interpolate(g, [496, 520], [1, 0], clamp)}}>
          {[
            {k: 'FREE', t: '3 signals · 4h refresh', c: SKY, f: focusFree},
            {k: 'PRO', t: '10 a day + Telegram', c: LIME, f: focusPro},
            {k: 'MAX', t: 'Unlimited + priority', c: GOLD, f: focusMax},
          ].map((x) => (
            <div key={x.k} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0.35 + x.f * 0.65}}>
              <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.16em', color: x.c, fontFamily: 'Arial, sans-serif'}}>{x.k}</div>
              <div style={{fontSize: 18, color: '#c4d9ea', fontFamily: 'Arial, sans-serif'}}>{x.t}</div>
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* ---------------- closing ---------------- */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(120deg, ${NAVY_DEEP}, ${NAVY} 55%, ${BLUE})`,
          clipPath: `inset(0 ${100 - wipeX * 100}% 0 0)`,
          opacity: wipeX > 0.001 ? 1 : 0,
          boxShadow: `inset -8px 0 0 ${LIME}`,
        }}
      />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp, transform: `translateY(${ctaY}px)`}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: lockOp, transform: `scale(${lockScale})`}}>
            <div style={{width: 64, height: 64, borderRadius: 17, background: NAVY, border: `1.5px solid rgba(183,243,75,0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 27, fontWeight: 900, color: LIME, fontFamily: 'Arial, sans-serif'}}>TW</div>
            <div style={{fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif'}}>TraderWatch</div>
          </div>

          <div style={{fontSize: 86, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', marginTop: 44, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
            Choose your access.
          </div>

          <div
            style={{
              marginTop: 40, display: 'flex', alignItems: 'center', gap: 14,
              background: LIME, color: '#193414', fontSize: 26, fontWeight: 900,
              padding: '22px 46px', borderRadius: 14, fontFamily: 'Arial, sans-serif',
            }}
          >
            Explore market setups →
          </div>

          <div style={{opacity: discOp, fontSize: 17, color: '#6f88a6', marginTop: 46, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif', maxWidth: 980}}>
            Educational information only. Trading is risky; no outcomes are guaranteed.
            Plan features as listed at signup; prices in USD.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
