import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {EURUSD_M1} from './eurusdM1';

/* ============================================================
   Technical vs Fundamental — editorial / Swiss print
   Paper stock, ink rules, numbered index, tight grotesk
   1080x1920 · 8 scenes · 50.7s
   ============================================================ */

const PAPER = '#f2eee6';
const INK = '#12161a';
const MUTE = '#6f6659';
const RED = '#c0392b';
const BLUE = '#1d4ed8';
const GREEN = '#2f7d4f';

const FONT = '"Helvetica Neue", Helvetica, Arial, sans-serif';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const eo = Easing.out(Easing.cubic);
const eio = Easing.inOut(Easing.cubic);

const SCENE = 190;
const COUNT = 8;
export const TAFA_ED_FRAMES = SCENE * COUNT;

const rise = (p: number, d = 30) => ({opacity: p, transform: `translateY(${(1 - p) * d}px)`});

/* ---------- running head / foot ---------- */
const Head: React.FC<{n: number; label: string}> = ({n, label}) => (
  <>
    <div style={{
      position: 'absolute', top: 70, left: 68, right: 68,
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      fontSize: 15, fontWeight: 700, letterSpacing: '.22em', color: INK, fontFamily: FONT,
    }}>
      <span>TRADERWATCH</span>
      <span style={{color: MUTE}}>{label}</span>
    </div>
    <div style={{position: 'absolute', top: 104, left: 68, right: 68, height: 2, background: INK}} />
    <div style={{
      position: 'absolute', bottom: 74, left: 68, right: 68,
      display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
      fontSize: 14, fontWeight: 700, letterSpacing: '.2em', color: MUTE, fontFamily: FONT,
    }}>
      <span>EDUCATION · NOT ADVICE</span>
      <span>{String(n).padStart(2, '0')} / 08</span>
    </div>
    <div style={{position: 'absolute', bottom: 62, left: 68, right: 68, height: 1.5, background: 'rgba(18,22,26,.2)'}} />
  </>
);

const Page: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{position: 'absolute', top: 150, left: 68, right: 68, bottom: 110, display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
    {children}
  </div>
);

const Kicker: React.FC<{p: number; children: React.ReactNode; color?: string}> = ({p, children, color = RED}) => (
  <div style={{
    alignSelf: 'flex-start', fontSize: 15, fontWeight: 800, letterSpacing: '.24em',
    color, fontFamily: FONT, ...rise(p, 14),
  }}>{children}</div>
);

/* ---------- real candles on paper ---------- */
const BARS = EURUSD_M1.slice(8, 34);

const InkChart: React.FC<{reveal: number}> = ({reveal}) => {
  const CW = 944, CH = 420;
  const lo = Math.min(...BARS.map((c) => c.l));
  const hi = Math.max(...BARS.map((c) => c.h));
  const pad = (hi - lo) * 0.14;
  const y = (v: number) => CH - ((v - (lo - pad)) / (hi + pad - (lo - pad))) * CH;
  const step = CW / BARS.length;
  const shown = reveal * BARS.length;

  return (
    <svg width={CW} height={CH} style={{overflow: 'visible'}}>
      {[0.2, 0.4, 0.6, 0.8].map((r) => (
        <line key={r} x1={0} x2={CW} y1={CH * r} y2={CH * r} stroke={INK} strokeOpacity={0.10} strokeWidth={1} />
      ))}
      {BARS.map((c, i) => {
        const grow = Math.max(0, Math.min(1, shown - i));
        if (grow <= 0) return null;
        const up = c.c >= c.o;
        const cx = i * step + step / 2;
        const top = y(Math.max(c.o, c.c));
        const bot = y(Math.min(c.o, c.c));
        const mid = (top + bot) / 2;
        const col = up ? GREEN : RED;
        return (
          <g key={i} opacity={Math.min(1, grow * 2)}>
            <line x1={cx} y1={mid + (y(c.h) - mid) * grow} x2={cx} y2={mid + (y(c.l) - mid) * grow} stroke={col} strokeWidth={2} />
            <rect x={cx - step * 0.28} y={mid + (top - mid) * grow} width={step * 0.56}
              height={Math.max(2.5, (bot - top) * grow)} fill={col} />
          </g>
        );
      })}
    </svg>
  );
};

