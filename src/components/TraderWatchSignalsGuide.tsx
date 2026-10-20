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

/* TraderWatch brand tokens — same values as app.css / index.html */
const NAVY = '#09284c';
const NAVY_DEEP = '#061e3a';
const BLUE = '#0d4f91';
const SKY = '#1685cf';
const GREEN = '#b7f34b';
const RED = '#c65349';
const GOLD = '#d89c1d';

/* Synthetic XAU/USD path — illustrative only, never real market data */
const PX: [number, number][] = [
  [0, 3380], [5, 3402], [10, 3391], [15, 3425], [20, 3412],
  [25, 3441], [30, 3428], [35, 3396], [40, 3415], [45, 3438],
  [50, 3455], [55, 3442], [60, 3468], [65, 3490], [70, 3477],
  [75, 3502], [80, 3518], [85, 3505], [90, 3529], [95, 3541],
  [100, 3528], [105, 3550], [110, 3567], [115, 3556], [120, 3580],
];

const PMIN = 3350;
const PMAX = 3620;

const CW = 952;
const CH = 460;
const chartX = (i: number) => (i / 120) * CW;
const chartY = (p: number) => CH - ((p - PMIN) / (PMAX - PMIN)) * (CH - 60) - 30;

function priceAt(i: number): number {
  let a = 0;
  while (a + 1 < PX.length - 1 && PX[a + 1][0] < i) a++;
  const [x1, y1] = PX[a];
  const [x2, y2] = PX[a + 1];
  const t = (i - x1) / (x2 - x1 || 1);
  return y1 + (y2 - y1) * t;
}

function pathTo(i: number): string {
  let d = '';
  for (let s = 0; s <= i; s++) {
    d += `${s === 0 ? 'M' : 'L'} ${chartX(s).toFixed(1)} ${chartY(priceAt(s)).toFixed(1)} `;
  }
  return d;
}

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/* ------------------------------------------------------------------ */
const Grid: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, rgba(255,255,255,0.030) 0 1px, transparent 1px 72px),
        repeating-linear-gradient(90deg, rgba(255,255,255,0.024) 0 1px, transparent 1px 72px)`,
    }}
  />
);

const Orb: React.FC<{cy?: number}> = ({cy = 620}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, 300], [0.9, 1.12], clamp);
  const op = interpolate(f, [0, 90], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: W / 2,
        top: cy,
        width: 1400,
        height: 1400,
        marginLeft: -700,
        marginTop: -700,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(22,133,207,0.28), rgba(13,79,145,0.10) 46%, transparent 68%)`,
        transform: `scale(${scale})`,
        opacity: op,
      }}
    />
  );
};

const Header: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 16], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute', top: 74, left: 64, right: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: op,
      }}
    >
      <div style={{display: 'flex', alignItems: 'center', gap: 18}}>
        <div
          style={{
            width: 58, height: 58, borderRadius: 16, background: NAVY,
            border: '1.5px solid rgba(183,243,75,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 27, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
          }}
        >
          TW
        </div>
        <div style={{fontSize: 34, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
          TraderWatch
        </div>
      </div>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 11,
          border: '1px solid rgba(255,255,255,0.20)', borderRadius: 999, padding: '11px 20px',
        }}
      >
        <div style={{width: 9, height: 9, borderRadius: '50%', background: GREEN, boxShadow: `0 0 12px ${GREEN}`}} />
        <div style={{fontSize: 18, fontWeight: 700, color: '#dceeff', letterSpacing: '0.07em', fontFamily: 'Arial, sans-serif'}}>
          SIGNAL GUIDE
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 1 — headline + chart with entry / stop / target lines          */
/* ------------------------------------------------------------------ */
const LEVELS = [
  {p: 3556, t: 'TARGET', c: '#5fd39b', at: 150},
  {p: 3524, t: 'ENTRY', c: '#ffffff', at: 126},
  {p: 3512, t: 'STOP', c: RED, at: 174},
];

