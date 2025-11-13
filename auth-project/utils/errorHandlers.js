const NotFoundError = (req, res, next) => {
  return res.status(404).json({
    status: res.statusCode,
    message: "not found route: " + req.url,
  });
};

const ErrorHandler = (req, res) => {
  console.log(JSON.stringify(err, null, 4));
  return res.json({
    status: err.status ?? err.statusCode ?? 500,
    message: err?.message ?? "internal server error",
    errors: err.errors,
  });
};

module.exports = {
  NotFoundError,
  ErrorHandler,
};