import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile} from 'remotion';
import timeline from './timeline.json';
import type {Timeline} from './types';
import {Scene} from './components/Scene';
import {HookCounter} from './components/HookCounter';
import {Outro} from './components/Outro';
import {Grain} from './components/Grain';

export const T = timeline as unknown as Timeline;
const audioFrames = Math.ceil(T.audioSeconds * T.fps);
const outroFrames = Math.round(T.outro.seconds * T.fps);
export const totalFrames = audioFrames + outroFrames;

export const Film: React.FC = () => {
  const dis = T.dissolveFrames;
  return (
    <AbsoluteFill style={{backgroundColor: '#14100c'}}>
      {T.scenes.map((s, i) => {
        const from = Math.round(s.start * T.fps);
        const last = i === T.scenes.length - 1;
        const next = last ? audioFrames : Math.round(T.scenes[i + 1].start * T.fps);
        const sceneFrames = Math.max(1, next - from);
        // сцена чуть «залезает» на следующую, чтобы было короткое растворение
        const dur = sceneFrames + (last ? 0 : dis);
        return (
          <Sequence key={s.id} from={from} durationInFrames={dur} name={s.name}>
            <Scene scene={s} fadeIn={i === 0 ? 0 : dis} sceneFrames={sceneFrames} />
          </Sequence>
        );
      })}
      <Sequence from={0} durationInFrames={Math.round(4.2 * T.fps)} name="hook-counter">
        <HookCounter srt={T.hookCounterSrt} />
      </Sequence>
      <Sequence from={audioFrames} durationInFrames={outroFrames} name="outro">
        <Outro title={T.outro.title} cards={T.outro.cards} />
      </Sequence>
      {T.grain ? <Grain /> : null}
      <Audio src={staticFile(T.audio)} />
    </AbsoluteFill>
  );
};
