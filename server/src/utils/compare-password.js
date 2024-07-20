const bcrypt = require('bcrypt');

const comparePassword = async (password, passwordDB) => {
  const isValidPassword = await bcrypt.compare(password, passwordDB);
  return isValidPassword;
};

module.exports = comparePassword;
