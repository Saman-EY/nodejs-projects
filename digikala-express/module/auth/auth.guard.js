const createHttpError = require("http-errors");
const { User } = require("../user/user.model");
const jwt = require("jsonwebtoken");

async function AuthGuard(req, res, next) {
  try {
    const authHeader = req.headers?.authorization ?? undefined;
    if (!authHeader) throw createHttpError(401, "login to your account!");
    const [bearer, token] = authHeader?.split(" ");
    
    const verifiedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (verifiedToken?.userId) {
      const user = await User.findByPk(verifiedToken.userId);
      if (!user) throw createHttpError(401, "login to your account!");

      req.user = {
        id: user.id,
        mobile: user.mobile,
        fullname: user.fullname,
      };

      return next();
    }
    throw createHttpError(401, "login to your account!");
  } catch (error) {
    next(error);
  }
}

module.exports = {
  AuthGuard,
};
