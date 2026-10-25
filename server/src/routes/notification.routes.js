import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getSellerAlerts,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== NOTIFICATION HANDLERS ===============
// ======================================================

router.route("/my-notifications").get(verifyJWT, getMyNotifications);
router.route("/seller/alerts").get(verifyJWT, authorizedRole("seller"), getSellerAlerts);

router
  .route("/mark-notification-read/:id")
  .patch(verifyJWT, markNotificationRead);

router
  .route("/mark-all-notifications-read")
  .patch(verifyJWT, markAllNotificationsRead);

export default router;
