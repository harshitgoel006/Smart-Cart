import multer from "multer";
import { ApiError } from "../utils/ApiError.js";

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {

    if (err.code === "LIMIT_FILE_COUNT") {
      return next(new ApiError(400, "Maximum 5 images allowed"));
    }

    if (err.code === "LIMIT_FILE_SIZE") {
      return next(new ApiError(400, "File size exceeds 5MB limit"));
    }

    return next(new ApiError(400, err.message));
  }

  next(err);
};