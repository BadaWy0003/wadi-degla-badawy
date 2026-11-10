// Makes transparent copies of the partner and certificate logos for the dark home page: the
// white background (and near-white edge) becomes transparent; the logo itself keeps its colours.
// The home page shows them in one light colour (CSS filter) and in colour on hover.
// Writes client-next/public/Assets/Icons/logos-transparent/<name>.webp (max 320x160).
// The originals are unchanged (the Partners and Certificates pages still use them).
//   cd tools && node make-transparent-logos.js
const path = require('path');
const sharp = require('sharp');

const PUB = path.join(__dirname, '../client-next/public');
const OUT = path.join(PUB, 'Assets/Icons/logos-transparent');
const FILES = [
  'Assets/Icons/partners/otrovato.webp',
  'Assets/Icons/partners/orascom.png',
  'Assets/Icons/partners/emaar.svg',
  'Assets/Icons/partners/egy-consulate-kuwait.jpeg',
  'Assets/Icons/partners/wyndham.webp',
  'Assets/Icons/partners/hydepark.webp',
  'Assets/Icons/partners/majid-alfuttaim.png',
  'Assets/Icons/partners/trade-logistics.webp',
  'Assets/Icons/partners/ckpc.jpeg',
  'Assets/Icons/partners/wd-developments.jpeg',
  'Assets/Icons/partners/mountain-view.png',
  'Assets/Media/Certificates/iaf-logo.webp',
  'Assets/Media/Certificates/uaf-logo.webp',
  'Assets/Media/Certificates/iso-logo.webp',
  'Assets/Media/Certificates/eos-logo.svg',
  'Assets/Media/Certificates/cbmi-logo.webp',
];

(async () => {
  require('fs').mkdirSync(OUT, { recursive: true });
  for (const file of FILES) {
    const { data, info } = await sharp(path.join(PUB, file), { density: 300 })
      .resize(320, 160, { fit: 'inside' })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 4) {
      const m = Math.min(data[i], data[i + 1], data[i + 2]); // how white the pixel is
      if (m > 235) data[i + 3] = 0;
      else if (m > 205) data[i + 3] = Math.round((data[i + 3] * (235 - m)) / 30);
    }
    const name = path.basename(file).replace(/\.\w+$/, '');
    await sharp(data, { raw: info })
      .trim({ threshold: 1 })
      .webp({ quality: 80, alphaQuality: 80 })
      .toFile(path.join(OUT, `${name}.webp`));
    console.log(name);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
