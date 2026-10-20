import React from 'react';
import {EURUSD_M1} from './eurusdM1';

const SKY = '#1685cf';
const LIME = '#b7f34b';
const RED = '#e0555a';
const GOLD = '#d89c1d';

const W = 888;
const PLOT_W = 776;
const PLOT_H = 322;
const PAD_R = W - PLOT_W;   // price axis gutter
const PAD_TOP = 50;
const PAD_BOT = 32;
const INNER_H = PLOT_H - PAD_TOP - PAD_BOT;

const LAST = EURUSD_M1[EURUSD_M1.length - 1];
const SWING_LOW = Math.min(...EURUSD_M1.map((c) => c.l));
const SWING_LOW_I = EURUSD_M1.findIndex((c) => c.l === SWING_LOW);
const DATA_HI = Math.max(...EURUSD_M1.map((c) => c.h));

const ENTRY = LAST.c;
const PIP = 0.0001;
const STOP = SWING_LOW - 0.12 * PIP;
const TARGET = ENTRY + (ENTRY - STOP) * 1.5;

/* the scale must contain every candle AND all three levels */
const R_LO = Math.min(STOP, Math.min(...EURUSD_M1.map((c) => c.l))) - 0.30 * PIP;
const R_HI = Math.max(TARGET, DATA_HI) + 0.30 * PIP;
const SPAN = R_HI - R_LO || 1;

const Y = (v: number) => PAD_TOP + (1 - (v - R_LO) / SPAN) * INNER_H;
const STEP = PLOT_W / EURUSD_M1.length;
const BODY = Math.max(6, STEP * 0.60);

const fmt = (v: number) => v.toFixed(5);
const hhmm = (t: string) => t.slice(11, 16);

const LEVELS = [
  {y: Y(TARGET), label: `TP ${fmt(TARGET)}`, color: LIME, ink: '#14290d', dash: '8 6'},
  {y: Y(ENTRY), label: `EN ${fmt(ENTRY)}`, color: SKY, ink: '#04121f', dash: ''},
  {y: Y(STOP), label: `SL ${fmt(STOP)}`, color: RED, ink: '#1b0709', dash: '8 6'},
];

/* axis ticks, then drop any that would collide with a level badge */
const AXIS_ALL = [R_HI, R_LO + SPAN * 0.62, R_LO + SPAN * 0.30, R_LO];
const AXIS = AXIS_ALL.filter((v) => LEVELS.every((lv) => Math.abs(Y(v) - lv.y) > 17));

