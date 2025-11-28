const NodeEnv = require("../../common/constant/env.enum");
const { AuthMessage } = require("./auth.messages");
const authService = require("./auth.service");
const autobind = require("auto-bind");

class AuthController {
  #service;
  constructor() {
    autobind(this);
    this.#service = authService;
  }

  async sendOTP(req, res, next) {
    try {
      const { mobile } = req.body;
      const result = await this.#service.sendOTP(mobile);
      return res.json({ message: AuthMessage.SendOtpSuccessfuly, data: result });
    } catch (error) {
      next(error);
    }
  }

  async checkOTP(req, res, next) {
    try {
      const { mobile, code } = req.body;
      const result = await this.#service.checkOTP(mobile, code);
      return res
        .cookie("access_token", result.accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === NodeEnv.Production,
        })
        .status(200)
        .json({ message: AuthMessage.LoginSuccessfully, data: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
