// This file defines the routes for handling file uploads. It uses the Express Router to define a POST route for uploading files. The route uses the multer middleware to handle the file upload and then calls the uploadFile controller function to process the uploaded file. The uploadFile controller uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.

import express from "express";
import {
  uploadFile,
  uploadMultipleFiles,
} from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// This route handles file uploads. It uses the multer middleware to handle the file upload and then calls the uploadFile controller function to process the uploaded file. The uploadFile controller uses the UploadService to upload the file to Cloudinary and returns the URL and public ID of the uploaded file in the response.
router.post("/single", upload.single("file"), uploadFile);
router.post("/multiple", upload.array("files", 10), uploadMultipleFiles);
export default router;
