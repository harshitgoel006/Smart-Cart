import UploadService from "../services/upload.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

// This controller handles file uploads. It uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.
const uploadFile = asyncHandler(async (req, res) => {
  const folder = req.body.folder || "misc";

  const data = await UploadService.uploadFile(req.file, folder);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "File uploaded successfully"));
});

const uploadMultipleFiles = asyncHandler(async (req, res) => {
  const files = req.files;
  const folder = req.body.folder || "misc";

  if (!files || files.length === 0) {
    throw new ApiError(400, "No files uploaded");
  }

  const data = await Promise.all(
    files.map((file) => UploadService.uploadFile(file, folder)),
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Files uploaded successfully"));
});

export { uploadFile, uploadMultipleFiles };
