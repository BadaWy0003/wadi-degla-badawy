const Joi = require("joi");


const quotationReqSchema = {
    body: Joi.object()
        .keys({

            customerAddress: Joi.string().required(),
            customerPhone: Joi.string().pattern(/^[0-9]{10}$/).required(),
            customerEmail: Joi.string().email().required(),

        })
        .required(),
};

let Offer = () => { return { items: [], prices: [] } };

const priceOfferReqSchema = {
    body: Joi.object()
        .keys({

            //Dont know the actual keys, These are only suggestions.
            Offer: Joi.Offer().required()

        })
        .required(),
};

module.exports = {
    quotationReqSchema,
    priceOfferReqSchema,
};
