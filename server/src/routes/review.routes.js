// This file defines the routes for handling review-related operations in the application. It includes routes for customers to create, update, delete, and view reviews, as well as mark reviews as helpful and report them. It also includes routes for sellers to view reviews of their products, reply to reviews, and get a summary of their reviews. Additionally, there are routes for admins to manage reviews, including listing all reviews, viewing review details, moderating reviews, featuring reviews, deleting reviews, and getting analytics on reviews. Each route is protected by JWT authentication and role-based authorization to ensure that only authorized users can access the respective functionalities.

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

// This route is for creating a new review. It requires the user to be authenticated and have the "customer" role. The route also uses multer middleware to handle file uploads for review images, allowing up to 5 images to be uploaded with the review. The controller function `createReview` will handle the logic for validating the review input, saving the review and associated images in the database, and returning an appropriate response indicating the success or failure of the review creation.
router
  .route("/reviews")
  .post(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    createReview,
  );

// This route is for updating an existing review by its ID. It requires the user to be authenticated and have the "customer" role. The route also uses multer middleware to handle file uploads for review images, allowing up to 5 images to be uploaded when updating the review. The controller function `updateReview` will handle the logic for validating the review update input, ensuring that the review belongs to the logged-in user, updating the review and associated images in the database, and returning an appropriate response indicating the success or failure of the review update.
router
  .route("/reviews/:reviewId")
  .put(
    verifyJWT,
    authorizedRole("customer"),
    upload.array("images", 5),
    updateReview,
  );

// This route is for deleting a review by its ID. It requires the user to be authenticated and have the "customer" role. The controller function `deleteReview` will handle the logic for ensuring that the review belongs to the logged-in user, deleting the review and associated images from the database, and returning an appropriate response indicating the success or failure of the review deletion.
router
  .route("/reviews/:reviewId")
  .delete(verifyJWT, authorizedRole("customer"), deleteReview);

// This route is for fetching reviews for a specific product by its ID. It does not require authentication, allowing anyone to view the reviews of a product. The controller function `getProductReviews` will handle the logic for retrieving the reviews of the specified product from the database, applying pagination and filtering based on query parameters such as page, limit, and rating, and returning them in the response.
router.route("/products/:productId/reviews").get(getProductReviews);

// This route is for fetching the reviews of the logged-in user. It requires the user to be authenticated and have the "customer" role. The controller function `getMyReviews` will handle the logic for retrieving the reviews written by the logged-in user from the database, applying pagination based on query parameters such as page and limit, and returning them in the response.
router
  .route("/my/reviews")
  .get(verifyJWT, authorizedRole("customer"), getMyReviews);

// This route is for marking a review as helpful. It requires the user to be authenticated and have the "customer" role. The controller function `markReviewHelpful` will handle the logic for ensuring that the review exists, updating the helpful count of the review in the database, and returning an appropriate response indicating the success or failure of marking the review as helpful.
router
  .route("/reviews/:reviewId/helpful")
  .post(verifyJWT, authorizedRole("customer"), markReviewHelpful);

// This route is for reporting a review. It requires the user to be authenticated and have the "customer" role. The controller function `reportReview` will handle the logic for validating the report input, ensuring that the review exists, saving the report information in the database, and returning an appropriate response indicating the success or failure of reporting the review.
router
  .route("/reviews/:reviewId/report")
  .post(verifyJWT, authorizedRole("customer"), reportReview);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

// This route is for fetching the reviews of the logged-in seller's products. It requires the user to be authenticated and have the "seller" role. The controller function `getSellerReviews` will handle the logic for retrieving the reviews of the seller's products from the database, applying pagination based on query parameters such as page and limit, and returning them in the response.
router
  .route("/seller/reviews")
  .get(verifyJWT, authorizedRole("seller"), getSellerReviews);

// This route is for replying to a review by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `replyToReview` will handle the logic for validating the reply input, ensuring that the review exists and belongs to one of the seller's products, saving the reply in the database, and returning an appropriate response indicating the success or failure of replying to the review.
router
  .route("/seller/reviews/:reviewId/reply")
  .post(verifyJWT, authorizedRole("seller"), replyToReview);

// This route is for fetching a summary of the reviews for the logged-in seller's products. It requires the user to be authenticated and have the "seller" role. The controller function `getSellerReviewSummary` will handle the logic for aggregating the reviews of the seller's products to generate a summary that includes metrics such as average rating, total number of reviews, distribution of ratings, and other relevant insights, and returning this summary in the response.
router
  .route("/seller/reviews/summary")
  .get(verifyJWT, authorizedRole("seller"), getSellerReviewSummary);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

// This route is for fetching all reviews for admin management. It requires the user to be authenticated and have the "admin" role. The controller function `adminListReviews` will handle the logic for retrieving all reviews from the database, applying filters, sorting, and pagination based on query parameters provided in the request, and returning them in the response for admin management purposes.

router
  .route("/admin/reviews")
  .get(verifyJWT, authorizedRole("admin"), adminListReviews);

// This route is for fetching the details of a specific review by its ID for admin management. It requires the user to be authenticated and have the "admin" role. The controller function `adminGetReviewDetails` will handle the logic for retrieving the review details from the database, including information about the review content, associated product, reviewer, and any reports or flags on the review, and returning this information in the response for admin management purposes.
router
  .route("/admin/reviews/view/:reviewId")
  .get(verifyJWT, authorizedRole("admin"), adminGetReviewDetails);

// This route is for moderating a specific review by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `adminModerateReview` will handle the logic for validating the moderation input (such as flags for inappropriate content), ensuring that the review exists, updating the review's moderation status in the database, and returning an appropriate response indicating the success or failure of the review moderation operation.
router
  .route("/admin/reviews/moderate/:reviewId")
  .post(verifyJWT, authorizedRole("admin"), adminModerateReview);

// This route is for featuring a specific review by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `adminFeatureReview` will handle the logic for ensuring that the review exists, updating the review's featured status in the database, and returning an appropriate response indicating the success or failure of the operation.
router
  .route("/admin/reviews/feature/:reviewId")
  .patch(verifyJWT, authorizedRole("admin"), adminFeatureReview);

// This route is for deleting a specific review by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `adminDeleteReview` will handle the logic for ensuring that the review exists, deleting the review and associated images from the database, and returning an appropriate response indicating the success or failure of the review deletion.
router
  .route("/admin/reviews/delete/:reviewId")
  .delete(verifyJWT, authorizedRole("admin"), adminDeleteReview);

// This route is for fetching analytics on reviews for admin insights. It requires the user to be authenticated and have the "admin" role. The controller function `adminReviewsAnalytics` will handle the logic for aggregating review data to generate various analytics such as average ratings, total number of reviews, distribution of ratings, most reviewed products, and other relevant insights, and returning this analytics data in the response for admin insights.
router
  .route("/admin/reviews/analytics")
  .get(verifyJWT, authorizedRole("admin"), adminReviewsAnalytics);

export default router;
