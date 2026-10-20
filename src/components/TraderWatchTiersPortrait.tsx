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
  price: string;
  oldPrice?: string;
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

const CARD_W = 880;
const CARD_H = 566;
const GAP = 40;
const STEP = CARD_H + GAP;

/* ------------------------------------------------------------------ */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, 720], [0, -110], clamp);
  const glow = interpolate(f, [0, 720], [0.7, 1.12], clamp);
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
          background: `radial-gradient(circle, rgba(22,133,207,0.34), rgba(13,79,145,0.10) 46%, transparent 70%)`,
          transform: `scale(${glow})`,
        }}
      />
    </AbsoluteFill>
  );
};

const MaskLine: React.FC<{children: React.ReactNode; p: number; size: number; color: string}> = ({children, p, size, color}) => (
  <div style={{overflow: 'hidden', paddingBottom: size * 0.08}}>
    <div
      style={{
        fontSize: size, fontWeight: 800, letterSpacing: '-0.05em', lineHeight: 0.98, color,
        fontFamily: 'Arial, sans-serif',
        transform: `translateY(${(1 - p) * 105}%)`, opacity: p > 0.01 ? 1 : 0,
      }}
    >
      {children}
    </div>
  </div>
);

const Check: React.FC<{p: number; color: string}> = ({p, color}) => (
  <svg width={26} height={26} viewBox="0 0 30 30" style={{flex: '0 0 auto', marginTop: 3}}>
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={0.35 * p} />
    <path
      d="M 8.5 15.5 L 13 20 L 21.5 10.5" fill="none" stroke={color} strokeWidth={3}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)}
    />
  </svg>
);

