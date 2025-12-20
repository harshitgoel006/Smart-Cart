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



// ======================================================
// =============== AUTHENTHICATION HANDLERS ============
// ======================================================


// generate refresh and access token
const generateAccessAndRefreshToken = async (userId) =>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave : false})

        return {accessToken, refreshToken}
    
    }
    catch(error){
        throw new ApiError(
          500, 
          "Something went wrong while generate access and refresh token"
        );
    }
};

// send otp for registration
const sendOtp = asyncHandler(async (req, res) => {
    const {email, role} = req.body;
    
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

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            null, 
            "OTP sent successfully to your email"
        ));

});

// registration of user - {customer, seller, admin}
const registerUser = asyncHandler(async (req, res)=>{
   const { email, username, fullname, password, role, phone } = req.body;

  if (!email || !fullname || !username || !password || !role || !phone) {
    throw new ApiError(400, "All fields are required");
  }

  const userExists = await User.findOne({
    $or: [{ username }, { email }]
  });
  if (userExists) {
    throw new ApiError(400, "User with this email  already exists");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
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
      recipientId: null, // optional: use admin user id if you have it
      recipientRole: "admin",
      recipientEmail: null,
      type: "NEW_USER_REGISTERED",
      title: "New user registered",
      message: `New ${role} registered: ${fullname} (${email})`,
      relatedEntity: { entityType: "user", entityId: user._id },
      channels: ["in-app"],
      meta: {
        userId: user._id,
        role,
        email,
      },
    });
  } catch (e) {
    console.error("Failed to send NEW_USER_REGISTERED notification", e);
  }  

  return res.status(201).json(
    new ApiResponse(200, createdUser, "User registered successfully")
  );
});

// verify otp through email
const verifyOtp = asyncHandler(async (req, res) => {

const { email, otp } = req.body;
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
  return res.status(200).json(
    new ApiResponse(200, null, "OTP verified successfully")
  );
});

// login of user - {customer, seller, admin}
const loginUser = asyncHandler(async (req, res) => {
   

const {email,  password} = req.body

if(!email){
    throw new ApiError(400," email is required" )
}

const user = await User.findOne({email}).select("+password +refreshToken")
if(!user){
    throw new ApiError(404, "User does not exist")
}
if(!user.isActive || user.isDeleted){
  throw new ApiError(403, "Your account is inactive or deleted. Contact support.")
}
if(user.role === "seller"){
  if(!user.isSellerApproved){
    throw new ApiError(403, "Seller account is not approved yet")
  }
  if(user.isSellerSuspended){
    throw new ApiError(403, "Your account is suspended. Contact support.")
  }
}
const isPasswordValid = await user.isPasswordCorrect(password)
if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
}

if(!user.isEmailVerified){
  throw new ApiError(401, "Email not verified yet. Please verify your email first.")
}
const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

const options = {
    httpOnly: true,
    secure: false,
}

return res
.status(200)
.cookie("accessToken",accessToken, options)
.cookie("refreshToken",refreshToken, options)
.json(
    new ApiResponse(
        200,
        {
            user: loggedInUser, accessToken, refreshToken
        },
        "User logged in Successfully"
    )
)

});

// logout of user -{customer, seller, admin}
const logoutUser = asyncHandler(async(req,res) =>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    ) 
    const options = {
    httpOnly: true,
    secure: true,
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200, {}, "User logout Successfully"))
    
});

// change of current password through old password
const changeCurrentPassword = asyncHandler(async (req, res)=>{

  const {oldPassword, newPassword} = req.body;
  if(!(oldPassword && newPassword)){
    throw new ApiError(400, "Old password and new password are required");
  }
  const user = await User.findById(req.user?._id).select("+password");

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if(!isPasswordCorrect){
    throw new ApiError(401, "Old password is incorrect");
  }

const isSame = await user.isPasswordCorrect(newPassword);
  if (isSame) {
    throw new ApiError(400, "Old and new password cannot be the same");
  }

  user.password = newPassword;

  await user.save({validateBeforeSave: false});

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

  return res 
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "Password changed successfully"
    )
  )


});

// sending otp for forget password
const sendResetOtp = asyncHandler(async (req, res)=>{
  const {email} = req.body;
    
    if(!email){
        throw new ApiError(400, "Email is required");
    }

    const existingUser = await User.findOne({email});

    if(!existingUser){
        throw new ApiError(400, "User with this email is not exist");
    }


    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({email}); // Clear any existing OTP for the email
    await OTP.create({email, otp});

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

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            null, 
            "OTP sent successfully to your email"
        ));
});

// verify the reset otp 
const verifyResetOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;
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

  return res.status(200).json(
    new ApiResponse(200, null, "OTP verified successfully")
  );
});

