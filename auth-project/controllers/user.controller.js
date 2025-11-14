const UserModel = require("../models/user.model");
const { hashPassword, verifyPassword, signToken } = require("../utils/auth");

async function registerController(req, res, next) {
  try {
    const { fullname, email, password } = req.body;
    const user = await UserModel.create({ fullname, email, password: hashPassword(password) });
    const payload = { id: user._id, email: user.email };
    const token = signToken(payload);

    res.send({
      token,
      message: "user created successfully",
    });
  } catch (error) {
    next(error);
  }
}
async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email });
    if (!user) {
      throw {
        status: 404,
        message: "user not found",
      };
    }
    if (verifyPassword(password, user.password)) {
      const payload = { id: user._id, email: user.email };
      const token = signToken(payload);
      res.send({
        token,
        message: "login successfully",
      });
    } else {
      throw {
        status: 400,
        message: "email or password is incorrect",
      };
    }
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
};
