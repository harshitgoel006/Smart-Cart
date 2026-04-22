// This file defines the UploadService class, which contains a static method for uploading files to Cloudinary. The service checks if the file is provided and has a valid path, then uses the Cloudinary utility to upload the file. If the upload is successful, it returns an object containing the URL and public ID of the uploaded file. If there is an error during the upload process, it throws an ApiError with an appropriate message.
import { uploadSingle } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

// This service handles file uploads. It uses the Cloudinary utility to upload the file and returns the URL and public ID of the uploaded file. If there is an error during the upload process, it throws an ApiError with an appropriate message.
class UploadService {
  // This method uploads a file to Cloudinary. It checks if the file is provided and has a valid path. If the upload is successful, it returns an object containing the URL and public ID of the uploaded file. If there is an error during the upload process, it throws an ApiError with a 500 status code and an appropriate message.
  static async uploadFile(file, folder = "misc") {
    if (!file?.path) {
      throw new ApiError(400, "No file uploaded");
    }
    try {
      const result = await uploadSingle(file.path, {
        folder: `SmartCart/${folder}`,
      });

      return {
        url: result.url,
        public_id: result.public_id,
      };
    } catch (error) {
      throw new ApiError(500, error.message || "File upload failed");
    }
  }
}

export default UploadService;
