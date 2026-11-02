const Joi = require('joi');

// Project fields. English name is required; Arabic texts, city and description are
// optional (the Arabic site falls back to English). Photo links and product ids are
// checked again in the service.

const bilingual = (maxLength, { required }) =>
  Joi.object({
    en: required ? Joi.string().trim().min(2).max(maxLength).required() : Joi.string().trim().allow('').max(maxLength),
    ar: Joi.string().trim().allow('').max(maxLength),
  });

const photoLink = Joi.string().trim().max(500);
const firestoreId = Joi.string().trim().max(100);

const projectFields = {
  name: bilingual(150, { required: true }).required(),
  city: bilingual(80, { required: false }),
  description: bilingual(5000, { required: false }),
  countryId: firestoreId.required(),
  thumbnail: photoLink.required(),
  images: Joi.array()
    .items(Joi.object({ src: photoLink.required(), alt: Joi.string().trim().allow('').max(200) }))
    .max(60),
  materials: Joi.array().items(firestoreId).max(40),
};

const createProjectReqSchema = { body: Joi.object(projectFields).required() };

// legacyMaterials: old material names without a product; the panel can only remove them.
const updateProjectReqSchema = {
  body: Joi.object({ ...projectFields, legacyMaterials: Joi.array().items(Joi.string().max(100)).max(40) }).required(),
};

const countryReqSchema = { body: Joi.object({ name: bilingual(60, { required: true }).required() }).required() };

const hiddenReqSchema = { body: Joi.object({ hidden: Joi.boolean().required() }).required() };

const moveReqSchema = { body: Joi.object({ direction: Joi.string().valid('up', 'down').required() }).required() };

module.exports = { createProjectReqSchema, updateProjectReqSchema, countryReqSchema, hiddenReqSchema, moveReqSchema };
