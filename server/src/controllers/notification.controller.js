import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import NotificationService from "../services/notification.service.js";

const getMyNotifications = asyncHandler(async (req, res) => {

  const data = await NotificationService.getUserNotifications(
    req.user._id,
    req.user.role,
    {
      page: req.query.page,
      limit: req.query.limit,
      onlyUnread: req.query.onlyUnread === "true"
    }
  );

  return res.status(200).json(
    new ApiResponse(200, data, "Notifications fetched")
  );
});

const markNotificationRead = asyncHandler(async (req, res) => {

  const notif = await NotificationService.markAsRead(
    req.user._id,
    req.params.id
  );

  return res.status(200).json(
    new ApiResponse(200, notif, "Notification marked as read")
  );
});

const markAllNotificationsRead = asyncHandler(async (req, res) => {

  const count = await NotificationService.markAllAsRead(
    req.user._id,
    req.user.role
  );

  return res.status(200).json(
    new ApiResponse(200, { modifiedCount: count }, "All notifications marked as read")
  );
});

export {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead
};