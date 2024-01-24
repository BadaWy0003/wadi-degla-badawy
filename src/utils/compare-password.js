const bcrypt = require("bcryptjs");

const comparePassword = async (password, passwordDB) => {
  return bcrypt.compare(password, passwordDB);
};

module.exports = comparePassword;
