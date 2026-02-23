import {asyncHandler} from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {
  uploadSingle,
  deleteFromCloudinary
} from "../utils/cloudinary.js";
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import {OTP} from "../models/otp.model.js";
import { VerifiedEmail } from "../models/verifiedEmail.model.js";
import cloudinary from "cloudinary";
import{Order} from "../models/order.model.js";
import {Product} from "../models/product.model.js";
import mongoose from "mongoose"
import NotificationService from "../services/notification/notification.service.js";


export const userService = {

async generateAccessAndRefreshToken(userId) {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  const tokenHash = user.hashToken(refreshToken);

  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // match JWT expiry

  user.refreshTokens.push({
    tokenHash,
    expiresAt: expiryDate
  });

  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
},

async sendOtp(email, role) {

  if (!email || !role) {
    throw new ApiError(400, "Email and role are required");
  }

  email = email.toLowerCase().trim();

  if (!["customer", "seller"].includes(role)) {
    throw new ApiError(403, "Invalid role selection");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User with this email already exists");
  }

  // Prevent OTP spam (cooldown 60 sec)
  const recentOtp = await OTP.findOne({
    email,
    purpose: "email_verification",
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
  });

  if (recentOtp) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.deleteMany({
    email,
    purpose: "email_verification"
  });

  await OTP.create({
    email,
    otpHash: otp,
    purpose: "email_verification",
    role
  });

  const subject = "Verify your email - SmartCart";

  const html = `
    <p>Hello 👋,</p>
    <p>Your OTP for email verification is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
  `;

  await sendEmail(email, subject, html);
},

async registerUser({
    email, username, fullname, password, role, phone, files
  }) {
    if (!email || !fullname || !username || !password || !role || !phone) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }]
    });
    if (userExists) {
      throw new ApiError(400, "User with this email  already exists");
    }

    const avatarLocalPath = files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadSingle(avatarLocalPath, {
  folder: "SmartCart/avatars"
});

    const verified = await VerifiedEmail.findOne({ email });

if (!verified) {
  throw new ApiError(403, "Email not verified via OTP");
}

if (verified.role !== role) {
  throw new ApiError(403, "Role mismatch with verified email");
}

    const user = await User.create({
      email,
      username,
      fullname,
      password,
      role,
      phone,
      avatar: avatar.url,
      isEmailVerified: true
    });

    await VerifiedEmail.deleteOne({ email });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }
    const admins = await User.find({ role: "admin", isActive: true });

    try {
      for (const admin of admins) {
  await NotificationService.emit("NEW_USER_REGISTERED", {
    recipient: admin._id,
    recipientRole: "admin",
    category: "account",
    entityType: "User",
    entityId: user._id,
    priority: "medium",
    meta: {
      role,
      fullname,
      email
    },
    email: admin.email
  });
}
    } catch (e) {}

    return createdUser;
},

async verifyOtp(email, otp) {

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP required");
  }

  email = email.toLowerCase().trim();

  const record = await OTP.findOne({
    email,
    purpose: "email_verification"
  }).select("+otpHash");

  if (!record) {
    throw new ApiError(400, "OTP expired or not found");
  }

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= record.maxAttempts) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many attempts");
  }

  const valid = await record.verifyOTP(otp);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  // Save temporary verified email
  await VerifiedEmail.findOneAndUpdate(
    { email },
    {
      email,
      role: "customer", // IMPORTANT: you must store role in OTP if you want to enforce role locking
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    },
    { upsert: true }
  );

  await OTP.deleteOne({ _id: record._id });
},

