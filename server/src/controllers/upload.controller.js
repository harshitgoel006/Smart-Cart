import { uploadSingle } from "../utils/cloudinary.js";

const uploadFile = async (req, res) => {

  if (!req.file?.path) {
    return res.status(400).json({
      message: "No file uploaded"
    });
  }

  try {

    const result = await uploadSingle(req.file.path, {
      folder: "SmartCart/uploads"
    });

    return res.status(200).json({
      message: "File uploaded successfully",
      url: result.url
    });

  } catch (error) {

    return res.status(500).json({
      message: "File upload failed",
      error: error.message
    });
  }
};

export { uploadFile };