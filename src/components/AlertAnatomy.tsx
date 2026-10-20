import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, Easing} from 'remotion';
import {GoldChart} from './GoldChart';

const W = 1080;
const H = 1920;
const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const easeOut = Easing.out(Easing.cubic);
const easeInOut = Easing.inOut(Easing.cubic);

const SCENE = 190;
const COUNT = 8;
export const ANATOMY_FRAMES = SCENE * COUNT;

const Backdrop: React.FC = () => {
  const f = useCurrentFrame();
  const drift = interpolate(f, [0, ANATOMY_FRAMES], [0, -180], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg,#01080f 0%,#030f1d 26%,#051a30 46%,#041324 68%,#030f1d 86%,#01090f 100%)'}}>
      <AbsoluteFill style={{backgroundImage: 'repeating-linear-gradient(0deg,rgba(255,255,255,.020) 0 1px,transparent 1px 72px),repeating-linear-gradient(90deg,rgba(255,255,255,.014) 0 1px,transparent 1px 72px)', backgroundPosition: `${drift}px ${drift}px`}} />
      <div style={{position: 'absolute', left: W * 0.5, top: H * 0.46, width: 1500, height: 1500, marginLeft: -750, marginTop: -750, borderRadius: '50%', background: 'radial-gradient(circle,rgba(9,48,81,.55),rgba(6,31,54,.22) 48%,transparent 72%)'}} />
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

const Dots: React.FC<{index: number}> = ({index}) => (
  <div style={{position: 'absolute', bottom: 92, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 10}}>
    {Array.from({length: COUNT}).map((_, i) => (
      <div key={i} style={{width: i === index ? 42 : 11, height: 11, borderRadius: 999, background: i === index ? SKY : 'rgba(255,255,255,.23)', boxShadow: i === index ? '0 0 18px rgba(22,133,207,.85)' : 'none'}} />
    ))}
  </div>
);

const Stage: React.FC<{children: React.ReactNode}> = ({children}) => (
  <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
    <div style={{width: 936, display: 'flex', flexDirection: 'column'}}>{children}</div>
  </AbsoluteFill>
);

const Pill: React.FC<{n: string; label: string; color?: string; p: number}> = ({n, label, color = SKY, p}) => (
  <div style={{display: 'flex', alignItems: 'center', gap: 14, opacity: p, transform: `translateY(${(1 - p) * 18}px)`}}>
    <div style={{minWidth: 58, height: 58, borderRadius: 999, padding: '0 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: color, color: '#08203a', fontSize: 26, fontWeight: 900, fontFamily: 'Arial,sans-serif'}}>{n}</div>
    <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.2em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif'}}>{label}</div>
  </div>
);

const Head: React.FC<{p: number; children: React.ReactNode; size?: number}> = ({p, children, size = 82}) => (
  <div style={{fontSize: size, lineHeight: 1.04, letterSpacing: '-.045em', color: '#fff', fontWeight: 800, marginTop: 30, fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>{children}</div>
);

const Note: React.FC<{p: number; children: React.ReactNode}> = ({p, children}) => (
  <div style={{marginTop: 44, fontSize: 28, lineHeight: 1.42, color: '#a9c1d6', fontFamily: 'Arial,sans-serif', opacity: p, transform: `translateY(${(1 - p) * 16}px)`, borderLeft: `3px solid ${SKY}`, paddingLeft: 22}}>{children}</div>
);

/* 01 cover */
const Cover: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [0, 20], [0.55, 1], clamp);
  const b = interpolate(l, [8, 40], [0.35, 1], {...clamp, easing: easeOut});
  const r = interpolate(l, [16, 64], [0.2, 1], {...clamp, easing: easeInOut});
  const s = interpolate(l, [30, 70], [0.35, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 980, textAlign: 'center', marginTop: -28}}>
        <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.24em', color: '#bcd6ea', fontFamily: 'Arial,sans-serif', opacity: a}}>TRADERWATCH · ANATOMY</div>
        <div style={{fontSize: 120, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1, marginTop: 28, opacity: a, fontFamily: 'Arial,sans-serif'}}>Every line</div>
        <div style={{fontSize: 120, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1, opacity: b, transform: `translateY(${(1 - b) * 18}px)`, fontFamily: 'Arial,sans-serif'}}>has a job.</div>
        <div style={{width: 500 * r, height: 5, borderRadius: 3, margin: '38px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}} />
        <div style={{fontSize: 28, lineHeight: 1.45, color: '#a9c1d6', marginTop: 30, opacity: s, fontFamily: 'Arial,sans-serif'}}>How to read a TraderWatch alert<br/>without guessing.</div>
      </div>
    </AbsoluteFill>
  );
};

/* 02 the alert */
const Alert: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const card = interpolate(l, [34, 74], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [96, 128], [0, 1], clamp);
  return (
    <Stage>
      <Pill n="01" label="THE ALERT" p={p} />
      <Head p={h}>It arrives<br/>like <span style={{color: SKY}}>this.</span></Head>
      <div style={{marginTop: 46, borderRadius: 26, padding: 28, background: 'rgba(8,36,64,.85)', border: '1px solid rgba(22,133,207,.35)', opacity: card, transform: `translateY(${(1 - card) * 28}px)`, boxShadow: '0 26px 60px rgba(2,12,26,.55)'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{fontSize: 20, fontWeight: 900, letterSpacing: '.1em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>TRADERWATCH AI</div>
          <div style={{fontSize: 16, color: '#7fa3c4', fontFamily: 'Arial,sans-serif'}}>now</div>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 22}}>
          <div style={{fontSize: 46, fontWeight: 900, color: '#fff', letterSpacing: '-.02em', fontFamily: 'Arial,sans-serif'}}>EURUSD</div>
          <div style={{padding: '9px 20px', borderRadius: 999, background: LIME, color: '#14290d', fontSize: 21, fontWeight: 900, fontFamily: 'Arial,sans-serif'}}>LONG</div>
        </div>
        {[['Entry', '1.12229'], ['Stop', '1.12136'], ['Target', '1.12369']].map((r, i) => {
          const q = interpolate(l, [48 + i * 12, 70 + i * 12], [0, 1], clamp);
          return (
            <div key={r[0]} style={{display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid rgba(255,255,255,.09)', opacity: q}}>
              <div style={{fontSize: 22, color: '#9fb8cd', fontFamily: 'Arial,sans-serif'}}>{r[0]}</div>
              <div style={{fontSize: 25, fontWeight: 800, color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{r[1]}</div>
            </div>
          );
        })}
      </div>
      <Note p={n}>Four numbers and a direction. Each one answers a different question.</Note>
    </Stage>
  );
};

/* 03 direction */
const Direction: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [96, 128], [0, 1], clamp);
  const two = interpolate(l, [38, 70], [0, 1], {...clamp, easing: easeOut});
  return (
    <Stage>
      <Pill n="02" label="PAIR & DIRECTION" p={p} />
      <Head p={h}>Where, and<br/>which <span style={{color: LIME}}>way.</span></Head>
      <div style={{display: 'flex', gap: 20, marginTop: 52, opacity: two}}>
        <div style={{flex: 1, borderRadius: 22, padding: '28px 24px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.13)'}}>
          <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '.16em', color: '#8fa8c0', fontFamily: 'Arial,sans-serif'}}>INSTRUMENT</div>
          <div style={{fontSize: 40, fontWeight: 900, color: '#eaf6ff', marginTop: 16, fontFamily: 'Arial,sans-serif'}}>EURUSD</div>
          <div style={{fontSize: 21, color: '#8fa8c0', marginTop: 8, fontFamily: 'Arial,sans-serif'}}>one chart, one focus</div>
        </div>
        <div style={{flex: 1, borderRadius: 22, padding: '28px 24px', background: 'rgba(183,243,75,.10)', border: `1px solid ${LIME}55`}}>
          <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '.16em', color: LIME, fontFamily: 'Arial,sans-serif'}}>DIRECTION</div>
          <div style={{fontSize: 40, fontWeight: 900, color: LIME, marginTop: 16, fontFamily: 'Arial,sans-serif'}}>LONG</div>
          <div style={{fontSize: 21, color: '#a9c1d6', marginTop: 8, fontFamily: 'Arial,sans-serif'}}>buy, then manage</div>
        </div>
      </div>
      <Note p={n}>Direction is not a prediction of the future. It is the side the rules selected today.</Note>
    </Stage>
  );
};

/* 04 entry */
const Entry: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [100, 132], [0, 1], clamp);
  const chart = interpolate(l, [30, 62], [0, 1], clamp);
  return (
    <Stage>
      <Pill n="03" label="ENTRY" p={p} />
      <Head p={h}>Where the idea<br/><span style={{color: SKY}}>activates.</span></Head>
      <div style={{marginTop: 34, opacity: chart}}>
        <GoldChart levels={1} label="EUR/USD · M1 · LIVE MT5 FEED" />
      </div>
      <Note p={n}>Entry is the price that confirms the setup, not the price you wish you had.</Note>
    </Stage>
  );
};

/* 05 stop */
const Stop: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [96, 128], [0, 1], clamp);
  const card = interpolate(l, [34, 70], [0, 1], {...clamp, easing: easeOut});
  return (
    <Stage>
      <Pill n="04" label="STOP" color={RED} p={p} />
      <Head p={h}>Where the idea<br/>is <span style={{color: RED}}>wrong.</span></Head>
      <div style={{marginTop: 50, borderRadius: 24, padding: '30px 28px', background: 'rgba(224,85,90,.10)', border: '1px solid rgba(224,85,90,.55)', opacity: card, transform: `translateY(${(1 - card) * 24}px)`}}>
        <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '.18em', color: RED, fontFamily: 'Arial,sans-serif'}}>INVALIDATION</div>
        <div style={{fontSize: 54, fontWeight: 900, color: '#fff', marginTop: 14, fontFamily: 'Arial,sans-serif'}}>1.12136</div>
        <div style={{fontSize: 23, color: '#a9c1d6', marginTop: 12, fontFamily: 'Arial,sans-serif'}}>9.3 pips below entry · 1R</div>
      </div>
      <Note p={n}>The stop is the line that ends the trade. It exists before the position does.</Note>
    </Stage>
  );
};

