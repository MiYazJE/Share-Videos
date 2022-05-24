const bcrypt = require('bcryptjs');

async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function comparePassword(encrypted, compare) {
  return bcrypt.compare(encrypted, compare);
}

module.exports = {
  encryptPassword,
  comparePassword,
};
