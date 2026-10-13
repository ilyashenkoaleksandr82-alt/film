import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import type {CameraPreset} from '../types';

type Props = {src: string; preset: CameraPreset; frames: number};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Движение камеры по картинке. Все кривые плавные (ease in-out), без рывков.
 * «refPush» повторяет динамику референса: плавный наезд, затем медленное «дыхание».
 */
export const KenBurns: React.FC<Props> = ({src, preset, frames}) => {
  const frame = useCurrentFrame();
  const p = clamp01(frame / Math.max(1, frames - 1));
  const e = Easing.inOut(Easing.cubic)(p);
  const lin = Easing.inOut(Easing.sin)(p);

  let s = 1.06;
  let x = 0;
  let y = 0;
  switch (preset) {
    case 'zoomIn':
      s = interpolate(lin, [0, 1], [1.02, 1.14]);
      x = interpolate(lin, [0, 1], [-0.8, 0.8]);
      break;
    case 'zoomOut':
      s = interpolate(lin, [0, 1], [1.14, 1.03]);
      x = interpolate(lin, [0, 1], [0.8, -0.8]);
      break;
    case 'panRight':
      s = 1.12;
      x = interpolate(e, [0, 1], [-3.6, 3.6]);
      break;
    case 'panLeft':
      s = 1.12;
      x = interpolate(e, [0, 1], [3.6, -3.6]);
      break;
    case 'driftUp':
      s = 1.12;
      y = interpolate(e, [0, 1], [3.2, -3.2]);
      break;
    case 'driftDown':
      s = 1.12;
      y = interpolate(e, [0, 1], [-3.2, 3.2]);
      break;
    case 'refPush': {
      // фаза 1: плавный наезд за ~45% времени, фаза 2: медленное доползание
      const a = clamp01(p / 0.45);
      const b = clamp01((p - 0.45) / 0.55);
      s = 1.0 + 0.1 * Easing.inOut(Easing.cubic)(a) + 0.035 * b;
      x = -1.8 * Easing.inOut(Easing.cubic)(a) - 0.6 * b;
      y = 0.9 * Easing.inOut(Easing.cubic)(a);
      break;
    }
  }

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#14100c'}}>
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${x}%, ${y}%) scale(${s})`,
          transformOrigin: 'center center',
        }}
      />
    </AbsoluteFill>
  );
};
