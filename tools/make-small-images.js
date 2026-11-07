#!/usr/bin/env node
/**
 * make-small-images.js
 *
 * Makes the "-sm.webp" copies (800 px wide, WebP quality 70) of the site photos in
 * client-next/public/Assets/Media/{Quarries,Projects}. Cards and sliders load them through
 * srcset (client-next/src/util/responsive-img.js), so phones and small cards don't download
 * the 1600 px originals. Run it after adding photos to those folders (inside tools/):
 *
 *   node make-small-images.js
 *
 * Every photo gets a copy (narrower originals are only re-encoded), because the helper assumes
 * that each .webp in those folders has one. Existing "-sm" copies are kept.
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../client-next/public/Assets/Media');
const FOLDERS = ['Quarries', 'Projects'];
const WIDTH = 800;

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    return p.endsWith('.webp') && !p.endsWith('-sm.webp') ? [p] : [];
  });
}

(async () => {
  let made = 0;
  let saved = 0;
  for (const folder of FOLDERS) {
    for (const file of walk(path.join(ROOT, folder))) {
      const out = file.replace(/\.webp$/, '-sm.webp');
      if (fs.existsSync(out)) continue;
      const info = await sharp(file)
        .resize({ width: WIDTH, withoutEnlargement: true })
        .webp({ quality: 70 })
        .toFile(out);
      made += 1;
      saved += fs.statSync(file).size - info.size;
    }
  }
  console.log(`made ${made} small copies (each card saves ${Math.round(saved / Math.max(made, 1) / 1024)} KB on average)`);
})();
