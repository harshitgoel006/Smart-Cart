// This module defines the routes for handling product-related operations in the e-commerce application. It includes routes for both customer and seller panels, as well as admin panel handlers for managing products. The routes are protected with JWT authentication and role-based authorization to ensure that only authorized users can access certain endpoints. The route handlers are imported from the product.controller.js file, which contains the logic for processing the requests and interacting with the database to perform CRUD operations on products, as well as other related functionalities such as searching, managing stock, handling reviews and QnA, scheduling flash sales, and moderating product content.

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
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

// This route is for fetching all products for customers. It does not require authentication, allowing any user to browse the product catalog. The controller function `customerGetAllProducts` will handle the logic for retrieving products from the database, applying filters, sorting, and pagination based on query parameters provided in the request.
router.route("/").get(customerGetAllProducts);

// This route is for fetching the details of a specific product by its ID. It does not require authentication, allowing any user to view product details. The controller function `getProductById` will handle the logic for retrieving the product information from the database based on the provided product ID in the request parameters.
router.route("/product/:productId").get(getProductById);

// This route is for fetching the top-rated products. It does not require authentication, allowing any user to view the top-rated products. The controller function `getTopRatedProduct` will handle the logic for retrieving products from the database that have the highest average ratings, and return them in the response.
router.route("/top-rated").get(getTopRatedProduct);

// This route is for fetching new arrival products. It does not require authentication, allowing any user to view the latest products added to the catalog. The controller function `getNewArrivalProduct` will handle the logic for retrieving products from the database that were recently added, and return them in the response.
router.route("/new-arrivals").get(getNewArrivalProduct);

// This route is for fetching products by category. It does not require authentication, allowing any user to view products within a specific category. The controller function `getProductsByCategory` will handle the logic for retrieving products from the database that belong to the specified category ID provided in the request parameters, and return them in the response.
router.route("/category/:categoryId").get(getProductsByCategory);

// This route is for searching products based on query parameters such as name, description, category, etc. It does not require authentication, allowing any user to search for products in the catalog. The controller function `searchProduct` will handle the logic for processing the search query, retrieving matching products from the database, and returning them in the response.
router.route("/search").get(searchProduct);

// This route is for fetching related products based on a specific product ID. It does not require authentication, allowing any user to view related products. The controller function `getRelatedProducts` will handle the logic for retrieving products from the database that are related to the specified product ID (e.g., based on category, tags, or other criteria), and return them in the response.
router.route("/product/:productId/related").get(getRelatedProducts);

// This route is for fetching reviews of a specific product by its ID. It does not require authentication, allowing any user to view product reviews. The controller function `getProductReview` will handle the logic for retrieving reviews from the database that are associated with the specified product ID provided in the request parameters, and return them in the response.
router.route("/product/:productId/reviews").get(getProductReview);

// This route is for submitting a review for a specific product. It requires the user to be authenticated and have the "customer" role. The controller function `submitReview` will handle the logic for validating the review input, associating it with the specified product ID and the logged-in user, saving it to the database, and returning an appropriate response indicating the success or failure of the review submission.
router
  .route("/product/:productId/reviews")
  .post(verifyJWT, authorizedRole("customer"), submitReview);

// This route is for fetching the QnA (questions and answers) of a specific product by its ID. It does not require authentication, allowing any user to view the QnA for a product. The controller function `getProductQnA` will handle the logic for retrieving the questions and answers from the database that are associated with the specified product ID provided in the request parameters, and return them in the response.
router.route("/product/:productId/qna").get(getProductQnA);

// This route is for asking a question about a specific product. It requires the user to be authenticated and have the "customer" role. The controller function `askProductQuestion` will handle the logic for validating the question input, associating it with the specified product ID and the logged-in user, saving it to the database, and returning an appropriate response indicating the success or failure of the question submission.
router
  .route("/product/:productId/qna")
  .post(verifyJWT, authorizedRole("customer"), askProductQuestion);

// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================

// This route is for creating a new product. It requires the user to be authenticated and have the "seller" role. The route also uses the multer middleware to handle file uploads for product images, allowing up to 5 images to be uploaded with the request. The controller function `createProduct` will handle the logic for validating the product input, saving the product information and associated images to the database, and returning an appropriate response indicating the success or failure of the product creation.
router.route("/create").post(
  verifyJWT,
  authorizedRole("seller"),
  upload.array("images", 5), // max 5 files
  createProduct,
);

// This route is for fetching the details of a specific product by its ID for the seller. It requires the user to be authenticated and have the "seller" role. The controller function `getSellerProduct` will handle the logic for retrieving the product information from the database based on the provided product ID in the request parameters, ensuring that the product belongs to the logged-in seller, and return it in the response.
router
  .route("/product/:productId")
  .get(verifyJWT, authorizedRole("seller"), getSellerProduct);

// This route is for updating a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The route also uses the multer middleware to handle file uploads for product images, allowing up to 5 images to be uploaded with the request. The controller function `updateProduct` will handle the logic for validating the updated product input, ensuring that the product belongs to the logged-in seller, updating the product information and associated images in the database, and returning an appropriate response indicating the success or failure of the product update.
router
  .route("/product/:productId")
  .put(verifyJWT, authorizedRole("seller"), updateProduct);

// This route is for deleting a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `deleteProduct` will handle the logic for ensuring that the product belongs to the logged-in seller, deleting the product from the database, and returning an appropriate response indicating the success or failure of the product deletion.
router
  .route("/product/:productId")
  .delete(verifyJWT, authorizedRole("seller"), deleteProduct);

