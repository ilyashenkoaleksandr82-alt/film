import React from 'react';
import {AbsoluteFill, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import type {SceneData} from '../types';
import {KenBurns} from './KenBurns';
import {NumberCounter} from './NumberCounter';
import {KeyPhrase} from './KeyPhrase';
import {Plaques} from './Plaques';

type Props = {scene: SceneData; fadeIn: number; sceneFrames: number};

export const Scene: React.FC<Props> = ({scene, fadeIn, sceneFrames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const opacity = fadeIn > 0 ? interpolate(frame, [0, fadeIn], [0, 1], {extrapolateRight: 'clamp'}) : 1;
  const sceneSec = sceneFrames / fps;

  let base: React.ReactNode;
  if (scene.clip) {
    // клип подгоняется под длину сцены скоростью воспроизведения (0.6x ... 1.5x)
    const rate = Math.min(1.5, Math.max(0.6, (scene.clipSeconds ?? sceneSec) / sceneSec));
    base = (
      <AbsoluteFill>
        <OffthreadVideo
          src={staticFile(scene.clip)}
          playbackRate={rate}
          muted
          style={{width: '100%', height: '100%', objectFit: 'cover'}}
        />
      </AbsoluteFill>
    );
  } else {
    base = <KenBurns src={scene.image} preset={scene.camera ?? 'zoomIn'} frames={sceneFrames} />;
  }

  return (
    <AbsoluteFill style={{opacity}}>
      {base}
      {scene.overlays?.map((o, i) => {
        if (o.type === 'counter') return <NumberCounter key={i} spec={o} frames={sceneFrames} />;
        if (o.type === 'keyphrase') return <KeyPhrase key={i} phrases={o.phrases} frames={sceneFrames} />;
        return <Plaques key={i} items={o.items} redFirst={o.redFirst} frames={sceneFrames} />;
      })}
    </AbsoluteFill>
  );
};

// запасной вариант статичной картинки без движения
export const StillImage: React.FC<{src: string}> = ({src}) => (
  <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
);
