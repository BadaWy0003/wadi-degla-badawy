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
  body: Joi.object()
    .keys({
      Offer: Joi.Offer().required(),
    })
    .required(),
};

module.exports = {
  quotationReqSchema,
  priceOfferReqSchema,
};
