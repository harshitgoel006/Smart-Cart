import { Router } from "express";
import {
  customerGetAllProducts,
  getNewArrivalProduct,
  getProductById,
  getProductsByCategory,
  getTopRatedProduct,
  searchProduct,
  getRelatedProducts,
  getProductReview,
  submitReview,
  getProductQnA,
  askProductQuestion,
  createProduct,
  getSellerProduct,
  updateProduct,
  deleteProduct,
  manageProductStock,
  variantManagement,
  getProductOrders,
  respondToProductQnA,
  archiveProduct,
  restoreArchiveProduct,
  getProductFeedback,
  scheduleFlashSale,
  approveProducts,
  rejectProduct,
  adminGetAllProducts,
  moderateProductContent,
  bulkModerateProducts,
  toggleAdminProductStatus,
  toggleSellerProductField,
  removeFlashSale,
} from "../controllers/product.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

router.route("/").get(customerGetAllProducts);

router.route("/product/:productId").get(getProductById);

router.route("/top-rated").get(getTopRatedProduct);

router.route("/new-arrivals").get(getNewArrivalProduct);

router.route("/category/:categoryId").get(getProductsByCategory);

router.route("/search").get(searchProduct);

router.route("/product/:productId/related").get(getRelatedProducts);

router.route("/product/:productId/reviews").get(getProductReview);

router
  .route("/product/:productId/reviews")
  .post(verifyJWT, authorizedRole("customer"), submitReview);

router.route("/product/:productId/qna").get(getProductQnA);

router
  .route("/product/:productId/qna")
  .post(verifyJWT, authorizedRole("customer"), askProductQuestion);

// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================

router.route("/create").post(
  verifyJWT,
  authorizedRole("seller"),
  upload.array("images", 5), // max 5 files
  createProduct,
);

router
  .route("/seller/product/:productId")
  .get(verifyJWT, authorizedRole("seller"), getSellerProduct);

router
  .route("/seller/product/:productId")
  .put(
    verifyJWT,
    authorizedRole("seller"),
    upload.array("images", 5),
    updateProduct,
  );

router
  .route("/seller/product/:productId")
  .delete(verifyJWT, authorizedRole("seller"), deleteProduct);

router
  .route("/product/:productId/stock")
  .patch(verifyJWT, authorizedRole("seller"), manageProductStock);

router
  .route("/product/:productId/variants")
  .patch(verifyJWT, authorizedRole("seller"), variantManagement);

router
  .route("/product/:productId/orders")
  .get(verifyJWT, authorizedRole("seller"), getProductOrders);

router
  .route("/product/:productId/qna/:questionId/respond")
  .post(verifyJWT, authorizedRole("seller"), respondToProductQnA);

router
  .route("/product/:productId/archive")
  .post(verifyJWT, authorizedRole("seller"), archiveProduct);

router
  .route("/product/:productId/restore")
  .post(verifyJWT, authorizedRole("seller"), restoreArchiveProduct);

router
  .route("/product/:productId/feedback")
  .get(verifyJWT, authorizedRole("seller"), getProductFeedback);

router
  .route("/product/:productId/toggle-feature")
  .post(verifyJWT, authorizedRole("seller"), toggleSellerProductField);

router
  .route("/product/:productId/toggle-active")
  .post(verifyJWT, authorizedRole("seller"), toggleSellerProductField);

router
  .route("/product/:productId/flash-sale")
  .post(verifyJWT, authorizedRole("seller"), scheduleFlashSale);


router
  .route("/product/:productId/delete-flash-sale")
  .delete(verifyJWT, authorizedRole("seller"), removeFlashSale);

// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================

router
  .route("/products")
  .get(verifyJWT, authorizedRole("admin"), adminGetAllProducts);

router
  .route("/products/:productId/approve")
  .post(verifyJWT, authorizedRole("admin"), approveProducts);

router
  .route("/products/:productId/reject")
  .post(verifyJWT, authorizedRole("admin"), rejectProduct);

router
  .route("/products/:productId/moderate")
  .post(verifyJWT, authorizedRole("admin"), moderateProductContent);

router
  .route("/product/:productId/toggle-status")
  .post(verifyJWT, authorizedRole("admin"), toggleAdminProductStatus);

router
  .route("/products/bulk-moderate")
  .post(verifyJWT, authorizedRole("admin"), bulkModerateProducts);

export default router;