export const GoldChart: React.FC<{scan?: number; zone?: number; levels?: number; label?: string}> = ({
  scan = 0,
  zone = 0,
  levels = 0,
  label = 'EUR/USD · M1 · LIVE MT5 FEED',
}) => (
  <svg width={W} height={PLOT_H + 26} viewBox={`0 0 ${W} ${PLOT_H + 26}`} style={{display: 'block'}}>
    <defs>
      <linearGradient id="zoneFill" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={SKY} stopOpacity={0.24} />
        <stop offset="100%" stopColor={SKY} stopOpacity={0.05} />
      </linearGradient>
      <clipPath id="plotClip">
        <rect x={0} y={0} width={PLOT_W} height={PLOT_H} rx={10} />
      </clipPath>
    </defs>

    <rect x={0} y={0} width={PLOT_W} height={PLOT_H} rx={10} fill="rgba(2,12,25,.32)" />

    <g clipPath="url(#plotClip)">
      {AXIS_ALL.map((v, i) => (
        <line key={`g${i}`} x1={0} y1={Y(v)} x2={PLOT_W} y2={Y(v)} stroke="rgba(255,255,255,.055)" strokeWidth={1} />
      ))}

      {EURUSD_M1.map((c, i) => {
        const x = STEP * i + STEP / 2;
        const up = c.c >= c.o;
        const col = up ? LIME : RED;
        const yo = Y(c.o);
        const yc = Y(c.c);
        return (
          <g key={c.t}>
            <line x1={x} y1={Y(c.h)} x2={x} y2={Y(c.l)} stroke={col} strokeWidth={1.7} opacity={0.92} />
            <rect
              x={x - BODY / 2}
              y={Math.min(yo, yc)}
              width={BODY}
              height={Math.max(2.5, Math.abs(yc - yo))}
              rx={1.5}
              fill={col}
            />
          </g>
        );
      })}

      {/* setup zone anchored on the real swing low */}
      <g opacity={zone}>
        <rect
          x={STEP * Math.max(0, SWING_LOW_I - 0.8)}
          y={Y(ENTRY)}
          width={PLOT_W - STEP * Math.max(0, SWING_LOW_I - 0.8)}
          height={Math.max(5, Y(STOP) - Y(ENTRY))}
          fill="url(#zoneFill)"
          stroke={SKY}
          strokeWidth={1.5}
          strokeDasharray="7 5"
          rx={3}
        />
        <line
          x1={STEP * SWING_LOW_I + STEP / 2}
          y1={Y(SWING_LOW)}
          x2={STEP * SWING_LOW_I + STEP / 2}
          y2={PLOT_H}
          stroke={SKY}
          strokeWidth={1}
          strokeDasharray="3 4"
          opacity={0.65}
        />
        <circle cx={STEP * SWING_LOW_I + STEP / 2} cy={Y(SWING_LOW)} r={5.5} fill="none" stroke={SKY} strokeWidth={2.2} />
      </g>

      {/* entry / stop / target rules */}
      <g opacity={levels}>
        {LEVELS.map((lv) => (
          <line key={lv.label} x1={0} y1={lv.y} x2={PLOT_W} y2={lv.y} stroke={lv.color} strokeWidth={1.7} strokeDasharray={lv.dash} />
        ))}
      </g>

      {scan > 0 && (
        <g>
          <line x1={scan * PLOT_W} y1={0} x2={scan * PLOT_W} y2={PLOT_H} stroke={SKY} strokeWidth={2} opacity={0.85} />
          <circle cx={scan * PLOT_W} cy={11} r={5} fill={SKY} />
        </g>
      )}
    </g>

    {/* price axis */}
    {AXIS.map((v, i) => (
      <text key={`ax${i}`} x={PLOT_W + 12} y={Y(v) + 5} fill="#7fa3c4" fontSize={15} fontWeight={700} fontFamily="Arial">
        {fmt(v)}
      </text>
    ))}

    {/* live price chip only before levels appear */}
    {levels < 0.5 && (
      <g>
        <rect x={PLOT_W + 4} y={Y(LAST.c) - 11} width={PAD_R - 8} height={22} rx={5} fill={GOLD} />
        <text x={PLOT_W + 12} y={Y(LAST.c) + 5} fill="#1b1204" fontSize={15} fontWeight={900} fontFamily="Arial">{fmt(LAST.c)}</text>
      </g>
    )}

    {/* level badges */}
    <g opacity={levels}>
      {LEVELS.map((lv) => (
        <g key={`b${lv.label}`}>
          <rect x={PLOT_W + 4} y={lv.y - 11} width={PAD_R - 8} height={22} rx={5} fill={lv.color} />
          <text x={PLOT_W + 11} y={lv.y + 5} fill={lv.ink} fontSize={14} fontWeight={900} fontFamily="Arial">{lv.label}</text>
        </g>
      ))}
    </g>

    {/* time axis */}
    {[0, Math.floor(EURUSD_M1.length / 2), EURUSD_M1.length - 1].map((i) => (
      <text
        key={`tm${i}`}
        x={Math.min(PLOT_W - 40, Math.max(4, STEP * i))}
        y={PLOT_H + 20}
        fill="#6f8aa6"
        fontSize={14}
        fontWeight={700}
        fontFamily="Arial"
      >
        {hhmm(EURUSD_M1[i].t)}
      </text>
    ))}

    <text x={9} y={20} fill="#8fa8c0" fontSize={15} fontWeight={900} letterSpacing="1.1" fontFamily="Arial">{label}</text>
  </svg>
);

export const CHART_META = {ENTRY, STOP, TARGET, SWING_LOW, R_LO, R_HI, LAST: LAST.c};
