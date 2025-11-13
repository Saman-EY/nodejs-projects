const UserModel = require("../models/user.model");
const { hashPassword } = require("../utils/auth");

async function registerController(req, res, next) {
  try {
    const { fullname, email, password } = req.body;
    const user = await UserModel.create({ fullname, email, password: hashPassword(password) });

    res.send(user);
  } catch (error) {
    next(error);
  }
}
async function loginController(req, res, next) {
  try {
    const { fullname, email, password } = req.body;

    res.json({
      fullname,
      email,
      password,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  registerController,
  loginController,
};
