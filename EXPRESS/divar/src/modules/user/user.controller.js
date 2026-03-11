const NodeEnv = require("../../common/constant/env.enum");
const autobind = require("auto-bind");
const { UserMessage } = require("./user.messages");
const CookiesNames = require("../../common/constant/cookie.enum");

class UserController {
  constructor() {
    autobind(this);
    // this.#service = authService;
  }

  async getProfile(req, res, next) {
    try {
      const user = req.user;
      res.json({
        message: UserMessage.success,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