/* 06 target */
const Target: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [96, 128], [0, 1], clamp);
  const card = interpolate(l, [34, 70], [0, 1], {...clamp, easing: easeOut});
  return (
    <Stage>
      <Pill n="05" label="TARGET" color={LIME} p={p} />
      <Head p={h}>Where the plan<br/><span style={{color: LIME}}>ends.</span></Head>
      <div style={{marginTop: 50, borderRadius: 24, padding: '30px 28px', background: 'rgba(183,243,75,.10)', border: `1px solid ${LIME}55`, opacity: card, transform: `translateY(${(1 - card) * 24}px)`}}>
        <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '.18em', color: LIME, fontFamily: 'Arial,sans-serif'}}>OBJECTIVE</div>
        <div style={{fontSize: 54, fontWeight: 900, color: '#fff', marginTop: 14, fontFamily: 'Arial,sans-serif'}}>1.12369</div>
        <div style={{fontSize: 23, color: '#a9c1d6', marginTop: 12, fontFamily: 'Arial,sans-serif'}}>14.0 pips above entry · 1.5R</div>
      </div>
      <Note p={n}>A target is where you take the plan off the table — not a promise the market reaches it.</Note>
    </Stage>
  );
};

/* 07 size */
const Size: React.FC<{l: number}> = ({l}) => {
  const p = interpolate(l, [4, 26], [0, 1], clamp);
  const h = interpolate(l, [10, 38], [0, 1], {...clamp, easing: easeOut});
  const n = interpolate(l, [100, 132], [0, 1], clamp);
  const rows = [['Account', '$10,000'], ['Risk per trade', '1%'], ['Risk in money', '$100'], ['Position size', 'your broker']];
  return (
    <Stage>
      <Pill n="06" label="SIZE" color={GOLD} p={p} />
      <Head p={h}>How much is<br/><span style={{color: GOLD}}>yours.</span></Head>
      <div style={{marginTop: 48, borderRadius: 24, padding: '6px 26px 20px', background: 'rgba(6,30,58,.66)', border: '1px solid rgba(255,255,255,.14)'}}>
        {rows.map((r, i) => {
          const q = interpolate(l, [36 + i * 14, 62 + i * 14], [0, 1], clamp);
          return (
            <div key={r[0]} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '18px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,.09)' : 'none', opacity: q}}>
              <div style={{fontSize: 21, letterSpacing: '.1em', color: '#8fa8c0', fontWeight: 800, fontFamily: 'Arial,sans-serif'}}>{r[0].toUpperCase()}</div>
              <div style={{fontSize: 32, fontWeight: 900, color: i === 3 ? GOLD : '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>{r[1]}</div>
            </div>
          );
        })}
      </div>
      <Note p={n}>The alert gives levels. Position size is calculated from your account and your stop — never copied.</Note>
    </Stage>
  );
};

