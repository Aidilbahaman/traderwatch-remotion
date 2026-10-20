import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {PAChart} from './PAChart';

const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);
const SCENE = 190;
const COUNT = 8;
const N = 30;
export const SL_FRAMES = SCENE * COUNT;

type Palette = {accent: string; pill: string; pillText: string; tint: string};

const PAL: Record<number, Palette> = {
  0: {accent: '#ff8a3d', pill: 'linear-gradient(135deg,#ff8a3d,#ffd166)', pillText: '#2a1200', tint: 'rgba(255,138,61,.10)'},
  1: {accent: '#00e5ff', pill: '#00e5ff', pillText: '#00232b', tint: 'rgba(0,229,255,.08)'},
  2: {accent: '#ff3366', pill: '#ff3366', pillText: '#2b0009', tint: 'rgba(255,51,102,.09)'},
  3: {accent: LIME, pill: LIME, pillText: '#12240a', tint: 'rgba(183,243,75,.08)'},
  4: {accent: '#818cf8', pill: '#818cf8', pillText: '#0d1030', tint: 'rgba(129,140,248,.10)'},
  5: {accent: '#00ff9f', pill: '#00ff9f', pillText: '#00281a', tint: 'rgba(0,255,159,.07)'},
  6: {accent: GOLD, pill: GOLD, pillText: '#2a1c00', tint: 'rgba(216,156,29,.09)'},
  7: {accent: GOLD, pill: GOLD, pillText: '#2a1c00', tint: 'rgba(216,156,29,.07)'},
};

