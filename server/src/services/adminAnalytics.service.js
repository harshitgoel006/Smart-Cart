import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";

export const adminAnalyticsService = {
  async overview({ days = 7 } = {}) {
    const safeDays = Math.min(31, Math.max(1, Number(days)));
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    from.setDate(from.getDate() - safeDays + 1);
    const [totals, daily, topProducts, customers, sellers] = await Promise.all([
      Order.aggregate([{ $match: { createdAt: { $gte: from }, orderStatus: { $ne: "cancelled" } } }, { $group: { _id: null, revenue: { $sum: "$finalAmount" }, orders: { $sum: 1 } } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: from }, orderStatus: { $ne: "cancelled" } } }, { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$finalAmount" }, orders: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
      Order.aggregate([{ $match: { createdAt: { $gte: from }, orderStatus: { $ne: "cancelled" } } }, { $unwind: "$items" }, { $group: { _id: "$items.productSnapshot.name", units: { $sum: "$items.quantity" }, revenue: { $sum: "$items.lineTotal" } } }, { $sort: { units: -1 } }, { $limit: 5 }]),
      User.countDocuments({ role: "customer", isDeleted: false }),
      User.countDocuments({ role: "seller", isDeleted: false }),
    ]);
    return { periodDays: safeDays, revenue: Number(totals[0]?.revenue || 0), orders: totals[0]?.orders || 0, customers, sellers, daily, topProducts };
  },

  async sellerPerformance({ days = 30, commissionRate = 10 } = {}) {
    const safeDays = Math.min(365, Math.max(1, Number(days)));
    const from = new Date();
    from.setDate(from.getDate() - safeDays);
    const sellers = await Order.aggregate([
      { $match: { createdAt: { $gte: from }, orderStatus: { $nin: ["cancelled", "refunded"] } } },
      { $unwind: "$items" },
      { $group: { _id: "$items.seller", orders: { $addToSet: "$_id" }, units: { $sum: "$items.quantity" }, sales: { $sum: "$items.lineTotal" } } },
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "seller" } },
      { $unwind: { path: "$seller", preserveNullAndEmptyArrays: true } },
      { $project: { sellerId: "$_id", name: "$seller.fullname", email: "$seller.email", orders: { $size: "$orders" }, units: 1, sales: 1, commission: { $multiply: [{ $convert: { input: "$sales", to: "double", onError: 0, onNull: 0 } }, commissionRate / 100] } } },
      { $sort: { sales: -1 } },
    ]);
    return { periodDays: safeDays, commissionRate, sellers };
  },
};
