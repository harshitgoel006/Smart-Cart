import "dotenv/config";
import mongoose from "mongoose";
import { Coupon } from "../../models/coupon.model.js";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is required");

await mongoose.connect(uri);
await Coupon.findOneAndUpdate(
  { code: "SMART10" },
  {
    code: "SMART10",
    description: "10% off your SmartCart order",
    discountType: "percent",
    discountValue: 10,
    maxDiscount: 500,
    minOrderValue: 999,
    usageLimitPerUser: 3,
    totalUsageLimit: 10000,
    isActive: true,
    startDate: new Date(),
    expiryDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
  },
  { upsert: true, new: true, setDefaultsOnInsert: true },
);
console.log("Seeded coupon SMART10");
await mongoose.disconnect();
