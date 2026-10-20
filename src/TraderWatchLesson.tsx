import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const BLUE = '#2a6df0';
const NAVY = '#081630';

/**
 * Minimal TraderWatch lesson comp: animated price line + step pills.
 * Charts on screen are always synthetic — education only.
 */
export const TraderWatchLesson: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = durationInFrames;

  // price line progress across the full duration (slow climb + pullback)
  const k = interpolate(frame, [0, t * 0.6, t * 0.8, t], [0, 0.72, 0.62, 0.95], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const W = 1080;
  const H = 1920;
  const baseX = 160;
  const baseY = 940;
  const x = baseX + k * (W - 320);
  const y = baseY - Math.sin(k * Math.PI) * 260 - k * 140;

  const dot: React.CSSProperties = {
    position: 'absolute',
    left: x,
    top: y,
    width: 18,
    height: 18,
    borderRadius: '50%',
    background: '#fff',
    border: `5px solid ${BLUE}`,
    transform: 'translate(-50%,-50%)',
    boxShadow: `0 0 40px ${BLUE}88`,
  };

  const stepAt = (i: number) =>
    interpolate(frame, [i * 160, i * 160 + 20], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });

  const fadeIn = interpolate(frame, [30, 70], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const showEnd = interpolate(frame, [t - 90, t - 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{backgroundColor: NAVY, color: '#fff', fontFamily: 'Inter, Arial, sans-serif'}}>
      {/* header */}
      <div
        style={{
          position: 'absolute',
          top: 120,
          left: 90,
          fontSize: 46,
          fontWeight: 900,
          opacity: fadeIn,
        }}
      >
        <span style={{color: BLUE}}>@traderwatch</span>
      </div>
      <div
        style={{
          position: 'absolute',
          top: 210,
          left: 90,
          fontSize: 110,
          fontWeight: 900,
          lineHeight: 1.05,
          opacity: fadeIn,
        }}
      >
        Price moves in <span style={{color: BLUE}}>steps.</span>
      </div>

      {/* chart card */}
      <div
        style={{
          position: 'absolute',
          left: 70,
          top: 420,
          width: W - 140,
          height: 720,
          borderRadius: 60,
          background: '#ecf2ff',
          overflow: 'hidden',
          opacity: fadeIn,
        }}
      >
        {/* baseline */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 560,
            height: 4,
            background: '#c8d6ee',
          }}
        />
        {/* price trail */}
        <svg width={W - 140} height={720} style={{position: 'absolute', inset: 0}}>
          <defs>
            <linearGradient id="trail" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={BLUE} stopOpacity="0.25" />
              <stop offset="1" stopColor={BLUE} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M ${baseX - 70} ${baseY + 120} L ${x} ${y} L ${x} 720 L ${baseX - 70} 720 Z`}
            fill="url(#trail)"
          />
          <path
            d={`M ${baseX - 70} ${baseY + 120} L ${x} ${y}`}
            stroke={BLUE}
            strokeWidth={12}
            strokeLinecap="round"
            fill="none"
          />
        </svg>
        {k > 0.015 && <div style={dot} />}
      </div>

      {/* step pills */}
      {['MARK THE HIGH', 'HOLD THE LOW', 'THE BREAK', 'THE RETEST'].map((s, i) => (
        <div
          key={s}
          style={{
            position: 'absolute',
            left: 90,
            top: 1240 + i * 105,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            opacity: stepAt(i),
            transform: `translateX(${(1 - stepAt(i)) * 60}px)`,
          }}
        >
          <div
            style={{
              width: 74,
              height: 74,
              borderRadius: '50%',
              background: BLUE,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 38,
              fontWeight: 900,
            }}
          >
            {i + 1}
          </div>
          <div style={{fontSize: 52, fontWeight: 800, color: '#d3e2ff'}}>{s}</div>
        </div>
      ))}

      {/* end CTA */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1680,
          textAlign: 'center',
          opacity: showEnd,
        }}
      >
        <div style={{fontSize: 88, fontWeight: 900, color: BLUE}}>READY TO TRADE?</div>
        <div style={{fontSize: 56, fontWeight: 700, color: '#9fb3d6', marginTop: 24}}>
          Charts are illustrative. Not financial advice.
        </div>
      </div>
    </AbsoluteFill>
  );
};