const PlanCard: React.FC<{tier: Tier; index: number; focus: number; dim: number; featStart: number; frame: number}> = ({
  tier, index, focus, dim, featStart, frame,
}) => {
  const {fps} = useVideoConfig();
  const s = spring({frame: Math.max(0, frame - (10 + index * 6)), fps, config: {damping: 16, stiffness: 90, mass: 0.9}});
  const y = interpolate(s, [0, 1], [140, 0]);
  const op = interpolate(frame, [10 + index * 6, 30 + index * 6], [0, 1], clamp);

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
  const sheen = interpolate(frame, [16 + index * 6, 86 + index * 6], [-160, 900], clamp);

  return (
    <div
      style={{
        position: 'relative', width: CARD_W, height: CARD_H,
        opacity: op * (1 - dim * 0.45),
        transform: `translateY(${y}px) scale(${1 + focus * 0.01})`,
      }}
    >
      <div
        style={{
          position: 'absolute', inset: -22, borderRadius: 44,
          background: `radial-gradient(circle at 50% 40%, ${tier.accent}55, transparent 70%)`,
          opacity: focus * 0.6, filter: 'blur(24px)',
        }}
      />
      <div
        style={{
          position: 'relative', width: '100%', height: '100%', borderRadius: 28,
          background: bg, border, boxShadow: '0 34px 80px rgba(2,12,26,0.55)',
          overflow: 'hidden', display: 'flex', flexDirection: 'column', padding: '30px 34px 26px',
        }}
      >
        <div style={{position: 'absolute', top: -140, left: sheen, width: 110, height: 900, background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.15), rgba(255,255,255,0))', transform: 'rotate(18deg)'}} />
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 6, background: `linear-gradient(90deg, ${tier.accent}, ${tier.accent}22)`}} />

        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '0.14em', color: tier.accent, fontFamily: 'Arial, sans-serif'}}>{tier.tag}</div>
          <div style={{fontSize: 14, fontWeight: 900, letterSpacing: '0.10em', color: textMuted, fontFamily: 'Arial, sans-serif'}}>0{index + 1}</div>
        </div>

        <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: 10}}>
          <div style={{fontSize: 46, fontWeight: 800, letterSpacing: '-0.03em', color: textMain, fontFamily: 'Arial, sans-serif'}}>{tier.name}</div>
          <div style={{display: 'flex', alignItems: 'baseline', gap: 8}}>
            <div style={{fontSize: 58, fontWeight: 800, letterSpacing: '-0.05em', color: tier.oldPrice ? GOLD : textMain, fontFamily: 'Arial, sans-serif'}}>{tier.price}</div>
            {tier.oldPrice && (
              <div style={{fontSize: 24, fontWeight: 800, color: textMuted, textDecoration: 'line-through', fontFamily: 'Arial, sans-serif'}}>{tier.oldPrice}</div>
            )}
          </div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 10, marginTop: 2}}>
          <div style={{fontSize: 15, color: textMuted, fontFamily: 'Arial, sans-serif'}}>{tier.priceNote}</div>
          {tier.badge && (
            <div style={{fontSize: 12, fontWeight: 900, letterSpacing: '0.10em', color: '#193414', background: GOLD, borderRadius: 999, padding: '5px 12px', fontFamily: 'Arial, sans-serif'}}>
              {tier.badge}
            </div>
          )}
        </div>

        <div style={{height: 1, background: isWhite ? '#e6eef6' : 'rgba(255,255,255,0.12)', margin: '16px 0 16px'}} />

        <div style={{display: 'flex', flexDirection: 'column', gap: 11}}>
          {tier.features.map((feat, i) => {
            const p = interpolate(frame, [featStart + i * 7, featStart + i * 7 + 16], [0, 1], clamp);
            return (
              <div key={feat} style={{display: 'flex', gap: 12, alignItems: 'flex-start', opacity: p, transform: `translateX(${(1 - p) * -16}px)`}}>
                <Check p={p} color={tier.accent} />
                <div style={{fontSize: 19, lineHeight: 1.3, color: isWhite ? '#33475e' : '#dbe9f5', fontFamily: 'Arial, sans-serif'}}>{feat}</div>
              </div>
            );
          })}
        </div>

        <div style={{marginTop: 'auto', paddingTop: 16}}>
          <div
            style={{
              height: 50, borderRadius: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: tier.key === 'free' ? 'rgba(255,255,255,0.10)' : tier.accent,
              color: tier.key === 'free' ? '#ffffff' : '#193414',
              fontSize: 18, fontWeight: 900, fontFamily: 'Arial, sans-serif',
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
export const TraderWatchTiersPortrait: React.FC = () => {
  const f = useCurrentFrame();
  const g = f - 120;

  const introOut = interpolate(f, [104, 120], [1, 0], clamp);
  const line1 = interpolate(f, [4, 30], [0, 1], {...clamp, easing: easeOut});
  const line2 = interpolate(f, [14, 42], [0, 1], {...clamp, easing: easeOut});
  const kickerOp = interpolate(f, [0, 16], [0, 1], clamp);
  const ruleW = interpolate(f, [8, 46], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});

  /* vertical camera: wide → Free → Pro → Max → wide */
  const camScale = interpolate(
    g,
    [70, 140, 168, 250, 278, 360, 388, 470, 500, 560],
    [0.98, 0.95, 1.28, 1.28, 1.28, 1.28, 1.28, 1.28, 0.95, 0.98],
    {...clamp, easing: easeOut},
  );
  const camY = interpolate(
    g,
    [70, 140, 168, 250, 278, 360, 388, 470, 500, 560],
    [0, 0, STEP, STEP, 0, 0, -STEP, -STEP, 0, 0],
    {...clamp, easing: Easing.inOut(Easing.cubic)},
  );

  const focusFree = interpolate(g, [150, 176, 246, 266], [0, 1, 1, 0], clamp);
  const focusPro = interpolate(g, [258, 284, 352, 372], [0, 1, 1, 0], clamp);
  const focusMax = interpolate(g, [368, 394, 466, 486], [0, 1, 1, 0], clamp);
  const dimFree = Math.max(focusPro, focusMax);
  const dimPro = Math.max(focusFree * 0.8, focusMax * 0.8);
  const dimMax = Math.max(focusFree * 0.8, focusPro * 0.8);

  const wipe = interpolate(g, [490, 500], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const ctaOp = interpolate(g, [496, 518], [0, 1], clamp);
  const ctaY = interpolate(g, [496, 518], [34, 0], {...clamp, easing: easeOut});
  const lockOp = interpolate(g, [510, 538], [0, 1], clamp);
  const lockScale = interpolate(g, [510, 542], [0.92, 1], {...clamp, easing: Easing.out(Easing.back(1.3))});
  const discOp = interpolate(g, [538, 566], [0, 1], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />

      {/* cover */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: introOut}}>
        <div style={{width: 940}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: kickerOp, marginBottom: 28}}>
            <div style={{width: 10, height: 10, borderRadius: '50%', background: LIME, boxShadow: `0 0 16px ${LIME}`}} />
            <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '0.20em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>TRADERWATCH · MEMBERSHIP</div>
          </div>
          <MaskLine p={line1} size={140} color="#ffffff">Three tiers.</MaskLine>
          <MaskLine p={line2} size={140} color={LIME}>One method.</MaskLine>
          <div style={{width: 520 * ruleW, height: 6, borderRadius: 3, background: `linear-gradient(90deg, ${LIME}, rgba(183,243,75,0.1))`, marginTop: 34}} />
          <div style={{fontSize: 24, color: '#a9c1d6', marginTop: 30, fontFamily: 'Arial, sans-serif'}}>Free to start. Pro for levels. Max for everything.</div>
        </div>
      </AbsoluteFill>

      {/* cards — vertical stack, camera pans down through them */}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <div
          style={{
            display: 'flex', flexDirection: 'column', gap: GAP,
            transform: `translateY(${camY}px) scale(${camScale})`, transformOrigin: 'center center',
          }}
        >
          {TIERS.map((t, i) => (
            <PlanCard
              key={t.key}
              tier={t}
              index={i}
              focus={i === 0 ? focusFree : i === 1 ? focusPro : focusMax}
              dim={i === 0 ? dimFree : i === 1 ? dimPro : dimMax}
              featStart={[150, 262, 374][i]}
              frame={g}
            />
          ))}
        </div>
      </AbsoluteFill>

      {/* closing */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(160deg, ${NAVY_DEEP}, ${NAVY} 55%, ${BLUE})`,
          clipPath: `inset(${100 - wipe * 100}% 0 0 0)`,
          opacity: wipe > 0.001 ? 1 : 0,
        }}
      />

      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity: ctaOp, transform: `translateY(${ctaY}px)`}}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 90px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 16, opacity: lockOp, transform: `scale(${lockScale})`}}>
            <div style={{width: 72, height: 72, borderRadius: 19, background: NAVY, border: `1.5px solid rgba(183,243,75,0.45)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, fontWeight: 900, color: LIME, fontFamily: 'Arial, sans-serif'}}>TW</div>
            <div style={{fontSize: 38, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'Arial, sans-serif'}}>TraderWatch</div>
          </div>

          <div style={{fontSize: 92, fontWeight: 800, letterSpacing: '-0.05em', color: '#fff', marginTop: 54, textAlign: 'center', lineHeight: 1.02, fontFamily: 'Arial, sans-serif'}}>
            Choose your access.
          </div>

          <div style={{marginTop: 52, display: 'flex', alignItems: 'center', gap: 12, background: LIME, color: '#193414', fontSize: 28, fontWeight: 900, padding: '26px 46px', borderRadius: 14, fontFamily: 'Arial, sans-serif'}}>
            Explore market setups →
          </div>

          <div style={{opacity: discOp, fontSize: 18, color: '#6f88a6', marginTop: 70, textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif'}}>
            Educational information only. Trading is risky; no outcomes are guaranteed.
            Plan features as listed at signup; prices in USD.
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
