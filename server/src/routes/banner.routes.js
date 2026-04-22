import express from "express";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getAllBannersAdmin,
} from "../controllers/banner.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = express.Router();

router.get("/", getBanners);

router.post("/", verifyJWT, authorizedRole("admin"), createBanner);
router.put("/:bannerId", verifyJWT, authorizedRole("admin"), updateBanner);
router.delete("/:bannerId", verifyJWT, authorizedRole("admin"), deleteBanner);
router.get(
  "/admin/all",
  verifyJWT,
  authorizedRole("admin"),
  getAllBannersAdmin,
);

export default router;