// change the password through otp via email
const resetPassword = asyncHandler(async (req, res)=>{
  const {email, newPassword} = req.body;
  if(!(email && newPassword)){
    throw new ApiError(400, "Email and new password are required");
  }
  const user = await User.findOne({ email }).select("+password");

  if(!user){
    throw new ApiError(404, "User does not exist");
  }

  const isSame = await user.isPasswordCorrect(newPassword);
  if (isSame) {
    throw new ApiError(400, "New password cannot be the same as the old password");
  }
  user.password = newPassword;
  await user.save({validateBeforeSave: false});

  try {
    await createAndSendNotification({
      recipientId: user._id,
      recipientRole: user.role,
      recipientEmail: user.email,
      type: "PASSWORD_RESET",
      title: "Password reset successfully",
      message:
        "Your password was reset using the OTP password reset flow.",
      relatedEntity: { entityType: "user", entityId: user._id },
      channels: ["in-app", "email"],
      meta: {
        userId: user._id,
      },
    });
  } catch (e) {
    console.error("Failed to send PASSWORD_RESET notification", e);
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      {},
      "Password reset successfully"
    )
  );
});

//  refreshing access token
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken || req.query.refreshToken;
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

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed successfully"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

// update user avatar - {customer, seller, admin}
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return res
      .status(200)
      .json(new ApiResponse(200, null, "No avatar uploaded. Nothing was changed"));
  }

  const user = await User.findById(req.user?._id);

  if (user?.avatar_public_id) {
    await cloudinary.v2.uploader.destroy(user.avatar_public_id);
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar?.url || !avatar?.public_id) {
    throw new ApiError(400, "Failed to upload new avatar");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
        avatar_public_id: avatar.public_id,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res.status(200).json(
    new ApiResponse(200, updatedUser, "User avatar updated successfully")
  );
});

// update address of user - {customer, seller, admin}
const updateAddress = asyncHandler(async(req, res)=>{
  const {label, street, city, state, country, pinCode, isDefault} = req.body;
  if(!(label && street && city && state && country && pinCode && isDefault)){
    throw new ApiError(400, "All fields are required");
  }
  const user = await User.findById(req.user?._id);
  if(!user){
    throw new ApiError(404, "User not found");
  }

  const updatedAddress = {
    label,
    street,
    city,
    state,
    country:country || "India",
    pincode: pinCode,
    isDefault: isDefault || false,
  };

  if (user.address.length === 0) {
    user.address.push(updatedAddress);
  } else {
    
    user.address[0] = updatedAddress;
  }
  await user.save();

  return res
  .status(200)
  .json(
    new ApiResponse(
      200, 
      user.address[0], 
      "Address updated successfully"
    )
  );

});




// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================


//  customer fetch profile 
const getCurrentUser = asyncHandler(async (req, res)=> {
  if (!req.user) {
    throw new ApiError(401, "User not authenticated");
  }
  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      req.user,
      "Current user fetched successfully"
    )
  )
});

// customer update profile
const updateAccountDetails = asyncHandler(async(req, res)=>{
  const {fullname, username, phone,email} = req.body;

  if(!(fullname || username || phone || email)){
    throw new ApiError(400, "At least one field is required to update");
  }
  const userId = req.user?._id;
  const user = await User.findById(req.user?._id).select("-password -refreshToken");
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
    req.user?._id,
  {
    $set:{
      fullname: fullname || user.fullname,
      username: username || user.username,
      phone: phone || user.phone,
      email: email || user.email
    }
  },
  {new: true}
).select("-password -refreshToken");

try {
    await createAndSendNotification({
      recipientId: updatedUser._id,
      recipientRole: updatedUser.role,
      recipientEmail: null,
      type: "PROFILE_UPDATED",
      title: "Profile updated",
      message: "Your account details were updated.",
      relatedEntity: { entityType: "user", entityId: updatedUser._id },
      channels: ["in-app"],
      meta: {
        userId: updatedUser._id,
      },
    });
  } catch (e) {
    console.error("Failed to send PROFILE_UPDATED notification", e);
  }


return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      updatedUser,
      "User account details updated successfully"
    )
)
});



// ======================================================
// =============== SELLER ACCOUNT HANDLERS ==============
// ======================================================


//  seller fetch profile 
const getSellerProfile =  asyncHandler(async(req, res) =>{
  if(!req.user || req.user.role !== "seller"){
    throw new ApiError(403, "Acess denied. Only seller can access ")
  }
  const seller = await User.findById(req.user._id)
  .select("-password -refreshToken -otp")

  if(!seller){
    throw new ApiError(404, "Seller not found");
  }

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      seller,
      "Seller profile fetched successfully"
    ))

});

