import {Router} from 'express';
import { 
    registerUser, 
    sendOtp, 
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
    getSellerProfile
 } from '../controllers/user.controller.js';
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {authorizedRole} from "../middlewares/authorizeRole.middleware.js"



const router = Router();


// This route is used to register a new user
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

// This route is used to send OTP to the user for verification
router
.route("/send-otp")
.post(sendOtp);

// This route is used to verify the OTP sent to the user
router
.route("/verify-otp")
.post(verifyOtp)

// This route is used to login the user
router
.route("/login")
.post(loginUser);

// This route is used to send reset OTP to the user
router
.route("/send-reset-otp")
.post(sendResetOtp);

// This route is used to verify the reset OTP sent to the user
router
.route("/verify-reset-otp")
.post(verifyResetOtp);

// This route is used to reset the user's password
router
.route("/reset-password")
.post(resetPassword);


// secured routes

// This route is used to logout the user
router
.route("/logout")
.post(
    verifyJWT, 
    logoutUser
)

// This route is used to change the current user's password
router
.route("/change-password")
.post(
    verifyJWT, 
    changeCurrentPassword
)

// This route is used to refresh the access token
router
.route("/refresh-token")
.post(
    refreshAccessToken
)

// This route is used to get the current user's details
router
.route("/get-user")
.get(
    verifyJWT,
    getCurrentUser
)

// This route is used to update the current user's account details
router
.route("/update-account")
.patch(
    verifyJWT,
    updateAccountDetails
)

// This route is used to update the user's avatar
router
.route("/update-avatar")
.patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

// This route is used to update the user's address
router
.route("/update-address")
.patch(
    verifyJWT,
    updateAddress
)

// This route is used for to get seller profile
router
.route("/seller/profile")
.get(
    verifyJWT,
    authorizedRole("SELLER"), 
    getSellerProfile)


router
.route("/seller/update-account")
.patch(
    verifyJWT,
    authorizedRole("SELLER"), 
    updateAccountDetails
)


export default router;