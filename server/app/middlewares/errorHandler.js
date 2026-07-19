function errorHandler(err, req, res, next) {
  console.error('HTTP request failed', {
    method: req.method,
    path: req.path,
    error: err,
  });

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.isOperational && err.statusCode
    ? err.statusCode
    : 500;
  const message = err.isOperational
    ? err.message
    : 'Internal server error';

  return res.status(statusCode).json({ message });
}

module.exports = errorHandler;