// seller update profile or complete profile if not
const updateSellerProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const {
    fullname, email, username, phone,
    shopName, shopAddress, gstNumber, businessType, 
    accountHolderName, bankAccountNumber, ifscCode, upiId 
  } = req.body;

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
  if(username) seller.username = username;
  if(phone) seller.phone = phone;

 
  if (shopName) seller.shopName = shopName;
  if (shopAddress) seller.shopAddress = shopAddress;
  if (gstNumber) seller.gstNumber = gstNumber;
  if (businessType) seller.businessType = businessType;
  if (accountHolderName) seller.accountHolderName = accountHolderName;
  if (bankAccountNumber) seller.bankAccountNumber = bankAccountNumber;
  if (ifscCode) seller.ifscCode = ifscCode;
  if (upiId) seller.upiId = upiId;

  if(req.file){
    if(seller.storeBanner){
      await 
      cloudinary.v2.uploader.destroy(seller.storeBanner_public_id);
    }
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if(!uploadResult.url || !uploadResult.public_id){
      throw new ApiError(400, "Failed to upload new store Banner")
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

if(allFieldsFilled){
  seller.isSellerProfileComplete = true;
}
else{
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


  return res.status(200).json(
    new ApiResponse(200, seller, "Seller profile updated successfully")
  );
});

// seller get product wise breakdown analysis
const getProductWiseBreakdown = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const data = await Order.aggregate([
    { $unwind: "$items" },
    { $match: { "items.seller": new mongoose.Types.ObjectId(sellerId) } },
    {
      $group: {
        _id: "$items.product",
        totalUnitsSold: { $sum: "$items.quantity" },
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
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

  res.status(200).json({
    success: true,
    data,
  });
});

// seller get top selling items 
const getTopSellingItems = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

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

  res.status(200).json({
    success: true,
    topProducts,
  });
});

// seller get daily sales data
const getDailySalesData = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

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
        totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
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

  res.status(200).json({
    success: true,
    dailyData,
  });
});



// ======================================================
// =============== ADMIN ACCOUNT HANDLERS ===============
// ======================================================



// admin approve seller
const approveSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await User.findById(id);
  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found or invalid");
  }

  if (seller.isSellerApproved) {
    return res.status(400).json({ message: "Seller is already approved" });
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

  res.status(200).json({
    success: true,
    message: "Seller approved successfully",
    seller,
  });
});

// admin suspend seller
const suspendSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await User.findById(id);
  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found or invalid");
  }

  if (seller.isSellerSuspended) {
    return res.status(400).json({ message: "Seller is already suspended" });
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

  res.status(200).json({
    success: true,
    message: "Seller suspended successfully",
    seller,
  });
});

// admin unsuspend seller
const unsuspendSeller = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const seller = await User.findById(id);
  if (!seller || seller.role !== "seller") {
    throw new ApiError(404, "Seller not found or invalid");
  }

  if (!seller.isSellerSuspended) {
    return res.status(400).json({ message: "Seller is not suspended" });
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

  res.status(200).json({
    success: true,
    message: "Seller unsuspended successfully",
    seller,
  });
});

// admin get all user- (customer + seller)
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users,
  });
});

// admin get all customer
const getAllCustomers = asyncHandler(async (req, res) => {
  const customers = await User.find({ role: "customer" })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: customers.length,
    customers,
  });
});

// admin get all seller
const getAllSellers = asyncHandler(async (req, res) => {
  const sellers = await User.find({ role: "seller" })
    .select("-password -refreshToken")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: sellers.length,
    sellers,
  });
});

// admin can deactivate user account
const deactivateUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  if (!user.isActive) {
    return res.status(400).json({ message: "User account already deactivated" });
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
  }catch (e) {
    console.error("Failed to send ACCOUNT_DEACTIVATED notification", e);
  }

  res.status(200).json({
    success: true,
    message: "User account deactivated successfully",
    user,
  });
});

// admin can activate user account again
const reactivateUserAccount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) throw new ApiError(404, "User not found");

  if (user.isActive) {
    return res.status(400).json({ message: "User account is already active" });
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

  res.status(200).json({
    success: true,
    message: "User account reactivated successfully",
    user,
  });
});



export {
    sendOtp,
    registerUser,
    verifyOtp,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    sendResetOtp,
    verifyResetOtp,
    resetPassword,
    refreshAccessToken,

    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateAddress,

    getSellerProfile,
    updateSellerProfile,
    getProductWiseBreakdown,
    getTopSellingItems,
    getDailySalesData,

    approveSeller,
    suspendSeller,
    unsuspendSeller,
    getAllUsers,
    getAllCustomers,
    getAllSellers,
    deactivateUserAccount,
    reactivateUserAccount,
  
}

