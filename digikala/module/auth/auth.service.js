const createHttpError = require("http-errors");
const { User, Otp } = require("../user/user.model");

async function sendOtpService(req, res, next) {
  try {
    const { mobile } = req.body;
    let code = Math.floor(Math.random() * 99999 - 10000) + 10000;
    let user = await User.findOne({ where: { mobile } });
    let otp = null;

    if (!user) {
      user = await User.create({
        mobile,
      });
      otp = await Otp.create({
        code,
        expires_in: new Date(Date.now() + 1000 * 60), // set 1 min
        userId: user.id,
      });

      return res.json({
        message: "otp send successfuly",
        code,
      });
    } else {
      otp = await Otp.findOne({ where: { userId: user?.id } });
      otp.code = code;
      otp.expires_in = new Date(Date.now() + 1000 * 60);
      await otp.save();
      return res.json({
        message: "otp send successfuly",
        code,
      });
    }
  } catch (error) {
    next(error);
  }
}
async function checkOtpService(req, res, next) {
  try {
    const { mobile, code } = req.body;

    let user = await User.findOne({
      where: { mobile },
      include: [{ model: Otp, as: "otp" }],
    });

    if (!user) throw createHttpError(401, "user account not found!");
    if (user?.otp?.code !== code) throw createHttpError(401, "otp code is invalid");
    if (user?.otp?.expires_in < new Date()) throw createHttpError(401, "otp code is expired");

    return res.json({
      message: "logged-in successfuly",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  sendOtpService,
  checkOtpService,
};
