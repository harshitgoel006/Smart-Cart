import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { reviewService } from "../services/review.service.js";

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

// This controller is used for creating a new review for a product. The user must have purchased the product to be able to review it. The review will be in pending state until approved by admin.
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

// This controller is used for updating an existing review. The user can only update their own reviews and only if the review is still pending or rejected. Approved reviews cannot be updated.
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

// This controller is used for deleting a review. The user can only delete their own reviews and only if the review is still pending or rejected. Approved reviews cannot be deleted.
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

// This controller is used for fetching reviews of a product. It supports pagination and sorting. Only approved reviews are returned in this endpoint.
const getProductReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getProductReviews(
    req.params.productId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Reviews fetched successfully"));
});

// This controller is used for fetching the reviews written by the logged in user. It supports pagination and sorting. All reviews (pending, approved, rejected) are returned in this endpoint.
const getMyReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getMyReviews(req.user._id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Your reviews fetched successfully"));
});

// This controller is used for marking a review as helpful or not helpful. The user can only vote once per review and can change their vote. The review author cannot vote on their own review.
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

// This controller is used for reporting a review. The user can report a review if they find it inappropriate or fake. The report will be reviewed by admin and appropriate action will be taken.
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

// This controller is used for fetching reviews received by the seller for their products. It supports pagination and sorting. All reviews (pending, approved, rejected) are returned in this endpoint.
const getSellerReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.getSellerReviews(req.user._id, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Seller reviews fetched successfully"));
});

//  This controller is used for replying to a review. The seller can reply to reviews received for their products. The reply will be visible under the review and can be seen by everyone. The seller can only reply once to a review and cannot edit or delete the reply.
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

// This controller is used for fetching the review summary for a seller. It returns the average rating, total number of reviews, and rating distribution for the seller's products. Only approved reviews are considered in this summary.
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

// This controller is used for fetching reviews for admin review management. It supports pagination, sorting, and filtering by status (pending, approved, rejected). Admin can see all reviews irrespective of their status.
const adminListReviews = asyncHandler(async (req, res) => {
  const data = await reviewService.adminListReviews(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Admin reviews fetched successfully"));
});

// This controller is used for fetching the details of a review for admin review management. It returns all details of the review including the product, reviewer, and any reports associated with the review. This is used by admin to make decisions on pending reviews and reported reviews.
const adminGetReviewDetails = asyncHandler(async (req, res) => {
  const data = await reviewService.adminGetReviewDetails(req.params.reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Review details fetched successfully"));
});

// This controller is used for moderating a review by admin. Admin can approve, reject, or mark a review as fake. The action taken by admin will be recorded in the review's moderation history along with the reason provided by admin. The user will be notified about the action taken on their review.
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

// This controller is used for featuring or unfeaturing a review by admin. Admin can feature a review if it is helpful and well written. Featured reviews will be highlighted on the product page and may receive more visibility. Admin can also unfeature a review if it no longer meets the criteria for featuring.
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

// This controller is used for deleting a review by admin. Admin can delete a review if it violates the platform's guidelines or if it is fake. Deleted reviews will be removed from the product page and will not be visible to users. The user will be notified about the deletion of their review.
const adminDeleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;

  const review = await reviewService.adminDeleteReview(req.user._id, reviewId);

  return res
    .status(200)
    .json(new ApiResponse(200, review, "Review deleted successfully"));
});

// This controller is used for fetching analytics data for reviews for admin. It returns data such as average rating, total number of reviews, rating distribution, and trends over time. This data can be used by admin to monitor the overall review performance and identify any issues or areas for improvement.
const adminReviewsAnalytics = asyncHandler(async (req, res) => {
  const data = await reviewService.adminReviewsAnalytics(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Reviews analytics fetched successfully"));
});

// Exporting the controllers as an object for easier import in routes
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
