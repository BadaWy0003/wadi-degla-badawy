const Joi = require('joi');
const { LANGS, FORMS, USES, TECH } = require('../services/product-details.service');

// Stone details (all optional). Texts are plain; the service trims them and keeps only the
// known forms/uses. Technical values are numbers without units.
const textIn = (max) => Joi.string().trim().allow('').max(max);
const langs = (max, keys) => Joi.object(Object.fromEntries(keys.map((l) => [l, textIn(max)])));

const productDetailsReqSchema = {
  body: Joi.object({
    description: langs(4000, LANGS),
    otherNames: Joi.array().items(Joi.string().trim().max(80)).max(10),
    origin: langs(120, ['en', 'ar']),
    colour: langs(160, ['en', 'ar']),
    forms: Joi.array()
      .items(Joi.string().valid(...FORMS))
      .max(FORMS.length),
    thicknesses: textIn(80),
    sizes: textIn(300),
    uses: Joi.array()
      .items(Joi.string().valid(...USES))
      .max(USES.length),
    tech: Joi.object(Object.fromEntries(TECH.map((k) => [k, Joi.number().min(0).max(100000).allow(null, '')]))),
  }).required(),
};

module.exports = { productDetailsReqSchema };
