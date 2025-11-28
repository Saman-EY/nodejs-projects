const createHttpError = require("http-errors");
const AuthorizationMessage = require("../messages/auth.message");
const jwt = require("jsonwebtoken");
const userModel = require("../../modules/user/user.model");
require("dotenv").config();

async function AuthorizationGuard(req, res, next) {
  try {
    const token = req?.cookie?.access_token;

    if (!token) throw new createHttpError.Unauthorized(AuthorizationMessage.login);
    const data = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (typeof data === "object" && "id" in data) {
      //   const user = await userModel.findById(data.id, { accesssToken: 0 }).lean();
      const user = await userModel.findById(data.id).lean();
      if (!user) throw new createHttpError.Unauthorized(AuthorizationMessage.notFound);
      req.user = user;
      return next();
    }
    throw new createHttpError.Unauthorized(AuthorizationMessage.invalidToken);
  } catch (error) {
    next(error);
  }
}

module.exports = AuthorizationGuard;
