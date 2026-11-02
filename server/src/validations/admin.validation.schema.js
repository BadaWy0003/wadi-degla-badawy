const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');

// Same password rules as the login form (customer.validation.schema.js).
const passwordSchema = passwordComplexity({
  min: 8,
  max: 16,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
});

// Roles known to authorize.middleware.js. Anything else would create an account
// that can't open any page.
const ADMIN_ROLES = ['MODERATOR', 'ADMIN', 'SUPER_ADMIN'];

const createAdminReqSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string().trim().min(2).max(40).required(),
      email: Joi.string().email().required(),
      password: passwordSchema.required(),
      role: Joi.string()
        .valid(...ADMIN_ROLES)
        .required(),
    })
    .required(),
};

const updateCurrentAdminReqSchema = {
  body: Joi.object()
    .keys({
      username: Joi.string().trim().min(2).max(40).required(),
    })
    .unknown(true) // the panel sends the whole form; only username is used
    .required(),
};

module.exports = { ADMIN_ROLES, createAdminReqSchema, updateCurrentAdminReqSchema };
