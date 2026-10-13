import React, {useEffect, useState} from 'react';
import {AbsoluteFill, cancelRender, continueRender, delayRender, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';

type Cue = {start: number; end: number; text: string};

const toSec = (s: string): number => {
  const m = s.trim().match(/(\d+):(\d+):(\d+)[,.](\d+)/);
  if (!m) return 0;
  return Number(m[1]) * 3600 + Number(m[2]) * 60 + Number(m[3]) + Number(m[4]) / 1000;
};

const parseSrt = (raw: string): Cue[] =>
  raw
    .replace(/\r/g, '')
    .split(/\n\n+/)
    .map((block) => {
      const lines = block.split('\n').filter(Boolean);
      const timeIdx = lines.findIndex((l) => l.includes('-->'));
      if (timeIdx < 0) return null;
      const [a, b] = lines[timeIdx].split('-->');
      return {start: toSec(a), end: toSec(b), text: lines.slice(timeIdx + 1).join('\n')};
    })
    .filter((c): c is Cue => c !== null);

/** Счётчик из SRT-файла по центру экрана: «$0.0 billion» -> «$7.6 billion». */
export const HookCounter: React.FC<{srt: string}> = ({srt}) => {
  const [cues, setCues] = useState<Cue[] | null>(null);
  const [handle] = useState(() => delayRender('Загрузка SRT-счётчика'));
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  useEffect(() => {
    fetch(staticFile(srt))
      .then((r) => r.text())
      .then((t) => {
        setCues(parseSrt(t));
        continueRender(handle);
      })
      .catch((e) => cancelRender(e));
  }, [handle, srt]);

  const t = frame / fps;
  const cue = cues?.find((c) => t >= c.start && t < c.end);
  const endT = cues && cues.length ? cues[cues.length - 1].end : 4;
  const opacity = interpolate(t, [0, 0.12, endT - 0.2, endT], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  if (!cue) return null;
  return (
    <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', opacity}}>
      <div
        style={{
          font: '800 236px "DejaVu Sans", Arial, "Liberation Sans", Helvetica, sans-serif',
          color: '#F3E9D2',
          fontVariantNumeric: 'tabular-nums',
          textShadow: '0 6px 40px rgba(0,0,0,0.65)',
          whiteSpace: 'nowrap',
        }}
      >
        {cue.text}
      </div>
    </AbsoluteFill>
  );
};
