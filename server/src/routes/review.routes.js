import { Router } from "express";
import {
  createReview,
  updateReview,
  deleteReview,
  getProductReviews,
  getMyReviews,
  markReviewHelpful,
  reportReview,
  getSellerReviews,
  replyToReview,
  getSellerReviewSummary,
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

router
  .route("/reviews")
  .post(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    createReview,
  );

router
  .route("/reviews/:reviewId")
  .put(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    updateReview,
  );

router
  .route("/reviews/:reviewId")
  .delete(verifyJWT, authorizedRole("customer"), deleteReview);

router.route("/products/:productId/reviews").get(getProductReviews);

router
  .route("/my/reviews")
  .get(verifyJWT, authorizedRole("customer"), getMyReviews);

router
  .route("/reviews/:reviewId/helpful")
  .post(verifyJWT, authorizedRole("customer"), markReviewHelpful);

router
  .route("/reviews/:reviewId/report")
  .post(verifyJWT, authorizedRole("customer"), reportReview);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

router
  .route("/seller/reviews")
  .get(verifyJWT, authorizedRole("seller"), getSellerReviews);

router
  .route("/seller/reviews/:reviewId/reply")
  .post(verifyJWT, authorizedRole("seller"), replyToReview);

router
  .route("/seller/reviews/summary")
  .get(verifyJWT, authorizedRole("seller"), getSellerReviewSummary);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================


router
  .route("/admin/reviews")
  .get(verifyJWT, authorizedRole("admin"), adminListReviews);

router
  .route("/admin/reviews/view/:reviewId")
  .get(verifyJWT, authorizedRole("admin"), adminGetReviewDetails);

router
  .route("/admin/reviews/moderate/:reviewId")
  .post(verifyJWT, authorizedRole("admin"), adminModerateReview);

router
  .route("/admin/reviews/feature/:reviewId")
  .patch(verifyJWT, authorizedRole("admin"), adminFeatureReview);

router
  .route("/admin/reviews/delete/:reviewId")
  .delete(verifyJWT, authorizedRole("admin"), adminDeleteReview);

router
  .route("/admin/reviews/analytics")
  .get(verifyJWT, authorizedRole("admin"), adminReviewsAnalytics);

export default router;
