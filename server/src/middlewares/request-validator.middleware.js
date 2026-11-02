const _ = require('lodash');

const validate = (schema) => {
  const isValid = async (req, res, next) => {
    try {
      const options = {
        abortEarly: true,
        allowUnknown: false,
        stripUnknown: false,
      };

      if (schema && !_.isEmpty(schema)) {
        const keys = ['headers', 'params', 'query', 'files', 'body'];
        const validationPromises = keys.map((key) => {
          const schemaObject = schema[key];
          const value = req[key];

          return schemaObject ? schemaObject.validateAsync(value, options) : Promise.resolve();
        });

        await Promise.all(validationPromises);
        return next();
      }
      return next();
    } catch (err) {
      const message = err.details[0].message.replace(/['"]/g, '');
      return res.status(400).json({
        error: message,
        message, // the admin panel shows `message` in its error toast
      });
    }
  };
  return isValid;
};

module.exports = validate;
