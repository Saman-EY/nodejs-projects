const { genSaltSync, hashSync, compareSync } = require("bcrypt");

function hashPassword(password) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

function verifyPassword(password, hashed) {
  const result = compareSync(password, hashed);
  return result;
}

module.exports = {
  hashPassword,
  verifyPassword,
};