async loginUser(email, password) {

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email })
    .select("+password +refreshTokens");

  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isActive || user.isDeleted) {
    throw new ApiError(403, "Account inactive");
  }

  if (user.role === "seller") {

    if (!user.sellerProfile?.isSellerApproved) {
      throw new ApiError(403, "Seller account not approved");
    }

    if (user.sellerProfile?.isSellerSuspended) {
      throw new ApiError(403, "Seller account suspended");
    }
  }

  const valid = await user.isPasswordCorrect(password);

  if (!valid) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.isEmailVerified) {
    throw new ApiError(401, "Email not verified");
  }

  // 🔹 Cleanup expired refresh tokens
  const now = new Date();
  user.refreshTokens = user.refreshTokens.filter(
    t => t.expiresAt > now
  );

  await user.save({ validateBeforeSave: false });

  // 🔹 Generate new tokens
  const { accessToken, refreshToken } =
    await this.generateAccessAndRefreshToken(user._id);

  const safeUser = await User.findById(user._id)
    .select("-password -refreshTokens");

  return {
    user: safeUser,
    accessToken,
    refreshToken
  };
},

async logoutUser(userId, refreshToken) {

  if (!refreshToken) {
    throw new ApiError(400, "Refresh token required");
  }

  const user = await User.findById(userId)
    .select("+refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const tokenHash = user.hashToken(refreshToken);

  const tokenExists = user.refreshTokens.some(
    t => t.tokenHash === tokenHash
  );

  if (!tokenExists) {
    // Token already revoked or invalid
    return;
  }

  user.refreshTokens = user.refreshTokens.filter(
    t => t.tokenHash !== tokenHash
  );

  await user.save({ validateBeforeSave: false });
},

async changeCurrentPassword(userId, oldPassword, newPassword) {

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old and new password required");
  }

  if (oldPassword === newPassword) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  const user = await User.findById(userId)
    .select("+password +refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const valid = await user.isPasswordCorrect(oldPassword);

  if (!valid) {
    throw new ApiError(401, "Old password incorrect");
  }

  user.password = newPassword;

  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });

  try {
    await NotificationService.emit("PASSWORD_CHANGED", {
      recipient: user._id,
      recipientRole: user.role,
      category: "security",
      entityType: "User",
      entityId: user._id,
      priority: "high",
      meta: {
        fullname: user.fullname
      },
      email: user.email
    });
  } catch (e) {
    console.error("Password change notification failed", e);
  }
},

async sendResetOtp(email) {

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email });

  if (!user) {
    return;
  }

  const recentOtp = await OTP.findOne({
    email,
    purpose: "password_reset",
    createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
  });

  if (recentOtp) {
    throw new ApiError(429, "Please wait before requesting another OTP");
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await OTP.deleteMany({
    email,
    purpose: "password_reset"
  });

  await OTP.create({
    email,
    otpHash: otp,
    purpose: "password_reset"
  });

  const subject = "Password Reset OTP - SmartCart";

  const html = `
    <p>Hello ${user.fullname},</p>
    <p>Your OTP for password reset is:</p>
    <h2>${otp}</h2>
    <p>This OTP is valid for 5 minutes.</p>
    <p>If you did not request this, ignore this email.</p>
  `;

  await sendEmail(email, subject, html);
},

async verifyResetOtp(email, otp) {

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP required");
  }

  email = email.toLowerCase().trim();

  const record = await OTP.findOne({
    email,
    purpose: "password_reset"
  }).select("+otpHash");

  if (!record) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= record.maxAttempts) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many attempts. Request new OTP.");
  }

  const valid = await record.verifyOTP(otp);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  // ✅ DO NOT DELETE YET
  // Let resetPassword delete it after successful password change

  return true;
},

