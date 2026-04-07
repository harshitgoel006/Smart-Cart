// This module defines the asyncHandler function, which is a higher-order function that wraps asynchronous request handlers in Express.js. It ensures that any errors thrown within the asynchronous handler are properly caught and passed to the next middleware (usually an error-handling middleware) for centralized error handling. This helps to avoid unhandled promise rejections and keeps the code cleaner by eliminating the need for try-catch blocks in each route handler.

// The asyncHandler function takes a request handler as an argument and returns a new function that executes the request handler and catches any errors that occur during its execution. If an error is caught, it is passed to the next middleware using the next() function, allowing for consistent error handling across the application.
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
