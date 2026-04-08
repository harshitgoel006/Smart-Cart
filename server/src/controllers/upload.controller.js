import UploadService from "../services/upload.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";

// This controller handles file uploads. It uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.
const uploadFile = asyncHandler(async (req, res) => {
  const data = await UploadService.uploadFile(req.file);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "File uploaded successfully"));
});

export { uploadFile };
