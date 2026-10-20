import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

const W = 1080;
const H = 1920;

const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';
const INK = '#030f1d';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const SCENE = 150;
const COUNT = 7;
export const TOTAL_FRAMES = SCENE * COUNT;

/* ------------------------------------------------------------------ */
const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, TOTAL_FRAMES], [0, -160], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #01080f 0%, #030f1d 26%, #051a30 46%, #041324 68%, #030f1d 86%, #01090f 100%)'}}>
      <AbsoluteFill style={{backgroundImage: `repeating-linear-gradient(0deg, rgba(255,255,255,.020) 0 1px, transparent 1px 72px), repeating-linear-gradient(90deg, rgba(255,255,255,.014) 0 1px, transparent 1px 72px)`, backgroundPosition: `${drift}px ${drift}px`}} />
      <div style={{position: 'absolute', left: W * 0.5, top: H * 0.46, width: 1500, height: 1500, marginLeft: -750, marginTop: -750, borderRadius: '50%', background: 'radial-gradient(circle,rgba(9,48,81,.55),rgba(6,31,54,.22) 48%,transparent 72%)'}} />
    </AbsoluteFill>
  );
};

const Chrome: React.FC<{section: string}> = ({section}) => (
  <>
    <div style={{position: 'absolute', top: 62, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
        <Img src={staticFile('logo-mark.png')} style={{height: 58, width: 62, objectFit: 'contain', objectPosition: 'left center'}} />
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.16em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>TRADERWATCH</div>
      </div>
      <div style={{fontSize: 16, fontWeight: 800, letterSpacing: '.18em', color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position: 'absolute', top: 136, left: 72, right: 72, height: 1, background: 'rgba(255,255,255,.14)'}} />
  </>
);

const Dots: React.FC<{index: number}> = ({index}) => (
  <div style={{position: 'absolute', bottom: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 12}}>
    {Array.from({length: COUNT}).map((_, i) => (
      <div key={i} style={{width: i === index ? 44 : 12, height: 12, borderRadius: 999, background: i === index ? SKY : 'rgba(255,255,255,.24)', boxShadow: i === index ? '0 0 18px rgba(22,133,207,.85)' : 'none'}} />
    ))}
  </div>
);

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 936, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </AbsoluteFill>
);

const Pill: React.FC<{n: string; label: string; color?: string; p?: number}> = ({n, label, color = SKY, p = 1}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
    <div style={{minWidth: 58, height: 58, borderRadius: 999, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color, color: '#08203a', fontSize: 26, fontWeight: 900, fontFamily: 'Arial,sans-serif'}}>{n}</div>
    <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.2em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif'}}>{label}</div>
  </div>
);

const Headline: React.FC<{p: number; size?: number; children: React.ReactNode}> = ({p, size = 84, children}) => (
  <div style={{fontSize: size, lineHeight: 1.04, letterSpacing: '-.045em', color: '#fff', fontWeight: 800, marginTop: 30, fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>{children}</div>
);

const Note: React.FC<{text: string; p: number}> = ({text, p}) => (
  <div style={{marginTop: 46, fontSize: 28, lineHeight: 1.42, color: '#a9c1d6', fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, borderLeft: `3px solid ${SKY}`, paddingLeft: 22}}>{text}</div>
);

const Check: React.FC<{p: number; color?: string; size?: number}> = ({p, color = LIME, size = 30}) => (
  <svg width={size} height={size} viewBox="0 0 30 30" style={{flex: '0 0 auto'}}>
    <circle cx={15} cy={15} r={14} fill="none" stroke={color} strokeWidth={2} opacity={0.35 * p} />
    <path d="M8.5 15.5L13 20L21.5 10.5" fill="none" stroke={color} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={26} strokeDashoffset={26 * (1 - p)} />
  </svg>
);

/* ------------------------------------------------------------------ */
/* 01 — data in                                                        */
const BARS = (() => {
  const out: {o: number; h: number; l: number; c: number}[] = [];
  let prev = 24;
  for (let i = 0; i < 22; i++) {
    const base = 24 + i * 1.1 + Math.sin(i * 1.15) * 5.4;
    out.push({o: prev, c: base, h: Math.max(prev, base) + 2.1, l: Math.min(prev, base) - 1.9});
    prev = base;
  }
  return out;
})();

const CW = 936;
const CH = 330;

const FeedChart: React.FC<{p: number; scan: number}> = ({p, scan}) => {
  const lo = Math.min(...BARS.map((c) => c.l)) - 1;
  const hi = Math.max(...BARS.map((c) => c.h)) + 1;
  const y = (v: number) => CH - ((v - lo) / (hi - lo)) * CH;
  const step = CW / BARS.length;
  const shown = p * BARS.length;
  const sx = scan * CW;

  return (
    <svg width={CW} height={CH} style={{overflow: 'visible'}}>
      {BARS.map((c, i) => {
        const grow = Math.max(0, Math.min(1, shown - i));
        if (grow <= 0) return null;
        const up = c.c >= c.o;
        const cx = i * step + step / 2;
        const top = y(Math.max(c.o, c.c));
        const bot = y(Math.min(c.o, c.c));
        const mid = (top + bot) / 2;
        const col = up ? SKY : '#5f7f99';
        return (
          <g key={i} opacity={Math.min(1, grow * 2)}>
            <line x1={cx} y1={mid + (y(c.h) - mid) * grow} x2={cx} y2={mid + (y(c.l) - mid) * grow} stroke={col} strokeWidth={2.2} />
            <rect x={cx - step * 0.26} y={mid + (top - mid) * grow} width={step * 0.52} height={Math.max(3, (bot - top) * grow)} rx={2.5} fill={col} opacity={0.85} />
          </g>
        );
      })}
      <line x1={sx} y1={-12} x2={sx} y2={CH + 12} stroke={LIME} strokeWidth={2.5} opacity={0.85} />
      <line x1={sx - 14} y1={-12} x2={sx - 14} y2={CH + 12} stroke={LIME} strokeWidth={1} opacity={0.3} />
      <line x1={sx + 14} y1={-12} x2={sx + 14} y2={CH + 12} stroke={LIME} strokeWidth={1} opacity={0.3} />
    </svg>
  );
};

const SceneData: React.FC<{l: number}> = ({l}) => {
  const pill = interpolate(l, [2, 18], [0, 1], clamp);
  const head = interpolate(l, [6, 26], [0, 1], {...clamp, easing: easeOut});
  const chart = interpolate(l, [14, 62], [0, 1], {...clamp, easing: easeInOut});
  const scan = interpolate(l, [20, 118], [0, 1], {...clamp, easing: easeInOut});
  const chips = interpolate(l, [30, 54], [0, 1], {...clamp, easing: easeOut});
  const note = interpolate(l, [96, 118], [0, 1], {...clamp, easing: easeOut});

  return (
    <Stage>
      <Pill n="01" label="DATA IN" p={pill} />
      <Headline p={head}>It starts with<br />raw <span style={{color: SKY}}>price.</span></Headline>

      <div style={{position: 'relative', marginTop: 54, opacity: Math.min(1, chart * 1.4)}}>
        <FeedChart p={chart} scan={scan} />
      </div>

      <div style={{marginTop: 34, display: 'flex', gap: 12, opacity: chips, transform: `translateY(${(1 - chips) * 16}px)`}}>
        {['M1', 'M5', 'M15', 'H1', 'H4', 'D1'].map((t) => (
          <div key={t} style={{flex: 1, textAlign: 'center', padding: '14px 0', borderRadius: 14, background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.13)', fontSize: 22, fontWeight: 900, letterSpacing: '.06em', color: '#cfe3f3', fontFamily: 'Arial,sans-serif'}}>{t}</div>
        ))}
      </div>

      <Note p={note} text="Thousands of candles across six timeframes, streaming in before any opinion is formed." />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 02 — structure read                                                 */
const SceneRead: React.FC<{l: number}> = ({l}) => {
  const pill = interpolate(l, [2, 18], [0, 1], clamp);
  const head = interpolate(l, [6, 26], [0, 1], {...clamp, easing: easeOut});
  const note = interpolate(l, [100, 122], [0, 1], {...clamp, easing: easeOut});
  const rows = [
    {k: 'Trend', v: 'higher highs, higher lows', c: LIME},
    {k: 'Liquidity', v: 'equal highs sitting above', c: SKY},
    {k: 'Levels', v: 'order block + fair value gap', c: GOLD},
  ];

  return (
    <Stage>
      <Pill n="02" label="STRUCTURE READ" p={pill} />
      <Headline p={head}>It maps<br />the <span style={{color: LIME}}>structure.</span></Headline>

      <div style={{marginTop: 52, display: 'flex', flexDirection: 'column', gap: 18}}>
        {rows.map((r, i) => {
          const p = interpolate(l, [26 + i * 18, 54 + i * 18], [0, 1], {...clamp, easing: easeOut});
          return (
            <div key={r.k} style={{display: 'flex', alignItems: 'center', gap: 20, borderRadius: 20, padding: '26px 26px', background: 'rgba(6,30,58,.62)', border: '1px solid rgba(255,255,255,.12)', opacity: p, transform: `translateY(${(1 - p) * 24}px)`}}>
              <div style={{width: 6, alignSelf: 'stretch', borderRadius: 4, background: r.c, boxShadow: `0 0 18px ${r.c}66`}} />
              <div>
                <div style={{fontSize: 30, fontWeight: 900, color: r.c, fontFamily: 'Arial,sans-serif'}}>{r.k}</div>
                <div style={{fontSize: 23, color: '#a9c1d6', marginTop: 4, fontFamily: 'Arial,sans-serif'}}>{r.v}</div>
              </div>
            </div>
          );
        })}
      </div>

      <Note p={note} text="No guessing: swings, liquidity and levels are labelled from the data, not from a feeling." />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 03 — confluence                                                     */
const SceneConfluence: React.FC<{l: number}> = ({l}) => {
  const pill = interpolate(l, [2, 18], [0, 1], clamp);
  const head = interpolate(l, [6, 26], [0, 1], {...clamp, easing: easeOut});
  const note = interpolate(l, [104, 126], [0, 1], {...clamp, easing: easeOut});
  const pct = Math.round(interpolate(l, [50, 100], [0, 1], {...clamp, easing: easeOut}) * 87);
  const ring = interpolate(l, [44, 104], [0, 1], {...clamp, easing: easeInOut});
  const checks = ['Structure aligned', 'Momentum confirms', 'Session liquid', 'Risk acceptable'];

  return (
    <Stage>
      <Pill n="03" label="CONFLUENCE" p={pill} />
      <Headline p={head}>Every layer<br />must <span style={{color: LIME}}>agree.</span></Headline>

      <div style={{marginTop: 50, display: 'flex', alignItems: 'center', gap: 40}}>
        <div style={{position: 'relative', width: 220, height: 220, flex: '0 0 auto'}}>
          <svg width={220} height={220} viewBox="0 0 220 220">
            <circle cx={110} cy={110} r={94} fill="none" stroke="rgba(255,255,255,.12)" strokeWidth={14} />
            <circle cx={110} cy={110} r={94} fill="none" stroke={LIME} strokeWidth={14} strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 94} strokeDashoffset={2 * Math.PI * 94 * (1 - (ring * 0.87))}
              transform="rotate(-90 110 110)" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
            <div style={{fontSize: 62, fontWeight: 900, color: '#fff', letterSpacing: '-.04em', fontFamily: 'Arial,sans-serif'}}>{pct}%</div>
            <div style={{fontSize: 16, fontWeight: 800, letterSpacing: '.18em', color: '#8fa8c0', fontFamily: 'Arial,sans-serif'}}>CONFIDENCE</div>
          </div>
        </div>

        <div style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 16}}>
          {checks.map((c, i) => {
            const p = interpolate(l, [56 + i * 12, 76 + i * 12], [0, 1], clamp);
            return (
              <div key={c} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p}}>
                <Check p={p} />
                <div style={{fontSize: 26, color: '#dbeaf6', fontFamily: 'Arial,sans-serif'}}>{c}</div>
              </div>
            );
          })}
        </div>
      </div>

      <Note p={note} text="One missing layer and the setup is dropped. A signal is the intersection, not a single pattern." />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 04 — risk engine                                                    */
const SceneRiskEngine: React.FC<{l: number}> = ({l}) => {
  const pill = interpolate(l, [2, 18], [0, 1], clamp);
  const head = interpolate(l, [6, 26], [0, 1], {...clamp, easing: easeOut});
  const note = interpolate(l, [100, 122], [0, 1], {...clamp, easing: easeOut});
  const rows = [
    {k: 'Entry', v: '2 412.80', c: '#eaf6ff'},
    {k: 'Stop', v: '2 404.10', c: RED},
    {k: 'Target', v: '2 438.90', c: LIME},
  ];

  return (
    <Stage>
      <Pill n="04" label="RISK ENGINE" color={GOLD} p={pill} />
      <Headline p={head}>Risk is sized<br />before the <span style={{color: GOLD}}>alert.</span></Headline>

      <div style={{marginTop: 50, borderRadius: 24, background: 'rgba(6,30,58,.62)', border: '1px solid rgba(255,255,255,.14)', padding: '10px 28px 26px'}}>
        {rows.map((r, i) => {
          const p = interpolate(l, [28 + i * 14, 52 + i * 14], [0, 1], {...clamp, easing: easeOut});
          return (
            <div key={r.k} style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '22px 0', borderBottom: '1px solid rgba(255,255,255,.09)', opacity: p}}>
              <div style={{fontSize: 25, color: '#a9c1d6', fontFamily: 'Arial,sans-serif'}}>{r.k}</div>
              <div style={{fontSize: 38, fontWeight: 900, color: r.c, fontFamily: 'Arial,sans-serif', fontVariantNumeric: 'tabular-nums'}}>{r.v}</div>
            </div>
          );
        })}
        <div style={{display: 'flex', gap: 14, marginTop: 22, opacity: interpolate(l, [72, 96], [0, 1], clamp)}}>
          {[{k: 'risk', v: '1%'}, {k: 'reward', v: '1 : 3'}, {k: 'size', v: 'auto'}].map((b) => (
            <div key={b.k} style={{flex: 1, borderRadius: 14, padding: '16px 18px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)'}}>
              <div style={{fontSize: 28, fontWeight: 900, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{b.v}</div>
              <div style={{fontSize: 17, letterSpacing: '.14em', color: '#8fa8c0', marginTop: 4, fontFamily: 'Arial,sans-serif'}}>{b.k.toUpperCase()}</div>
            </div>
          ))}
        </div>
      </div>

      <Note p={note} text="Position size is calculated from the stop distance, so one loss never breaks the account." />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
/* 05 — delivery                                                       */
const SceneDeliver: React.FC<{l: number}> = ({l}) => {
  const pill = interpolate(l, [2, 18], [0, 1], clamp);
  const head = interpolate(l, [6, 26], [0, 1], {...clamp, easing: easeOut});
  const note = interpolate(l, [104, 126], [0, 1], {...clamp, easing: easeOut});
  const card = interpolate(l, [26, 56], [0, 1], {...clamp, easing: easeOut});

  return (
    <Stage>
      <Pill n="05" label="DELIVERY" p={pill} />
      <Headline p={head}>Then it reaches<br /><span style={{color: SKY}}>you.</span></Headline>

      <div style={{marginTop: 48, borderRadius: 26, background: 'rgba(8,36,64,.85)', border: '1px solid rgba(22,133,207,.35)', padding: 30, opacity: card, transform: `translateY(${(1 - card) * 30}px)`, boxShadow: '0 26px 60px rgba(2,12,26,.55)'}}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 30, height: 30, borderRadius: 9, background: `linear-gradient(140deg,${SKY},#0d4f91)`}} />
            <div style={{fontSize: 21, fontWeight: 900, letterSpacing: '.1em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>TRADERWATCH AI</div>
          </div>
          <div style={{fontSize: 17, color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>now</div>
        </div>

        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 26}}>
          <div style={{fontSize: 52, fontWeight: 900, letterSpacing: '-.03em', color: '#fff', fontFamily: 'Arial,sans-serif'}}>XAUUSD</div>
          <div style={{padding: '10px 22px', borderRadius: 999, background: LIME, color: '#132b0c', fontSize: 24, fontWeight: 900, letterSpacing: '.08em', fontFamily: 'Arial,sans-serif'}}>LONG</div>
        </div>

        <div style={{marginTop: 24, borderTop: '1px solid rgba(255,255,255,.12)'}}>
          {[{k: 'Entry', v: '2 412.80'}, {k: 'Stop loss', v: '2 404.10'}, {k: 'Take profit', v: '2 438.90'}].map((r, i) => {
            const p = interpolate(l, [48 + i * 12, 70 + i * 12], [0, 1], clamp);
            return (
              <div key={r.k} style={{display: 'flex', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,.08)', opacity: p}}>
                <div style={{fontSize: 23, color: '#9fb8cd', fontFamily: 'Arial,sans-serif'}}>{r.k}</div>
                <div style={{fontSize: 27, fontWeight: 800, color: '#eaf6ff', fontFamily: 'Arial,sans-serif', fontVariantNumeric: 'tabular-nums'}}>{r.v}</div>
              </div>
            );
          })}
        </div>

        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 20, opacity: interpolate(l, [80, 104], [0, 1], clamp)}}>
          <div style={{fontSize: 19, color: '#8fa8c0', fontFamily: 'Arial,sans-serif'}}>H1 · confidence 87% · 1:3</div>
          <div style={{fontSize: 19, color: '#8fa8c0', fontFamily: 'Arial,sans-serif'}}>EXAMPLE</div>
        </div>
      </div>

      <Note p={note} text="Pair, direction, entry, stop, target and size — one message, no interpretation needed." />
    </Stage>
  );
};

/* ------------------------------------------------------------------ */
const SceneCover: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [0, 16], [0.55, 1], clamp);
  const b = interpolate(l, [6, 30], [0.35, 1], {...clamp, easing: easeOut});
  const rule = interpolate(l, [16, 54], [0.2, 1], {...clamp, easing: easeInOut});
  const sub = interpolate(l, [26, 58], [0.35, 1], clamp);

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 960, textAlign: 'center', marginTop: -30}}>
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.24em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif', opacity: a}}>TRADERWATCH · HOW IT WORKS</div>
        <div style={{fontSize: 138, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: .98, marginTop: 28, opacity: a, fontFamily: 'Arial,sans-serif'}}>How the AI</div>
        <div style={{fontSize: 138, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: .98, opacity: b, transform: `translateY(${(1 - b) * 18}px)`, fontFamily: 'Arial,sans-serif'}}>reads it.</div>
        <div style={{width: 500 * rule, height: 5, borderRadius: 3, margin: '38px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}} />
        <div style={{fontSize: 28, lineHeight: 1.45, color: '#a9c1d6', marginTop: 30, opacity: sub, fontFamily: 'Arial,sans-serif'}}>From raw price<br />to a signal you can act on.</div>
      </div>
    </AbsoluteFill>
  );
};

const SceneOutro: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 30], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [20, 46], [0, 1], {...clamp, easing: easeOut});
  const rule = interpolate(l, [34, 70], [0, 1], {...clamp, easing: easeInOut});
  const c = interpolate(l, [56, 86], [0, 1], {...clamp, easing: easeOut});

  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 960, textAlign: 'center', marginTop: -30}}>
        <div style={{fontSize: 124, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1, opacity: a, fontFamily: 'Arial,sans-serif'}}>You get the plan.</div>
        <div style={{fontSize: 124, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1, opacity: b, fontFamily: 'Arial,sans-serif'}}>Not a guess.</div>
        <div style={{width: 430 * rule, height: 5, borderRadius: 3, margin: '42px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}} />
        <div style={{marginTop: 42, opacity: c}}>
          <Img src={staticFile('logo-mark.png')} style={{height: 96, width: 102, objectFit: 'contain', display: 'block', margin: '0 auto 22px'}} />
          <div style={{fontSize: 34, fontWeight: 900, letterSpacing: '.08em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>@TRADERWATCH</div>
          <div style={{fontSize: 24, color: '#8fa8c0', marginTop: 12, fontFamily: 'Arial,sans-serif'}}>Follow for daily chart education.</div>
          <div style={{fontSize: 19, color: '#6f8aa6', marginTop: 26, lineHeight: 1.4, fontFamily: 'Arial,sans-serif'}}>Educational content only. Not financial advice.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
const sceneOpacity = (f: number, i: number) => {
  const s = i * SCENE;
  const e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 14, e], [1, 0], clamp);
  return Math.min(interpolate(f, [s, s + 14], [0, 1], clamp), interpolate(f, [e - 14, e], [1, 0], clamp));
};

export const TraderWatchAI: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const local = f - idx * SCENE;
  const push = interpolate(local, [0, SCENE], [1, 1.03], clamp);
  const section = ['INTRO', 'STEP 01', 'STEP 02', 'STEP 03', 'STEP 04', 'STEP 05', 'OUTRO'][idx];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />
      <Chrome section={section} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 42%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: sceneOpacity(f, 0)}}><SceneCover l={local} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: sceneOpacity(f, 1)}}><SceneData l={local} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: sceneOpacity(f, 2)}}><SceneRead l={local} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: sceneOpacity(f, 3)}}><SceneConfluence l={local} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: sceneOpacity(f, 4)}}><SceneRiskEngine l={local} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: sceneOpacity(f, 5)}}><SceneDeliver l={local} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: sceneOpacity(f, 6)}}><SceneOutro l={local} /></AbsoluteFill>}
      </AbsoluteFill>
      <Dots index={idx} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / TOTAL_FRAMES) * 100}%`, background: `linear-gradient(90deg,${SKY},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
