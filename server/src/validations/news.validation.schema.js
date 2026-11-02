const Joi = require('joi');

// News article fields: the same as the articles that used to live in
// client-next/src/components/News/newsList.js, with English + Arabic text.
// English is required; Arabic is optional (the Arabic site falls back to English).
// Text is plain: paragraphs are separated by an empty line, as before.

const bilingual = (maxLength, { required }) =>
  Joi.object({
    en: required ? Joi.string().trim().min(2).max(maxLength).required() : Joi.string().trim().allow('').max(maxLength),
    ar: Joi.string().trim().allow('').max(maxLength),
  });

// Photo links are checked again in the service (own Storage bucket or the website's
// existing /Assets/Media/ photos only).
const photoLink = Joi.string().trim().max(500);

const articleFields = {
  title: bilingual(200, { required: true }).required(),
  content: bilingual(20000, { required: true }).required(),
  excerpt: bilingual(300, { required: false }),
  year: Joi.number().integer().min(2000).max(2100).required(),
  month: Joi.number().integer().min(1).max(12).required(),
  author: Joi.string().trim().allow('').max(60),
  thumbnail: photoLink.allow(''),
  images: Joi.array()
    .items(Joi.object({ src: photoLink.required(), alt: Joi.string().trim().allow('').max(200) }))
    .max(40),
  pinned: Joi.boolean(),
};

const createNewsReqSchema = {
  body: Joi.object({
    ...articleFields,
    // Optional custom web address; made from the English title when empty.
    slug: Joi.string()
      .trim()
      .lowercase()
      .pattern(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      .max(100)
      .allow(''),
  }).required(),
};

// The web address (slug) can't be changed after creation, so links to the article keep working.
const updateNewsReqSchema = { body: Joi.object(articleFields).required() };

const flagReqSchema = (name) => ({ body: Joi.object({ [name]: Joi.boolean().required() }).required() });

module.exports = {
  createNewsReqSchema,
  updateNewsReqSchema,
  hiddenReqSchema: flagReqSchema('hidden'),
  pinnedReqSchema: flagReqSchema('pinned'),
};
