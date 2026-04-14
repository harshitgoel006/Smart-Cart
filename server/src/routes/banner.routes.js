import express from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
} from "../controllers/banner.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/authorizeRole.middleware.js";

const router = express.Router();

router.get("/", getBanners);

router.post("/", verifyJWT, authorizeRole("admin"), createBanner);
router.put("/:bannerId", verifyJWT, authorizeRole("admin"), updateBanner);
router.delete("/:bannerId", verifyJWT, authorizeRole("admin"), deleteBanner);
router.get("/admin/all", verifyJWT, authorizeRole("admin"), getAllBannersAdmin);

export default router;