import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, Easing} from 'remotion';

const W = 1920;
const H = 1080;
const NAVY = '#09284c';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const INK = '#10243b';
const MUTED = '#60758d';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

export const HERO_FRAMES = 270; // 9s @ 30fps, loops seamlessly

/* deterministic candle series for the hero card */
const CANDLES = (() => {
  const out: {o: number; h: number; l: number; c: number}[] = [];
  let prev = 60;
  for (let i = 0; i < 26; i++) {
    const base = 60 + i * 1.15 + Math.sin(i * 0.78) * 5.2 + Math.cos(i * 0.4) * 1.6;
    out.push({o: prev, c: base, h: Math.max(prev, base) + 2.1, l: Math.min(prev, base) - 1.9});
    prev = base;
  }
  return out;
})();

const CW = 700;
const CH = 330;
const LO = Math.min(...CANDLES.map((c) => c.l)) - 1;
const HI = Math.max(...CANDLES.map((c) => c.h)) + 1;
const Y = (v: number) => CH - ((v - LO) / (HI - LO)) * CH;
const STEP = CW / CANDLES.length;

const ChartCard: React.FC<{l: number; fade: number}> = ({l, fade}) => {
  const build = interpolate(l, [18, 108], [0, 1], {...clamp, easing: easeInOut});
  const scan = interpolate(l, [30, 210], [0, 1], {...clamp, easing: easeInOut});
  const chip = interpolate(l, [104, 138], [0, 1], {...clamp, easing: easeOut});
  const shown = build * CANDLES.length;

  return (
    <div
      style={{
        position: 'relative',
        width: 780,
        borderRadius: 26,
        background: `linear-gradient(165deg, #061e3a 0%, #09284c 52%, #0d4f91 100%)`,
        boxShadow: '0 40px 90px rgba(9,40,76,.28)',
        padding: 34,
        opacity: fade,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
          <div style={{fontSize: 26, fontWeight: 800, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>XAU/USD · Gold</div>
          <div style={{display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', borderRadius: 999, background: 'rgba(183,243,75,.16)', border: '1px solid rgba(183,243,75,.4)'}}>
            <div style={{width: 8, height: 8, borderRadius: 999, background: GREEN}} />
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '.14em', color: GREEN, fontFamily: 'Arial,sans-serif'}}>LIVE</div>
          </div>
        </div>
        <div style={{fontSize: 15, letterSpacing: '.14em', color: '#7fa3c4', fontWeight: 800, fontFamily: 'Arial,sans-serif'}}>H4</div>
      </div>

      <svg width={CW} height={CH} style={{marginTop: 22, overflow: 'visible'}}>
        {CANDLES.map((c, i) => {
          const grow = Math.max(0, Math.min(1, shown - i));
          if (grow <= 0) return null;
          const up = c.c >= c.o;
          const x = STEP * i + STEP / 2;
          const top = Y(Math.max(c.o, c.c));
          const bot = Y(Math.min(c.o, c.c));
          const mid = (top + bot) / 2;
          return (
            <g key={i} opacity={Math.min(1, grow * 2)}>
              <line x1={x} y1={mid + (Y(c.h) - mid) * grow} x2={x} y2={mid + (Y(c.l) - mid) * grow} stroke={up ? GREEN : '#7f96ad'} strokeWidth={2} />
              <rect x={x - STEP * 0.28} y={mid + (top - mid) * grow} width={STEP * 0.56} height={Math.max(3, (bot - top) * grow)} rx={2} fill={up ? GREEN : 'rgba(127,150,173,.7)'} />
            </g>
          );
        })}
        <line x1={scan * CW} y1={-10} x2={scan * CW} y2={CH + 10} stroke={SKY} strokeWidth={2} opacity={0.5} />
      </svg>

      <div
        style={{
          position: 'absolute', right: 34, top: 96,
          padding: '14px 20px', borderRadius: 14,
          background: 'rgba(9,40,76,.92)', border: '1px solid rgba(183,243,75,.45)',
          opacity: chip, transform: `translateY(${(1 - chip) * 14}px)`,
        }}
      >
        <div style={{fontSize: 13, fontWeight: 900, letterSpacing: '.16em', color: GREEN, fontFamily: 'Arial,sans-serif'}}>SETUP FOUND</div>
        <div style={{fontSize: 19, fontWeight: 700, color: '#eaf6ff', marginTop: 6, fontFamily: 'Arial,sans-serif'}}>Entry · Stop · Target</div>
      </div>

      <div style={{fontSize: 13, color: '#7fa3c4', marginTop: 16, fontFamily: 'Arial,sans-serif'}}>
        Illustrative chart. Prices may differ from your broker; not a trade recommendation.
      </div>
    </div>
  );
};

export const WebsiteHero: React.FC = () => {
  const f = useCurrentFrame();

  /* seamless loop: fade everything down in the last 18 frames and back up in the first 18 */
  const loopFade = interpolate(f, [HERO_FRAMES - 18, HERO_FRAMES], [1, 0.55], clamp);

  /* hero copy is complete on frame 0 so autoplay and poster frames never look blank */
  const eyebrow = interpolate(f, [0, 28], [0.82, 1], {...clamp, easing: easeOut});
  const h1a = interpolate(f, [0, 34], [0.82, 1], {...clamp, easing: easeOut});
  const h1b = interpolate(f, [0, 46], [0.72, 1], {...clamp, easing: easeOut});
  const body = interpolate(f, [0, 60], [0.70, 1], {...clamp, easing: easeOut});
  const cta = interpolate(f, [0, 76], [0.65, 1], {...clamp, easing: easeOut});
  const card = interpolate(f, [0, 40], [0.72, 1], {...clamp, easing: easeOut});
  const drift = interpolate(f, [0, HERO_FRAMES], [0, -22], clamp);

  return (
    <AbsoluteFill style={{background: 'linear-gradient(120deg,#ffffff 0%,#f5f9fc 52%,#eaf4fc 100%)', overflow: 'hidden'}}>
      <AbsoluteFill
        style={{
          backgroundImage: `repeating-linear-gradient(0deg, rgba(9,40,76,.035) 0 1px, transparent 1px 80px), repeating-linear-gradient(90deg, rgba(9,40,76,.028) 0 1px, transparent 1px 80px)`,
          backgroundPosition: `${drift}px ${drift}px`,
          maskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(ellipse at 70% 40%, black 0%, transparent 78%)',
        }}
      />

      <div style={{position: 'absolute', left: 130, top: 150, width: 820}}>
        <div style={{fontSize: 22, fontWeight: 900, letterSpacing: '.22em', color: SKY, fontFamily: 'Arial,sans-serif', opacity: eyebrow * loopFade}}>
          BUILT FOR MORE INFORMED TRADING
        </div>

        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.02, color: NAVY, marginTop: 30, fontFamily: 'Arial,sans-serif', opacity: h1a * loopFade, transform: `translateY(${(1 - h1a) * 22}px)`}}>
          Read the market.
        </div>
        <div style={{fontSize: 104, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.02, color: BLUE, marginTop: 4, fontFamily: 'Arial,sans-serif', opacity: h1b * loopFade, transform: `translateY(${(1 - h1b) * 22}px)`}}>
          Trade with a plan.
        </div>

        <div style={{fontSize: 27, lineHeight: 1.55, color: MUTED, marginTop: 34, maxWidth: 700, fontFamily: 'Arial,sans-serif', opacity: body * loopFade}}>
          Learn the why behind the setup. Explore forex signals with clear risk levels, market context and practical tools to help you make your own decisions.
        </div>

        <div style={{display: 'flex', alignItems: 'center', gap: 26, marginTop: 44, opacity: cta * loopFade}}>
          <div style={{padding: '22px 38px', borderRadius: 14, background: GREEN, color: '#132b0c', fontSize: 24, fontWeight: 900, fontFamily: 'Arial,sans-serif', boxShadow: '0 18px 40px rgba(183,243,75,.38)'}}>
            Explore market setups →
          </div>
          <div style={{fontSize: 23, fontWeight: 700, color: NAVY, fontFamily: 'Arial,sans-serif', textDecoration: 'underline', textUnderlineOffset: 6}}>
            How TraderWatch works
          </div>
        </div>

        <div style={{fontSize: 17, color: '#8aa0b5', marginTop: 40, fontFamily: 'Arial,sans-serif', opacity: body * loopFade}}>
          Educational information only. Trading is risky; no outcomes are guaranteed.
        </div>
      </div>

      <div style={{position: 'absolute', right: 120, top: 210}}>
        <ChartCard l={f} fade={card * loopFade} />
      </div>
    </AbsoluteFill>
  );
};
