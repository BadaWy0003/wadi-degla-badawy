const bcrypt = require("bcrypt");

const comparePassword = async (password, passwordDB) => {
  return bcrypt.compare(password, passwordDB);
};

module.exports = comparePassword;
