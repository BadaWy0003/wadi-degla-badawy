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

// Saved stones: product ids from `materials` (the account page and the signup's step 3).
const savedStonesSchema = Joi.array().items(Joi.string().trim().max(64)).max(50).unique();
const phoneSchema = Joi.string().pattern(/^[0-9]{10,15}$/);

const registerCustomerReqSchema = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().trim().min(2).max(60).required(),
      companyName: Joi.string().trim().min(1).max(80).required(),
      rnc: Joi.string().trim().max(40).allow(''),
      email: Joi.string().trim().email().max(120).required(),
      phone: phoneSchema.required(),
      whatsapp: phoneSchema.allow(''),
      country: Joi.string().trim().max(80).required(),
      countryCode: Joi.string().trim().max(4).allow(''),
      address: Joi.string().trim().max(200).allow(''),
      // optional since 2026-11: the signup asks for it in its last, skippable step
      port: Joi.string().trim().max(80).allow(''),
      savedStones: savedStonesSchema,
      password: passwordSchema,
    })
    .required(),
};

// PUT /api/customer/me/edit: every field optional (email, phone and password can't change here)
const updateCustomerReqSchema = {
  body: Joi.object()
    .keys({
      fullName: Joi.string().trim().min(2).max(60),
      companyName: Joi.string().trim().min(1).max(80),
      rnc: Joi.string().trim().max(40).allow(''),
      whatsapp: phoneSchema.allow(''),
      country: Joi.string().trim().max(80),
      countryCode: Joi.string().trim().max(4).allow(''),
      address: Joi.string().trim().max(200).allow(''),
      port: Joi.string().trim().max(80).allow(''),
      savedStones: savedStonesSchema,
    })
    .min(1)
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
  updateCustomerReqSchema,
};
