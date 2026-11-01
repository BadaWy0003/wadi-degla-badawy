// Stone finishes as stored in Firestore (entered in the admin panel, in English)
// -> translation keys. Unknown/new finishes are shown as entered.
export const FINISH_KEYS = {
  Polished: 'finishes.polished',
  Honed: 'finishes.honed',
  Antique: 'finishes.antique',
  Brushed: 'finishes.brushed',
  Flamed: 'finishes.flamed',
  'Bush Hammered': 'finishes.bushHammered',
  Leather: 'finishes.leather',
  Rough: 'finishes.rough',
  'Sand blasted': 'finishes.sandblasted',
  'Split Face': 'finishes.splitFace',
};

export const finishLabel = (t, name) => (FINISH_KEYS[name] ? t(FINISH_KEYS[name]) : name);
