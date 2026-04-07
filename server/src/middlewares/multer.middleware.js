import multer from "multer";
import path from "path";
import crypto from "crypto";

// This middleware handles file uploads using multer. It stores uploaded files in a temporary directory and generates unique filenames to avoid conflicts. The file size is limited to 5MB to prevent excessively large uploads.
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/temp");
  },
  filename: (req, file, cb) => {
    const uniqueName =
      crypto.randomBytes(16).toString("hex") + path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});
