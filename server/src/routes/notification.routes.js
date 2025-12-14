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

// Get notifications for the logged-in user

router.route("/my-notifications")
    .get(
        verifyJWT, 
        getMyNotifications
    );

// Mark a specific notification as read
router.route("/mark-notification-read/:id")
    .patch(
        verifyJWT, 
        markNotificationRead
    );

// Mark all notifications as read
router.route("/mark-all-notifications-read")
    .patch(
        verifyJWT, 
        markAllNotificationsRead
    );


export default router;
