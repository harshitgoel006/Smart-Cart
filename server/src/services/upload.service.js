import { uploadSingle } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";

class UploadService {

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
