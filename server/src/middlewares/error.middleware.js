import { ApiError } from "../utils/ApiError.js";
import multer from "multer";

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (err instanceof multer.MulterError) {
    let message = "File upload error";

    if (err.code === "LIMIT_FILE_SIZE") {
      message = "File size exceeds 5MB limit";
    }

    if (err.code === "LIMIT_FILE_COUNT") {
      message = "Maximum 5 files allowed";
    }

    return res.status(400).json({
      success: false,
      message,
      errors: [],
    });
  }

  if (err.message?.includes("Only JPG, PNG, and WEBP image files are allowed")) {
    return res.status(400).json({
      success: false,
      message: err.message,
      errors: [],
    });
  }

  if (err.name === "ValidationError") {
    const formattedErrors = {};

    for (const key in err.errors) {
      formattedErrors[key] = err.errors[key].message;
    }

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: formattedErrors,
    });
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || "Internal Server Error",
      error.errors || [],
    );
  }

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
    errors: error.errors || [],
  });
};

export { errorHandler };
