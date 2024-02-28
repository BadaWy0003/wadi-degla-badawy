const jwt = require('jsonwebtoken');

const AUTH_TOKEN_EXPIRY = '7d';

const generateSignedUserToken = async (id, userType) => {
  const jwtSignedUserToken = jwt.sign({ id, userType }, process.env.SECRET_KEY, {
    expiresIn: AUTH_TOKEN_EXPIRY,
  });
  return jwtSignedUserToken;
};

module.exports = generateSignedUserToken;
