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
    toggleProductFeature,
    scheduleFlashSale,

    approveProducts,
    rejectProduct,
    adminGetAllProducts,
    moderateProductContent,
    toggleProductStatus,
    bulkModerateProducts,

 } from "../controllers/product.controller.js";
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";


const router = Router();



// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================



// This route is used to get all products with optional filters
router.route("/").get(customerGetAllProducts);

// This route is used to get product by its ID
router.route("/product/:productId").get(getProductById);

// This route is used to get top rated products
router.route("/top-rated").get(getTopRatedProduct);

// This route is used to get new arrivals product
router.route("/new-arrivals").get(getNewArrivalProduct)

// This route is used to get product by category
router.route("/category/:categoryId").get(getProductsByCategory)

// This route is used to search products
router.route("/search").get(searchProduct);

// This route is used to get related products
router.route("/product/:productId/related").get(getRelatedProducts);

// This route is used to get product reviews
router.route("/product/:productId/reviews").get(getProductReview);

// This route is used to submit a review
router.route("/product/:productId/reviews").post(
  verifyJWT,
  authorizedRole("customer"),
  submitReview
);

// This route is used to get product QnA
router.route("/product/:productId/qna").get(getProductQnA);

// This route is used to ask a question about a product
router.route("/product/:productId/qna").post(
  verifyJWT,
  authorizedRole("customer"),
  askProductQuestion
);




// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================



// This route is used to create product
router.route("/create").post(
  verifyJWT,
  authorizedRole("seller"),
  upload.array("images", 5), // max 5 files
  createProduct
);

// This route is used to get a seller's product by ID
router.route("/product/:productId").get(
  verifyJWT,
  authorizedRole("seller"),
  getSellerProduct
);

// This route is used to update a seller's product
router.route("/product/:productId").put(
  verifyJWT,
  authorizedRole("seller"),
  updateProduct
);

// This route is used to delete a seller's product
router.route("/product/:productId").delete(
  verifyJWT,
  authorizedRole("seller"),
  deleteProduct
);

// This route is used to manage a seller's product stock
router.route("/product/:productId/stock").patch(
  verifyJWT,
  authorizedRole("seller"),
  manageProductStock
);

// This route is used to manage a seller's product variants
router.route("/product/:productId/variants").patch(
  verifyJWT,
  authorizedRole("seller"),
  variantManagement
);

// This route is used to get a seller's product orders
router.route("/product/:productId/orders").get(
  verifyJWT,
  authorizedRole("seller"),
  getProductOrders
);

// This route is used to respond to a seller's product QnA
router.route("/product/:productId/qna/:questionId/respond").post(
  verifyJWT,
  authorizedRole("seller"),
  respondToProductQnA
);

// This route is used to archive a seller's product
router.route("/product/:productId/archive").post(
  verifyJWT,
  authorizedRole("seller"),
  archiveProduct
);

// This route is used to restore a seller's archived product
router.route("/product/:productId/restore").post(
  verifyJWT,
  authorizedRole("seller"),
  restoreArchiveProduct
);

// This route is used to get a seller's product feedback
router.route("/product/:productId/feedback").get(
  verifyJWT,
  authorizedRole("seller"),
  getProductFeedback
);

// This route is used to toggle a seller's product feature
router.route("/product/:productId/toggle-feature").post(
  verifyJWT,
  authorizedRole("seller"),
  toggleProductFeature
);

// This route is used to schedule a flash sale for a seller's product
router.route("/product/:productId/flash-sale").post(
  verifyJWT,
  authorizedRole("seller"),
  scheduleFlashSale
);

// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================



// This route is used to get all products for admin
router.route("/products").post(
  verifyJWT,
  authorizedRole("admin"),
  adminGetAllProducts
)

// This route is used to approve a product
router.route("/products/:id/approve").post(
  verifyJWT,
  authorizedRole("admin"),
  approveProducts
);

// This route is used to reject a product
router.route("/products/:id/reject").post(
  verifyJWT,
  authorizedRole("admin"),
  rejectProduct
);

// This route is used to moderate a product's content
router.route("/products/:id/moderate").post(
  verifyJWT,
  authorizedRole("admin"),
  moderateProductContent
);

// This route is used to toggle a product's status
router.route("/products/:id/toggle-status").post(
  verifyJWT,
  authorizedRole("admin"),
  toggleProductStatus
);

// This route is used to bulk moderate products
router.route("/products/:id/bulk-moderate").post(
  verifyJWT,
  authorizedRole("admin"),
  bulkModerateProducts
);


export default router;