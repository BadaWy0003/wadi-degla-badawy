const Joi = require("joi");


const quotationReqSchema = {
    body: Joi.object()
        .keys({

            customerName: Joi.String().required(),
            customerAddress: Joi.String().required(),
            customerPhone: Joi.String().required(),
            customerEmail: Joi.String().required(),

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
