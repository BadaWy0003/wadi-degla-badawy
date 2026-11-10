// Builds photos from the real stone photos in the admin panel (their main, Polished photo):
// 1. the headers of the four category topic pages: the stones side by side as vertical strips.
//    Each photo is used at about its own size, so the header stays sharp (one stone photo, ~900 px
//    wide, would be blurry stretched over a whole screen). In client-next/public/Assets/Media/Hero/:
//      <name>.webp     2000x720, 5 strips (desktop)
//      <name>-m.webp    800x800, the first 3 strips (phones, see MOBILE_HEROES in hero-images.js)
// 2. the home page's "Choose your stone" cards: one stone each, <tile>.webp 480x640.
// Run again if a stone's photo changes, then use new file names (photos are cached 30 days):
//   cd tools && NODE_USE_ENV_PROXY=1 node make-topic-heroes.js   (NODE_USE_ENV_PROXY: cloud only)
const path = require('path');
const sharp = require('sharp');

const API = 'https://server-withered-wildflower-1595.fly.dev/api/storage/all';
const OUT = path.join(__dirname, '../client-next/public/Assets/Media/Hero');

const HEROES = {
  'egyptian-marble-hero': ['Galala', 'Sunny Dark', 'Emperador', 'Creamy White Pearl', 'Triesta Grey'],
  'egyptian-granite-hero': ['Black Aswan', 'Red Aswan', 'Halayeb', 'Rosa El Nasr', 'Karnak Grey'],
  'imported-marble-hero': [
    'Calacatta Italy',
    'Nero Marquina',
    'Emperador Light',
    'Botticino Classico',
    'Panda White',
  ],
  'imported-granite-hero': [
    'Black Platinum Gold',
    'Kashmir Gold',
    'Baltic Brown',
    'Star Galaxy',
    'Tiger Skin',
  ],
};

// Home page "Choose your stone" cards (owner's choice, 2026-11-10)
const TILES = {
  'stone-tile-egyptian-marble': 'Sunny Dark',
  'stone-tile-egyptian-granite': 'Red Aswan',
  'stone-tile-imported-marble': 'Calacatta Italy',
  'stone-tile-imported-granite': 'Black Platinum Gold',
};

// Photos side by side, each cropped (centre) to a strip of `stripW` x `height`.
async function strips(buffers, stripW, height) {
  const parts = await Promise.all(
    buffers.map((b) => sharp(b).resize(stripW, height, { fit: 'cover' }).toBuffer()),
  );
  return sharp({
    create: { width: stripW * parts.length, height, channels: 3, background: '#000' },
  }).composite(parts.map((input, i) => ({ input, left: i * stripW, top: 0 })));
}

(async () => {
  const { data } = await (await fetch(API)).json();
  const photo = async (stone) => {
    const p = data.find((x) => String(x.name).trim() === stone);
    const finish = p?.finishes?.find((f) => f.finish === 'Polished') || p?.finishes?.[0];
    if (!finish?.link) throw new Error(`No photo for ${stone}`);
    return Buffer.from(await (await fetch(encodeURI(finish.link))).arrayBuffer());
  };

  for (const [name, stones] of Object.entries(HEROES)) {
    const buffers = [];
    for (const stone of stones) buffers.push(await photo(stone));
    await (await strips(buffers, 400, 720))
      .webp({ quality: 66 })
      .toFile(path.join(OUT, `${name}.webp`));
    await (await strips(buffers.slice(0, 3), 267, 800))
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 68 })
      .toFile(path.join(OUT, `${name}-m.webp`));
    console.log(`${name}: ${stones.join(', ')}`);
  }

  for (const [name, stone] of Object.entries(TILES)) {
    await sharp(await photo(stone))
      .resize(480, 640, { fit: 'cover' })
      .webp({ quality: 70 })
      .toFile(path.join(OUT, `${name}.webp`));
    console.log(`${name}: ${stone}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
