import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {EURUSD_M1} from './eurusdM1';

/* ============================================================
   Technical vs Fundamental — animated explainer
   1080x1920 · 8 scenes · 190 frames each · 50.7s
   ============================================================ */

const W = 1080, H = 1920;
const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#e0a33a';
const CYAN = '#4fc3f7';
const RED = '#e0555a';
const INK = '#eaf6ff';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const eo = Easing.out(Easing.cubic);
const eio = Easing.inOut(Easing.cubic);

const SCENE = 190;
const COUNT = 8;
export const TAFA_FRAMES = SCENE * COUNT;

const fu = (p: number, d = 18) => ({opacity: p, transform: `translateY(${(1 - p) * d}px)`});

/* ---------- chrome ---------- */
const Field: React.FC<{f: number}> = ({f}) => (
  <AbsoluteFill>
    <svg width={W} height={H} style={{position: 'absolute'}}>
      <circle cx={200 + Math.sin(f * 0.01) * 70} cy={430 + Math.cos(f * 0.008) * 60} r={300} fill={SKY} opacity={0.13} />
      <circle cx={900 + Math.cos(f * 0.009) * 60} cy={1300 + Math.sin(f * 0.011) * 70} r={330} fill={LIME} opacity={0.07} />
    </svg>
  </AbsoluteFill>
);

const Chrome: React.FC<{section: string; tint: string}> = ({section, tint}) => (
  <>
    <div style={{position: 'absolute', top: 62, left: 72, right: 72, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 13}}>
        <Img src={staticFile('logo-mark.png')} style={{height: 52, width: 56, objectFit: 'contain'}} />
        <div style={{fontSize: 18, fontWeight: 900, letterSpacing: '.16em', color: INK, fontFamily: 'Arial,sans-serif'}}>TRADERWATCH</div>
      </div>
      <div style={{fontSize: 15, fontWeight: 800, letterSpacing: '.18em', color: tint, fontFamily: 'Arial,sans-serif'}}>{section}</div>
    </div>
    <div style={{position: 'absolute', top: 134, left: 72, right: 72, height: 1, background: 'rgba(255,255,255,.13)'}} />
  </>
);

const Dots: React.FC<{index: number}> = ({index}) => (
  <div style={{position: 'absolute', bottom: 88, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 9}}>
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
    fontFamily: 'Arial,sans-serif', ...fu(p, 14),
  }}>{children}</div>
);

const Head: React.FC<{p: number; children: React.ReactNode; size?: number}> = ({p, children, size = 72}) => (
  <div style={{
    marginTop: 24, fontSize: size, lineHeight: 1.06, letterSpacing: '-.05em',
    color: '#fff', fontWeight: 800, fontFamily: 'Arial,sans-serif', ...fu(p, 26),
  }}>{children}</div>
);

const Sub: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{
    marginTop: 22, maxWidth: 870, fontSize: 25, lineHeight: 1.45, color: '#a9c1d6',
    fontFamily: 'Arial,sans-serif', ...fu(p, 16),
  }}>{children}</div>
);

/* ---------- real candles ---------- */
const BARS = EURUSD_M1.slice(8, 38);

