// This module defines the routes for handling notification-related operations in the e-commerce application. It includes routes for retrieving notifications for the logged-in user, marking individual notifications as read, and marking all notifications as read. The routes are protected with JWT authentication to ensure that only authenticated users can access their notifications. The route handlers are imported from the notification.controller.js file, which contains the logic for processing the requests and interacting with the database to manage notifications, including fetching, updating read status, and other related functionalities.

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

// This route is for fetching the notifications of the logged-in user. It requires the user to be authenticated using the verifyJWT middleware. The controller function `getMyNotifications` will handle the logic for retrieving the user's notifications from the database, applying pagination and filtering based on query parameters such as page, limit, and onlyUnread.
router.route("/my-notifications").get(verifyJWT, getMyNotifications);

// This route is for marking a single notification as read. It requires the user to be authenticated using the verifyJWT middleware. The controller function `markNotificationRead` will handle the logic for updating the read status of a specific notification identified by its ID in the request parameters.
router
  .route("/mark-notification-read/:id")
  .patch(verifyJWT, markNotificationRead);

// This route is for marking all notifications as read. It requires the user to be authenticated using the verifyJWT middleware. The controller function `markAllNotificationsRead` will handle the logic for updating the read status of all notifications for the logged-in user.
router
  .route("/mark-all-notifications-read")
  .patch(verifyJWT, markAllNotificationsRead);

export default router;