/* ============================================================ */
export const TechVsFundEditorial: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;

  const LBL = ['INDEX', 'WHY', 'NOW', 'COMPARE', 'ORDER', 'MISTAKE', 'END', 'END'];

  return (
    <AbsoluteFill style={{overflow: 'hidden', background: PAPER, color: INK}}>
      {/* paper grain */}
      <AbsoluteFill style={{
        backgroundImage:
          'radial-gradient(circle at 18% 12%, rgba(18,22,26,.045), transparent 55%),' +
          'radial-gradient(circle at 82% 88%, rgba(18,22,26,.05), transparent 55%)',
      }} />
      <Head n={Math.min(8, idx + 1)} label={LBL[idx]} />

      {/* ---------- 1 · cover ---------- */}
      {idx === 0 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)}>MARKET LITERACY · 01</Kicker>
          <div style={{marginTop: 26}}>
            <div style={{
              fontSize: 128, fontWeight: 900, letterSpacing: '-.055em', lineHeight: 0.94,
              ...rise(interpolate(l, [10, 44], [0, 1], {...clamp, easing: eo}), 40),
            }}>TECHNICAL</div>
            <div style={{
              fontSize: 60, fontWeight: 400, letterSpacing: '-.02em', color: MUTE,
              margin: '10px 0', fontStyle: 'italic',
              opacity: interpolate(l, [28, 56], [0, 1], clamp),
            }}>versus</div>
            <div style={{
              fontSize: 128, fontWeight: 900, letterSpacing: '-.055em', lineHeight: 0.94,
              color: RED,
              ...rise(interpolate(l, [34, 70], [0, 1], {...clamp, easing: eo}), 40),
            }}>FUNDAMENTAL</div>
          </div>
          <div style={{marginTop: 64}}>
            <div style={{height: 2, background: INK, width: `${interpolate(l, [70, 120], [0, 100], clamp)}%`}} />
            <div style={{
              marginTop: 22, fontSize: 27, lineHeight: 1.5, color: INK, maxWidth: 780,
              opacity: interpolate(l, [86, 126], [0, 1], clamp),
            }}>
              Two ways to read the same chart.<br />
              <span style={{color: MUTE}}>One asks why. One asks what now.</span>
            </div>
          </div>
        </Page>
      )}

      {/* ---------- 2 · fundamentals ---------- */}
      {idx === 1 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)} color={RED}>02 · THE WHY</Kicker>
          <div style={{
            marginTop: 18, fontSize: 86, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1,
            ...rise(interpolate(l, [8, 40], [0, 1], {...clamp, easing: eo}), 34),
          }}>What should<br />it be worth?</div>
          <div style={{marginTop: 40}}>
            {[
              ['01', 'Earnings', 'Is the business making money?'],
              ['02', 'Interest rates', 'What does money cost right now?'],
              ['03', 'Growth', 'Is the economy speeding up?'],
            ].map(([n, t, d], i) => {
              const p = interpolate(l, [46 + i * 20, 86 + i * 20], [0, 1], {...clamp, easing: eo});
              return (
                <div key={n} style={{paddingTop: 18, paddingBottom: 18, borderTop: '1.5px solid rgba(18,22,26,.22)', ...rise(p, 22)}}>
                  <div style={{display: 'flex', gap: 22, alignItems: 'baseline'}}>
                    <div style={{fontSize: 17, fontWeight: 800, color: RED, letterSpacing: '.1em', fontFamily: FONT}}>{n}</div>
                    <div style={{flex: 1}}>
                      <div style={{fontSize: 36, fontWeight: 800, letterSpacing: '-.03em'}}>{t}</div>
                      <div style={{fontSize: 22, color: MUTE, marginTop: 4}}>{d}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{
            marginTop: 46, fontSize: 24, fontStyle: 'italic', color: MUTE,
            opacity: interpolate(l, [130, 170], [0, 1], clamp),
          }}>Measured in quarters, not minutes.</div>
        </Page>
      )}

      {/* ---------- 3 · technicals ---------- */}
      {idx === 2 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)} color={BLUE}>03 · THE NOW</Kicker>
          <div style={{
            marginTop: 16, fontSize: 86, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1,
            ...rise(interpolate(l, [8, 40], [0, 1], {...clamp, easing: eo}), 34),
          }}>Where is price<br />right now?</div>
          <div style={{marginTop: 34}}>
            <InkChart reveal={interpolate(l, [30, 130], [0, 1], {...clamp, easing: eio})} />
          </div>
          <div style={{
            marginTop: 16, display: 'flex', justifyContent: 'space-between',
            fontSize: 17, color: MUTE, letterSpacing: '.06em',
            opacity: interpolate(l, [110, 150], [0, 1], clamp),
          }}>
            <span>EUR/USD · M1</span><span>REAL OHLC</span>
          </div>
          <div style={{
            marginTop: 46, fontSize: 24, fontStyle: 'italic', color: MUTE,
            opacity: interpolate(l, [134, 174], [0, 1], clamp),
          }}>Measured in candles, not fiscal years.</div>
        </Page>
      )}

      {/* ---------- 4 · compare ---------- */}
      {idx === 3 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)}>04 · COMPARE</Kicker>
          <div style={{
            marginTop: 16, fontSize: 78, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1,
            ...rise(interpolate(l, [8, 40], [0, 1], {...clamp, easing: eo}), 34),
          }}>Same asset.<br />Different question.</div>
          <div style={{marginTop: 40}}>
            <div style={{display: 'flex', gap: 24, paddingBottom: 12}}>
              <div style={{width: 150}} />
              <div style={{flex: 1, fontSize: 15, fontWeight: 800, letterSpacing: '.18em', color: RED}}>FUNDAMENTAL</div>
              <div style={{flex: 1, fontSize: 15, fontWeight: 800, letterSpacing: '.18em', color: BLUE}}>TECHNICAL</div>
            </div>
            {[
              ['Question', 'Why worth this?', 'What is it doing?'],
              ['Horizon', 'Months to years', 'Minutes to weeks'],
              ['Input', 'Earnings, rates', 'Structure, levels'],
              ['Fails when', 'Slow, often early', 'Misses the context'],
            ].map(([a, b, c], i) => {
              const p = interpolate(l, [46 + i * 18, 82 + i * 18], [0, 1], {...clamp, easing: eo});
              return (
                <div key={a} style={{
                  display: 'flex', gap: 24, alignItems: 'baseline',
                  padding: '18px 0', borderTop: '1.5px solid rgba(18,22,26,.22)',
                  ...rise(p, 18),
                }}>
                  <div style={{width: 150, fontSize: 17, fontWeight: 800, letterSpacing: '.08em', color: MUTE}}>{a}</div>
                  <div style={{flex: 1, fontSize: 23, lineHeight: 1.3}}>{b}</div>
                  <div style={{flex: 1, fontSize: 23, lineHeight: 1.3}}>{c}</div>
                </div>
              );
            })}
          </div>
        </Page>
      )}

      {/* ---------- 5 · order of operations ---------- */}
      {idx === 4 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)}>05 · ORDER OF OPERATIONS</Kicker>
          <div style={{
            marginTop: 16, fontSize: 86, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1,
            ...rise(interpolate(l, [8, 40], [0, 1], {...clamp, easing: eo}), 34),
          }}>Bias first.<br />Trigger second.</div>
          <div style={{marginTop: 56}}>
            {[
              ['01', 'BIAS', 'Fundamentals decide direction', RED],
              ['02', 'TRIGGER', 'Technicals decide the entry', BLUE],
              ['03', 'RISK', 'Size decides whether you survive', GREEN],
            ].map(([n, t, d, c], i) => {
              const p = interpolate(l, [50 + i * 26, 92 + i * 26], [0, 1], {...clamp, easing: eo});
              return (
                <div key={n} style={{
                  display: 'flex', alignItems: 'baseline', gap: 26,
                  padding: '24px 0', borderTop: '1.5px solid rgba(18,22,26,.22)',
                  ...rise(p, 24),
                }}>
                  <div style={{fontSize: 46, fontWeight: 900, color: c, letterSpacing: '-.03em', width: 74}}>{n}</div>
                  <div style={{flex: 1}}>
                    <div style={{fontSize: 34, fontWeight: 800, letterSpacing: '-.03em'}}>{t}</div>
                    <div style={{fontSize: 21, color: MUTE, marginTop: 3}}>{d}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{height: 1.5, background: 'rgba(18,22,26,.22)'}} />
        </Page>
      )}

      {/* ---------- 6 · the mistake ---------- */}
      {idx === 5 && (
        <Page>
          <Kicker p={interpolate(l, [4, 30], [0, 1], clamp)}>06 · THE MISTAKE</Kicker>
          <div style={{
            marginTop: 16, fontSize: 86, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1,
            ...rise(interpolate(l, [8, 40], [0, 1], {...clamp, easing: eo}), 34),
          }}>One pretending<br />to be the other.</div>
          <div style={{marginTop: 54}}>
            {[
              ['A chart to justify a story', 'It always fits what you already believe.'],
              ['A valuation to time an entry', 'Cheap can stay cheap for a very long time.'],
            ].map(([t, d], i) => {
              const p = interpolate(l, [54 + i * 26, 96 + i * 26], [0, 1], {...clamp, easing: eo});
              return (
                <div key={t} style={{
                  padding: '26px 0', borderTop: '1.5px solid rgba(18,22,26,.22)',
                  display: 'flex', gap: 20, alignItems: 'flex-start', ...rise(p, 22),
                }}>
                  <div style={{fontSize: 26, fontWeight: 900, color: RED, lineHeight: 1}}>✕</div>
                  <div>
                    <div style={{fontSize: 31, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.2}}>{t}</div>
                    <div style={{fontSize: 21, color: MUTE, marginTop: 6, lineHeight: 1.4}}>{d}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{height: 1.5, background: 'rgba(18,22,26,.22)'}} />
          <div style={{
            marginTop: 28, fontSize: 24, fontStyle: 'italic', color: INK,
            opacity: interpolate(l, [120, 160], [0, 1], clamp),
          }}>Fundamentals set the bias. Technicals set the trigger.</div>
        </Page>
      )}

      {/* ---------- 7/8 · end ---------- */}
      {idx >= 6 && (
        <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', padding: '0 68px'}}>
          <div style={{width: '100%', textAlign: 'center'}}>
            <Img
              src={staticFile('traderwatch-ai-agents-logo.png')}
              style={{
                width: 190, height: 190, objectFit: 'contain', margin: '0 auto',
                opacity: interpolate(l, [4, 34], [0, 1], clamp),
              }}
            />
            <div style={{
              marginTop: 30, fontSize: 62, fontWeight: 900, letterSpacing: '-.05em', lineHeight: 1.05,
              ...rise(interpolate(l, [18, 54], [0, 1], {...clamp, easing: eo}), 30),
            }}>
              Two questions.<br />One plan.
            </div>
            <div style={{
              marginTop: 34, width: '100%', height: 2, background: INK,
              transform: `scaleX(${interpolate(l, [50, 100], [0, 1], clamp)})`, transformOrigin: 'center',
            }} />
            <div style={{
              marginTop: 30, fontSize: 26, color: MUTE, lineHeight: 1.6,
              opacity: interpolate(l, [66, 106], [0, 1], clamp),
            }}>
              Bias. Trigger. Risk.<br />
              <span style={{fontSize: 21}}>Educational content only. Not financial advice.</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* progress ticks */}
      <div style={{position: 'absolute', left: 68, right: 68, bottom: 46, display: 'flex', gap: 6}}>
        {Array.from({length: COUNT}).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4,
            background: i <= idx ? INK : 'rgba(18,22,26,.16)',
          }} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
