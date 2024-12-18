const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

const complexityOptions = {
  min: 8,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};
const passwordSchema = passwordComplexity(complexityOptions);

const registerCustomerReqSchema = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().min(4).max(20).required(),
      companyName: Joi.string().min(1).max(20).required(),
      rnc: Joi.string().allow(''),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .pattern(/^[0-9]{10,15}$/)
        .required(),
      whatsapp: Joi.string()
      .pattern(/^[0-9]{10,15}$/).allow(''),
      country: Joi.string().required(),
      countryCode: Joi.string().allow(''),
      address: Joi.string().allow(''),
      port: Joi.string().required(),
      password: passwordSchema,


    })
    .required(),
};

const loginCustomerReqSchema = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: passwordSchema,
    })
    .required(),
};

module.exports = {
  registerCustomerReqSchema,
  loginCustomerReqSchema,
};
