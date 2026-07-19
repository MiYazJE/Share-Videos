class AppError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = options.isOperational ?? true;
    this.cause = options.cause;
    Error.captureStackTrace?.(this, this.constructor);
  }
}

class UpstreamServiceError extends AppError {
  constructor(message, options = {}) {
    super(message, 502, options);
  }
}

module.exports = {
  AppError,
  UpstreamServiceError,
};
