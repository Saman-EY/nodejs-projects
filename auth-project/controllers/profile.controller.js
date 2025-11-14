async function getProfileController(req, res, next) {
  res.send(req.user);
}

module.exports = {
  getProfileController,
};