const CandleChart: React.FC<{l: number; reveal: number; accent: string; showLevels?: boolean; showPlan?: boolean}> =
  ({l, reveal, accent, showLevels = false, showPlan = false}) => {
  const CW = 936, CH = 330;
  const lo = Math.min(...BARS.map(c => c.l));
  const hi = Math.max(...BARS.map(c => c.h));
  const pad = (hi - lo) * 0.12;
  const y = (v: number) => CH - ((v - (lo - pad)) / ((hi + pad) - (lo - pad))) * CH;
  const step = CW / BARS.length;
  const shown = reveal * BARS.length;
  const last = BARS[Math.min(BARS.length - 1, Math.max(0, Math.floor(shown) - 1))];

  return (
    <svg width={CW} height={CH} style={{overflow: 'visible'}}>
      {[0.25, 0.5, 0.75].map(r => (
        <line key={r} x1={0} x2={CW} y1={CH * r} y2={CH * r} stroke="#fff" strokeOpacity={0.055} strokeDasharray="4 6" />
      ))}
      {BARS.map((c, i) => {
        const grow = Math.max(0, Math.min(1, shown - i));
        if (grow <= 0) return null;
        const up = c.c >= c.o;
        const cx = i * step + step / 2;
        const top = y(Math.max(c.o, c.c));
        const bot = y(Math.min(c.o, c.c));
        const mid = (top + bot) / 2;
        const col = up ? accent : '#5f7f99';
        return (
          <g key={i} opacity={Math.min(1, grow * 2)}>
            <line x1={cx} y1={mid + (y(c.h) - mid) * grow} x2={cx} y2={mid + (y(c.l) - mid) * grow} stroke={col} strokeWidth={2} />
            <rect x={cx - step * 0.26} y={mid + (top - mid) * grow} width={step * 0.52}
              height={Math.max(2.5, (bot - top) * grow)} rx={2} fill={col} opacity={0.9} />
          </g>
        );
      })}
      {showLevels && (
        <>
          <line x1={0} x2={CW} y1={y(hi - pad * 0.4)} y2={y(hi - pad * 0.4)} stroke="#ff8a8a" strokeWidth={1.6} strokeDasharray="7 6" opacity={0.85} />
          <line x1={0} x2={CW} y1={y(lo + pad * 0.4)} y2={y(lo + pad * 0.4)} stroke={LIME} strokeWidth={1.6} strokeDasharray="7 6" opacity={0.85} />
        </>
      )}
      {showPlan && last && (
        <>
          <line x1={0} x2={CW} y1={y(last.c)} y2={y(last.c)} stroke="#fff" strokeWidth={1.4} strokeDasharray="5 5" opacity={0.7} />
          <circle cx={CW - 6} cy={y(last.c)} r={5} fill="#fff" />
        </>
      )}
    </svg>
  );
};

/* ---------- 1. cover ---------- */
const Cover: React.FC<{l: number}> = ({l}) => {
  const split = interpolate(l, [30, 92], [0, 1], {...clamp, easing: eio});
  const a = interpolate(l, [6, 38], [0, 1], {...clamp, easing: eo});
  const b = interpolate(l, [22, 58], [0, 1], {...clamp, easing: eo});
  const c = interpolate(l, [46, 88], [0, 1], {...clamp, easing: eo});
  const rule = interpolate(l, [58, 110], [0, 1], {...clamp, easing: eio});
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 940, textAlign: 'center'}}>
        <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '.30em', color: '#7fa3c4', opacity: a, fontFamily: 'Arial,sans-serif'}}>
          MARKET LITERACY
        </div>
        <div style={{marginTop: 34, fontSize: 84, fontWeight: 800, letterSpacing: '-.055em', lineHeight: 1.04, color: '#fff', opacity: b, fontFamily: 'Arial,sans-serif'}}>
          Two ways to read
        </div>
        <div style={{
          fontSize: 84, fontWeight: 800, letterSpacing: '-.055em', lineHeight: 1.04, opacity: b, fontFamily: 'Arial,sans-serif',
          background: 'linear-gradient(90deg,#4fc3f7,#b7f34b 55%,#e0a33a)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
        }}>
          the same market.
        </div>
        <div style={{width: 420 * rule, height: 4, borderRadius: 3, margin: '40px auto 0',
          background: `linear-gradient(90deg,${CYAN},${GOLD})`}} />
        <div style={{marginTop: 46, display: 'flex', justifyContent: 'center', gap: 18 * split, opacity: c}}>
          <div style={{
            flex: 1, padding: '28px 16px', borderRadius: 20,
            background: 'rgba(79,195,247,.16)', border: '1.5px solid rgba(79,195,247,.60)',
            transform: `scale(${0.95 + split * 0.05})`,
          }}>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '.14em', color: CYAN, fontFamily: 'Arial,sans-serif'}}>TECHNICAL</div>
            <div style={{marginTop: 10, fontSize: 44, fontWeight: 800, letterSpacing: '-.04em', color: '#fff', fontFamily: 'Arial,sans-serif'}}>Price</div>
          </div>
          <div style={{
            flex: 1, padding: '28px 16px', borderRadius: 20,
            background: 'rgba(224,163,58,.16)', border: '1.5px solid rgba(224,163,58,.60)',
            transform: `scale(${0.95 + split * 0.05})`,
          }}>
            <div style={{fontSize: 15, fontWeight: 900, letterSpacing: '.14em', color: GOLD, fontFamily: 'Arial,sans-serif'}}>FUNDAMENTAL</div>
            <div style={{marginTop: 10, fontSize: 44, fontWeight: 800, letterSpacing: '-.04em', color: '#fff', fontFamily: 'Arial,sans-serif'}}>Value</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- 2. fundamentals ---------- */
