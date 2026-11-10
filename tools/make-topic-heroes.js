// Builds the header photos of the topic pages from the real stone photos in the admin panel:
// the stones' main (Polished) photos side by side as vertical strips. Each photo is used at about
// its own size, so the header stays sharp (one stone photo, ~900 px wide, would be blurry
// stretched over a whole screen). Writes, in client-next/public/Assets/Media/Hero/:
//   <name>.webp    2000x720, 5 strips (desktop)
//   <name>-m.webp   800x800, the first 3 strips (phones, see MOBILE_HEROES in hero-images.js)
// Run again if a stone's photo changes, then use new file names (photos are cached 30 days):
//   cd tools && NODE_USE_ENV_PROXY=1 node make-topic-heroes.js   (NODE_USE_ENV_PROXY: cloud only)
const path = require('path');
const sharp = require('sharp');

const API = 'https://server-withered-wildflower-1595.fly.dev/api/storage/all';
const OUT = path.join(__dirname, '../client-next/public/Assets/Media/Hero');

const HEROES = {
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
  for (const [name, stones] of Object.entries(HEROES)) {
    const buffers = [];
    for (const stone of stones) {
      const p = data.find((x) => String(x.name).trim() === stone);
      const finish = p?.finishes?.find((f) => f.finish === 'Polished') || p?.finishes?.[0];
      if (!finish?.link) throw new Error(`No photo for ${stone}`);
      buffers.push(Buffer.from(await (await fetch(encodeURI(finish.link))).arrayBuffer()));
    }
    await (await strips(buffers, 400, 720))
      .webp({ quality: 66 })
      .toFile(path.join(OUT, `${name}.webp`));
    await (await strips(buffers.slice(0, 3), 267, 800))
      .resize(800, 800, { fit: 'cover' })
      .webp({ quality: 68 })
      .toFile(path.join(OUT, `${name}-m.webp`));
    console.log(`${name}: ${stones.join(', ')}`);
  }
})().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
