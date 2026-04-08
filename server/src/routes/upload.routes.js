// This file defines the routes for handling file uploads. It uses the Express Router to define a POST route for uploading files. The route uses the multer middleware to handle the file upload and then calls the uploadFile controller function to process the uploaded file. The uploadFile controller uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.

import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// This route handles file uploads. It uses the multer middleware to handle the file upload and then calls the uploadFile controller function to process the uploaded file. The uploadFile controller uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.
router.post("/upload", upload.single("file"), uploadFile);

export default router;
