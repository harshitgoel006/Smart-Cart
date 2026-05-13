import { ApiError } from "../utils/ApiError.js";


// This middleware function is designed to handle errors that occur during the processing of requests in an Express application. It checks if the error is an instance of ApiError, and if not, it creates a new ApiError with a status code (defaulting to 500 for internal server errors) and a message. The middleware then constructs a response object containing the success status, error message, and any additional errors. If the application is running in development mode, it also includes the stack trace in the response for debugging purposes. Finally, it sends the response with the appropriate HTTP status code.
const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;

    error = new ApiError(
      statusCode,
      error.message || "Internal Server Error",
      error.errors || [],
      err.stack,
    );
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = error.stack;
  }

  return res.status(error.statusCode).json(response);
};

export { errorHandler };
