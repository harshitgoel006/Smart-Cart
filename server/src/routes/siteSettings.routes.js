import { Router } from "express";
import { getPublicSiteSettings, getAdminSiteSettings, updateAdminSiteSettings } from "../controllers/siteSettings.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();
router.get("/", getPublicSiteSettings);
router.get("/admin", verifyJWT, authorizedRole("admin"), getAdminSiteSettings);
router.patch("/admin", verifyJWT, authorizedRole("admin"), updateAdminSiteSettings);
export default router;
