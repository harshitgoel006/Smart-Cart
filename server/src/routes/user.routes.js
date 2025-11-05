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
    getSellerProfile,
    getDailySalesData,
    getProductWiseBreakdown,
    getTopSellingItems,
    updateSellerProfile,
    approveSeller,
    suspendSeller,
    unsuspendSeller,
    getAllUsers,
    getAllSellers,
    getAllCustomers,
    reactivateUserAccount,
    deactivateUserAccount
 } from '../controllers/user.controller.js';
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {authorizedRole} from "../middlewares/authorizeRole.middleware.js"



const router = Router();



// ======================================================
// =============== AUTHENTHICATION HANDLERS ============
// ======================================================



// registration of user - {customer, seller, admin}
router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }
    ]),
    registerUser
)

// send otp for registration
router
.route("/send-otp")
.post(sendOtp);

router.post("/hello", (req, res) =>{
    res.send("hello from harshit")
})

// verify otp through email
router
.route("/verify-otp")
.post(verifyOtp)

// login of user - {customer, seller, admin}
router
.route("/login")
.post(loginUser);

// sending otp for forget password
router
.route("/send-reset-otp")
.post(sendResetOtp);

// verify the reset otp 
router
.route("/verify-reset-otp")
.post(verifyResetOtp);

// change the password through otp via email
router
.route("/reset-password")
.post(resetPassword);


// secured routes

// logout of user -{customer, seller, admin}
router
.route("/logout")
.post(
    verifyJWT, 
    logoutUser
)

// change of current password through old password
router
.route("/change-password")
.post(
    verifyJWT, 
    changeCurrentPassword
)

//  refreshing access token
router
.route("/refresh-token")
.post(
    refreshAccessToken
)

// update user avatar - {customer, seller, admin}
router
.route("/update-avatar")
.patch(
    verifyJWT,
    upload.single("avatar"),
    updateUserAvatar
)

// update address of user - {customer, seller, admin}
router
.route("/update-address")
.patch(
    verifyJWT,
    updateAddress
)



// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================



//  customer fetch profile 
router
.route("/get-user")
.get(
    verifyJWT,
    getCurrentUser
)

// customer update profile
router
.route("/update-account")
.patch(
    verifyJWT,
    updateAccountDetails
)



// ======================================================
// =============== SELLER ACCOUNT HANDLERS ==============
// ======================================================



//  seller fetch profile 
router
.route("/seller/profile")
.get(
    verifyJWT,
    authorizedRole("seller"), 
    getSellerProfile
)


// seller update profile or complete profile if not
router
.route("/seller/update-account")
.post(
    verifyJWT,
    authorizedRole("seller"), 
    updateSellerProfile
)

// seller get product wise breakdown analysis
router.route("/seller/product-breakdown")
.get(
    authorizedRole("seller"),
    getProductWiseBreakdown
)

// seller get top selling items 
router.route("/seller/top-products")
.get(
    authorizedRole("seller"),
    getTopSellingItems
)

// seller get daily sales data
router.route("/seller/daily-sales")
.get(
    authorizedRole("seller"),
    getDailySalesData
)



// ======================================================
// =============== ADMIN ACCOUNT HANDLERS ===============
// ======================================================



// admin approve seller
router.route("/admin/sellers/:id/approve")
.post(verifyJWT,
    authorizedRole("admin"),
    approveSeller
)

// admin suspend seller
router.route("/admin/sellers/:id/suspend")
.post(verifyJWT,
    authorizedRole("admin"),
    suspendSeller
)

// admin unsuspend seller
router.route("/admin/sellers/:id/unsuspend")
.post(verifyJWT,
    authorizedRole("admin"),
    unsuspendSeller
)

// admin get all user- (customer + seller)
router.route("/admin/users")
.get(verifyJWT,
    authorizedRole("admin"),
    getAllUsers
)

// admin get all seller
router.route("/admin/sellers")
.get(verifyJWT,
    authorizedRole("admin"),
    getAllSellers
)

// admin get all customer
router.route("/admin/customers")
.get(verifyJWT,
    authorizedRole("admin"),
    getAllCustomers
)

// admin can activate user account again
router.route("/admin/users/:id/reactivate")
.post(verifyJWT,
    authorizedRole("admin"),
    reactivateUserAccount
)

// admin can deactivate user account
router.route("/admin/users/:id/deactivate")
.post(verifyJWT,
    authorizedRole("admin"),
    deactivateUserAccount
)

export default router;