async resetPassword(email, otp, newPassword) {

  if (!email || !otp || !newPassword) {
    throw new ApiError(400, "Email, OTP and new password required");
  }

  email = email.toLowerCase().trim();

  const record = await OTP.findOne({
    email,
    purpose: "password_reset"
  }).select("+otpHash");

  if (!record) {
    throw new ApiError(400, "OTP expired or invalid");
  }

  if (record.expiresAt < Date.now()) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(400, "OTP expired");
  }

  if (record.attempts >= record.maxAttempts) {
    await OTP.deleteOne({ _id: record._id });
    throw new ApiError(429, "Too many attempts");
  }

  const valid = await record.verifyOTP(otp);

  if (!valid) {
    record.attempts += 1;
    await record.save();
    throw new ApiError(400, "Invalid OTP");
  }

  const user = await User.findOne({ email })
    .select("+password +refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isSame = await user.isPasswordCorrect(newPassword);

  if (isSame) {
    throw new ApiError(400, "New password cannot be same as old password");
  }

  user.password = newPassword;

  user.refreshTokens = [];

  await user.save({ validateBeforeSave: false });

  await OTP.deleteOne({ _id: record._id });

  try {
    await NotificationService.emit("PASSWORD_RESET", {
      recipient: user._id,
      recipientRole: user.role,
      category: "security",
      entityType: "User",
      entityId: user._id,
      priority: "high",
      meta: {
        fullname: user.fullname
      },
      email: user.email
    });
  } catch (e) {
    console.error("Password reset notification failed", e);
  }
},


async updateUserAvatar(userId, file) {

  if (!file?.path) {
    throw new ApiError(400, "Avatar file required");
  }

  const user = await User.findById(userId)
    .select("+avatar_public_id");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔹 Delete old avatar via abstraction
  if (user.avatar_public_id) {
    await deleteFromCloudinary(user.avatar_public_id);
  }

  // 🔹 Upload new avatar
  const uploaded = await uploadSingle(file.path, {
    folder: "SmartCart/avatars"
  });

  user.avatar = uploaded.url;
  user.avatar_public_id = uploaded.public_id;

  await user.save({ validateBeforeSave: false });

  return await User.findById(userId)
    .select("-password -refreshTokens");
},

async updateUserAvatar(userId, file) {

  if (!file) {
    throw new ApiError(400, "Avatar file required");
  }

  const user = await User.findById(userId)
    .select("+avatar_public_id");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔹 Delete old avatar safely
  if (user.avatar_public_id) {
    try {
      await cloudinary.v2.uploader.destroy(user.avatar_public_id);
    } catch (err) {
      console.error("Old avatar delete failed", err);
    }
  }

  // 🔹 Upload new avatar
  const uploaded = await uploadOnCloudinary(file.path);

  if (!uploaded?.url || !uploaded?.public_id) {
    throw new ApiError(400, "Avatar upload failed");
  }

  user.avatar = uploaded.url;
  user.avatar_public_id = uploaded.public_id;

  await user.save({ validateBeforeSave: false });

  const safeUser = await User.findById(userId)
    .select("-password -refreshTokens");

  return safeUser;
},

