import {asyncHandler} from "../utils/asyncHandler.js";
import{ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import{uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken";
import sendEmail from "../utils/sendEmail.js";
import {OTP} from "../models/otp.model.js";
import cloudinary from "cloudinary";
import{Order} from "../models/order.model.js";
import {Product} from "../models/product.model.js";
import mongoose from "mongoose"
import createAndSendNotification from "../utils/sendNotification.js";

export const userService = {

//  This function will generate an access token and a refresh token for the user. It retrieves the user from the database using the provided user ID, generates the tokens using methods defined in the User model, saves the refresh token to the user's record in the database, and returns both tokens.

  async generateAccessAndRefreshToken(userId) {
    try {
      const user = await User.findById(userId);

      const accessToken = user.generateAccessToken();
      const refreshToken = user.generateRefreshToken();

      user.refreshToken = refreshToken;
      await user.save({ validateBeforeSave: false });

      return { accessToken, refreshToken };
    } catch (error) {
      throw new ApiError(
        500,
        "Something went wrong while generate access and refresh token"
      );
    }
  },

//  This function will send an OTP to the user's email for verification during registration. It checks if the email and role are provided, verifies that the user does not already exist, generates a random OTP, saves it to the database, and sends an email with the OTP to the user.

  async sendOtp(email, role){

    if(!(email && role)){
        throw new ApiError(400, "Email and role are required");
    }

    const existingUser = await User.findOne({email});

    if(existingUser){
        throw new ApiError(400, "User with this email is already exist");
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({email}); // Clear any existing OTP for the email
    await OTP.create({email, otp});

    const subject = "Verify your email to complete registration - SmartCart";
    const html = `<p>Hello 👋,</p>
                  <p>Thank you for choosing <strong>SmartCart</strong>.</p>
                  <p>Your One-Time Password (OTP) to complete your sign-up is:</p>
                  <h2 style="color: #007bff;">${otp}</h2>
                  <p>This OTP is valid for <strong>1 minutes</strong>. Please do not share this code with anyone.</p>
                  <p>If you did not initiate this request, please ignore this email.</p>
                  <p>Regards,<br> Team SmartCart</p>`;

    await sendEmail(email, subject, html);
  },


//  This function will handle the user registration process. It validates the input data, checks for existing users, uploads the avatar to Cloudinary, creates a new user in the database, and sends a notification to the admin about the new registration.

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

    const avatar = await uploadOnCloudinary(avatarLocalPath);

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

    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering user");
    }

    try {
      await createAndSendNotification({
        recipientId: "6946fbc63074456aa4c2906c",
        recipientRole: "admin",
        recipientEmail: "harshitgoel885@gmail.com",
        type: "NEW_USER_REGISTERED",
        title: "New user registered",
        message: `New ${role} registered: ${fullname} (${email})`,
        relatedEntity: { entityType: "user", entityId: user._id },
        channels: ["in-app", "email"],
        meta: {
          userId: user._id,
          role,
          email,
        },
      });
    } catch (e) {}

    return createdUser;
  },


//   This function will verify the OTP sent to user's email during registration. It checks if the OTP is valid and not expired, and then deletes it from the database.

  async verifyOtp(email, otp) {
    if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }
  const existingOtp = await OTP.findOne({ email });
  if (!existingOtp || existingOtp.otp !== otp) {
    throw new ApiError(400, "Invalid  OTP");
  }

  if (existingOtp.expiresAt < Date.now()) {
    await OTP.deleteOne({ email });
    throw new ApiError(400, "OTP has expired. Please request a new one.");
  }

  await OTP.deleteOne({ email });
  },

// This function will handle the user login process. It validates the input data, checks if the user exists and is active, verifies the password, checks if the email is verified, and returns the user data if all checks pass.

  async loginUser(email, password) {
    if (!email) {
      throw new ApiError(400, " email is required");
    }

    const user = await User.findOne({ email }).select("+password +refreshToken");
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    if (!user.isActive || user.isDeleted) {
      throw new ApiError(403, "Your account is inactive or deleted. Contact support.");
    }

    if (user.role === "seller") {
      if (!user.isSellerApproved) {
        throw new ApiError(403, "Seller account is not approved yet");
      }
      if (user.isSellerSuspended) {
        throw new ApiError(403, "Your account is suspended. Contact support.");
      }
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
      throw new ApiError(401, "Invalid user credentials");
    }

    if (!user.isEmailVerified) {
      throw new ApiError(401, "Email not verified yet. Please verify your email first.");
    }

    return user; 
  },

//  This function will handle the user logout process. It takes the user ID as input, finds the user in the database, and sets the refresh token to undefined, effectively logging the user out.
  async logoutUser(userId) {
    await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          refreshToken: undefined,
        },
      },
      {
        new: true,
      }
    );
    // No return (same as original)
  },


  async changeCurrentPassword(userId, oldPassword, newPassword) {
    if (!(oldPassword && newPassword)) {
      throw new ApiError(400, "Old password and new password are required");
    }

    const user = await User.findById(userId).select("+password");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    if (!isPasswordCorrect) {
      throw new ApiError(401, "Old password is incorrect");
    }

    const isSame = await user.isPasswordCorrect(newPassword);
    if (isSame) {
      throw new ApiError(400, "Old and new password cannot be the same");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    try {
      await createAndSendNotification({
        recipientId: user._id,
        recipientRole: user.role,
        recipientEmail: user.email,
        type: "PASSWORD_CHANGED",
        title: "Password changed successfully",
        message: "Your password was changed from your account settings.",
        relatedEntity: { entityType: "user", entityId: user._id },
        channels: ["in-app", "email"],
        meta: {
          userId: user._id,
        },
      });
    } catch (e) {
      console.error("Failed to send PASSWORD_CHANGED notification", e);
    }

    // no return (same as original logic)
  },

  async sendResetOtp(email) {
    if (!email) {
      throw new ApiError(400, "Email is required");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new ApiError(400, "User with this email is not exist");
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    await OTP.create({ email, otp });

    const subject = "OTP for resetting your SmartCart password";
    const html = `<p>Hello 👋,</p>

<p>We received a request to reset the password for your <strong>SmartCart</strong> account.</p>

<p>Your One-Time Password (OTP) for password reset is:</p>

<h2 style="color: #d9534f;">${otp}</h2>

<p>This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone to keep your account secure.</p>

<p>If you did not request a password reset, please contact our support team immediately or ignore this email.</p>

<p>Stay safe,<br>
Team SmartCart</p>`;

    await sendEmail(email, subject, html);
  },

  async verifyResetOtp(email, otp) {
    if (!email || !otp) {
      throw new ApiError(400, "Email and OTP are required");
    }

    const existingOtp = await OTP.findOne({ email });
    if (!existingOtp || existingOtp.otp !== otp) {
      throw new ApiError(400, "Invalid  OTP");
    }

    if (existingOtp.expiresAt < Date.now()) {
      await OTP.deleteOne({ email });
      throw new ApiError(400, "OTP has expired. Please request a new one.");
    }

    await OTP.deleteOne({ email });
  },

  async resetPassword(email, newPassword) {
    if (!(email && newPassword)) {
      throw new ApiError(400, "Email and new password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      throw new ApiError(404, "User does not exist");
    }

    const isSame = await user.isPasswordCorrect(newPassword);
    if (isSame) {
      throw new ApiError(400, "New password cannot be the same as the old password");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    try {
      await createAndSendNotification({
        recipientId: user._id,
        recipientRole: user.role,
        recipientEmail: user.email,
        type: "PASSWORD_RESET",
        title: "Password reset successfully",
        message: "Your password was reset using the OTP password reset flow.",
        relatedEntity: { entityType: "user", entityId: user._id },
        channels: ["in-app", "email"],
        meta: {
          userId: user._id,
        },
      });
    } catch (e) {
      console.error("Failed to send PASSWORD_RESET notification", e);
    }
  },


  async refreshAccessToken(incomingRefreshToken) {
    if (!incomingRefreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    try {
      const decodedToken = jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const user = await User.findById(decodedToken?._id);
      if (!user) {
        throw new ApiError(404, "Invalid refresh token");
      }

      if (!user.refreshToken || user.refreshToken !== incomingRefreshToken.trim()) {
        throw new ApiError(401, "Refresh token is expired or invalid");
      }

      return user; // token rotate controller karega
    } catch (error) {
      throw new ApiError(401, error?.message || "Invalid refresh token");
    }
  },



  async updateUserAvatar(userId, file) {
    const avatarLocalPath = file?.path;

    if (!avatarLocalPath) {
      return null; // controller same response bhejega
    }

    const user = await User.findById(userId);

    if (user?.avatar_public_id) {
      await cloudinary.v2.uploader.destroy(user.avatar_public_id);
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);

    if (!avatar?.url || !avatar?.public_id) {
      throw new ApiError(400, "Failed to upload new avatar");
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: avatar.url,
          avatar_public_id: avatar.public_id,
        },
      },
      { new: true }
    ).select("-password -refreshToken");

    return updatedUser;
  },

  async updateAddress(userId, data) {
  const { label, street, city, state, country, pinCode, isDefault } = data;

  if (!(label && street && city && state && country && pinCode && isDefault)) {
    throw new ApiError(400, "All fields are required");
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedAddress = {
    label,
    street,
    city,
    state,
    country: country || "India",
    pincode: pinCode,
    isDefault: isDefault || false,
  };

  if (user.address.length === 0) {
    user.address.push(updatedAddress);
  } else {
    user.address[0] = updatedAddress;
  }

  await user.save();

  return user.address[0];
},

  async updateAccountDetails(userId, data) {
  const { fullname, username, phone, email } = data;

  if (!(fullname || username || phone || email)) {
    throw new ApiError(400, "At least one field is required to update");
  }

  const user = await User.findById(userId).select("-password -refreshToken");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (email && email !== user.email) {
    const emailExists = await User.findOne({ email });
    if (emailExists && emailExists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Email is already taken");
    }
  }

  if (username && username !== user.username) {
    const usernameExists = await User.findOne({ username });
    if (usernameExists && usernameExists._id.toString() !== userId.toString()) {
      throw new ApiError(400, "Username is already taken");
    }
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        fullname: fullname || user.fullname,
        username: username || user.username,
        phone: phone || user.phone,
        email: email || user.email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  try {
    await createAndSendNotification({
      recipientId: updatedUser._id,
      recipientRole: updatedUser.role,
      recipientEmail: updatedUser.email,
      type: "PROFILE_UPDATED",
      title: "Profile updated",
      message: "Your account details were updated.",
      relatedEntity: { entityType: "user", entityId: updatedUser._id },
      channels: ["in-app","email"],
      meta: {
        userId: updatedUser._id,
      },
    });
  } catch (e) {
    console.error("Failed to send PROFILE_UPDATED notification", e);
  }

  return updatedUser;
},



async getSellerProfile(userId, role) {
  if (!userId || role !== "seller") {
    throw new ApiError(403, "Acess denied. Only seller can access ");
  }

  const seller = await User.findById(userId)
    .select("-password -refreshToken -otp");

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  return seller;
},

async updateSellerProfile(userId, data, file) {
  const {
    fullname, email, username, phone,
    shopName, shopAddress, gstNumber, businessType,
    accountHolderName, bankAccountNumber, ifscCode, upiId
  } = data;

  const seller = await User.findById(userId);

  if (!seller) {
    throw new ApiError(404, "Seller not found");
  }

  if (seller.role !== "seller") {
    throw new ApiError(403, "Only sellers can update seller profile");
  }

  if (fullname) seller.fullname = fullname;
  if (email) seller.email = email;
  seller.isEmailVerified = false;
  if (username) seller.username = username;
  if (phone) seller.phone = phone;

  if (shopName) seller.shopName = shopName;
  if (shopAddress) seller.shopAddress = shopAddress;
  if (gstNumber) seller.gstNumber = gstNumber;
  if (businessType) seller.businessType = businessType;
  if (accountHolderName) seller.accountHolderName = accountHolderName;
  if (bankAccountNumber) seller.bankAccountNumber = bankAccountNumber;
  if (ifscCode) seller.ifscCode = ifscCode;
  if (upiId) seller.upiId = upiId;

  if (file) {
    if (seller.storeBanner) {
      await cloudinary.v2.uploader.destroy(seller.storeBanner_public_id);
    }

    const uploadResult = await uploadOnCloudinary(file.path);

    if (!uploadResult.url || !uploadResult.public_id) {
      throw new ApiError(400, "Failed to upload new store Banner");
    }

    seller.storeBanner = uploadResult.url;
    seller.storeBanner_public_id = uploadResult.public_id;
  }

  const allFieldsFilled =
    seller.shopName &&
    seller.shopAddress &&
    seller.gstNumber &&
    seller.businessType &&
    seller.accountHolderName &&
    seller.bankAccountNumber &&
    seller.ifscCode &&
    seller.upiId &&
    seller.storeBanner;

  if (allFieldsFilled) {
    seller.isSellerProfileComplete = true;
  } else {
    seller.isSellerProfileComplete = false;
  }

  await seller.save();

  try {
    await createAndSendNotification({
      recipientId: seller._id,
      recipientRole: "seller",
      recipientEmail: seller.email,
      type: "SELLER_PROFILE_UPDATED",
      title: "Store profile updated",
      message:
        "Your seller/store profile has been updated. If you changed business or bank details, they may be reviewed.",
      relatedEntity: { entityType: "user", entityId: seller._id },
      channels: ["in-app", "email"],
      meta: {
        userId: seller._id,
      },
    });
  } catch (e) {
    console.error("Failed to send SELLER_PROFILE_UPDATED notification", e);
  }

  return seller;
},

async getProductWiseBreakdown(sellerId) {
    const data = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.seller": new mongoose.Types.ObjectId(sellerId) } },
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
          name: "$productDetails.name",
          totalUnitsSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return data;
  },

async getTopSellingItems(sellerId) {
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.seller": new mongoose.Types.ObjectId(sellerId) } },
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
          productId: "$_id",
          name: "$productDetails.name",
          totalUnitsSold: 1,
        },
      },
    ]);

    return topProducts;
  },


  async getDailySalesData(sellerId) {
    const dailyData = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.seller": new mongoose.Types.ObjectId(sellerId) } },
      {
        $group: {
          _id: {
            date: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
            },
          },
          totalRevenue: {
            $sum: { $multiply: ["$items.quantity", "$items.price"] },
          },
          totalOrders: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
      {
        $project: {
          date: "$_id.date",
          totalRevenue: 1,
          totalOrders: 1,
          _id: 0,
        },
      },
    ]);

    return dailyData;
  },


  async approveSeller(id) {
    const seller = await User.findById(id);

    if (!seller || seller.role !== "seller") {
      throw new ApiError(404, "Seller not found or invalid");
    }

    if (seller.isSellerApproved) {
      return { alreadyApproved: true };
    }

    seller.isSellerApproved = true;
    seller.isSellerSuspended = false;

    await seller.save();

    try {
      await createAndSendNotification({
        recipientId: seller._id,
        recipientRole: "seller",
        recipientEmail: seller.email,
        type: "SELLER_APPROVED",
        title: "Seller account approved",
        message:
          "Congratulations! Your seller account has been approved. You can now start selling on SmartCart.",
        relatedEntity: { entityType: "user", entityId: seller._id },
        channels: ["in-app", "email"],
        meta: {
          userId: seller._id,
        },
      });
    } catch (e) {
      console.error("Failed to send SELLER_APPROVED notification", e);
    }

    return { alreadyApproved: false, seller };
  },

  async suspendSeller(id) {
  const seller = await User.findById(id);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found or invalid");
  }

  if (seller.isSellerSuspended) {
    return { alreadySuspended: true };
  }

  seller.isSellerSuspended = true;
  await seller.save();

  try {
    await createAndSendNotification({
      recipientId: seller._id,
      recipientRole: "seller",
      recipientEmail: seller.email,
      type: "SELLER_SUSPENDED",
      title: "Seller account suspended",
      message:
        "Your seller account has been suspended by admin. Please contact support for more details.",
      relatedEntity: { entityType: "user", entityId: seller._id },
      channels: ["in-app", "email"],
      meta: {
        userId: seller._id,
      },
    });
  } catch (e) {
    console.error("Failed to send SELLER_SUSPENDED notification", e);
  }

  return { alreadySuspended: false, seller };
},


