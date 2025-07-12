import { Router } from "express";
import { uploadFile } from "../controllers/upload.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.post("/upload", upload.single("file"),uploadFile);



export { router as uploadRouter };