async updateAddress(userId, data) {

  const {
    label,
    street,
    city,
    state,
    country,
    pincode,
    isDefault
  } = data;

  if (!label || !street || !city || !state || !pincode) {
    throw new ApiError(400, "Required address fields missing");
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔹 Limit max addresses
  if (!user.addresses) {
    user.addresses = [];
  }

  if (
    user.addresses.length >= 5 &&
    !user.addresses.find(addr => addr.label === label)
  ) {
    throw new ApiError(400, "Maximum 5 addresses allowed");
  }

  // 🔹 If setting default → unset others
  if (isDefault) {
    user.addresses.forEach(addr => {
      addr.isDefault = false;
    });
  }

  const existingIndex = user.addresses.findIndex(
    addr => addr.label === label
  );

  const newAddress = {
    label,
    street,
    city,
    state,
    country: country || "India",
    pincode,
    isDefault: !!isDefault
  };

  if (existingIndex !== -1) {
    user.addresses[existingIndex] = newAddress;
  } else {
    user.addresses.push(newAddress);
  }

  await user.save();

  return user.addresses;
},

async updateAccountDetails(userId, data) {

  const { fullname, username, phone, email } = data;

  if (!fullname && !username && !phone && !email) {
    throw new ApiError(400, "At least one field required to update");
  }

  const user = await User.findById(userId)
    .select("-password -refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // 🔹 Username uniqueness
  if (username && username !== user.username) {

    const usernameExists = await User.findOne({ username });

    if (usernameExists && usernameExists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Username already taken");
    }

    user.username = username;
  }

  if (email && email !== user.email) {

    email = email.toLowerCase().trim();

    const emailExists = await User.findOne({ email });

    if (emailExists && emailExists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Email already taken");
    }

    user.email = email;
    user.isEmailVerified = false;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "email_verification"
    });

    await OTP.create({
      email,
      otpHash: otp,
      purpose: "email_verification"
    });

    await sendEmail(
      email,
      "Verify your new email - SmartCart",
      `<h2>Your OTP: ${otp}</h2>`
    );
  }

  if (fullname) user.fullname = fullname;
  if (phone) user.phone = phone;

  await user.save();

  try {
    await NotificationService.emit("PROFILE_UPDATED", {
      recipient: user._id,
      recipientRole: user.role,
      category: "account",
      entityType: "User",
      entityId: user._id,
      priority: "medium",
      meta: {
        fullname: user.fullname
      },
      email: user.email
    });
  } catch (e) {
    console.error("PROFILE_UPDATED notification failed", e);
  }

  return user;
},

async getSellerProfile(userId) {

  const seller = await User.findById(userId)
    .select("-password -refreshTokens");

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  if (seller.role !== "seller") {
    throw new ApiError(403, "Only sellers can access this resource");
  }

  return {
    basicInfo: {
      fullname: seller.fullname,
      email: seller.email,
      username: seller.username,
      phone: seller.phone,
      avatar: seller.avatar
    },
    sellerProfile: seller.sellerProfile
  };
},

async updateSellerProfile(userId, data, file) {

  const seller = await User.findById(userId)
    .select("+sellerProfile");

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  if (seller.role !== "seller") {
    throw new ApiError(403, "Only sellers can update seller profile");
  }

  if (!seller.sellerProfile) {
    seller.sellerProfile = {};
  }

  const profile = seller.sellerProfile;

  // 🔹 Basic user fields
  if (data.fullname) seller.fullname = data.fullname;

  if (data.username && data.username !== seller.username) {

    const exists = await User.findOne({ username: data.username });

    if (exists && exists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Username already taken");
    }

    seller.username = data.username;
  }

  if (data.phone) seller.phone = data.phone;

  // 🔹 Email change (require verification)
  if (data.email && data.email !== seller.email) {

    const email = data.email.toLowerCase().trim();

    const exists = await User.findOne({ email });

    if (exists && exists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Email already taken");
    }

    seller.email = email;
    seller.isEmailVerified = false;

    // Send OTP for verification
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "email_verification"
    });

    await OTP.create({
      email,
      otpHash: otp,
      purpose: "email_verification"
    });

    await sendEmail(
      email,
      "Verify your new email - SmartCart",
      `<h2>Your OTP: ${otp}</h2>`
    );
  }

  // 🔹 Nested sellerProfile updates
  const fields = [
    "shopName",
    "shopAddress",
    "gstNumber",
    "businessType",
    "accountHolderName",
    "bankAccountNumber",
    "ifscCode",
    "upiId"
  ];

  fields.forEach(field => {
    if (data[field]) {
      profile[field] = data[field];
    }
  });

  // 🔹 Banner upload
  // 🔹 Banner upload