const Fundamentals: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const s = interpolate(l, [26, 58], [0, 1], {...clamp, easing: eo});
  const rows = [
    ['Earnings', 'Is the business making money?', 0.82],
    ['Interest rates', 'What does money cost right now?', 0.64],
    ['Growth', 'Is the economy speeding up or slowing?', 0.46],
  ];
  return (
    <Stage>
      <Kicker p={k} color={GOLD}>FUNDAMENTALS</Kicker>
      <Head p={h}>It asks <span style={{color: GOLD}}>why.</span></Head>
      <Sub p={s}>What should this actually be worth?</Sub>
      <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 14}}>
        {rows.map(([name, desc, v], i) => {
          const q = interpolate(l, [44 + i * 18, 86 + i * 18], [0, 1], {...clamp, easing: eo});
          return (
            <div key={name as string} style={{
              padding: '22px 24px', borderRadius: 18,
              background: 'rgba(224,163,58,.07)', border: '1px solid rgba(224,163,58,.26)',
              opacity: q, transform: `translateY(${(1 - q) * 22}px)`,
            }}>
              <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                <div style={{fontSize: 26, fontWeight: 800, color: '#ffe6bd', fontFamily: 'Arial,sans-serif'}}>{name as string}</div>
                <div style={{fontSize: 16, color: '#a08355', fontFamily: 'Arial,sans-serif'}}>slow signal</div>
              </div>
              <div style={{fontSize: 19, color: '#c0a980', marginTop: 6, fontFamily: 'Arial,sans-serif'}}>{desc as string}</div>
              <div style={{marginTop: 14, height: 8, borderRadius: 5, background: 'rgba(255,255,255,.09)', overflow: 'hidden'}}>
                <div style={{height: '100%', width: `${(v as number) * 100 * q}%`, background: GOLD, borderRadius: 5}} />
              </div>
            </div>
          );
        })}
      </div>
      <Sub p={interpolate(l, [128, 168], [0, 1], clamp)}>Measured in quarters and years, not in minutes.</Sub>
    </Stage>
  );
};

/* ---------- 3. technicals ---------- */
const Technicals: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const s = interpolate(l, [24, 56], [0, 1], {...clamp, easing: eo});
  const rev = interpolate(l, [30, 130], [0, 1], {...clamp, easing: eio});
  return (
    <Stage>
      <Kicker p={k} color={CYAN}>TECHNICALS</Kicker>
      <Head p={h}>It asks <span style={{color: CYAN}}>what now.</span></Head>
      <Sub p={s}>Where is price, and where did it react?</Sub>
      <div style={{marginTop: 36}}>
        <CandleChart l={l} reveal={rev} accent={CYAN} showLevels showPlan />
      </div>
      <div style={{marginTop: 22, fontSize: 17, color: '#6f8aa6', fontFamily: 'Arial,sans-serif', opacity: interpolate(l, [110, 150], [0, 1], clamp)}}>
        EUR/USD · M1 · real OHLC
      </div>
      <Sub p={interpolate(l, [132, 172], [0, 1], clamp)}>Measured in candles and sessions, not in fiscal years.</Sub>
    </Stage>
  );
};

