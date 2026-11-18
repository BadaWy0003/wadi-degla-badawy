// Each piece's picture: the website's own (StoneCreationData.js), with the client's changes from
// the admin panel (Website → Stone creations → Photos: photo_<piece>) on top. `ownImage` keeps the
// original file, whose name holds the mosaic size ("…-5x5-cm"). Not a client component
// (content-defaults.json reads the defaults).
import { architectureData, mosaicsData } from './StoneCreationData';
import { sitePhoto } from '../../util/site-content';

// "stoneCreation.items.crown" -> "photo_crown"
export const pieceField = (item) => `photo_${item.titleKey.split('.').pop()}`;

const withSaved = (list) =>
  list.map((item) => ({
    ...item,
    ownImage: item.image,
    image: sitePhoto('stoneCreations', pieceField(item), item.image),
  }));

export const ARCHITECTURE = withSaved(architectureData);
export const MOSAICS = withSaved(mosaicsData);

export const STONE_CREATION_PHOTOS_DEFAULTS = Object.fromEntries(
  [...architectureData, ...mosaicsData].map((item) => [pieceField(item), item.image]),
);
