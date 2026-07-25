import { Router } from "express";
import {
  uploadFile,
  uploadMultipleFiles,
} from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/single", upload.single("file"), uploadFile);
router.post("/multiple", upload.array("files", 5), uploadMultipleFiles);

export default router;