// This route is for managing the stock of a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `manageProductStock` will handle the logic for validating the stock update input, ensuring that the product belongs to the logged-in seller, updating the stock information in the database, and returning an appropriate response indicating the success or failure of the stock update.
router
  .route("/product/:productId/stock")
  .patch(verifyJWT, authorizedRole("seller"), manageProductStock);

// This route is for managing the variants of a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `variantManagement` will handle the logic for validating the variant management input, ensuring that the product belongs to the logged-in seller, updating the variant information in the database, and returning an appropriate response indicating the success or failure of the variant management operation.
router
  .route("/product/:productId/variants")
  .patch(verifyJWT, authorizedRole("seller"), variantManagement);

// This route is for fetching the orders associated with a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `getProductOrders` will handle the logic for retrieving the orders from the database that are associated with the specified product ID provided in the request parameters, ensuring that the product belongs to the logged-in seller, and return them in the response.
router
  .route("/product/:productId/orders")
  .get(verifyJWT, authorizedRole("seller"), getProductOrders);

// This route is for responding to a specific question in the QnA of a product. It requires the user to be authenticated and have the "seller" role. The controller function `respondToProductQnA` will handle the logic for validating the response input, ensuring that the product belongs to the logged-in seller, associating the response with the specified question ID and product ID, saving it to the database, and returning an appropriate response indicating the success or failure of the response submission.
router
  .route("/product/:productId/qna/:questionId/respond")
  .post(verifyJWT, authorizedRole("seller"), respondToProductQnA);

// This route is for archiving a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `archiveProduct` will handle the logic for ensuring that the product belongs to the logged-in seller, updating the product's status to archived in the database, and returning an appropriate response indicating the success or failure of the product archiving.
router
  .route("/product/:productId/archive")
  .post(verifyJWT, authorizedRole("seller"), archiveProduct);

// This route is for restoring an archived product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `restoreArchiveProduct` will handle the logic for ensuring that the product belongs to the logged-in seller, updating the product's status from archived to active in the database, and returning an appropriate response indicating the success or failure of the product restoration.
router
  .route("/product/:productId/restore")
  .post(verifyJWT, authorizedRole("seller"), restoreArchiveProduct);

// This route is for fetching feedback related to a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `getProductFeedback` will handle the logic for retrieving feedback from the database that is associated with the specified product ID provided in the request parameters, ensuring that the product belongs to the logged-in seller, and return it in the response.
router
  .route("/product/:productId/feedback")
  .get(verifyJWT, authorizedRole("seller"), getProductFeedback);

// This route is for toggling the featured status of a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `toggleProductFeature` will handle the logic for ensuring that the product belongs to the logged-in seller, updating the product's featured status in the database, and returning an appropriate response indicating the success or failure of the operation.
router
  .route("/product/:productId/toggle-feature")
  .post(verifyJWT, authorizedRole("seller"), toggleProductFeature);

// This route is for scheduling a flash sale for a specific product by its ID. It requires the user to be authenticated and have the "seller" role. The controller function `scheduleFlashSale` will handle the logic for validating the flash sale input (such as discount percentage, start time, end time), ensuring that the product belongs to the logged-in seller, saving the flash sale information in the database, and returning an appropriate response indicating the success or failure of the flash sale scheduling.
router
  .route("/product/:productId/flash-sale")
  .post(verifyJWT, authorizedRole("seller"), scheduleFlashSale);

// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================

// This route is for fetching all products for admin management. It requires the user to be authenticated and have the "admin" role. The controller function `adminGetAllProducts` will handle the logic for retrieving all products from the database, applying filters, sorting, and pagination based on query parameters provided in the request, and return them in the response for admin management purposes.
router
  .route("/products")
  .get(verifyJWT, authorizedRole("admin"), adminGetAllProducts);

// This route is for approving a specific product by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `approveProducts` will handle the logic for ensuring that the product exists, updating the product's approval status to approved in the database, and returning an appropriate response indicating the success or failure of the product approval.
router
  .route("/products/:id/approve")
  .post(verifyJWT, authorizedRole("admin"), approveProducts);

// This route is for rejecting a specific product by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `rejectProduct` will handle the logic for ensuring that the product exists, updating the product's approval status to rejected in the database, and returning an appropriate response indicating the success or failure of the product rejection.
router
  .route("/products/:id/reject")
  .post(verifyJWT, authorizedRole("admin"), rejectProduct);

// This route is for moderating the content of a specific product by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `moderateProductContent` will handle the logic for validating the moderation input (such as flags for inappropriate content), ensuring that the product exists, updating the product's moderation status in the database, and returning an appropriate response indicating the success or failure of the content moderation operation.
router
  .route("/products/:id/moderate")
  .post(verifyJWT, authorizedRole("admin"), moderateProductContent);

// This route is for toggling the active status of a specific product by its ID. It requires the user to be authenticated and have the "admin" role. The controller function `toggleProductStatus` will handle the logic for ensuring that the product exists, updating the product's active status in the database, and returning an appropriate response indicating the success or failure of the operation.
router
  .route("/products/:id/toggle-status")
  .post(verifyJWT, authorizedRole("admin"), toggleProductStatus);

// This route is for bulk moderating products. It requires the user to be authenticated and have the "admin" role. The controller function `bulkModerateProducts` will handle the logic for validating the bulk moderation input (such as a list of product IDs and their corresponding moderation actions), ensuring that the products exist, updating the moderation status of each specified product in the database accordingly, and returning an appropriate response indicating the success or failure of the bulk moderation operation.F
router
  .route("/products/:id/bulk-moderate")
  .post(verifyJWT, authorizedRole("admin"), bulkModerateProducts);

export default router;
