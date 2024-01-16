const joi = require("joi");
const joiPasswordExtendCore = require("joi-password");

const joiPassword = joi.extend(joiPasswordExtendCore);
const passwordSchema = joiPassword
  .string()
  .min(8)
  .max(16)
  .minOfSpecialCharacters(1)
  .minOfLowercase(1)
  .minOfUppercase(1)
  .required();

export const registerCustomerReqSchema = {
  body: joi
    .object()
    .keys({
      username: joi.string().min(4).max(20).required(),
      email: joi.string().email().required(),
      password: passwordSchema,
    })
    .required(),
};

export const loginCustomerReqSchema = {
  body: joi
    .object()
    .keys({
      email: joi.string().email(),
      password: passwordSchema,
    })
    .required(),
};

module.exports = {
  registerCustomerReqSchema,
  loginCustomerReqSchema,
};
