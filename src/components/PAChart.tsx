import React from 'react';
import {EURUSD_M1} from './eurusdM1';

const SKY = '#1685cf';
const LIME = '#b7f34b';
const GOLD = '#d89c1d';
const RED = '#e0555a';

const BARS = EURUSD_M1.slice(6, 36);
const N = BARS.length;

const W = 936;
const H = 470;
const PAD_L = 12;
const PAD_R = 92;
const PAD_T = 34;
const PAD_B = 30;
const PLOT_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;
const CW = PLOT_W / N;

const LO = Math.min(...BARS.map((b) => b.l));
const HI = Math.max(...BARS.map((b) => b.h));
const SPAN = HI - LO || 1;

const Y = (v: number) => PAD_T + (1 - (v - LO) / SPAN) * INNER_H;
const BW = Math.max(7, CW * 0.56);
const px = (v: number) => v.toFixed(5);

const isHigh = (i: number) =>
  i > 1 && i < N - 1 && BARS[i].h >= BARS[i - 1].h && BARS[i].h >= BARS[i + 1].h;
const isLow = (i: number) =>
  i > 1 && i < N - 1 && BARS[i].l <= BARS[i - 1].l && BARS[i].l <= BARS[i + 1].l;
const HIGHS = BARS.map((_, i) => i).filter(isHigh).slice(0, 3);
const LOWS = BARS.map((_, i) => i).filter(isLow).slice(0, 3);

const SUPPORT_I = LOWS.length ? LOWS[0] : 6;
const SUPPORT_P = BARS[SUPPORT_I].l;
const TOUCHES = BARS.map((b, i) => ({i, d: Math.abs(b.l - SUPPORT_P)}))
  .filter((t) => t.d < SPAN * 0.09).map((t) => t.i).slice(0, 4);
const LAST_TOUCH = TOUCHES.length ? TOUCHES[TOUCHES.length - 1] : SUPPORT_I;
const REACTION_I = Math.min(N - 1,
  BARS.findIndex((b, i) => i > LAST_TOUCH && b.c > b.o && Math.abs(b.c - b.o) > SPAN * 0.05) >= 0
    ? BARS.findIndex((b, i) => i > LAST_TOUCH && b.c > b.o && Math.abs(b.c - b.o) > SPAN * 0.05)
    : LAST_TOUCH + 1,
);

const CX = (i: number) => PAD_L + (i + 0.5) * CW;

export type PAChartProps = {
  /** how many candles visible (integer, 1-N) */
  reveal?: number;
  showTrend?: number;
  showLevel?: number;
  showReaction?: number;
  scanPulse?: number;
  zoom?: number;
  live?: boolean;
  caption?: string;
  /** visual style */
  variant?: 'default' | 'blueprint' | 'holographic' | 'neon' | 'ascii';
};

const VARIANTS = {
  default:    {bg:'rgba(2,12,25,.34)',   grid:'rgba(255,255,255,.045)', up:LIME,   dn:RED,      accent:SKY,  glow:false},
  blueprint:  {bg:'rgba(0,6,18,.55)',     grid:'rgba(100,180,255,.06)', up:'#00d4ff', dn:'#ff6b35', accent:'#00d4ff', glow:false},
  holographic:{bg:'rgba(4,8,22,.60)',     grid:'rgba(200,180,255,.04)', up:'#c084fc', dn:'#f472b6', accent:'#818cf8', glow:true},
  neon:      {bg:'rgba(5,0,15,.60)',     grid:'rgba(0,255,200,.04)',  up:'#00ff9f', dn:'#ff3366', accent:'#00d4ff', glow:true},
  ascii:     {bg:'rgba(0,0,0,.75)',      grid:'rgba(0,255,0,.03)',   up:'#00ff00', dn:'#ff0000', accent:'#ffff00', glow:false},
};

