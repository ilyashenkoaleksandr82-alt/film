// Рендер ролика и наложение LUT одним запуском: node scripts/render.mjs
import {execSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';

mkdirSync('out', {recursive: true});
const run = (cmd) => {
  console.log('>', cmd);
  execSync(cmd, {stdio: 'inherit'});
};

// 1) рендер Remotion (без цветокоррекции)
run('npx remotion render src/index.ts Film out/raw.mp4 --codec=h264 --crf=16');
// 2) LUT (.cube) накладывается ffmpeg: нужен установленный ffmpeg
run(
  'ffmpeg -y -i out/raw.mp4 -vf "lut3d=public/grade/Doc_70s_Warm_Faded.cube" ' +
    '-c:v libx264 -crf 16 -pix_fmt yuv420p -c:a copy out/final_graded.mp4',
);
console.log('Готово: out/final_graded.mp4');
