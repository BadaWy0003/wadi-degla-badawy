const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

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

const registerUserReqSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string().min(4).max(20).required(),
      email: Joi.string().email().required(),
      password: passwordSchema,
    })
    .required(),
};

const loginUserReqSchema = {
  body: Joi.object()
    .keys({
      email: Joi.string().email().required(),
      password: passwordSchema,
    })
    .required(),
};

module.exports = {
  registerUserReqSchema,
  loginUserReqSchema,
};
