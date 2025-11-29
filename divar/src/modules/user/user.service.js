const autoBind = require("auto-bind");
const userModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessage } = require("./user.messages");
const { randomInt } = require("crypto");
const jwt = require("jsonwebtoken");

class UserService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = userModel;
  }
}

module.exports = new UserService();