export const PAChart: React.FC<PAChartProps> = ({
  reveal = N,
  showTrend = 0,
  showLevel = 0,
  showReaction = 0,
  scanPulse = 0,
  zoom = 1,
  live = false,
  caption = 'EUR/USD · M1 · REAL MT5 DATA',
  variant = 'default',
}) => {
  const S = VARIANTS[variant] || VARIANTS.default;

  const vis = Math.max(1, Math.round(reveal));

  const scanX = scanPulse > 0 ? PAD_L + scanPulse * PLOT_W : -1;

  return (
    <svg width={W} height={H} style={{
      display:'block', overflow:'visible',
      filter: S.glow ? 'drop-shadow(0 0 8px rgba(0,210,255,.2))' : undefined,
    }}>
      <rect x={0} y={0} width={W} height={H} rx={16}
        fill={S.bg}
        stroke={variant === 'blueprint' ? 'rgba(0,180,255,.3)' : 'rgba(255,255,255,.08)'}
      />

      {[0.25, 0.5, 0.75].map((p) => (
        <line key={p} x1={0} y1={PAD_T + INNER_H*p} x2={W} y2={PAD_T + INNER_H*p}
          stroke={S.grid} strokeWidth={variant==='blueprint' ? 0.8 : 1} />
      ))}

      {/* support level */}
      <g opacity={showLevel}>
        <rect x={0} y={Y(SUPPORT_P)-7} width={W} height={14} fill={`${S.accent}28`} />
        {TOUCHES.filter(i => i < vis).map(i => (
          <circle key={i} cx={CX(i)} cy={Y(BARS[i].l)} r={11}
            fill="none" stroke={S.accent} strokeWidth={2.5} />
        ))}
        <line x1={0} y1={Y(SUPPORT_P)} x2={W-PAD_R} y2={Y(SUPPORT_P)} stroke={S.accent} strokeWidth={2.5} />
        <rect x={W-PAD_R+6} y={Y(SUPPORT_P)-13} width={PAD_R-12} height={26} rx={5} fill={S.accent} />
        <text x={W-PAD_R+13} y={Y(SUPPORT_P)+6}
          fill={variant==='default' ? '#04121f' : '#000'}
          fontSize={14} fontWeight={900} fontFamily="Arial">SUPPORT</text>
      </g>

      {/* candles — all in fixed position */}
      {BARS.slice(0, vis).map((b, i) => {
        const up = b.c >= b.o;
        const col = up ? S.up : S.dn;
        const o = b.o;
        const c = b.c;
        const h = b.h;
        const l = b.l;
        return (
          <g key={b.t}>
            <line x1={CX(i)} y1={Y(h)} x2={CX(i)} y2={Y(l)}
              stroke={col} strokeWidth={1.7} opacity={0.9} />
            <rect x={CX(i)-BW/2} y={Math.min(Y(o),Y(c))}
              width={BW} height={Math.max(3, Math.abs(Y(o)-Y(c)))}
              rx={1.5} fill={col} />
          </g>
        );
      })}

      {/* scan line */}
      {scanPulse > 0 && scanX > PAD_L && scanX < W-PAD_R && (
        <line x1={scanX} y1={PAD_T} x2={scanX} y2={PAD_T+INNER_H}
          stroke={S.accent} strokeWidth={1.5} opacity={0.7} strokeDasharray="4 4" />
      )}

      {/* trend labels */}
      <g opacity={showTrend}>
        {HIGHS.slice(0,2).map((i,k) => i < vis ? (
          <g key={`h${i}`}>
            <line x1={CX(i)} y1={Y(BARS[i].h)} x2={CX(i)} y2={Y(BARS[i].h)-16}
              stroke={S.accent} strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={CX(i)-16} y={Y(BARS[i].h)-22}
              fill={S.accent} fontSize={15} fontWeight={900} fontFamily="Arial">
              {k===0 ? 'H' : 'HH'}
            </text>
          </g>
        ) : null)}
        {LOWS.slice(0,2).map((i,k) => i < vis ? (
          <g key={`l${i}`}>
            <line x1={CX(i)} y1={Y(BARS[i].l)} x2={CX(i)} y2={Y(BARS[i].l)+16}
              stroke={S.up} strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={CX(i)-16} y={Y(BARS[i].l)+30}
              fill={S.up} fontSize={15} fontWeight={900} fontFamily="Arial">
              {k===0 ? 'L' : 'HL'}
            </text>
          </g>
        ) : null)}
      </g>

      {/* reaction annotation */}
      <g opacity={showReaction}>
        {REACTION_I < vis ? (() => {
          const cx = CX(REACTION_I);
          return (
            <>
              <circle cx={cx} cy={Y(BARS[REACTION_I].c)} r={16} fill="none" stroke={S.accent} strokeWidth={3} />
              <line x1={cx} y1={Y(BARS[REACTION_I].c)-20} x2={cx+54} y2={Y(BARS[REACTION_I].c)-62}
                stroke={S.accent} strokeWidth={2} />
              <text x={cx+58} y={Y(BARS[REACTION_I].c)-58}
                fill={S.accent} fontSize={15} fontWeight={900} fontFamily="Arial">BUYERS STEP IN</text>
            </>
          );
        })() : null}
      </g>

      {/* price axis */}
      {[HI, LO+SPAN*0.5, LO].map((v,i) => (
        <text key={i} x={W-PAD_R+12} y={Y(v)+5}
          fill="#7fa3c4" fontSize={14} fontWeight={700} fontFamily="Arial">{px(v)}</text>
      ))}

      <text x={12} y={22} fill="#8fa8c0" fontSize={14} fontWeight={900} letterSpacing="1" fontFamily="Arial">
        {caption}
      </text>
      {live && (
        <>
          <circle cx={W-80} cy={18} r={6} fill="#ef4444" opacity={0.85}/>
          <text x={W-68} y={23} fill="#ef4444" fontSize={14} fontWeight={900} fontFamily="Arial">LIVE</text>
        </>
      )}
    </svg>
  );
};