async unsuspendSeller(id) {
  const seller = await User.findById(id);

  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found or invalid");
  }

  if (!seller.isSellerSuspended) {
    return { notSuspended: true };
  }

  seller.isSellerSuspended = false;
  await seller.save();

  try {
    await createAndSendNotification({
      recipientId: seller._id,
      recipientRole: "seller",
      recipientEmail: seller.email,
      type: "SELLER_UNSUSPENDED",
      title: "Seller account unsuspended",
      message:
        "Your seller account suspension has been removed. You can now continue selling.",
      relatedEntity: { entityType: "user", entityId: seller._id },
      channels: ["in-app", "email"],
      meta: {
        userId: seller._id,
      },
    });
  } catch (e) {
    console.error("Failed to send SELLER_UNSUSPENDED notification", e);
  }

  return { notSuspended: false, seller };
},


async deactivateUserAccount(id) {
  const user = await User.findById(id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (!user.isActive) {
    return { alreadyDeactivated: true };
  }

  user.isActive = false;
  await user.save();

  try {
    await createAndSendNotification({
      recipientId: user._id,
      recipientRole: user.role,
      recipientEmail: user.email,
      type: "ACCOUNT_DEACTIVATED",
      title: "Account deactivated",
      message:
        "Your account has been deactivated by admin. You can no longer access SmartCart until it is reactivated.",
      relatedEntity: { entityType: "user", entityId: user._id },
      channels: ["in-app", "email"],
      meta: {
        userId: user._id,
      },
    });
  } catch (e) {
    console.error("Failed to send ACCOUNT_DEACTIVATED notification", e);
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
    await createAndSendNotification({
      recipientId: user._id,
      recipientRole: user.role,
      recipientEmail: user.email,
      type: "ACCOUNT_REACTIVATED",
      title: "Account reactivated",
      message:
        "Your account has been reactivated by admin. You can now access SmartCart again.",
      relatedEntity: { entityType: "user", entityId: user._id },
      channels: ["in-app", "email"],
      meta: {
        userId: user._id,
      },
    });
  } catch (e) {
    console.error("Failed to send ACCOUNT_REACTIVATED notification", e);
  }

  return { alreadyActive: false, user };
},

  
};
