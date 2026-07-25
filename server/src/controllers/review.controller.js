import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { reviewService } from "../services/review.service.js";

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

const createReview = asyncHandler(async (req, res) => {
  const review = await reviewService.createReview(
    req.user._id,
    req.params.productId,
    req.body,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review submitted successfully"));
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(
    req.user._id,
    req.params.reviewId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review updated successfully"));
});

const deleteReview = asyncHandler(async (req, res) => {
  const result = await reviewService.deleteReview(
    req.user._id,
    req.params.reviewId,
    req.user.role,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Review deleted successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getProductReviews(
    req.params.productId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Reviews fetched successfully"));
});

const getMyReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getMyReviews(req.user._id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Your reviews fetched successfully"));
});

const markReviewHelpful = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { type } = req.body;

  const review = await reviewService.markReviewHelpful(
    req.user._id,
    reviewId,
    type,
  );

  const helpfulCount = review.votes.filter((v) => v.type === "helpful").length;
  const notHelpfulCount = review.votes.filter(
    (v) => v.type === "not_helpful",
  ).length;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        helpfulCount,
        notHelpfulCount,
      },
      "Vote recorded successfully",
    ),
  );
});

const reportReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { reason } = req.body;

  const result = await reviewService.reportReview(
    req.user._id,
    reviewId,
    reason,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Review reported successfully"));
});

// ======================================================
// ================ SELLER PANEL HANDLERS ===============
// ======================================================

const getSellerReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getSellerReviews(req.user._id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Seller reviews fetched successfully"));
});

const replyToReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { message } = req.body;

  const review = await reviewService.replyToReview(
    req.user._id,
    reviewId,
    message,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Reply submitted successfully"));
});

const getSellerReviewSummary = asyncHandler(async (req, res) => {
  const data = await reviewService.getSellerReviewSummary(
    req.user._id,
    req.query.productId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, data, "Seller review summary fetched successfully"),
    );
});

// ======================================================
// ================ ADMIN PANEL HANDLERS ================
// ======================================================

const adminListReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.adminListReviews(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Admin reviews fetched successfully"));
});

const adminGetReviewDetails = asyncHandler(async (req, res) => {
  const data = await reviewService.adminGetReviewDetails(req.params.reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Review details fetched successfully"));
});

const adminModerateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { action, reason } = req.body;

  const review = await reviewService.adminModerateReview(
    req.user._id,
    reviewId,
    action,
    reason,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review moderated successfully"));
});

const adminFeatureReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { featured } = req.body;

  const review = await reviewService.adminFeatureReview(
    req.user._id,
    reviewId,
    featured,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        review,
        `Review ${featured ? "featured" : "unfeatured"} successfully`,
      ),
    );
});

const adminDeleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await reviewService.adminDeleteReview(req.user._id, reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review deleted successfully"));
});

const adminReviewsAnalytics = asyncHandler(async (req, res) => {
  const data = await reviewService.adminReviewsAnalytics(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Reviews analytics fetched successfully"));
});

export {
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
};
