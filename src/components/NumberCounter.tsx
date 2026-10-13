import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import type {CounterOverlay} from '../types';
import {fmt} from './format';

type Props = {spec: CounterOverlay; frames: number};

export const NumberCounter: React.FC<Props> = ({spec, frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const start = Math.round(fps * 0.15);
  const countFrames = Math.max(6, Math.min(Math.round(fps * 2.2), Math.round(frames * 0.65)));
  const t = interpolate(frame, [start, start + countFrames], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const enter = interpolate(frame, [0, 8], [0, 1], {extrapolateRight: 'clamp'});
  const exit = interpolate(frame, [frames - 8, frames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const text =
    spec.text ?? `${spec.prefix ?? ''}${fmt((spec.to ?? 0) * t, spec.decimals ?? 0, spec.sep ?? false)}${spec.suffix ?? ''}`;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 110, opacity: enter * exit}}>
      <div
        style={{
          background: 'rgba(18,14,10,0.66)',
          borderRadius: 26,
          padding: '14px 48px 18px',
          textAlign: 'center',
          boxShadow: '0 12px 40px rgba(0,0,0,0.45)',
          transform: `translateY(${(1 - enter) * 24}px)`,
        }}
      >
        <div
          style={{
            font: '800 124px Arial, "Liberation Sans", Helvetica, sans-serif',
            color: '#F3E9D2',
            letterSpacing: 1,
            fontVariantNumeric: 'tabular-nums',
            textShadow: '0 4px 18px rgba(0,0,0,0.5)',
          }}
        >
          {text}
        </div>
        {spec.label ? (
          <div style={{font: '600 36px Arial, "Liberation Sans", Helvetica, sans-serif', color: '#F6A826', marginTop: -6}}>
            {spec.label}
          </div>
        ) : null}
      </div>
    </AbsoluteFill>
  );
};
