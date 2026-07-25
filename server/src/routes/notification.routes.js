import { Router } from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// ======================================================
// =============== NOTIFICATION HANDLERS ===============
// ======================================================

router.route("/my-notifications").get(verifyJWT, getMyNotifications);

router
  .route("/mark-notification-read/:id")
  .patch(verifyJWT, markNotificationRead);

router
  .route("/mark-all-notifications-read")
  .patch(verifyJWT, markAllNotificationsRead);

export default router;
