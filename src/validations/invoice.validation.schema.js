const Joi = require("joi");


const quotationReqSchema = {
  body: Joi.object()
    .keys({
      

    })
    .required(),
};

const priceOfferReqSchema = {
  body: Joi.object()
    .keys({
    

    })
    .required(),
};

module.exports = {
  quotationReqSchema,
  priceOfferReqSchema,
};