const Backdrop: React.FC<{tint: string}> = ({tint}) => {
  const f = useCurrentFrame();
  const d = interpolate(f, [0, SL_FRAMES], [0, -180], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#01080f 0%,#030f1d 26%,#051a30 46%,#041324 68%,#030f1d 86%,#01090f 100%)'}}>
      <AbsoluteFill style={{
        backgroundImage:
          'repeating-linear-gradient(0deg,rgba(255,255,255,.020) 0 1px,transparent 1px 72px),repeating-linear-gradient(90deg,rgba(255,255,255,.014) 0 1px,transparent 1px 72px)',
        backgroundPosition: `${d}px ${d}px`,
      }} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 42%, ${tint}, transparent 62%)`}} />
    </AbsoluteFill>
  );
};

const Chrome: React.FC<{section: string}> = ({section}) => (
  <>
    <div style={{position: 'absolute', top: 62, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Img src={staticFile('logo-mark.png')} style={{height: 58, width: 62, objectFit: 'contain'}} />
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.16em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>TRADERWATCH</div>
      </div>
      <div style={{fontSize: 16, fontWeight: 800, letterSpacing: '.18em', color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position: 'absolute', top: 136, left: 72, right: 72, height: 1, background: 'rgba(255,255,255,.14)'}} />
  </>
);

const Dots: React.FC<{index: number; accent: string}> = ({index, accent}) => (
  <div style={{position: 'absolute', bottom: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10}}>
    {Array.from({length: COUNT}).map((_, i) => (
      <div key={i} style={{width: i === index ? 42 : 11, height: 11, borderRadius: 999, background: i === index ? accent : 'rgba(255,255,255,.23)'}} />
    ))}
  </div>
);

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 936, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </AbsoluteFill>
);

const Pill: React.FC<{n: string; label: string; pal: Palette; p: number}> = ({n, label, pal, p}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
    <div style={{
      minWidth: 58, height: 58, borderRadius: 999, padding: '0 12px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: pal.pill, color: pal.pillText,
      fontSize: 26, fontWeight: 900, fontFamily: 'Arial,sans-serif',
    }}>{n}</div>
    <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.2em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif'}}>{label}</div>
  </div>
);

const Head: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{
    fontSize: 68, lineHeight: 1.06, letterSpacing: '-.045em', color: '#fff',
    fontWeight: 800, marginTop: 26, fontFamily: 'Arial,sans-serif',
    opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
  }}>{children}</div>
);

const Note: React.FC<{p: number; accent: string; children: React.ReactNode}> = ({p, accent, children}) => (
  <div style={{
    marginTop: 38, fontSize: 26, lineHeight: 1.42, color: '#a9c1d6',
    fontFamily: 'Arial,sans-serif', opacity: p,
    transform: `translateY(${(1 - p) * 16}px)`,
    borderLeft: `3px solid ${accent}`, paddingLeft: 20,
  }}>{children}</div>
);

const Check: React.FC<{p: number; color: string}> = ({p, color}) => (
  <svg width={30} height={30} viewBox="0 0 30 30">
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={.35 * p} />
    <path d="M8.5 15.5L13 20L21.5 10.5" fill="none" stroke={color} strokeWidth={3.4}
      strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)} />
  </svg>
);

/* ---------- scenes ---------- */

const Cover: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const a = interpolate(l, [4, 30], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [20, 56], [0, 1], {...clamp, easing: easeOut});
  const r = interpolate(l, [40, 86], [0, 1], {...clamp, easing: easeInOut});
  const s = interpolate(l, [62, 112], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 980, textAlign: 'center', marginTop: -30}}>
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.24em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif', opacity: a}}>
          TRADERWATCH · EDUCATION
        </div>
        <div style={{fontSize: 108, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1, marginTop: 28, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          Where does
        </div>
        <div style={{fontSize: 108, fontWeight: 800, letterSpacing: '-.055em', color: pal.accent, lineHeight: 1, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          your stop go?
        </div>
        <div style={{width: 500 * r, height: 5, borderRadius: 3, margin: '38px auto 0', background: `linear-gradient(90deg,${pal.accent},rgba(255,255,255,.04))`}} />
        <div style={{fontSize: 28, lineHeight: 1.45, color: '#a9c1d6', marginTop: 30, opacity: s, fontFamily: 'Arial,sans-serif'}}>
          Risk is a decision,<br />not a reaction.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Why: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [34, 100], [0, 1], {...clamp, easing: easeInOut});
  const n = interpolate(l, [112, 148], [0, 1], clamp);
  const reveal = interpolate(l, [36, SCENE - 20], [1, N], {...clamp, easing: easeInOut});
  return (
    <Stage>
      <Pill n="01" label="WHY IT EXISTS" pal={pal} p={p} />
      <Head p={h}>The stop defines<br />the <span style={{color: pal.accent}}>risk.</span></Head>
      <div style={{marginTop: 40, opacity: chart}}>
        <PAChart reveal={reveal} variant="blueprint" caption="EUR/USD · M1 · ILLUSTRATIVE" />
      </div>
      <Note p={n} accent={pal.accent}>Your stop is the price that proves the idea wrong. Decide it before you enter, not after.</Note>
    </Stage>
  );
};

const Mistake: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [34, 100], [0, 1], {...clamp, easing: easeInOut});
  const n = interpolate(l, [112, 148], [0, 1], clamp);
  const scan = interpolate(l, [40, 120], [0, 1], {...clamp, easing: easeInOut});
  return (
    <Stage>
      <Pill n="02" label="THE MISTAKE" pal={pal} p={p} />
      <Head p={h}>A random<br /><span style={{color: pal.accent}}>pip distance.</span></Head>
      <div style={{marginTop: 40, opacity: chart}}>
        <PAChart reveal={N} variant="neon" scanPulse={scan} caption="EUR/USD · M1 · ILLUSTRATIVE" />
      </div>
      <Note p={n} accent={pal.accent}>Twenty pips because it feels safe is not a reason. The market has no idea what number you picked.</Note>
    </Stage>
  );
};

const Structure: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [34, 100], [0, 1], {...clamp, easing: easeInOut});
  const lvl = interpolate(l, [48, 92], [0, 1], clamp);
  const n = interpolate(l, [112, 148], [0, 1], clamp);
  return (
    <Stage>
      <Pill n="03" label="STRUCTURE" pal={pal} p={p} />
      <Head p={h}>Beyond the<br /><span style={{color: pal.accent}}>swing that made it.</span></Head>
      <div style={{marginTop: 40, opacity: chart}}>
        <PAChart reveal={N} showTrend={1} showLevel={lvl} variant="default" caption="EUR/USD · M1 · ILLUSTRATIVE" />
      </div>
      <Note p={n} accent={pal.accent}>Put the stop where the idea stops being true — past the low that started the move.</Note>
    </Stage>
  );
};

const Buffer: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [34, 100], [0, 1], {...clamp, easing: easeInOut});
  const react = interpolate(l, [54, 96], [0, 1], clamp);
  const n = interpolate(l, [116, 152], [0, 1], clamp);
  return (
    <Stage>
      <Pill n="04" label="THE BUFFER" pal={pal} p={p} />
      <Head p={h}>Leave room<br />for <span style={{color: pal.accent}}>noise.</span></Head>
      <div style={{marginTop: 40, opacity: chart}}>
        <PAChart reveal={N} showTrend={1} showLevel={1} showReaction={react} variant="holographic" caption="EUR/USD · M1 · ILLUSTRATIVE" />
      </div>
      <Note p={n} accent={pal.accent}>A stop sitting on the exact low gets clipped by normal movement. Add space, then size down.</Note>
    </Stage>
  );
};

const MathScene: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [34, 100], [0, 1], {...clamp, easing: easeInOut});
  const n = interpolate(l, [116, 152], [0, 1], clamp);
  const scan = interpolate(l, [46, 110], [0, 1], {...clamp, easing: easeInOut});
  return (
    <Stage>
      <Pill n="05" label="THE MATH" pal={pal} p={p} />
      <Head p={h}>Stop first.<br /><span style={{color: pal.accent}}>Size second.</span></Head>
      <div style={{marginTop: 40, opacity: chart}}>
        <PAChart reveal={N} showLevel={1} variant="ascii" scanPulse={scan} caption="EUR/USD · M1 · ILLUSTRATIVE" />
      </div>
      <Note p={n} accent={pal.accent}>Distance from entry to stop sets your position size. Wider stop means smaller size — never the other way round.</Note>
    </Stage>
  );
};

const Checklist: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const p = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 42], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [140, 176], [0, 1], clamp);
  const items = ['Find the invalidation level', 'Add a volatility buffer', 'Measure the distance', 'Set size from the distance'];
  return (
    <Stage>
      <Pill n="06" label="SEQUENCE" pal={pal} p={p} />
      <Head p={h}>Four steps,<br /><span style={{color: pal.accent}}>every trade.</span></Head>
      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 44}}>
        {items.map((t, i) => {
          const q = interpolate(l, [34 + i * 18, 60 + i * 18], [0, 1], clamp);
          return (
            <div key={t} style={{
              height: 78, borderRadius: 16, display: 'flex', alignItems: 'center', gap: 17,
              padding: '0 22px', background: 'rgba(255,255,255,.06)',
              border: '1px solid rgba(255,255,255,.13)', opacity: q,
              transform: `translateX(${(1 - q) * 26}px)`,
            }}>
              <Check p={q} color={pal.accent} />
              <div style={{fontSize: 27, fontWeight: 700, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{t}</div>
            </div>
          );
        })}
      </div>
      <Note p={n} accent={pal.accent}>No stop, no trade. That single rule removes most of the damage.</Note>
    </Stage>
  );
};

const Outro: React.FC<{l: number; pal: Palette}> = ({l, pal}) => {
  const a = interpolate(l, [4, 36], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [22, 62], [0, 1], {...clamp, easing: easeOut});
  const r = interpolate(l, [42, 92], [0, 1], {...clamp, easing: easeInOut});
  const c = interpolate(l, [72, 112], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 980, textAlign: 'center', marginTop: -34}}>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          Define the risk.
        </div>
        <div style={{fontSize: 96, fontWeight: 800, letterSpacing: '-.055em', color: pal.accent, lineHeight: 1, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          Then the trade.
        </div>
        <div style={{width: 440 * r, height: 5, borderRadius: 3, margin: '40px auto 0', background: `linear-gradient(90deg,${pal.accent},rgba(255,255,255,.04))`}} />
        <div style={{marginTop: 30, opacity: c}}>
          <Img src={staticFile('logo-mark.png')} style={{height: 92, width: 98, objectFit: 'contain', display: 'block', margin: '0 auto 20px'}} />
          <div style={{fontSize: 32, fontWeight: 900, letterSpacing: '.08em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>@TRADERWATCH</div>
          <div style={{fontSize: 18, color: '#6f8aa6', marginTop: 22, fontFamily: 'Arial,sans-serif'}}>
            Educational content only. Not financial advice.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const op = (f: number, i: number) => {
  const s = i * SCENE;
  const e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 16, e], [1, 0], clamp);
  return Math.min(
    interpolate(f, [s, s + 16], [0, 1], clamp),
    interpolate(f, [e - 16, e], [1, 0], clamp),
  );
};

export const StopLoss: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;
  const pal = PAL[idx] ?? PAL[0];
  const push = interpolate(l, [0, SCENE], [1, 1.02], clamp);
  const sec = ['INTRO', 'WHY', 'MISTAKE', 'STRUCTURE', 'BUFFER', 'MATH', 'SEQUENCE', 'OUTRO'][idx];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop tint={pal.tint} />
      <Chrome section={sec} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 42%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: op(f, 0)}}><Cover l={l} pal={pal} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: op(f, 1)}}><Why l={l} pal={pal} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: op(f, 2)}}><Mistake l={l} pal={pal} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: op(f, 3)}}><Structure l={l} pal={pal} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: op(f, 4)}}><Buffer l={l} pal={pal} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: op(f, 5)}}><MathScene l={l} pal={pal} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: op(f, 6)}}><Checklist l={l} pal={pal} /></AbsoluteFill>}
        {idx === 7 && <AbsoluteFill style={{opacity: op(f, 7)}}><Outro l={l} pal={pal} /></AbsoluteFill>}
      </AbsoluteFill>
      <Dots index={idx} accent={pal.accent} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / SL_FRAMES) * 100}%`, background: `linear-gradient(90deg,${pal.accent},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
