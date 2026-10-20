import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';

/* ============================================================
   What is an LLM? — animated explainer
   1080x1920 · 8 scenes · 190 frames each
   ============================================================ */

const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';
const INK = '#eaf6ff';
const MUT = '#8fa8c0';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const SCENE = 190;
const COUNT = 8;
export const LLM_FRAMES = SCENE * COUNT;

/* ---------- shared motion pieces ---------- */

const Field: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <svg width={1080} height={1920} style={{position: 'absolute'}}>
      <g opacity={0.45}>
        <circle cx={220 + Math.sin(f * 0.011) * 80} cy={420 + Math.cos(f * 0.009) * 60} r={280} fill={SKY} opacity={0.16} />
        <circle cx={880 + Math.cos(f * 0.008) * 70} cy={1250 + Math.sin(f * 0.012) * 80} r={320} fill={LIME} opacity={0.09} />
      </g>
      <defs>
        <filter id="llmfield" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={80} />
        </filter>
      </defs>
    </svg>
  </AbsoluteFill>
);

/* streaming tokens behind the cover */
const TokenStream: React.FC<{f: number; y: number; dir: number; op: number; color: string}> = ({f, y, dir, op, color}) => {
  const words = ['the', 'model', 'predicts', 'next', 'token', 'from', 'context', 'weights', 'attention', 'pattern'];
  return (
    <g opacity={op}>
      {Array.from({length: 9}).map((_, i) => {
        const w = words[(i + Math.floor(f / 40)) % words.length];
        const span = 1400;
        const raw = ((f * 2.2 * dir + i * 160) % span + span) % span;
        const x = dir > 0 ? raw - 160 : 1080 - raw + 160;
        const bw = 26 + w.length * 15;
        return (
          <g key={i} opacity={0.55}>
            <rect x={x} y={y + i * 0} width={bw} height={40} rx={20} fill={color} opacity={0.16} />
            <text x={x + 13} y={y + 27} fill={color} fontSize={19} fontFamily="Arial" fontWeight={700}>{w}</text>
          </g>
        );
      })}
    </g>
  );
};

const Chrome: React.FC<{section: string}> = ({section}) => (
  <>
    <div style={{position: 'absolute', top: 62, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
        <Img src={staticFile('logo-mark.png')} style={{height: 54, width: 58, objectFit: 'contain'}} />
        <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '.16em', color: INK, fontFamily: 'Arial,sans-serif'}}>AI EXPLAINED</div>
      </div>
      <div style={{fontSize: 15, fontWeight: 800, letterSpacing: '.18em', color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position: 'absolute', top: 134, left: 72, right: 72, height: 1, background: 'rgba(255,255,255,.13)'}} />
  </>
);

