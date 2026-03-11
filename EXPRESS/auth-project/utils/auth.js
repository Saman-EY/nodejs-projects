const { genSaltSync, hashSync, compareSync } = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET = "b630f9621bde81ac95d0a314d437a234916c4c77";

function hashPassword(password) {
  const salt = genSaltSync(10);
  const hash = hashSync(password, salt);
  return hash;
}

function verifyPassword(password, hashed) {
  const result = compareSync(password, hashed);
  return result;
}

function signToken(payload) {
  return jwt.sign(payload, SECRET);
}
function verifyToken(token) {
  return jwt.verify(token, SECRET);
}

module.exports = {
  hashPassword,
  verifyPassword,
  signToken,
  verifyToken,
};