/* ---------- 4. comparison ---------- */
const Compare: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const rows = [
    ['Question', 'Why is it worth this?', 'What is it doing now?'],
    ['Horizon', 'Months to years', 'Minutes to weeks'],
    ['Input', 'Earnings, rates, growth', 'Structure, levels, volume'],
    ['Weakness', 'Slow, often early', 'Can miss the bigger picture'],
  ];
  return (
    <Stage>
      <Kicker p={k} color={LIME}>SIDE BY SIDE</Kicker>
      <Head p={h} size={64}>Same asset.<br />Different question.</Head>
      <div style={{marginTop: 40}}>
        <div style={{display: 'flex', gap: 10, marginBottom: 12}}>
          <div style={{width: 132}} />
          <div style={{flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '.12em', color: GOLD, fontFamily: 'Arial,sans-serif'}}>FUNDAMENTAL</div>
          <div style={{flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 900, letterSpacing: '.12em', color: CYAN, fontFamily: 'Arial,sans-serif'}}>TECHNICAL</div>
        </div>
        {rows.map(([label, f, t], i) => {
          const q = interpolate(l, [40 + i * 20, 78 + i * 20], [0, 1], {...clamp, easing: eo});
          return (
            <div key={label} style={{
              display: 'flex', gap: 10, alignItems: 'stretch',
              padding: '16px 0', borderTop: '1px solid rgba(255,255,255,.10)',
              opacity: q, transform: `translateX(${(1 - q) * 26}px)`,
            }}>
              <div style={{width: 132, fontSize: 17, fontWeight: 800, color: '#7fa3c4', fontFamily: 'Arial,sans-serif', alignSelf: 'center'}}>{label}</div>
              <div style={{flex: 1, padding: '14px 14px', borderRadius: 12, background: 'rgba(224,163,58,.08)', border: '1px solid rgba(224,163,58,.22)', fontSize: 18, lineHeight: 1.35, color: '#e8d3ae', fontFamily: 'Arial,sans-serif'}}>{f}</div>
              <div style={{flex: 1, padding: '14px 14px', borderRadius: 12, background: 'rgba(79,195,247,.08)', border: '1px solid rgba(79,195,247,.22)', fontSize: 18, lineHeight: 1.35, color: '#c6e6f8', fontFamily: 'Arial,sans-serif'}}>{t}</div>
            </div>
          );
        })}
      </div>
      <Sub p={interpolate(l, [132, 172], [0, 1], clamp)}>Neither one is the answer on its own.</Sub>
    </Stage>
  );
};

/* ---------- 5. fundamentals lead ---------- */
const FundLead: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const s = interpolate(l, [24, 56], [0, 1], {...clamp, easing: eo});
  const wave = interpolate(l, [44, 140], [0, 1], {...clamp, easing: eio});
  const pts = [0.55, 0.62, 0.5, 0.68, 0.74, 0.66, 0.8, 0.88, 0.84, 0.92];
  const cw = 900, ch = 260;
  const px = (i: number) => (i / (pts.length - 1)) * cw;
  const py = (v: number) => ch - v * ch;
  let d = `M${px(0)} ${py(pts[0])}`;
  for (let i = 1; i < pts.length; i++) {
    const x0 = px(i - 1), x1 = px(i), m = (x0 + x1) / 2;
    d += ` C${m} ${py(pts[i - 1])} ${m} ${py(pts[i])} ${x1} ${py(pts[i])}`;
  }
  return (
    <Stage>
      <Kicker p={k} color={GOLD}>WHEN FUNDAMENTALS LEAD</Kicker>
      <Head p={h}>The long view.</Head>
      <Sub p={s}>Valuation, the rate cycle, and how big the position should be.</Sub>
      <div style={{marginTop: 38, position: 'relative'}}>
        <svg width={cw} height={ch} style={{overflow: 'visible'}}>
          <defs>
            <linearGradient id="fundwave" x1="0" x2="1">
              <stop offset="0" stopColor={GOLD} stopOpacity={0.35} />
              <stop offset="1" stopColor={GOLD} />
            </linearGradient>
            <clipPath id="fundclip">
              <rect x={0} y={-20} width={cw * wave + 2} height={ch + 60} />
            </clipPath>
          </defs>
          {[0.2, 0.4, 0.6, 0.8].map(r => (
            <line key={r} x1={0} x2={cw} y1={ch * r} y2={ch * r} stroke="#fff" strokeOpacity={0.05} />
          ))}
          <g clipPath="url(#fundclip)">
            <path d={`${d} L${cw} ${ch} L0 ${ch} Z`} fill="rgba(224,163,58,.12)" />
            <path d={d} fill="none" stroke="url(#fundwave)" strokeWidth={4} strokeLinecap="round" />
          </g>
          <circle cx={cw * wave} cy={py(pts[Math.min(pts.length - 1, Math.floor(wave * pts.length))])} r={7} fill={GOLD} opacity={wave > 0.03 ? 1 : 0} />
        </svg>
        <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 14, fontSize: 15, color: '#6f8aa6', fontFamily: 'Arial,sans-serif'}}>
          <span>Q1</span><span>Q2</span><span>Q3</span><span>Q4</span>
        </div>
      </div>
      <Sub p={interpolate(l, [130, 172], [0, 1], clamp)}>It tells you the direction. It rarely tells you the moment.</Sub>
    </Stage>
  );
};

