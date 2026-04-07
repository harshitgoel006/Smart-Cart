// This module implements the user service, which contains all the business logic related to user management such as registration, login, password reset, profile updates, and seller-specific functionalities. It interacts with the User model for database operations and uses utility functions for tasks like sending emails and handling file uploads. The service also integrates with the notification system to emit relevant events when user actions occur.

import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadSingle, deleteFromCloudinary } from "../utils/cloudinary.js";
import sendEmail from "../utils/sendEmail.js";
import { OTP } from "../models/otp.model.js";
import { VerifiedEmail } from "../models/verifiedEmail.model.js";
import cloudinary from "cloudinary";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import NotificationService from "../services/notification/notification.service.js";

// The userService object encapsulates all the methods related to user management. It includes functionalities for generating access and refresh tokens, sending OTPs for email verification and password reset, registering new users, verifying OTPs, logging in and out users, changing passwords, updating user profiles and addresses, and handling seller-specific profile information. Each method performs necessary validations, interacts with the database through the User model, and emits notifications for relevant events to keep users informed about their account activities.
export const userService = {
  // This method generates a new access token and refresh token for a given user ID. It retrieves the user from the database, creates the tokens using methods defined in the User model, hashes the refresh token for secure storage, and saves it in the user's document with an expiry date. The generated tokens are then returned to be used for authentication in subsequent requests.
  async generateAccessAndRefreshToken(userId) {
    const user = await User.findById(userId);

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    const tokenHash = user.hashToken(refreshToken);

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7); // match JWT expiry

    user.refreshTokens.push({
      tokenHash,
      expiresAt: expiryDate,
    });

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  },

  // This method sends an OTP to the specified email address for the purpose of email verification during user registration. It checks if the email and role are provided, validates the role, ensures that no user already exists with the given email, and prevents OTP spamming by enforcing a cooldown period. If all checks pass, it generates a 6-digit OTP, saves it in the database with an expiry time, and sends it to the user's email address using a predefined email template.
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
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOtp) {
      throw new ApiError(429, "Please wait before requesting another OTP");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "email_verification",
    });

    await OTP.create({
      email,
      otpHash: otp,
      purpose: "email_verification",
      role,
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

  // This method registers a new user with the provided details such as email, username, fullname, password, role, phone number, and avatar file. It performs various validations to ensure all required fields are present, checks for existing users with the same email or username, handles avatar upload to Cloudinary, verifies that the email has been verified via OTP, creates the user in the database, and emits a notification to all admins about the new user registration. Finally, it returns the created user without sensitive information like password and refresh tokens.
  async registerUser({
    email,
    username,
    fullname,
    password,
    role,
    phone,
    files,
  }) {
    if (!email || !fullname || !username || !password || !role || !phone) {
      throw new ApiError(400, "All fields are required");
    }

    const userExists = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (userExists) {
      throw new ApiError(400, "User with this email  already exists");
    }

    const avatarLocalPath = files?.avatar?.[0]?.path;
    if (!avatarLocalPath) {
      throw new ApiError(400, "Avatar is required");
    }

    const avatar = await uploadSingle(avatarLocalPath, {
      folder: "SmartCart/avatars",
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
      isEmailVerified: true,
    });

    await VerifiedEmail.deleteOne({ email });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken",
    );
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
            email,
          },
          email: admin.email,
        });
      }
    } catch (e) {}

    return createdUser;
  },

  // This method verifies the OTP provided by the user for email verification during registration. It checks if the email and OTP are provided, retrieves the corresponding OTP record from the database, checks for expiry and maximum attempts, verifies the OTP against the stored hash, and if valid, saves a temporary verified email record that can be used for registration. Finally, it deletes the OTP record from the database to prevent reuse.
  async verifyOtp(email, otp) {
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP required");
    }

    email = email.toLowerCase().trim();

    const record = await OTP.findOne({
      email,
      purpose: "email_verification",
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
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      { upsert: true },
    );

    await OTP.deleteOne({ _id: record._id });
  },

  // This method handles user login by validating the provided email and password. It checks if the email and password are present, retrieves the user from the database, verifies the password, checks if the account is active and email is verified, cleans up expired refresh tokens, generates new access and refresh tokens, and returns the user information along with the tokens. If any validation fails, it throws appropriate errors to indicate the issue.
  async loginUser(email, password) {
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    email = email.toLowerCase().trim();

    const user = await User.findOne({ email }).select(
      "+password +refreshTokens",
    );

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
    user.refreshTokens = user.refreshTokens.filter((t) => t.expiresAt > now);

    await user.save({ validateBeforeSave: false });

    // 🔹 Generate new tokens
    const { accessToken, refreshToken } =
      await this.generateAccessAndRefreshToken(user._id);

    const safeUser = await User.findById(user._id).select(
      "-password -refreshTokens",
    );

    return {
      user: safeUser,
      accessToken,
      refreshToken,
    };
  },

  // This method handles user logout by revoking the provided refresh token. It checks if the refresh token is present, retrieves the user from the database along with their refresh tokens, hashes the provided refresh token, checks if it exists in the user's stored tokens, and if found, removes it from the database to prevent further use. If the token is not found, it simply returns without error, as the token may have already been revoked or invalid.
  async logoutUser(userId, refreshToken) {
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token required");
    }

    const user = await User.findById(userId).select("+refreshTokens");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const tokenHash = user.hashToken(refreshToken);

    const tokenExists = user.refreshTokens.some(
      (t) => t.tokenHash === tokenHash,
    );

    if (!tokenExists) {
      // Token already revoked or invalid
      return;
    }

    user.refreshTokens = user.refreshTokens.filter(
      (t) => t.tokenHash !== tokenHash,
    );

    await user.save({ validateBeforeSave: false });
  },

  // This method allows a user to change their current password by providing the old password and the new password. It validates the input, retrieves the user from the database, checks if the old password is correct, ensures that the new password is different from the old one, updates the user's password, revokes all existing refresh tokens for security, saves the changes to the database, and emits a notification about the password change. If any validation fails or if the user is not found, it throws appropriate errors to indicate the issue.
  async changeCurrentPassword(userId, oldPassword, newPassword) {
    if (!oldPassword || !newPassword) {
      throw new ApiError(400, "Old and new password required");
    }

    if (oldPassword === newPassword) {
      throw new ApiError(400, "New password cannot be same as old password");
    }

    const user = await User.findById(userId).select("+password +refreshTokens");

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
          fullname: user.fullname,
        },
        email: user.email,
      });
    } catch (e) {
      console.error("Password change notification failed", e);
    }
  },

  // This method sends a password reset OTP to the user's email address. It validates the input email, checks if a user with the given email exists, prevents OTP spamming by enforcing a cooldown period, generates a 6-digit OTP, saves it in the database with an expiry time, and sends it to the user's email using a predefined template. If the user does not exist, it simply returns without error to prevent information disclosure about registered emails.
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
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOtp) {
      throw new ApiError(429, "Please wait before requesting another OTP");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await OTP.deleteMany({
      email,
      purpose: "password_reset",
    });

    await OTP.create({
      email,
      otpHash: otp,
      purpose: "password_reset",
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

  // This method verifies the OTP provided by the user for password reset. It checks if the email and OTP are provided, retrieves the corresponding OTP record from the database, checks for expiry and maximum attempts, verifies the OTP against the stored hash, and if valid, allows the password reset process to continue. The OTP record is not deleted immediately to allow for a subsequent password reset request if needed, but it can be deleted after a successful password change to prevent reuse.
  async verifyResetOtp(email, otp) {
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP required");
    }

    email = email.toLowerCase().trim();

    const record = await OTP.findOne({
      email,
      purpose: "password_reset",
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

  // This method resets the user's password after verifying the provided OTP. It checks if the email, OTP, and new password are provided, retrieves the corresponding OTP record from the database, checks for expiry and maximum attempts, verifies the OTP against the stored hash, and if valid, updates the user's password in the database. It also revokes all existing refresh tokens for security and emits a notification about the password reset. Finally, it deletes the OTP record to prevent reuse.
  async resetPassword(email, otp, newPassword) {
    if (!email || !otp || !newPassword) {
      throw new ApiError(400, "Email, OTP and new password required");
    }

    email = email.toLowerCase().trim();

    const record = await OTP.findOne({
      email,
      purpose: "password_reset",
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

    const user = await User.findOne({ email }).select(
      "+password +refreshTokens",
    );

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
          fullname: user.fullname,
        },
        email: user.email,
      });
    } catch (e) {
      console.error("Password reset notification failed", e);
    }
  },

  // This method updates the user's avatar by uploading a new image file to Cloudinary and deleting the old avatar if it exists. It validates the input file, retrieves the user from the database, handles the avatar upload and deletion, updates the user's avatar URL and public ID in the database, and returns the updated user information without sensitive fields like password and refresh tokens.
  async updateUserAvatar(userId, file) {
    if (!file?.path) {
      throw new ApiError(400, "Avatar file required");
    }

    const user = await User.findById(userId).select("+avatar_public_id");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 🔹 Delete old avatar via abstraction
    if (user.avatar_public_id) {
      await deleteFromCloudinary(user.avatar_public_id);
    }

    // 🔹 Upload new avatar
    const uploaded = await uploadSingle(file.path, {
      folder: "SmartCart/avatars",
    });

    user.avatar = uploaded.url;
    user.avatar_public_id = uploaded.public_id;

    await user.save({ validateBeforeSave: false });

    return await User.findById(userId).select("-password -refreshTokens");
  },

  // This method updates the user's avatar by uploading a new image file to Cloudinary and deleting the old avatar if it exists. It validates the input file, retrieves the user from the database, handles the avatar upload and deletion, updates the user's avatar URL and public ID in the database, and returns the updated user information without sensitive fields like password and refresh tokens.
  async updateUserAvatar(userId, file) {
    if (!file) {
      throw new ApiError(400, "Avatar file required");
    }

    const user = await User.findById(userId).select("+avatar_public_id");

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

    const safeUser = await User.findById(userId).select(
      "-password -refreshTokens",
    );

    return safeUser;
  },

  // This method updates the user's address information. It validates the required address fields, retrieves the user from the database, limits the maximum number of addresses to 5, allows setting one address as default while unsetting others, updates or adds the address based on the label, saves the changes to the database, and returns the updated list of addresses.
  async updateAddress(userId, data) {
    const { label, street, city, state, country, pincode, isDefault } = data;

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
      !user.addresses.find((addr) => addr.label === label)
    ) {
      throw new ApiError(400, "Maximum 5 addresses allowed");
    }

    // 🔹 If setting default → unset others
    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    const existingIndex = user.addresses.findIndex(
      (addr) => addr.label === label,
    );

    const newAddress = {
      label,
      street,
      city,
      state,
      country: country || "India",
      pincode,
      isDefault: !!isDefault,
    };

    if (existingIndex !== -1) {
      user.addresses[existingIndex] = newAddress;
    } else {
      user.addresses.push(newAddress);
    }

    await user.save();

    return user.addresses;
  },

  // This method updates the user's account details such as fullname, username, phone number, and email. It validates that at least one field is provided for update, retrieves the user from the database, checks for username uniqueness if it's being updated, handles email change by enforcing uniqueness and sending a verification OTP, updates the provided fields, saves the changes to the database, emits a notification about the profile update, and returns the updated user information without sensitive fields like password and refresh tokens.
  async updateAccountDetails(userId, data) {
    const { fullname, username, phone, email } = data;

    if (!fullname && !username && !phone && !email) {
      throw new ApiError(400, "At least one field required to update");
    }

    const user = await User.findById(userId).select("-password -refreshTokens");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // 🔹 Username uniqueness
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });

      if (
        usernameExists &&
        usernameExists._id.toString() !== userId.toString()
      ) {
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
        purpose: "email_verification",
      });

      await OTP.create({
        email,
        otpHash: otp,
        purpose: "email_verification",
      });

      await sendEmail(
        email,
        "Verify your new email - SmartCart",
        `<h2>Your OTP: ${otp}</h2>`,
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
          fullname: user.fullname,
        },
        email: user.email,
      });
    } catch (e) {
      console.error("PROFILE_UPDATED notification failed", e);
    }

    return user;
  },

  // This method retrieves the seller profile information for a given user ID. It checks if the user exists and has the role of "seller", and if so, it returns an object containing the basic user information (fullname, email, username, phone, avatar) and the nested sellerProfile details. If the user is not found or does not have the seller role, it throws appropriate errors to indicate the issue.
  async getSellerProfile(userId) {
    const seller = await User.findById(userId).select(
      "-password -refreshTokens",
    );

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
        avatar: seller.avatar,
      },
      sellerProfile: seller.sellerProfile,
    };
  },

  // This method updates the seller profile information for a given user ID. It checks if the user exists and has the role of "seller", then it updates both the basic user fields (fullname, username, phone, email) and the nested sellerProfile fields (shopName, shopAddress, gstNumber, businessType, accountHolderName, bankAccountNumber, ifscCode, upiId). It also handles email change by enforcing uniqueness and sending a verification OTP, and manages banner image upload by deleting the old banner from Cloudinary if it exists. Finally, it checks for profile completeness based on required fields and saves the changes to the database before returning the updated profile information.
  async updateSellerProfile(userId, data, file) {
    const seller = await User.findById(userId).select("+sellerProfile");

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
        purpose: "email_verification",
      });

      await OTP.create({
        email,
        otpHash: otp,
        purpose: "email_verification",
      });

      await sendEmail(
        email,
        "Verify your new email - SmartCart",
        `<h2>Your OTP: ${otp}</h2>`,
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
      "upiId",
    ];

    fields.forEach((field) => {
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
        folder: "SmartCart/banners",
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
      profile.storeBanner,
    ];

    profile.isSellerProfileComplete = requiredFields.every(Boolean);

    await seller.save();

    return {
      basicInfo: {
        fullname: seller.fullname,
        email: seller.email,
        username: seller.username,
        phone: seller.phone,
        avatar: seller.avatar,
      },
      sellerProfile: seller.sellerProfile,
    };
  },

  // This method retrieves a breakdown of sales data for a seller, grouped by product. It checks if the seller ID is provided and valid, ensures that the user is a seller, and then performs an aggregation on the Order collection to calculate total units sold and total revenue for each product sold by the seller. The results are enriched with product details using a lookup, sorted by revenue in descending order, and returned as an array of objects containing product ID, product name, total units sold, and total revenue.
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
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          totalUnitsSold: 1,
          totalRevenue: 1,
        },
      },

      { $sort: { totalRevenue: -1 } },
    ]);

    return data;
  },

  // This method retrieves the top-selling products for a seller based on the total units sold. It checks if the seller ID is provided and valid, ensures that the user is a seller, and then performs an aggregation on the Order collection to calculate total units sold for each product sold by the seller. The results are enriched with product details using a lookup, sorted by total units sold in descending order, limited to the top 5 products, and returned as an array of objects containing product ID, product name, and total units sold.
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
          totalUnitsSold: { $sum: "$items.quantity" },
        },
      },

      { $sort: { totalUnitsSold: -1 } },

      { $limit: 5 },

      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },

      { $unwind: "$productDetails" },

      {
        $project: {
          _id: 0,
          productId: "$_id",
          productName: "$productDetails.name",
          totalUnitsSold: 1,
        },
      },
    ]);

    return topProducts;
  },

  // This method retrieves a breakdown of daily sales data for a seller, including total revenue and total orders for each day. It checks if the seller ID is provided and valid, ensures that the user is a seller, and then performs an aggregation on the Order collection to calculate daily revenue and order count for orders that include items sold by the seller. The results are grouped by date, sorted in ascending order, and returned as an array of objects containing the date, total revenue, and total orders for each day.
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
                timezone: "Asia/Kolkata",
              },
            },
            orderId: "$_id",
          },
          revenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
        },
      },

      // 🔹 Now group again by date (to fix order counting)
      {
        $group: {
          _id: "$_id.date",
          totalRevenue: { $sum: "$revenue" },
          totalOrders: { $sum: 1 },
        },
      },

      { $sort: { _id: 1 } },

      {
        $project: {
          _id: 0,
          date: "$_id",
          totalRevenue: 1,
          totalOrders: 1,
        },
      },
    ]);

    return dailyData;
  },

  // This method approves a seller's account by setting the appropriate flags in their profile. It checks if the seller ID is provided and valid, ensures that the user is a seller, checks if the seller profile is complete, and if not already approved, it updates the seller's profile to mark them as approved and not suspended. It then saves the changes to the database and emits a notification about the approval. Finally, it returns an object indicating whether the seller was already approved and the updated seller information.
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
          fullname: seller.fullname,
        },
        email: seller.email,
      });
    } catch (e) {
      console.error("SELLER_APPROVED notification failed", e);
    }

    return { alreadyApproved: false, seller };
  },

  // This method suspends a seller's account by setting the appropriate flags in their profile. It checks if the seller ID is provided and valid, ensures that the user is a seller, checks if the seller profile is approved, and if not already suspended, it updates the seller's profile to mark them as suspended. It then saves the changes to the database and emits a notification about the suspension. Finally, it returns an object indicating whether the seller was already suspended and the updated seller information.
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
          fullname: seller.fullname,
        },
        email: seller.email,
      });
    } catch (e) {
      console.error("SELLER_SUSPENDED notification failed", e);
    }

    return { alreadySuspended: false, seller };
  },

  // This method unsuspends a seller's account by updating the appropriate flags in their profile. It checks if the seller ID is provided and valid, ensures that the user is a seller, checks if the seller profile is approved, and if currently suspended, it updates the seller's profile to mark them as not suspended. It then saves the changes to the database and emits a notification about the unsuspension. Finally, it returns an object indicating whether the seller was not suspended and the updated seller information.
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
          fullname: seller.fullname,
        },
        email: seller.email,
      });
    } catch (e) {
      console.error("SELLER_UNSUSPENDED notification failed", e);
    }

    return { notSuspended: false, seller };
  },

  // This method retrieves a paginated list of all users in the system. It accepts page and limit parameters for pagination, calculates the number of documents to skip, and queries the User collection to retrieve the users while excluding sensitive fields like password and refresh tokens. The results are sorted by creation date in descending order. It also counts the total number of users to calculate the total pages and returns an object containing the total count, current page, total pages, and the list of users.
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
      users,
    };
  },

  // This method retrieves a paginated list of all customers in the system. It accepts page and limit parameters for pagination, calculates the number of documents to skip, and queries the User collection to retrieve users with the role of "customer" while excluding sensitive fields like password and refresh tokens. The results are sorted by creation date in descending order. It also counts the total number of customers to calculate the total pages and returns an object containing the total count, current page, total pages, and the list of customers.
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
      customers,
    };
  },

  // This method retrieves a paginated list of all sellers in the system. It accepts page and limit parameters for pagination, calculates the number of documents to skip, and queries the User collection to retrieve users with the role of "seller" while excluding sensitive fields like password and refresh tokens. The results are sorted by creation date in descending order. It also counts the total number of sellers to calculate the total pages and returns an object containing the total count, current page, total pages, and the list of sellers.
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
      sellers,
    };
  },

  // This method deactivates a user's account by setting the isActive flag to false and revoking all existing refresh tokens. It checks if the user ID is valid, retrieves the user from the database, checks if the account is already deactivated, updates the user's status and refresh tokens, saves the changes to the database, emits a notification about the account deactivation, and returns an object indicating whether the account was already deactivated and the updated user information.
  async deactivateUserAccount(id) {
    const user = await User.findById(id).select("+refreshTokens");

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
        email: user.email,
      });
    } catch (e) {
      console.error("ACCOUNT_DEACTIVATED notification failed", e);
    }

    return { alreadyDeactivated: false, user };
  },

  // This method reactivates a user's account by setting the isActive flag to true. It checks if the user ID is valid, retrieves the user from the database, checks if the account is already active, updates the user's status, saves the changes to the database, emits a notification about the account reactivation, and returns an object indicating whether the account was already active and the updated user information.
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
        email: user.email,
      });
    } catch (e) {
      console.error("ACCOUNT_REACTIVATED notification failed", e);
    }

    return { alreadyActive: false, user };
  },
};
