import { PRODUCT_CATEGORIES } from '../../util/product-types';
import { productSlug } from '../../util/product-slugs';

// The stones the Visualizer can show, made from the product list (at build time in
// app/[lang]/visualizer/page.js, and again in the browser when the list is refreshed): only
// what the page needs, in category order (PRODUCT_CATEGORIES), A-Z inside each category.
// A stone needs an interior room photo (indoorMockup) to be shown.
//
// Room photos (uploaded in the admin panel as the "Indoor Mockup" / "Outdoor Mockup" finishes)
// are 1920 x 810 and hold two scenes side by side: interior = floor (left) + wall (right),
// exterior = tower (left) + façade (right). Granite interior photos are one kitchen worktop
// with dark bars on both sides. The page shows one scene at a time (roomsOf below), so new
// room photos must keep the same layout.

const INSIDE = ['indoorMockup', 'mockup'];
const OUTSIDE = ['outdoorMockup', 'mockupOutdoor'];
const ROOM_FINISHES = [...INSIDE, ...OUTSIDE];

const findFinish = (finishes, names) =>
  names.map((n) => finishes.find((f) => f.finish === n && f.link)).find(Boolean);
const photo = (f) => (f ? { src: f.link, low: f.thumb || null } : null);

export function visualizerStones(products = []) {
  const stones = [];
  for (const type of PRODUCT_CATEGORIES) {
    products
      .filter((p) => p.type === type)
      .sort((a, b) => String(a.name).trim().localeCompare(String(b.name).trim()))
      .forEach((p) => {
        const finishes = p.finishes || [];
        const inside = findFinish(finishes, INSIDE);
        if (!inside) return;
        // the stone's own photo for its sample: Honed, else Polished, else any finish
        const sample =
          findFinish(finishes, ['Honed', 'Polished']) ||
          finishes.find((f) => f.link && !ROOM_FINISHES.includes(f.finish));
        stones.push({
          id: p.id,
          name: String(p.name).trim(),
          type,
          slug: productSlug(p.name),
          swatch: sample ? sample.mini || sample.thumb || sample.link : null,
          finish: sample ? sample.finish : null,
          inside: photo(inside),
          outside: photo(findFinish(finishes, OUTSIDE)),
        });
      });
  }
  return stones;
}

// The scenes ("rooms") of a stone: which photo, and which part of it.
// part: 'left' / 'right' half of a two-scene photo, or 'kitchen' (one scene, dark bars cut off).
// The two Egyptian alabaster stones show a lit panel instead of a floor in the left scene.
const isGranite = (stone) => /granite/i.test(stone.type);
const isBacklit = (stone) => /alabaster|onyx/i.test(stone.name);

export function roomsOf(stone) {
  if (!stone) return [];
  if (isGranite(stone)) return [{ id: 'kitchen', photo: 'inside', part: 'kitchen' }];
  const rooms = [
    { id: isBacklit(stone) ? 'panel' : 'floor', photo: 'inside', part: 'left' },
    { id: 'wall', photo: 'inside', part: 'right' },
  ];
  if (stone.outside) {
    rooms.push(
      { id: 'tower', photo: 'outside', part: 'left' },
      { id: 'facade', photo: 'outside', part: 'right' },
    );
  }
  return rooms;
}

// The room to show for a stone: the one the visitor chose if the stone has it (a lit panel
// stands in for a floor and back), else the stone's first room.
const STAND_IN = { floor: 'panel', panel: 'floor' };
export function roomFor(stone, wanted) {
  const rooms = roomsOf(stone);
  return (
    rooms.find((r) => r.id === wanted) || rooms.find((r) => r.id === STAND_IN[wanted]) || rooms[0]
  );
}

export const hasRoom = (stone, id) => roomsOf(stone).some((r) => r.id === id);

// The stone shown when the page opens (owner's first stone on the products list too).
export const FIRST_STONE = 'Emperador';
export const firstStone = (stones) =>
  stones.find((s) => s.name === FIRST_STONE) || stones[0] || null;
