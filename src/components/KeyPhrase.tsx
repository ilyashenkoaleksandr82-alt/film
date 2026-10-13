import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';

type Props = {phrases: string[]; frames: number};

const pill: React.CSSProperties = {
  font: '700 72px Georgia, "Times New Roman", serif',
  padding: '10px 34px 14px',
  background: 'rgba(20,16,12,0.78)',
  color: '#F3E9D2',
  borderRadius: 14,
  whiteSpace: 'nowrap',
};

/**
 * Подсветка слов маркером (как в статье-шаблоне): жёлтый маркер выезжает слева направо
 * с постоянной скоростью ~0,074 с на букву, текст остаётся поверх.
 */
export const KeyPhrase: React.FC<Props> = ({phrases, frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = phrases.length;
  const slot = Math.max(1, Math.floor(frames / n));
  const idx = Math.min(n - 1, Math.floor(frame / slot));
  const local = frame - idx * slot;
  const phrase = phrases[idx];
  const wipe = Math.max(8, Math.round(phrase.length * 0.074 * fps));
  const pct = interpolate(local, [8, 8 + wipe], [0, 100], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const pop = interpolate(local, [0, 6], [0, 1], {extrapolateRight: 'clamp'});
  const out = idx === n - 1 ? interpolate(frame, [frames - 6, frames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}) : 1;

  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 96, opacity: pop * out}}>
      <div style={{position: 'relative', display: 'inline-block', transform: `translateY(${(1 - pop) * 14}px)`}}>
        <div style={pill}>{phrase}</div>
        <div
          style={{
            ...pill,
            position: 'absolute',
            inset: 0,
            background: '#F9E13C',
            color: '#161412',
            clipPath: `inset(0 ${100 - pct}% 0 0 round 14px)`,
          }}
        >
          {phrase}
        </div>
      </div>
    </AbsoluteFill>
  );
};