/* 08 outro */
const Outro: React.FC<{l: number}> = ({l}) => {
  const a = interpolate(l, [4, 36], [0, 1], {...clamp, easing: easeOut});
  const b = interpolate(l, [20, 56], [0, 1], {...clamp, easing: easeOut});
  const r = interpolate(l, [38, 82], [0, 1], {...clamp, easing: easeInOut});
  const c = interpolate(l, [64, 100], [0, 1], clamp);
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
      <div style={{width: 980, textAlign: 'center', marginTop: -34}}>
        <div style={{fontSize: 108, fontWeight: 800, letterSpacing: '-.055em', color: '#fff', lineHeight: 1, opacity: a, fontFamily: 'Arial,sans-serif'}}>The alert is</div>
        <div style={{fontSize: 108, fontWeight: 800, letterSpacing: '-.055em', color: LIME, lineHeight: 1, opacity: b, fontFamily: 'Arial,sans-serif'}}>the map.</div>
        <div style={{width: 440 * r, height: 5, borderRadius: 3, margin: '40px auto 0', background: `linear-gradient(90deg,${LIME},rgba(183,243,75,.06))`}} />
        <div style={{fontSize: 27, lineHeight: 1.45, color: '#a9c1d6', marginTop: 30, opacity: c, fontFamily: 'Arial,sans-serif'}}>You still drive. Read every line<br/>before you take the trade.</div>
        <div style={{marginTop: 32, opacity: c}}>
          <Img src={staticFile('logo-mark.png')} style={{height: 92, width: 98, objectFit: 'contain', display: 'block', margin: '0 auto 20px'}} />
          <div style={{fontSize: 33, fontWeight: 900, letterSpacing: '.08em', color: '#eaf6ff', fontFamily: 'Arial,sans-serif'}}>@TRADERWATCH</div>
          <div style={{fontSize: 18, color: '#6f8aa6', marginTop: 22, lineHeight: 1.4, fontFamily: 'Arial,sans-serif'}}>Educational content only. Not financial advice.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const sceneOpacity = (f: number, i: number) => {
  const s = i * SCENE;
  const e = s + SCENE;
  if (i === 0) return interpolate(f, [e - 16, e], [1, 0], clamp);
  return Math.min(interpolate(f, [s, s + 16], [0, 1], clamp), interpolate(f, [e - 16, e], [1, 0], clamp));
};

export const AlertAnatomy: React.FC = () => {
  const f = useCurrentFrame();
  const idx = Math.min(COUNT - 1, Math.floor(f / SCENE));
  const l = f - idx * SCENE;
  const push = interpolate(l, [0, SCENE], [1, 1.025], clamp);
  const sec = ['INTRO', 'THE ALERT', 'DIRECTION', 'ENTRY', 'STOP', 'TARGET', 'SIZE', 'OUTRO'][idx];

  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Backdrop />
      <Chrome section={sec} />
      <AbsoluteFill style={{transform: `scale(${push})`, transformOrigin: 'center 42%'}}>
        {idx === 0 && <AbsoluteFill style={{opacity: sceneOpacity(f, 0)}}><Cover l={l} /></AbsoluteFill>}
        {idx === 1 && <AbsoluteFill style={{opacity: sceneOpacity(f, 1)}}><Alert l={l} /></AbsoluteFill>}
        {idx === 2 && <AbsoluteFill style={{opacity: sceneOpacity(f, 2)}}><Direction l={l} /></AbsoluteFill>}
        {idx === 3 && <AbsoluteFill style={{opacity: sceneOpacity(f, 3)}}><Entry l={l} /></AbsoluteFill>}
        {idx === 4 && <AbsoluteFill style={{opacity: sceneOpacity(f, 4)}}><Stop l={l} /></AbsoluteFill>}
        {idx === 5 && <AbsoluteFill style={{opacity: sceneOpacity(f, 5)}}><Target l={l} /></AbsoluteFill>}
        {idx === 6 && <AbsoluteFill style={{opacity: sceneOpacity(f, 6)}}><Size l={l} /></AbsoluteFill>}
        {idx === 7 && <AbsoluteFill style={{opacity: sceneOpacity(f, 7)}}><Outro l={l} /></AbsoluteFill>}
      </AbsoluteFill>
      <Dots index={idx} />
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, height: 6, background: 'rgba(255,255,255,.10)'}}>
        <div style={{height: '100%', width: `${(f / ANATOMY_FRAMES) * 100}%`, background: `linear-gradient(90deg,${SKY},${LIME})`}} />
      </div>
    </AbsoluteFill>
  );
};
