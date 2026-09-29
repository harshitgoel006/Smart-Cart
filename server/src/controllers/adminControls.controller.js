import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { Coupon } from "../models/coupon.model.js";
import { Notification } from "../models/notification.model.js";
import { adminAnalyticsService } from "../services/adminAnalytics.service.js";

export const getSellerPerformance = asyncHandler(async (req, res) => {
  const data = await adminAnalyticsService.sellerPerformance(req.query);
  res.status(200).json(new ApiResponse(200, data, "Seller performance fetched"));
});

export const getCouponAnalytics = asyncHandler(async (_req, res) => {
  const data = await Coupon.find({}).select("code usageCount totalUsageLimit discountType discountValue isActive expiryDate").sort({ usageCount: -1 }).lean();
  res.status(200).json(new ApiResponse(200, { coupons: data, totalUses: data.reduce((sum, item) => sum + (item.usageCount || 0), 0) }, "Coupon analytics fetched"));
});

export const broadcastNotification = asyncHandler(async (req, res) => {
  const { title, message, role = "customer", category = "system", priority = "medium" } = req.body;
  if (!title || !message) throw new ApiError(400, "Title and message are required");
  if (!["customer", "seller", "admin"].includes(role)) throw new ApiError(400, "Invalid recipient role");
  const recipients = await User.find({ role, isActive: true, isDeleted: false }).select("_id").lean();
  if (!recipients.length) throw new ApiError(404, "No active recipients found");
  await Notification.insertMany(recipients.map((recipient) => ({ recipient: recipient._id, recipientRole: role, category, event: "ADMIN_BROADCAST", title, message, priority })));
  res.status(201).json(new ApiResponse(201, { sent: recipients.length }, "Broadcast sent"));
});

export const updateAdminPermissions = asyncHandler(async (req, res) => {
  const { permissions } = req.body;
  if (!Array.isArray(permissions)) throw new ApiError(400, "Permissions must be an array");
  const allowedPermissions = new Set(["manage_catalog", "manage_orders", "manage_customers", "manage_content", "manage_settings", "manage_broadcasts"]);
  if (permissions.some((permission) => !allowedPermissions.has(permission))) throw new ApiError(400, "Invalid permission selected");
  const user = await User.findById(req.params.userId).select("fullname email role permissions");
  if (!user) throw new ApiError(404, "Admin user not found");
  if (user.role !== "admin") throw new ApiError(400, "Permissions can only be assigned to admin users");
  user.permissions = permissions;
  await user.save();
  res.status(200).json(new ApiResponse(200, user, "Admin permissions updated"));
});
