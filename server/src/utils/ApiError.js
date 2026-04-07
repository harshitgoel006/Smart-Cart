// This module defines the ApiError class, which extends the built-in Error class to provide a standardized way of handling API errors in the application. The ApiError class includes additional properties such as statusCode, data, errors, and success to provide more context about the error. It also captures the stack trace for better debugging. This class can be used

// throughout the application to throw consistent errors that can be caught and handled by error-handling middleware, ensuring that clients receive structured error responses.
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = "",
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.errors = errors;
    this.message = message;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
