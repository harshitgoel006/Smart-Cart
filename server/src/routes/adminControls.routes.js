import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";
import { broadcastNotification, getCouponAnalytics, getSellerPerformance, updateAdminPermissions } from "../controllers/adminControls.controller.js";

const router = Router();
router.use(verifyJWT, authorizedRole("admin"));
router.get("/seller-performance", getSellerPerformance);
router.get("/coupon-analytics", getCouponAnalytics);
router.post("/broadcast", broadcastNotification);
router.patch("/permissions/:userId", updateAdminPermissions);
export default router;
