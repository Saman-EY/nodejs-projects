const autoBind = require("auto-bind");
const userModel = require("../user/user.model");
const createHttpError = require("http-errors");
const { AuthMessage } = require("./auth.messages");
const { randomInt } = require("crypto");

class AuthService {
  #model;
  constructor() {
    autoBind(this);
    this.#model = userModel;
  }

  async sendOTP(mobile) {
    const now = new Date().getTime();
    const user = await this.#model.findOne({ mobile });
    const otp = {
      code: randomInt(10000, 99999),
      expireAt: now + 1000 * 60 * 2,
    };

    // create new user if its first time
    if (!user) {
      const newUser = await this.#model.create({
        mobile,
        otp,
      });
      return newUser;
    }

    // prevent login spam by expires time of otp
    if (user.otp && user.otp.expireAt > now) {
      throw new createHttpError.BadRequest(AuthMessage.OtpCodeNotExpire);
    }

    user.otp = otp;
    await user.save();
    return user;
  }

  async checkOTP(mobile, code) {
    const user = await this.checkExistByMobile(mobile);
    const now = new Date().getTime();
    if (user?.otp?.expireAt < now) throw new createHttpError.Unauthorized(AuthMessage.OtpCodeExpired);
    if (user?.otp?.code !== code) throw new createHttpError.Unauthorized(AuthMessage.OtpCodeIncorrect);

    if (!user?.verifiedMobile) {
      user.verifiedMobile = true;
      user.save();
    }

    return user;
  }

  // check user by mobile, if its not found return error
  async checkExistByMobile(mobile) {
    const user = await this.#model.findOne({ mobile });
    if (!user) {
      throw new createHttpError.NotFound(AuthMessage.NotFound);
    }

    return user;
  }
}

module.exports = new AuthService();
