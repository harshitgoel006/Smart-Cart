import { Router } from "express";
import {
  // CUSTOMER PANEL HANDLERS
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getMyReviews,
  markReviewHelpful,
  reportReview,

  // SELLER PANEL HANDLERS
  getSellerReviews,
  replyToReview,
  getSellerReviewSummary,

  // ADMIN PANEL HANDLERS
  adminListReviews,
  adminGetReviewDetails,
  adminModerateReview,
  adminFeatureReview,
  adminDeleteReview,
  adminReviewsAnalytics,
} from "../controllers/review.controller.js";

import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();




// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================




// This route is for creating a new review for a product (with images)
router
  .route("/reviews")
  .post(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    createReview
  );

// This route is for updating an existing review of logged-in customer
router
  .route("/reviews/:reviewId")
  .put(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    updateReview
  );

// This route is for deleting a review of logged-in customer (soft delete)
router
  .route("/reviews/:reviewId")
  .delete(
    verifyJWT,
    authorizedRole("customer"),
    deleteReview
  );

// This route is for getting approved reviews of a product (public)
router
  .route("/products/:productId/reviews")
  .get(getProductReviews);

// This route is for getting all reviews created by logged-in customer
router
  .route("/my/reviews")
  .get(
    verifyJWT,
    authorizedRole("customer"),
    getMyReviews
  );

// This route is for marking a review helpful / not helpful
router
  .route("/reviews/:reviewId/helpful")
  .post(
    verifyJWT,
    authorizedRole("customer"),
    markReviewHelpful
  );

// This route is for reporting a review (spam/abuse/etc.)
router
  .route("/reviews/:reviewId/report")
  .post(
    verifyJWT,
    authorizedRole("customer"),
    reportReview
  );



// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================



// This route is for getting reviews of all products belonging to seller
router
  .route("/seller/reviews")
  .get(
    verifyJWT,
    authorizedRole("seller"),
    getSellerReviews
  );

// This route is for replying to a review by seller
router
  .route("/seller/reviews/:reviewId/reply")
  .post(
    verifyJWT,
    authorizedRole("seller"),
    replyToReview
  );

// This route is for getting rating summary per product for seller
router
  .route("/seller/reviews/summary")
  .get(
    verifyJWT,
    authorizedRole("seller"),
    getSellerReviewSummary
  );



// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================



// This route is for listing all reviews for admin with filters
router
  .route("/admin/reviews")
  .get(
    verifyJWT,
    authorizedRole("admin"),
    adminListReviews
  );

// This route is for viewing details of a specific review
router
  .route("/admin/reviews/view/:reviewId")
  .get(
    verifyJWT,
    authorizedRole("admin"),
    adminGetReviewDetails
  );

// This route is for approving or rejecting a review
router
  .route("/admin/reviews/moderate/:reviewId")
  .post(
    verifyJWT,
    authorizedRole("admin"),
    adminModerateReview
  );

// This route is for featuring / unfeaturing a review
router
  .route("/admin/reviews/feature/:reviewId")
  .patch(
    verifyJWT,
    authorizedRole("admin"),
    adminFeatureReview
  );

// This route is for deleting a review by admin (soft delete)
router
  .route("/admin/reviews/delete/:reviewId")
  .delete(
    verifyJWT,
    authorizedRole("admin"),
    adminDeleteReview
  );

// This route is for getting global reviews analytics for admin
router
  .route("/admin/reviews/analytics")
  .get(
    verifyJWT,
    authorizedRole("admin"),
    adminReviewsAnalytics
  );

export default router;
