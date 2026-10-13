import React from 'react';
import {Composition} from 'remotion';
import {Film, T, totalFrames} from './Film';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="Film"
      component={Film}
      durationInFrames={totalFrames}
      fps={T.fps}
      width={T.width}
      height={T.height}
    />
  );
};