if (file?.path) {

  if (profile.storeBanner_public_id) {
    await deleteFromCloudinary(profile.storeBanner_public_id);
  }

  const uploaded = await uploadSingle(file.path, {
    folder: "SmartCart/banners"
  });

  profile.storeBanner = uploaded.url;
  profile.storeBanner_public_id = uploaded.public_id;
}

  // 🔹 Profile completeness check
  const requiredFields = [
    profile.shopName,
    profile.shopAddress,
    profile.gstNumber,
    profile.businessType,
    profile.accountHolderName,
    profile.bankAccountNumber,
    profile.ifscCode,
    profile.upiId,
    profile.storeBanner
  ];

  profile.isSellerProfileComplete = requiredFields.every(Boolean);

  await seller.save();

  return {
    basicInfo: {
      fullname: seller.fullname,
      email: seller.email,
      username: seller.username,
      phone: seller.phone,
      avatar: seller.avatar
    },
    sellerProfile: seller.sellerProfile
  };
},

async getProductWiseBreakdown(sellerId) {

  if (!sellerId) {
    throw new ApiError(400, "Seller ID required");
  }

  const seller = await User.findById(sellerId);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(403, "Access denied");
  }

  const objectId = new mongoose.Types.ObjectId(sellerId);

  const data = await Order.aggregate([

    // 🔹 Only completed orders
    { $match: { orderStatus: "delivered" } },

    { $unwind: "$items" },

    { $match: { "items.seller": objectId } },

    {
      $group: {
        _id: "$items.product",
        totalUnitsSold: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] }
        }
      }
    },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },

    { $unwind: "$productDetails" },

    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$productDetails.name",
        totalUnitsSold: 1,
        totalRevenue: 1
      }
    },

    { $sort: { totalRevenue: -1 } }

  ]);

  return data;
},

async getTopSellingItems(sellerId) {

  if (!sellerId) {
    throw new ApiError(400, "Seller ID required");
  }

  const seller = await User.findById(sellerId);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(403, "Access denied");
  }

  const objectId = new mongoose.Types.ObjectId(sellerId);

  const topProducts = await Order.aggregate([

    // 🔹 Only delivered orders
    { $match: { orderStatus: "delivered" } },

    { $unwind: "$items" },

    { $match: { "items.seller": objectId } },

    {
      $group: {
        _id: "$items.product",
        totalUnitsSold: { $sum: "$items.quantity" }
      }
    },

    { $sort: { totalUnitsSold: -1 } },

    { $limit: 5 },

    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "productDetails"
      }
    },

    { $unwind: "$productDetails" },

    {
      $project: {
        _id: 0,
        productId: "$_id",
        productName: "$productDetails.name",
        totalUnitsSold: 1
      }
    }

  ]);

  return topProducts;
},


async getDailySalesData(sellerId) {

  if (!sellerId) {
    throw new ApiError(400, "Seller ID required");
  }

  const seller = await User.findById(sellerId);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(403, "Access denied");
  }

  const objectId = new mongoose.Types.ObjectId(sellerId);

  const dailyData = await Order.aggregate([

    // 🔹 Only delivered orders
    { $match: { orderStatus: "delivered" } },

    { $unwind: "$items" },

    { $match: { "items.seller": objectId } },

    {
      $group: {
        _id: {
          date: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
              timezone: "Asia/Kolkata"
            }
          },
          orderId: "$_id"
        },
        revenue: {
          $sum: { $multiply: ["$items.quantity", "$items.price"] }
        }
      }
    },

    // 🔹 Now group again by date (to fix order counting)
    {
      $group: {
        _id: "$_id.date",
        totalRevenue: { $sum: "$revenue" },
        totalOrders: { $sum: 1 }
      }
    },

    { $sort: { _id: 1 } },

    {
      $project: {
        _id: 0,
        date: "$_id",
        totalRevenue: 1,
        totalOrders: 1
      }
    }

  ]);

  return dailyData;
},