/* ---------- 6. technicals lead ---------- */
const TechLead: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const s = interpolate(l, [24, 56], [0, 1], {...clamp, easing: eo});
  const rev = interpolate(l, [26, 100], [0, 1], {...clamp, easing: eio});
  const plan = interpolate(l, [96, 140], [0, 1], {...clamp, easing: eo});
  return (
    <Stage>
      <Kicker p={k} color={CYAN}>WHEN TECHNICALS LEAD</Kicker>
      <Head p={h}>The precise moment.</Head>
      <Sub p={s}>Where to enter, where you are wrong, where you take profit.</Sub>
      <div style={{marginTop: 34}}>
        <CandleChart l={l} reveal={rev} accent={CYAN} showLevels showPlan />
      </div>
      <div style={{marginTop: 26, display: 'flex', gap: 10, opacity: plan}}>
        {[
          ['ENTRY', 'where price accepted', '#fff'],
          ['STOP', 'where the idea breaks', RED],
          ['TARGET', 'where it pays you', LIME],
        ].map(([a, b, c]) => (
          <div key={a as string} style={{
            flex: 1, padding: '16px 12px', borderRadius: 14,
            background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.12)',
          }}>
            <div style={{fontSize: 14, fontWeight: 900, letterSpacing: '.1em', color: c as string, fontFamily: 'Arial,sans-serif'}}>{a as string}</div>
            <div style={{fontSize: 15, color: '#8fa8c0', marginTop: 5, lineHeight: 1.3, fontFamily: 'Arial,sans-serif'}}>{b as string}</div>
          </div>
        ))}
      </div>
      <Sub p={interpolate(l, [140, 176], [0, 1], clamp)}>It tells you the moment. It rarely tells you the direction.</Sub>
    </Stage>
  );
};

