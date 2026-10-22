/**
 * 이미지 최적화 — public/images 의 원본 JPG 로 WebP 를 만든다.
 *   npm run images
 *
 * - photo-*.jpg   : 큰 배경 사진. 어두운 오버레이가 덮이므로 품질 55 로도 충분하다.
 * - photo-*-sm.jpg: 모바일·썸네일용 절반 크기
 * - 3d-*.jpg      : 3D 일러스트. 480px 원본 + 화면에 작게 보일 때 쓰는 320px
 * - photo-ceo.jpg : 인물 사진은 품질을 조금 높게
 *
 * 원본 JPG 는 그대로 두고, 같은 이름의 .webp 를 덮어쓴다 (몇 번 실행해도 결과가 같다).
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const dir = path.resolve(import.meta.dirname, '../public/images');
const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

const rules = (name) => {
  if (name.startsWith('3d-')) return [{ suffix: '', width: 480, quality: 78 }, { suffix: '-320', width: 320, quality: 78 }];
  if (name === 'photo-ceo') return [{ suffix: '', quality: 72 }];
  if (name.startsWith('photo-')) return [{ suffix: '', quality: 55 }];
  return [];
};

let before = 0;
let after = 0;
for (const file of (await readdir(dir)).filter((f) => f.endsWith('.jpg')).sort()) {
  const name = file.slice(0, -4);
  const src = path.join(dir, file);
  const srcSize = (await stat(src)).size;
  for (const { suffix, width, quality } of rules(name)) {
    const out = path.join(dir, `${name}${suffix}.webp`);
    let img = sharp(src);
    if (width) img = img.resize({ width, withoutEnlargement: true });
    await img.webp({ quality, effort: 6 }).toFile(out);
    const outSize = (await stat(out)).size;
    if (!suffix) {
      before += srcSize;
      after += outSize;
    }
    console.log(`${file.padEnd(30)} → ${path.basename(out).padEnd(32)} ${kb(srcSize).padStart(6)} → ${kb(outSize)}`);
  }
}
console.log(`\n합계(원본 대비): ${kb(before)} → ${kb(after)}`);