async approveSeller(id) {

  const seller = await User.findById(id);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found");
  }

  if (!seller.sellerProfile) {
    throw new ApiError(400, "Seller profile incomplete");
  }

  if (seller.sellerProfile.isSellerApproved) {
    return { alreadyApproved: true };
  }

  seller.sellerProfile.isSellerApproved = true;
  seller.sellerProfile.isSellerSuspended = false;

  await seller.save();

  try {
    await NotificationService.emit("SELLER_APPROVED", {
      recipient: seller._id,
      recipientRole: "seller",
      category: "account",
      entityType: "User",
      entityId: seller._id,
      priority: "high",
      meta: {
        fullname: seller.fullname
      },
      email: seller.email
    });
  } catch (e) {
    console.error("SELLER_APPROVED notification failed", e);
  }

  return { alreadyApproved: false, seller };
},

async suspendSeller(id) {

  const seller = await User.findById(id);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found");
  }

  if (!seller.sellerProfile?.isSellerApproved) {
    throw new ApiError(400, "Seller not approved yet");
  }

  if (seller.sellerProfile.isSellerSuspended) {
    return { alreadySuspended: true };
  }

  seller.sellerProfile.isSellerSuspended = true;

  await seller.save();

  try {
    await NotificationService.emit("SELLER_SUSPENDED", {
      recipient: seller._id,
      recipientRole: "seller",
      category: "account",
      entityType: "User",
      entityId: seller._id,
      priority: "high",
      meta: {
        fullname: seller.fullname
      },
      email: seller.email
    });
  } catch (e) {
    console.error("SELLER_SUSPENDED notification failed", e);
  }

  return { alreadySuspended: false, seller };
},

async unsuspendSeller(id) {

  const seller = await User.findById(id);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found");
  }

  if (!seller.sellerProfile?.isSellerSuspended) {
    return { notSuspended: true };
  }

  seller.sellerProfile.isSellerSuspended = false;

  await seller.save();

  try {
    await NotificationService.emit("SELLER_UNSUSPENDED", {
      recipient: seller._id,
      recipientRole: "seller",
      category: "account",
      entityType: "User",
      entityId: seller._id,
      priority: "medium",
      meta: {
        fullname: seller.fullname
      },
      email: seller.email
    });
  } catch (e) {
    console.error("SELLER_UNSUSPENDED notification failed", e);
  }

  return { notSuspended: false, seller };
},

async getAllUsers({ page = 1, limit = 10 }) {

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const users = await User.find()
    .select("-password -refreshTokens")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments();

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    users
  };
},

async getAllCustomers({ page = 1, limit = 10 }) {

  const skip = (page - 1) * limit;

  const customers = await User.find({ role: "customer" })
    .select("-password -refreshTokens")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role: "customer" });

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    customers
  };
},

async getAllSellers({ page = 1, limit = 10 }) {

  const skip = (page - 1) * limit;

  const sellers = await User.find({ role: "seller" })
    .select("-password -refreshTokens")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments({ role: "seller" });

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    sellers
  };
},

async deactivateUserAccount(id) {

  const user = await User.findById(id)
    .select("+refreshTokens");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    return { alreadyDeactivated: true };
  }

  user.isActive = false;

  user.refreshTokens = [];

  await user.save();

  try {
    await NotificationService.emit("ACCOUNT_DEACTIVATED", {
      recipient: user._id,
      recipientRole: user.role,
      category: "account",
      entityType: "User",
      entityId: user._id,
      priority: "high",
      meta: { fullname: user.fullname },
      email: user.email
    });
  } catch (e) {
    console.error("ACCOUNT_DEACTIVATED notification failed", e);
  }

  return { alreadyDeactivated: false, user };
},

async reactivateUserAccount(id) {

  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.isActive) {
    return { alreadyActive: true };
  }

  user.isActive = true;

  await user.save();

  try {
    await NotificationService.emit("ACCOUNT_REACTIVATED", {
      recipient: user._id,
      recipientRole: user.role,
      category: "account",
      entityType: "User",
      entityId: user._id,
      priority: "medium",
      meta: { fullname: user.fullname },
      email: user.email
    });
  } catch (e) {
    console.error("ACCOUNT_REACTIVATED notification failed", e);
  }

  return { alreadyActive: false, user };
}

  
};

