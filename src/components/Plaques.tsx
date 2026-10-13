import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Card} from './Card';

type Props = {items: string[]; redFirst?: boolean; frames: number};

/** Короткие плашки с подписями, выезжают по очереди слева. */
export const Plaques: React.FC<Props> = ({items, redFirst, frames}) => {
  const frame = useCurrentFrame();
  const exit = interpolate(frame, [frames - 8, frames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'flex-start', padding: '0 0 96px 96px'}}>
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, opacity: exit}}>
        {items.map((t, i) => {
          const d = 6 + i * 12;
          const k = interpolate(frame, [d, d + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={i} style={{opacity: k, transform: `translateX(${(1 - k) * -90}px)`}}>
              <Card text={t} red={!!redFirst && i === 0} height={96} fontSize={44} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