const Dots: React.FC<{index: number}> = ({index}) => (
  <div style={{position: 'absolute', bottom: 90, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 9}}>
    {Array.from({length: COUNT}).map((_, i) => (
      <div key={i} style={{
        width: i === index ? 40 : 10, height: 10, borderRadius: 99,
        background: i === index ? LIME : 'rgba(255,255,255,.22)',
        boxShadow: i === index ? '0 0 14px rgba(183,243,75,.7)' : 'none',
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
    alignSelf: 'flex-start', padding: '9px 15px', borderRadius: 999,
    background: `${color}1f`, border: `1px solid ${color}4d`,
    fontSize: 15, fontWeight: 900, letterSpacing: '.16em', color,
    fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 14}px)`,
  }}>{children}</div>
);

const Head: React.FC<{p: number; children: React.ReactNode; size?: number}> = ({p, children, size = 74}) => (
  <div style={{
    marginTop: 24, fontSize: size, lineHeight: 1.05, letterSpacing: '-.05em',
    color: '#fff', fontWeight: 800, fontFamily: 'Arial,sans-serif',
    opacity: p, transform: `translateY(${(1 - p) * 26}px)`,
  }}>{children}</div>
);

const Sub: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{
    marginTop: 24, maxWidth: 860, fontSize: 26, lineHeight: 1.45, color: '#a9c1d6',
    fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 16}px)`,
  }}>{children}</div>
);

/* ---------- 1. cover ---------- */
const Cover: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 34], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [22, 62], [0, 1], {...clamp, easing: easeOut});
  const c = interpolate(l, [56, 104], [0, 1], clamp);
  const rule = interpolate(l, [64, 118], [0, 1], {...clamp, easing: easeInOut});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <TokenStream f={l} y={330} dir={1} op={0.55} color={SKY} />
        <TokenStream f={l} y={1520} dir={-1} op={0.45} color={LIME} />
      </svg>
      <div style={{width: 960, textAlign: 'center', marginTop: -20}}>
        <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '.30em', color: MUT, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          AI EXPLAINED
        </div>
        <div style={{fontSize: 106, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1.02, marginTop: 32, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          What is
        </div>
        <div style={{fontSize: 106, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1.02, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          an LLM?
        </div>
        <div style={{width: 440 * rule, height: 5, borderRadius: 3, margin: '40px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.04))`}} />
        <div style={{fontSize: 27, lineHeight: 1.5, color: '#a9c1d6', marginTop: 32, opacity: c, fontFamily: 'Arial,sans-serif'}}>
          A large language model,<br />in plain English.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. next-token prediction ---------- */
const Predict: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const s = interpolate(l, [26, 60], [0, 1], {...clamp, easing: easeOut});
  const cands = [
    ['morning', 0.46, LIME],
    ['evening', 0.21, SKY],
    ['world', 0.14, GOLD],
    ['meeting', 0.08, '#7f8fa6'],
  ];
  return (
    <Stage>
      <Kicker p={k}>THE CORE IDEA</Kicker>
      <Head p={h}>It predicts<br />the <span style={{color: LIME}}>next token.</span></Head>
      <Sub p={s}>Given everything before it, the model scores what is likely to come next.</Sub>
      <div style={{marginTop: 40, padding: '26px 28px', borderRadius: 24, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)'}}>
        <div style={{fontSize: 30, color: '#cfe1f2', fontFamily: 'Arial,sans-serif'}}>
          “Good <span style={{color: LIME}}>morning</span>, have a good ___”
        </div>
        <div style={{marginTop: 26, display: 'flex', flexDirection: 'column', gap: 12}}>
          {cands.map(([w, pv, col], i) => {
            const q = interpolate(l, [56 + i * 16, 96 + i * 16], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={w as string} style={{display: 'flex', alignItems: 'center', gap: 14, opacity: q}}>
                <div style={{width: 130, fontSize: 21, fontWeight: 700, color: INK, fontFamily: 'Arial,sans-serif'}}>{w as string}</div>
                <div style={{flex: 1, height: 22, borderRadius: 6, background: 'rgba(255,255,255,.08)', overflow: 'hidden'}}>
                  <div style={{
                    height: '100%',
                    width: `${(pv as number) * 100 * q * 2}%`,
                    background: col as string, borderRadius: 6,
                  }} />
                </div>
                <div style={{width: 62, textAlign: 'right', fontSize: 19, fontWeight: 800, color: col as string, fontFamily: 'Arial,sans-serif'}}>
                  {Math.round((pv as number) * 100)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <Sub p={interpolate(l, [130, 168], [0, 1], clamp)}>No meaning engine. Just probabilities over what usually follows.</Sub>
    </Stage>
  );
};

/* ---------- 3. tokens ---------- */
const Tokens: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const split = interpolate(l, [48, 118], [0, 1], {...clamp, easing: easeInOut});
  const parts = ['Un', 'believ', 'able', ' wea', 'ther'];
  return (
    <Stage>
      <Kicker p={k}>STEP ONE</Kicker>
      <Head p={h}>Text becomes<br /><span style={{color: SKY}}>tokens.</span></Head>
      <Sub p={interpolate(l, [24, 56], [0, 1], {...clamp, easing: easeOut})}>
        The model does not read letters or words. It reads chunks.
      </Sub>
      <div style={{marginTop: 44, padding: '30px 26px', borderRadius: 24, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)'}}>
        <div style={{fontSize: 30, color: '#cfe1f2', fontFamily: 'Arial,sans-serif', opacity: 1 - split * 0.25}}>
          Unbelievable weather
        </div>
        <div style={{height: 2, background: 'rgba(255,255,255,.10)', margin: '22px 0'}} />
        <div style={{display: 'flex', gap: 8, flexWrap: 'wrap'}}>
          {parts.map((t, i) => {
            const q = interpolate(l, [60 + i * 14, 92 + i * 14], [0, 1], {...clamp, easing: easeOut});
            return (
              <div key={i} style={{
                padding: '12px 16px', borderRadius: 10, background: 'rgba(22,133,207,.18)',
                border: '1px solid rgba(22,133,207,.5)', color: INK,
                fontSize: 26, fontWeight: 700, fontFamily: 'Arial,sans-serif',
                opacity: q, transform: `translateY(${(1 - q) * 18}px)`,
              }}>{t}</div>
            );
          })}
        </div>
        <div style={{marginTop: 22, display: 'flex', gap: 10, alignItems: 'center'}}>
          {parts.map((_, i) => {
            const q = interpolate(l, [104 + i * 8, 132 + i * 8], [0, 1], clamp);
            return (
              <div key={i} style={{
                flex: 1, height: 40, borderRadius: 8, background: `rgba(183,243,75,${0.10 + 0.16 * q})`,
                border: '1px solid rgba(183,243,75,.35)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 800, color: LIME, fontFamily: 'Arial,sans-serif', opacity: q,
              }}>{1000 + i * 137}</div>
            );
          })}
        </div>
        <div style={{marginTop: 12, fontSize: 17, color: MUT, fontFamily: 'Arial,sans-serif'}}>Each token has an ID. That number is what the model works with.</div>
      </div>
    </Stage>
  );
};

/* ---------- 4. training ---------- */
const Training: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const lines = 7;
  return (
    <Stage>
      <Kicker p={k}>HOW IT LEARNS</Kicker>
      <Head p={h}>Trained on<br /><span style={{color: GOLD}}>huge amounts of text.</span></Head>
      <Sub p={interpolate(l, [24, 56], [0, 1], {...clamp, easing: easeOut})}>
        Books, articles, code, conversations. The model adjusts itself to predict that text better.
      </Sub>
      <div style={{marginTop: 40, height: 380, position: 'relative', overflow: 'hidden', borderRadius: 24, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)'}}>
        {Array.from({length: lines}).map((_, i) => {
          const off = (l * 1.6 + i * 54) % 420;
          const w = 62 + ((i * 37) % 30);
          const op = interpolate(l, [20 + i * 6, 60 + i * 6], [0, 1], clamp);
          return (
            <div key={i} style={{
              position: 'absolute', left: 26, top: 380 - off, width: `${w}%`, height: 16,
              borderRadius: 8, background: i % 3 === 0 ? 'rgba(216,156,29,.55)' : 'rgba(255,255,255,.20)',
              opacity: op * 0.9,
            }} />
          );
        })}
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 130,
          background: 'linear-gradient(180deg,rgba(3,15,29,0),rgba(3,15,29,.96))',
        }} />
        <div style={{
          position: 'absolute', left: '50%', bottom: 26, transform: 'translateX(-50%)',
          padding: '12px 22px', borderRadius: 999, background: GOLD, color: '#2a1c00',
          fontSize: 18, fontWeight: 900, fontFamily: 'Arial,sans-serif',
          opacity: interpolate(l, [70, 108], [0, 1], clamp),
        }}>PATTERN → WEIGHT UPDATE</div>
      </div>
      <Sub p={interpolate(l, [132, 172], [0, 1], clamp)}>Repeat trillions of times. That is the whole training loop.</Sub>
    </Stage>
  );
};

/* ---------- 5. parameters ---------- */
const Params: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const cols = 12, rows = 7;
  const count = Math.round(interpolate(l, [30, 150], [0, 70], {...clamp, easing: easeOut}));
  return (
    <Stage>
      <Kicker p={k}>WHAT IT STORES</Kicker>
      <Head p={h}>Billions of<br /><span style={{color: SKY}}>numbers.</span></Head>
      <Sub p={interpolate(l, [24, 56], [0, 1], {...clamp, easing: easeOut})}>
        Those numbers are called parameters. They encode statistical patterns, not facts.
      </Sub>
      <div style={{marginTop: 40, padding: 26, borderRadius: 24, background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.10)'}}>
        <div style={{display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 9}}>
          {Array.from({length: cols * rows}).map((_, i) => {
            const q = interpolate(l, [34 + (i % cols) * 3 + Math.floor(i / cols) * 4, 74 + (i % cols) * 3 + Math.floor(i / cols) * 4], [0, 1], clamp);
            const v = 0.25 + 0.75 * Math.abs(Math.sin(i * 1.7 + l * 0.05));
            return (
              <div key={i} style={{
                height: 20, borderRadius: 4,
                background: `rgba(${22 + v * 160},${133 + v * 60},${207},${0.16 + v * 0.5})`,
                opacity: q,
              }} />
            );
          })}
        </div>
        <div style={{marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 12}}>
          <div style={{fontSize: 52, fontWeight: 800, color: LIME, fontFamily: 'Arial,sans-serif', letterSpacing: '-.03em'}}>
            {count}%
          </div>
          <div style={{fontSize: 19, color: MUT, fontFamily: 'Arial,sans-serif'}}>of the grid lit — the real models are far larger</div>
        </div>
      </div>
      <Sub p={interpolate(l, [140, 178], [0, 1], clamp)}>Parameters are the model's learned settings. Not a database of sentences.</Sub>
    </Stage>
  );
};

/* ---------- 6. attention ---------- */
const Attention: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const words = ['The', 'cat', 'sat', 'because', 'it', 'was', 'tired'];
  const w = 936, gap = 8;
  const cellW = (w - gap * (words.length - 1)) / words.length;
  const arcs = [
    [4, 1, 0.9],
    [4, 3, 0.7],
    [4, 6, 0.6],
  ];
  const draw = interpolate(l, [56, 128], [0, 1], {...clamp, easing: easeInOut});
  return (
    <Stage>
      <Kicker p={k}>THE TRICK</Kicker>
      <Head p={h}>Attention:<br /><span style={{color: LIME}}>it looks back.</span></Head>
      <Sub p={interpolate(l, [24, 56], [0, 1], {...clamp, easing: easeOut})}>
        To predict the next token, the model weighs which earlier tokens matter most.
      </Sub>
      <div style={{marginTop: 46, position: 'relative'}}>
        <svg width={w} height={230} style={{display: 'block'}}>
          {arcs.map(([from, to, strength], i) => {
            const x1 = from * (cellW + gap) + cellW / 2;
            const x2 = to * (cellW + gap) + cellW / 2;
            const lift = 40 + Math.abs(x1 - x2) * 0.22;
            const d = `M${x1} 118 C ${x1} ${118 - lift}, ${x2} ${118 - lift}, ${x2} 118`;
            return (
              <path key={i} d={d} fill="none" stroke={LIME} strokeWidth={2 + strength * 2.5}
                strokeLinecap="round" opacity={0.75}
                strokeDasharray={420} strokeDashoffset={420 * (1 - draw)} />
            );
          })}
        </svg>
        <div style={{display: 'flex', gap, marginTop: -104}}>
          {words.map((t, i) => {
            const hot = i === 4;
            const q = interpolate(l, [30 + i * 8, 62 + i * 8], [0, 1], clamp);
            return (
              <div key={i} style={{
                width: cellW, height: 64, borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: hot ? 'rgba(183,243,75,.18)' : 'rgba(255,255,255,.06)',
                border: `1px solid ${hot ? 'rgba(183,243,75,.6)' : 'rgba(255,255,255,.14)'}`,
                color: hot ? LIME : INK, fontSize: 21, fontWeight: 800,
                fontFamily: 'Arial,sans-serif', opacity: q,
              }}>{t}</div>
            );
          })}
        </div>
      </div>
      <Sub p={interpolate(l, [132, 172], [0, 1], clamp)}>“it” resolves to “cat” because attention links them. That link is learned, not looked up.</Sub>
    </Stage>
  );
};

/* ---------- 7. limits ---------- */
const Limits: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: easeOut});
  const items = [
    ['Not a database', 'It does not store facts. It reconstructs likely text.'],
    ['No truth check', 'A confident sentence can still be wrong.'],
    ['No memory by default', 'Each conversation starts from the prompt.'],
  ];
  return (
    <Stage>
      <Kicker p={k} color={RED}>THE LIMITS</Kicker>
      <Head p={h}>Fluent is not<br /><span style={{color: RED}}>the same as correct.</span></Head>
      <div style={{display: 'flex', flexDirection: 'column', gap: 13, marginTop: 44}}>
        {items.map((it, i) => {
          const q = interpolate(l, [34 + i * 20, 68 + i * 20], [0, 1], {...clamp, easing: easeOut});
          return (
            <div key={it[0]} style={{
              padding: '22px 24px', borderRadius: 18,
              background: 'rgba(224,85,90,.07)', border: '1px solid rgba(224,85,90,.28)',
              opacity: q, transform: `translateX(${(1 - q) * 28}px)`,
            }}>
              <div style={{fontSize: 25, fontWeight: 800, color: '#ffd9db', fontFamily: 'Arial,sans-serif'}}>{it[0]}</div>
              <div style={{fontSize: 19, color: '#c9a3a6', marginTop: 6, fontFamily: 'Arial,sans-serif'}}>{it[1]}</div>
            </div>
          );
        })}
      </div>
      <Sub p={interpolate(l, [120, 160], [0, 1], clamp)}>It predicts plausible text. Verifying it is still your job.</Sub>
    </Stage>
  );
};

/* ---------- 8. outro ---------- */
const Outro: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 36], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [22, 64], [0, 1], {...clamp, easing: easeOut});
  const c = interpolate(l, [58, 106], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <svg width={1080} height={1920} style={{position: 'absolute'}}>
        <TokenStream f={l} y={1500} dir={-1} op={0.4} color={LIME} />
      </svg>
      <div style={{width: 940, textAlign: 'center'}}>
        <div style={{fontSize: 88, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1.05, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          It predicts.
        </div>
        <div style={{fontSize: 88, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1.05, opacity: b, fontFamily: 'Arial,sans-serif'}}>
          You verify.
        </div>
        <div style={{marginTop: 44, opacity: c}}>
          <div style={{display: 'inline-flex', padding: '16px 32px', borderRadius: 999, background: 'rgba(183,243,75,.14)', border: '1px solid rgba(183,243,75,.45)', color: LIME, fontSize: 22, fontWeight: 900, fontFamily: 'Arial,sans-serif', letterSpacing: '.04em'}}>
            AI EXPLAINED
          </div>
          <div style={{marginTop: 40, fontSize: 19, color: '#6f8aa6', fontFamily: 'Arial,sans-serif', lineHeight: 1.5}}>
            An LLM is a next-token predictor trained on text.<br />Not an oracle, not a search engine.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const op = (f: number, i: number) => {
  const s = i * SCENE;
  const e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 18, e], [1, 0], clamp);
  return Math.min(
    interpolate(f, [s, s + 18], [0, 1], clamp),
    interpolate(f, [e - 18, e], [1, 0], clamp),
  );
};

const SECTIONS = ['INTRO', 'PREDICTION', 'TOKENS', 'TRAINING', 'PARAMETERS', 'ATTENTION', 'LIMITS', 'OUTRO'];

export const LLMExplainer: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;
  const push = interpolate(l, [0, SCENE], [1, 1.02], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#01080f'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#01080f 0%,#03101f 24%,#051a30 48%,#041324 70%,#020c18 88%,#01080f 100%)'}} />
      <Field f={f} />
      <Chrome section={SECTIONS[idx]} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 44%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: op(f, 0)}}><Cover l={l} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: op(f, 1)}}><Predict l={l} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: op(f, 2)}}><Tokens l={l} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: op(f, 3)}}><Training l={l} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: op(f, 4)}}><Params l={l} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: op(f, 5)}}><Attention l={l} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: op(f, 6)}}><Limits l={l} /></AbsoluteFill>}
        {idx === 7 && <AbsoluteFill style={{opacity: op(f, 7)}}><Outro l={l} /></AbsoluteFill>}
      </AbsoluteFill>
      <Dots index={idx} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / LLM_FRAMES) * 100}%`, background: `linear-gradient(90deg,${SKY},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
