import { Router } from "express";
import { getAdminOverview } from "../controllers/adminAnalytics.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();
router.get("/overview", verifyJWT, authorizedRole("admin"), getAdminOverview);
export default router;