/* ---------- 7. the mistake ---------- */
const Mistake: React.FC<{l: number}> = ({l}) => {
  const k = interpolate(l, [4, 28], [0, 1], clamp);
  const h = interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo});
  const items = [
    ['Using a chart to justify a story', 'The chart always fits whatever you already believe.'],
    ['Using a valuation to time an entry', 'Cheap can stay cheap for a very long time.'],
  ];
  return (
    <Stage>
      <Kicker p={k} color={RED}>THE MISTAKE</Kicker>
      <Head p={h}>Using one<br /><span style={{color: RED}}>as the other.</span></Head>
      <div style={{marginTop: 42, display: 'flex', flexDirection: 'column', gap: 14}}>
        {items.map(([t, d2], i) => {
          const q = interpolate(l, [36 + i * 22, 74 + i * 22], [0, 1], {...clamp, easing: eo});
          return (
            <div key={t} style={{
              padding: '24px 26px', borderRadius: 18,
              background: 'rgba(224,85,90,.07)', border: '1px solid rgba(224,85,90,.28)',
              opacity: q, transform: `translateY(${(1 - q) * 24}px)`,
            }}>
              <div style={{display: 'flex', gap: 14, alignItems: 'flex-start'}}>
                <div style={{fontSize: 24, color: RED, fontWeight: 900, lineHeight: 1, fontFamily: 'Arial,sans-serif'}}>✕</div>
                <div>
                  <div style={{fontSize: 24, fontWeight: 800, color: '#ffd9db', fontFamily: 'Arial,sans-serif'}}>{t}</div>
                  <div style={{fontSize: 18, color: '#c9a3a6', marginTop: 7, lineHeight: 1.4, fontFamily: 'Arial,sans-serif'}}>{d2}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <Sub p={interpolate(l, [118, 160], [0, 1], clamp)}>
        Fundamentals set the bias. Technicals set the trigger.
      </Sub>
    </Stage>
  );
};

/* ---------- 8. outro ---------- */
const Outro: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 36], [0, 1], {...clamp, easing: eo});
  const b = interpolate(l, [22, 62], [0, 1], {...clamp, easing: eo});
  const c = interpolate(l, [58, 104], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 940, textAlign: 'center'}}>
        <div style={{fontSize: 68, fontWeight: 800, letterSpacing: '-.05em', color: '#fff', lineHeight: 1.08, opacity: a, fontFamily: 'Arial,sans-serif'}}>
          Different questions.
        </div>
        <div style={{fontSize: 68, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1.08, marginTop: 8, opacity: b, fontFamily: 'Arial,sans-serif',
          background: 'linear-gradient(90deg,#4fc3f7,#b7f34b 55%,#e0a33a)',
          WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}}>
          Same discipline.
        </div>
        <div style={{marginTop: 46, opacity: c}}>
          <div style={{display: 'inline-flex', padding: '15px 30px', borderRadius: 999, background: 'rgba(183,243,75,.13)', border: '1px solid rgba(183,243,75,.42)', color: LIME, fontSize: 20, fontWeight: 900, letterSpacing: '.05em', fontFamily: 'Arial,sans-serif'}}>
            TRADERWATCH
          </div>
          <div style={{marginTop: 34, fontSize: 18, color: '#6f8aa6', lineHeight: 1.55, fontFamily: 'Arial,sans-serif'}}>
            Educational content only.<br />Not financial advice.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ---------- assemble ---------- */
const op = (f: number, i: number) => {
  const s = i * SCENE, e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 20, e], [1, 0], clamp);
  return Math.min(
    interpolate(f, [s, s + 20], [0, 1], clamp),
    interpolate(f, [e - 20, e], [1, 0], clamp),
  );
};

const SECTIONS = ['INTRO', 'FUNDAMENTAL', 'TECHNICAL', 'COMPARE', 'LONG VIEW', 'THE MOMENT', 'THE MISTAKE', 'OUTRO'];
const TINTS = ['#b7f34b', GOLD, CYAN, LIME, GOLD, CYAN, RED, LIME];

export const TechVsFund: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;
  const push = interpolate(l, [0, SCENE], [1, 1.018], clamp);

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: '#01080f'}}>
      <AbsoluteFill style={{background: 'linear-gradient(180deg,#01080f 0%,#03101f 24%,#051a30 48%,#041324 70%,#020c18 88%,#01080f 100%)'}} />
      <Field f={f} />
      <Chrome section={SECTIONS[idx]} tint={TINTS[idx]} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 44%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: op(f, 0)}}><Cover l={l} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: op(f, 1)}}><Fundamentals l={l} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: op(f, 2)}}><Technicals l={l} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: op(f, 3)}}><Compare l={l} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: op(f, 4)}}><FundLead l={l} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: op(f, 5)}}><TechLead l={l} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: op(f, 6)}}><Mistake l={l} /></AbsoluteFill>}
        {idx === 7 && <AbsoluteFill style={{opacity: op(f, 7)}}><Outro l={l} /></AbsoluteFill>}
      </AbsoluteFill>
      <Dots index={idx} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / TAFA_FRAMES) * 100}%`, background: `linear-gradient(90deg,${SKY},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
