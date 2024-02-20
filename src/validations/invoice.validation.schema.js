const Joi = require('joi');

const quotationReqSchema = {
  body: Joi.object()
    .keys({
      customerAddress: Joi.string().required(),
      customerPhone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
      customerEmail: Joi.string().email().required(),
    })
    .required(),
};

const priceOfferReqSchema = {
  body: Joi.object({
    invoiceId: Joi.number().integer().required(),
    itemUpdates: Joi.array()
      .items(
        Joi.object({
          itemId: Joi.number().integer().required(),
          newPrice: Joi.number().precision(2).required(),
        }),
      )
      .required(),
  }).required(),
};

module.exports = {
  quotationReqSchema,
  priceOfferReqSchema,
};
