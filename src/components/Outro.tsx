import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Card} from './Card';
import type {OutroCard} from '../types';

/** Финал: пять главных ошибок списком (плашки в размерах референса: 133 px, отступ слева 162 px). */
export const Outro: React.FC<{title: string; cards: OutroCard[]}> = ({title, cards}) => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 12], [0, 1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 30% 40%, #2a221b 0%, #14100c 70%)', opacity: fade}}>
      <div style={{position: 'absolute', left: 162, top: 90, font: '700 64px Georgia, "Times New Roman", serif', color: '#F3E9D2'}}>
        {title}
      </div>
      <div style={{position: 'absolute', left: 162, top: 230, display: 'flex', flexDirection: 'column', gap: 26}}>
        {cards.map((c, i) => {
          const d = 10 + i * 14;
          const k = interpolate(frame, [d, d + 14], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.out(Easing.cubic),
          });
          return (
            <div key={i} style={{opacity: k, transform: `translateX(${(1 - k) * -120}px)`}}>
              <Card text={c.text} icon={c.icon} red={i === 0} height={133} fontSize={52} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
