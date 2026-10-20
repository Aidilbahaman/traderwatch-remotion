import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/* Test A: root AbsoluteFill with a gradient background + nested scene AbsoluteFill */
export const DiagA: React.FC = () => {
  const f = useCurrentFrame();
  const op = interpolate(f, [0, 18], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(135deg, #061e3a 0%, #09284c 45%, #0d4f91 100%)'}}>
      <AbsoluteFill style={{opacity: op}}>
        <div style={{position: 'absolute', top: 100, left: 100, fontSize: 80, color: '#ffffff'}}>
          NESTED SCENE TEXT
        </div>
        <div style={{position: 'absolute', top: 300, left: 100, width: 500, height: 200, background: '#ffffff'}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

/* Test B: root AbsoluteFill with gradient, children flat (no nested AbsoluteFill) */
export const DiagB: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(135deg, #061e3a 0%, #09284c 45%, #0d4f91 100%)'}}>
    <div style={{position: 'absolute', top: 100, left: 100, fontSize: 80, color: '#ffffff'}}>
      FLAT TEXT
    </div>
    <div style={{position: 'absolute', top: 300, left: 100, width: 500, height: 200, background: '#ffffff'}} />
  </AbsoluteFill>
);