const SceneChart: React.FC = () => {
  const f = useCurrentFrame();

  const drawPct = interpolate(f, [26, 210], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const drawnIndex = Math.floor(drawPct * 120);

  const line1 = interpolate(f, [12, 44], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line1Y = interpolate(f, [12, 44], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const line2 = interpolate(f, [44, 76], [0, 1], {...clamp, easing: Easing.out(Easing.quad)});
  const line2Y = interpolate(f, [44, 76], [44, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const subOp = interpolate(f, [84, 112], [0, 1], clamp);
  const cardOp = interpolate(f, [14, 52], [0, 1], clamp);
  const cardY = interpolate(f, [14, 56], [40, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  const sceneOut = interpolate(f, [286, 316], [1, 0], clamp);

  const idx = Math.min(drawnIndex, 120);
  const lastX = chartX(idx);
  const lastY = chartY(priceAt(idx));

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={800} />

      <div
        style={{
          position: 'absolute', top: 250, left: 64,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          border: '1px solid rgba(255,255,255,0.28)', borderRadius: 99,
          padding: '10px 18px', opacity: line1,
        }}
      >
        <div style={{width: 8, height: 8, borderRadius: '50%', background: GREEN}} />
        <div style={{fontSize: 17, fontWeight: 800, letterSpacing: '0.09em', color: '#dceeff', fontFamily: 'Arial, sans-serif'}}>
          HOW TO READ A SIGNAL
        </div>
      </div>

      <div style={{position: 'absolute', top: 330, left: 64, width: 952}}>
        <div
          style={{
            opacity: line1, transform: `translateY(${line1Y}px)`,
            fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em',
            color: '#fff', fontFamily: 'Arial, sans-serif',
          }}
        >
          A signal is a plan.
        </div>
        <div
          style={{
            opacity: line2, transform: `translateY(${line2Y}px)`,
            fontSize: 96, fontWeight: 800, lineHeight: 1.03, letterSpacing: '-0.045em',
            color: GREEN, fontFamily: 'Arial, sans-serif', marginTop: 6,
          }}
        >
          Not a command.
        </div>
        <div
          style={{
            opacity: subOp, fontSize: 29, lineHeight: 1.45, color: '#c4d9ea',
            marginTop: 24, maxWidth: 900, fontFamily: 'Arial, sans-serif',
          }}
        >
          Every alert carries four numbers. Read them in order.
        </div>
      </div>

      <div
        style={{
          position: 'absolute', top: 760, left: 64, width: 952,
          borderRadius: 28, background: 'rgba(9,40,76,0.74)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 34px 90px rgba(3,18,36,0.55)',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
        }}
      >
        <div
          style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '22px 28px', borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div style={{fontSize: 26, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
            XAU/USD · 1H
          </div>
          <div style={{fontSize: 14, fontWeight: 800, color: GREEN, letterSpacing: '0.10em', fontFamily: 'Arial, sans-serif'}}>
            ILLUSTRATIVE
          </div>
        </div>

        <svg width={CW} height={CH + 40} viewBox={`0 0 ${CW} ${CH + 40}`}>
          <defs>
            <linearGradient id="gFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={GOLD} stopOpacity="0.26" />
              <stop offset="100%" stopColor={GOLD} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3].map((g) => (
            <line key={g} x1={0} x2={CW} y1={80 + g * 100} y2={80 + g * 100} stroke="rgba(255,255,255,0.07)" strokeWidth={1} />
          ))}

          {/* entry / stop / target lines */}
          {LEVELS.map((lv) => {
            const p = interpolate(f, [lv.at, lv.at + 26], [0, 1], clamp);
            const y = chartY(lv.p);
            return (
              <g key={lv.t} opacity={p}>
                <line
                  x1={0}
                  x2={CW * p}
                  y1={y}
                  y2={y}
                  stroke={lv.c}
                  strokeWidth={2.5}
                  strokeDasharray="12 8"
                  opacity={0.9}
                />
                <text
                  x={CW - 14}
                  y={y - 12}
                  textAnchor="end"
                  fill={lv.c}
                  fontSize={22}
                  fontWeight={800}
                  fontFamily="Arial, sans-serif"
                >
                  {lv.t}
                </text>
              </g>
            );
          })}

          {drawnIndex > 2 && (
            <path d={`${pathTo(drawnIndex)} L ${lastX} ${CH + 40} L 0 ${CH + 40} Z`} fill="url(#gFill)" />
          )}
          {drawnIndex > 0 && (
            <path d={pathTo(drawnIndex)} fill="none" stroke={GOLD} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
          )}
          {drawnIndex > 0 && drawnIndex < 121 && (
            <>
              <circle cx={lastX} cy={lastY} r={18} fill={GOLD} opacity={0.25} />
              <circle cx={lastX} cy={lastY} r={7} fill="#fff" />
            </>
          )}
        </svg>
      </div>

      <div style={{position: 'absolute', top: 1400, left: 64, width: 952, fontSize: 19, color: '#8fa8c0', opacity: cardOp, fontFamily: 'Arial, sans-serif'}}>
        Synthetic example — not live prices, not a recommendation.
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 2 — anatomy of one setup                                      */
/* ------------------------------------------------------------------ */
const SceneAnatomy: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 300;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [560, 590], [1, 0], clamp);
  const cardIn = spring({frame: Math.max(0, local - 16), fps, config: {damping: 18, stiffness: 90, mass: 0.9}});
  const cardY = interpolate(cardIn, [0, 1], [70, 0]);
  const cardOp = interpolate(local, [16, 34], [0, 1], clamp);

  const rows = [
    {n: '01', k: 'DIRECTION', v: 'BUY XAU/USD', c: '#25804b', p: 'Long or short, and on which pair.'},
    {n: '02', k: 'ENTRY', v: '3,524.50', c: NAVY, p: 'Reference price — not a guaranteed fill.'},
    {n: '03', k: 'STOP LOSS', v: '3,512.00', c: RED, p: 'Where the idea is wrong. Risk first.'},
    {n: '04', k: 'TAKE PROFIT', v: '3,556.00', c: '#25804b', p: 'Where the plan takes profit.'},
  ];

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={540} />

      <div style={{position: 'absolute', top: 230, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          THE ANATOMY
        </div>
        <div style={{fontSize: 66, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Four fields, read in order.
        </div>
      </div>

      {/* the card itself */}
      <div
        style={{
          position: 'absolute', top: 420, left: 64, width: 952,
          borderRadius: 26, background: '#fff', padding: '0 32px 24px',
          overflow: 'hidden', opacity: cardOp, transform: `translateY(${cardY}px)`,
          boxShadow: '0 26px 64px rgba(3,18,36,0.45)',
        }}
      >
        <div style={{height: 8, margin: '0 -32px 20px', background: `linear-gradient(90deg, ${GOLD}, ${GOLD}66)`}} />
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 14}}>
            <div
              style={{
                width: 46, height: 46, borderRadius: 12, background: '#fff5d9', color: '#9a6900',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, fontWeight: 900, fontFamily: 'Arial, sans-serif',
              }}
            >
              AU
            </div>
            <div style={{fontSize: 32, fontWeight: 800, color: NAVY, fontFamily: 'Arial, sans-serif', letterSpacing: '-0.02em'}}>
              XAU/USD
            </div>
          </div>
          <div
            style={{
              fontSize: 15, fontWeight: 900, letterSpacing: '0.08em',
              padding: '8px 16px', borderRadius: 999, background: 'rgba(37,128,75,0.14)', color: '#25804b',
              fontFamily: 'Arial, sans-serif',
            }}
          >
            BUY
          </div>
        </div>
      </div>

      {/* the four explanations */}
      <div style={{position: 'absolute', top: 640, left: 64, width: 952}}>
        {rows.map((r, i) => {
          const a = interpolate(local, [34 + i * 14, 58 + i * 14], [0, 1], clamp);
          const y = interpolate(local, [34 + i * 14, 58 + i * 14], [26, 0], clamp);
          return (
            <div
              key={r.n}
              style={{
                opacity: a, transform: `translateY(${y}px)`,
                display: 'flex', alignItems: 'center', gap: 22,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 20, padding: '22px 26px', marginBottom: 18,
              }}
            >
              <div
                style={{
                  flex: '0 0 auto', width: 54, height: 54, borderRadius: 14,
                  background: 'rgba(183,243,75,0.14)', border: '1px solid rgba(183,243,75,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 21, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
                }}
              >
                {r.n}
              </div>
              <div style={{flex: 1}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                  <div style={{fontSize: 17, fontWeight: 900, letterSpacing: '0.10em', color: '#9fb6cc', fontFamily: 'Arial, sans-serif'}}>
                    {r.k}
                  </div>
                  <div style={{fontSize: 28, fontWeight: 800, color: r.c === NAVY ? '#fff' : r.c, fontFamily: 'Arial, sans-serif'}}>
                    {r.v}
                  </div>
                </div>
                <div style={{fontSize: 21, color: '#a9c1d6', marginTop: 6, fontFamily: 'Arial, sans-serif'}}>
                  {r.p}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 3 — Telegram delivery                                         */
/* ------------------------------------------------------------------ */
const SceneTelegram: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 566;
  const {fps} = useVideoConfig();

  const headOp = interpolate(local, [0, 22], [0, 1], clamp);
  const sceneOut = interpolate(f, [742, 772], [1, 0], clamp);
  const phoneIn = spring({frame: Math.max(0, local - 10), fps, config: {damping: 20, stiffness: 80, mass: 1}});
  const phoneY = interpolate(phoneIn, [0, 1], [90, 0]);
  const phoneOp = interpolate(local, [10, 30], [0, 1], clamp);
  const bubbleIn = spring({frame: Math.max(0, local - 34), fps, config: {damping: 16, stiffness: 110, mass: 0.8}});
  const bubbleY = interpolate(bubbleIn, [0, 1], [40, 0]);
  const bubbleOp = interpolate(local, [34, 50], [0, 1], clamp);
  const typed = Math.floor(interpolate(local, [40, 78], [0, 4], clamp));

  const bullets = [
    {t: 'Pushed to you personally', p: 'Not a group chat you have to babysit.'},
    {t: 'Sent when it is posted', p: 'Before the move, not after it.'},
    {t: 'You still verify and decide', p: 'Your chart, your risk, your call.'},
  ];

  return (
    <AbsoluteFill style={{opacity: sceneOut}}>
      <Orb cy={640} />

      <div style={{position: 'absolute', top: 230, left: 64, width: 952, opacity: headOp}}>
        <div style={{fontSize: 19, fontWeight: 800, letterSpacing: '0.16em', color: SKY, fontFamily: 'Arial, sans-serif'}}>
          DELIVERED PRIVATELY
        </div>
        <div style={{fontSize: 64, fontWeight: 800, letterSpacing: '-0.04em', color: '#fff', marginTop: 16, lineHeight: 1.08, fontFamily: 'Arial, sans-serif'}}>
          Straight to your Telegram.
        </div>
      </div>

      {/* phone mock */}
      <div
        style={{
          position: 'absolute', top: 470, left: 300, width: 480, height: 700,
          borderRadius: 44, background: '#0b2138',
          border: '2px solid rgba(255,255,255,0.16)',
          boxShadow: '0 40px 90px rgba(2,12,26,0.6)',
          overflow: 'hidden', opacity: phoneOp, transform: `translateY(${phoneY}px)`,
        }}
      >
        {/* telegram header */}
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '26px 26px 22px',
            background: '#0f2f52', borderBottom: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div
            style={{
              width: 46, height: 46, borderRadius: '50%', background: NAVY,
              border: '1.5px solid rgba(183,243,75,0.40)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, fontWeight: 900, color: GREEN, fontFamily: 'Arial, sans-serif',
            }}
          >
            TW
          </div>
          <div>
            <div style={{fontSize: 22, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
              TraderWatch Alerts
            </div>
            <div style={{fontSize: 15, color: '#7fc9a4', marginTop: 2, fontFamily: 'Arial, sans-serif'}}>
              private · bot
            </div>
          </div>
        </div>

        {/* message bubble */}
        <div
          style={{
            margin: '26px 22px 0', padding: '20px 22px', borderRadius: 18,
            background: '#173c62', opacity: bubbleOp, transform: `translateY(${bubbleY}px)`,
            border: '1px solid rgba(255,255,255,0.10)',
          }}
        >
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{fontSize: 24, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif'}}>
              XAU/USD
            </div>
            <div
              style={{
                fontSize: 13, fontWeight: 900, letterSpacing: '0.06em', padding: '5px 11px',
                borderRadius: 999, background: 'rgba(183,243,75,0.18)', color: GREEN, fontFamily: 'Arial, sans-serif',
              }}
            >
              BUY
            </div>
          </div>
          <div style={{marginTop: 14, display: 'grid', gap: 8}}>
            {[
              {k: 'Entry', v: '3,524.50'},
              {k: 'SL', v: '3,512.00'},
              {k: 'TP', v: '3,556.00'},
            ].map((row, i) => (
              <div
                key={row.k}
                style={{
                  display: 'flex', justifyContent: 'space-between',
                  opacity: typed > i ? 1 : 0.12,
                  fontSize: 20, fontFamily: 'Arial, sans-serif',
                }}
              >
                <span style={{color: '#9fb6cc'}}>{row.k}</span>
                <span style={{color: '#fff', fontWeight: 700}}>{row.v}</span>
              </div>
            ))}
          </div>
          <div style={{marginTop: 14, fontSize: 14, color: '#7f97ae', fontFamily: 'Arial, sans-serif'}}>
            Educational example · verify before acting
          </div>
        </div>

        {/* typing indicator */}
        <div style={{margin: '18px 22px 0', display: 'flex', gap: 8, alignItems: 'center', opacity: interpolate(local, [78, 92], [0, 1], clamp)}}>
          {[0, 1, 2].map((d) => (
            <div
              key={d}
              style={{
                width: 10, height: 10, borderRadius: '50%', background: '#5f7f9e',
                opacity: 0.35 + 0.65 * Math.abs(Math.sin((local - 78) / 6 + d)),
              }}
            />
          ))}
          <div style={{fontSize: 14, color: '#6f88a6', marginLeft: 6, fontFamily: 'Arial, sans-serif'}}>
            next setup pending
          </div>
        </div>
      </div>

      {/* three delivery points */}
      <div style={{position: 'absolute', top: 1230, left: 64, width: 952}}>
        {bullets.map((b, i) => {
          const a = interpolate(local, [56 + i * 14, 78 + i * 14], [0, 1], clamp);
          const y = interpolate(local, [56 + i * 14, 78 + i * 14], [24, 0], clamp);
          return (
            <div key={b.t} style={{opacity: a, transform: `translateY(${y}px)`, display: 'flex', gap: 18, marginBottom: 22}}>
              <div
                style={{
                  flex: '0 0 auto', width: 34, height: 34, borderRadius: '50%',
                  background: 'rgba(183,243,75,0.16)', border: '1px solid rgba(183,243,75,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 17, color: GREEN, fontFamily: 'Arial, sans-serif',
                }}
              >
                ✓
              </div>
              <div>
                <div style={{fontSize: 27, fontWeight: 800, color: '#fff', fontFamily: 'Arial, sans-serif', letterSpacing: '-0.01em'}}>
                  {b.t}
                </div>
                <div style={{fontSize: 20, color: '#a9c1d6', marginTop: 4, fontFamily: 'Arial, sans-serif'}}>
                  {b.p}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Scene 4 — end card (same CTA as the site)                           */
/* ------------------------------------------------------------------ */
const SceneEnd: React.FC = () => {
  const f = useCurrentFrame();
  const local = f - 748;

  const logoOp = interpolate(local, [0, 20], [0, 1], clamp);
  const logoScale = interpolate(local, [0, 28], [0.9, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
  const ctaOp = interpolate(local, [20, 44], [0, 1], clamp);
  const discOp = interpolate(local, [40, 64], [0, 1], clamp);

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(circle at 50% 42%, #12376e 0%, ${NAVY_DEEP} 58%, #04101f 100%)`,
        justifyContent: 'center', alignItems: 'center',
      }}
    >
      <Grid />
      <Orb cy={760} />

      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 72px'}}>
        <div
          style={{
            opacity: logoOp, transform: `scale(${logoScale})`,
            width: 150, height: 150, borderRadius: 36,
            background: NAVY, border: '2.5px solid rgba(183,243,75,0.45)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 62, fontWeight: 900, color: GREEN,
            fontFamily: 'Arial, sans-serif', boxShadow: '0 0 90px rgba(183,243,75,0.22)',
          }}
        >
          TW
        </div>

        <div style={{opacity: logoOp, fontSize: 92, fontWeight: 800, color: '#fff', marginTop: 34, letterSpacing: '-0.03em', fontFamily: 'Arial, sans-serif'}}>
          TraderWatch
        </div>

        <div style={{opacity: ctaOp, fontSize: 36, fontWeight: 700, color: '#a9c1d6', marginTop: 18, textAlign: 'center', fontFamily: 'Arial, sans-serif'}}>
          Read the signal. Then decide.
        </div>

        <div
          style={{
            opacity: ctaOp, marginTop: 54, display: 'inline-flex', alignItems: 'center', gap: 12,
            background: GREEN, color: '#193414', fontSize: 32, fontWeight: 800,
            padding: '26px 58px', borderRadius: 16, fontFamily: 'Arial, sans-serif',
          }}
        >
          Explore market setups →
        </div>

        <div
          style={{
            opacity: discOp, fontSize: 20, color: '#6f88a6', marginTop: 80,
            textAlign: 'center', lineHeight: 1.6, fontFamily: 'Arial, sans-serif',
          }}
        >
          Educational information only. Trading is risky; no outcomes are guaranteed.
          Prices shown are illustrative and are not trade recommendations.
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ------------------------------------------------------------------ */
/* Main — 900 frames @ 30fps = 30s, portrait 1080x1920                  */
/* Scenes gated by absolute frame so no opaque backdrop covers them.    */
/* ------------------------------------------------------------------ */
export const TraderWatchSignalsGuide: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `linear-gradient(160deg, #08284d 0%, #0d4f91 62%, #1685cf 100%)`}}>
      <Grid />
      {f < 320 && <Header />}
      {f < 320 && <SceneChart />}
      {f >= 292 && f < 592 && <SceneAnatomy />}
      {f >= 562 && f < 774 && <SceneTelegram />}
      {f >= 742 && <SceneEnd />}
    </AbsoluteFill>
  );
};
