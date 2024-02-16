const Joi = require("joi");


const quotationReqSchema = {
    body: Joi.object()
        .keys({

            //Dont know the actual keys, These are only suggestions.
            customerName: Joi.String().required(),
            customerAddress: Joi.String().required(),
            customerPhone: Joi.String().required(),
            customerEmail: Joi.String().required(),

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
