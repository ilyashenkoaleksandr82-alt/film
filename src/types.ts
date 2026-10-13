export type CameraPreset = 'zoomIn' | 'zoomOut' | 'panLeft' | 'panRight' | 'driftUp' | 'driftDown' | 'refPush';

export type CounterOverlay = {
  type: 'counter';
  to?: number;
  text?: string; // готовая строка вместо счёта, например «3–4 %»
  prefix?: string;
  suffix?: string;
  decimals?: number;
  sep?: boolean; // неразрывные пробелы в тысячах
  label?: string;
};
export type KeyPhraseOverlay = {type: 'keyphrase'; phrases: string[]};
export type PlaquesOverlay = {type: 'plaques'; items: string[]; redFirst?: boolean};
export type Overlay = CounterOverlay | KeyPhraseOverlay | PlaquesOverlay;

export type SceneData = {
  id: number;
  name: string;
  orig: number;
  start: number; // секунды от начала озвучки
  end: number;
  text: string;
  image: string;
  camera?: CameraPreset;
  clip?: string;
  clipSeconds?: number;
  article?: boolean;
  overlays?: Overlay[];
};

export type OutroCard = {icon: 'phone' | 'clock' | 'grid' | 'rings' | 'dollar'; text: string};

export type Timeline = {
  fps: number;
  width: number;
  height: number;
  audio: string;
  audioSeconds: number;
  hookCounterSrt: string;
  dissolveFrames: number;
  grain: boolean;
  outro: {seconds: number; title: string; cards: OutroCard[]};
  scenes: SceneData[];
};
