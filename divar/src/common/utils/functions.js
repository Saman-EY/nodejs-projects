const isTrue = (value) => [true, 1, "true"].includes(value);
const isFalse = (value) => [false, 0, "false"].includes(value);

const removePropertyInObject = (object = {}, properties = []) => {
  for (const element of properties) {
    delete object[element];
  }

  return object;
};

module.exports = {
  isTrue,
  isFalse,
  removePropertyInObject,
};
