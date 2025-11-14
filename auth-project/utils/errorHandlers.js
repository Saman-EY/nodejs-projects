const NotFoundError = (req, res, next) => {
  return res.status(404).json({
    status: 404,
    message: "not found route: " + req.url,
  });
};

const ErrorHandler = (err, req, res, next) => {
  console.log(JSON.stringify(err, null, 4));
  const status = err.status ?? err.statusCode ?? 500;

  return res.status(status).json({
    status,
    message: err?.message ?? "internal server error",
    errors: err.errors ?? null,
  });
};

module.exports = {
  NotFoundError,
  ErrorHandler,
};
