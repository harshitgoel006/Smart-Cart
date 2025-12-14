import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Notification } from "../models/notification.model.js";


// Controller to get notifications for the logged-in user

const getMyNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;
  const { page = 1, limit = 20, onlyUnread } = req.query;

  const filter = { recipientId: userId, recipientRole: role };
  if (onlyUnread === "true") filter.isRead = false;

  const p = Number(page);
  const l = Number(limit);

  const [notifications, total] = await Promise.all([
    Notification.find(filter)
      .sort({ createdAt: -1 })
      .skip((p - 1) * l)
      .limit(l),
    Notification.countDocuments(filter),
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        notifications,
        pagination: {
          page: p,
          limit: l,
          total,
          totalPages: Math.ceil(total / l),
        },
      },
      "Notifications fetched"
    )
  );
});



// Controller to mark a specific notification as read

const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { id } = req.params;

  const notif = await Notification.findOne({ _id: id, recipientId: userId });
  if (!notif) throw new ApiError(404, "Notification not found");

  notif.isRead = true;
  notif.readAt = new Date();
  await notif.save();

  return res
    .status(200)
    .json(new ApiResponse(200, notif, "Notification marked as read"));
});



// Controller to mark all notifications as read

const markAllNotificationsRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const role = req.user.role;

  const result = await Notification.updateMany(
    { recipientId: userId, recipientRole: role, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      { modifiedCount: result.modifiedCount },
      "All notifications marked as read"
    )
  );
});


export {
    getMyNotifications,
    markNotificationRead,
    markAllNotificationsRead,
};
