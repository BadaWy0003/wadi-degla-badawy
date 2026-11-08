// Builds client-next/public/logo-512.png: the colour logo centred on a white 512x512 square.
// Google needs a raster logo (PNG/JPG, at least 112x112) for the Organization data in
// client-next/src/components/RootHtml.js; it doesn't accept SVG. Run again if the logo changes:
//   cd tools && node make-logo-png.js
const path = require('path');
const sharp = require('sharp');

const SRC = path.join(__dirname, '../client-next/public/Assets/Logo-Identity/wadi-degla-logo-color.svg');
const OUT = path.join(__dirname, '../client-next/public/logo-512.png');
const SIZE = 512;
const PAD = 48; // white margin around the logo

(async () => {
  const inner = SIZE - PAD * 2;
  const logo = await sharp(SRC, { density: 600 })
    .resize(inner, inner, { fit: 'inside' })
    .png()
    .toBuffer();
  await sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: '#ffffff' },
  })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9, palette: true })
    .toFile(OUT);
  const meta = await sharp(OUT).metadata();
  console.log(`${path.relative(process.cwd(), OUT)}: ${meta.width}x${meta.height}, ${meta.format}`);
})();
