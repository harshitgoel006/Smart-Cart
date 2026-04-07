import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { productService } from "../services/product.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

// This controller is used to fetch all products for customers with support for pagination, filtering, and sorting. It allows customers to browse through the product catalog based on various criteria such as category, price range, ratings, and more. The controller processes the query parameters for pagination (page and limit), filtering (e.g., category, price), and sorting (e.g., price, popularity) to return a customized list of products that match the customer's preferences.
const customerGetAllProducts = asyncHandler(async (req, res) => {
  const product = await productService.customerGetAllProducts(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Products fetched successfully"));
});

// This controller is used to fetch a specific product by its ID for customers. It retrieves the product details based on the provided product ID and returns the information.
const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

// This controller is used to fetch top-rated products for customers. It retrieves a list of products that have the highest ratings based on customer reviews and feedback. The controller may also support pagination to limit the number of top-rated products returned in a single response.
const getTopRatedProduct = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const topProduct = await productService.getTopRatedProduct(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        topProduct,
        "Top rated products fetched successfully",
      ),
    );
});

// This controller is used to fetch new arrival products for customers. It retrieves a list of recently added products to the catalog, allowing customers to discover the latest offerings. The controller may also support pagination to limit the number of new arrival products returned in a single response.
const getNewArrivalProduct = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;

  const newArrivals = await productService.getNewArrivalProduct(limit);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        newArrivals,
        "New arrival products fetched successfully",
      ),
    );
});

// This controller is used to fetch products based on a specific category for customers. It retrieves a list of products that belong to the specified category ID, allowing customers to browse products within their preferred categories. The controller may also support pagination and additional filtering options to further refine the product results.
const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const products = await productService.getProductsByCategory(
    categoryId,
    req.query,
  );
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        products,
        "Products fetched successfully by category",
      ),
    );
});

// This controller is used to search for products based on various criteria such as keywords, category, price range, and more for customers. It processes the search query parameters and returns a list of products that match the search criteria, allowing customers to find products that meet their specific needs and preferences.
const searchProduct = asyncHandler(async (req, res) => {
  const products = await productService.searchProduct(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "searched products fetched successfully"),
    );
});

// This controller is used to fetch related products for a specific product based on its ID for customers. It retrieves a list of products that are similar or complementary to the specified product, allowing customers to discover additional items that may interest them. The controller may use various algorithms to determine related products, such as analyzing product attributes, customer behavior, and purchase history.
const getRelatedProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const products = await productService.getRelatedProducts(
    productId,
    req.query,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "Related products fetched successfully"),
    );
});

// This controller is used to fetch reviews for a specific product based on its ID for customers. It retrieves a list of customer reviews and ratings associated with the specified product, allowing customers to read feedback from other buyers before making a purchase decision. The controller may also support pagination to limit the number of reviews returned in a single response.
const getProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await productService.getProductReviews(productId, req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, reviews, "Product reviews fetched successfully"),
    );
});

// This controller is used to submit a review for a specific product based on its ID by customers. It allows customers to provide feedback and ratings for a product they have purchased or used. The controller processes the review submission, validates the input, and saves the review to the database. It may also trigger notifications to the seller about the new review and update the product's overall rating based on the submitted review.
const submitReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const reviews = await productService(productId, userId, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, reviews.review, reviews.message));
});

// This controller is used to fetch the QnA (Questions and Answers) for a specific product based on its ID for customers. It retrieves a list of questions asked by customers about the product along with the corresponding answers provided by the seller or other customers. This allows potential buyers to get more information about the product and make informed purchasing decisions. The controller may also support pagination to limit the number of QnA entries returned in a single response.
const getProductQnA = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const data = await productService.getProductQnA(productId, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Product QnA fetched successfully"));
});

// This controller is used to submit a question about a specific product based on its ID by customers. It allows customers to ask questions regarding the product they are interested in, and the questions are typically answered by the seller or other customers. The controller processes the question submission, validates the input, and saves the question to the database. It may also trigger notifications to the seller about the new question and update the product's QnA section with the submitted question.
const askProductQuestion = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const userId = req.user._id; // Auth middleware

  const newQnA = await productService.askProductQuestion(
    productId,
    userId,
    question,
  );

  return res
    .status(201)
    .json(
      new ApiResponse(201, newQnA, "Product question submitted successfully"),
    );
});

// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================

// This controller is used to create a new product by sellers. It allows sellers to add new products to the catalog by providing necessary details such as product name, description, price, category, images, and other relevant information. The controller processes the product creation request, validates the input data, and saves the new product to the database. It may also trigger notifications to the admin for product approval if required by the platform's workflow.
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.user._id,
    req.body,
    req.files,
  );

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        product,
        "Product created successfully & pending admin approval",
      ),
    );
});

// This controller is used to fetch products created by the seller. It retrieves a list of products that belong to the authenticated seller, allowing them to manage and view their product listings. The controller may also support pagination and filtering options to help sellers easily navigate through their products.
const getSellerProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const products = await productService.getSellerProducts(sellerId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

// This controller is used to update an existing product by sellers. It allows sellers to modify the details of their products, such as name, description, price, images, and other relevant information. The controller processes the product update request, validates the input data, and updates the product in the database. It may also trigger notifications to the admin for re-approval if significant changes are made to the product.
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user._id;

  const product = await productService.updateProduct(
    productId,
    sellerId,
    req.body,
    req.files,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product updated & pending admin approval"),
    );
});

// This controller is used to delete a product by sellers. It allows sellers to remove their products from the catalog. The controller processes the product deletion request, validates the seller's authorization to delete the product, and removes the product from the database. It may also trigger notifications to the admin about the product deletion.
const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(
    req.params.productId,
    req.user._id,
  );

  return res.status(200).json(new ApiResponse(200, null, result.message));
});

// This controller is used to manage the stock of a product by sellers. It allows sellers to update the available stock quantity for their products, ensuring accurate inventory management. The controller processes the stock update request, validates the input data, and updates the product's stock information in the database. It may also trigger notifications to the admin if the stock level falls below a certain threshold.
const manageProductStock = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { stock } = req.body;

  const product = await productService.manageProductStock(
    productId,
    req.user._id,
    stock,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Stock updated successfully"));
});

// This controller is used to manage product variants by sellers. It allows sellers to add, update, or delete variants of their products, such as different sizes, colors, or configurations. The controller processes the variant management request, validates the input data, and updates the product's variant information in the database. It may also trigger notifications to the admin for re-approval if significant changes are made to the product variants.
const variantManagement = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { variants } = req.body;

  const product = await productService.variantManagement(
    productId,
    req.user._id,
    variants,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Variants updated successfully"));
});

//  This controller is used to fetch orders related to a specific product for sellers. It retrieves a list of orders that include the specified product, allowing sellers to view and manage orders associated with their products. The controller may also support pagination and filtering options to help sellers easily navigate through the orders.
const getProductOrders = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const sellerId = req.user._id;
  const order = await productService.getProductOrders(
    productId,
    sellerId,
    req.query,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, order, "product order fetched successfully"));
});

// This controller is used to respond to product-related questions in the QnA section by sellers. It allows sellers to provide answers to questions asked by customers about their products. The controller processes the response submission, validates the input, and saves the answer to the database. It may also trigger notifications to the customer about the new answer and update the product's QnA section with the provided response.
const respondToProductQnA = asyncHandler(async (req, res) => {
  const { productId, questionId } = req.params;
  const sellerId = req.user._id;

  const qna = await productService.respondToProductQnA(
    productId,
    questionId,
    sellerId,
    req.body,
  );

  return res.status(200).json(new ApiResponse(200, qna, "Answer submitted"));
});

// This controller is used to archive a product by sellers. It allows sellers to temporarily remove their products from the active catalog without permanently deleting them. The controller processes the archive request, validates the seller's authorization to archive the product, and updates the product's status in the database to indicate that it is archived. Archived products are typically hidden from customers but can be restored later if needed.
const archiveProduct = asyncHandler(async (req, res) => {
  const productId = req.params;
  const result = await productService.archiveProduct(productId, req.user._id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.alreadyArchived
          ? "Product already archived"
          : "Product archived successfully",
      ),
    );
});

// This controller is used to restore an archived product by sellers. It allows sellers to reactivate their previously archived products and make them available in the active catalog again. The controller processes the restore request, validates the seller's authorization to restore the product, and updates the product's status in the database to indicate that it is no longer archived. Restored products become visible to customers once again.
const restoreArchiveProduct = asyncHandler(async (req, res) => {
  const productId = req.params;

  const result = await productService.restoreArchiveProduct(
    productId,
    req.user._id,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        result,
        result.notArchived
          ? "Product is not archived"
          : "Product restored successfully",
      ),
    );
});

// This controller is used to fetch feedback related to a specific product for sellers. It retrieves a list of feedback entries, including reviews, ratings, and questions from customers about the specified product. This allows sellers to gain insights into customer opinions and address any concerns or issues raised in the feedback. The controller may also support pagination to limit the number of feedback entries returned in a single response.
const getProductFeedback = asyncHandler(async (req, res) => {
  const productId = req.params.id;
  const productFeedback = await productService.getProductFeedback(
    productId,
    req.user._id,
    req.query,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        productFeedback,
        "Product feedback fetched successfully",
      ),
    );
});

// This controller is used to toggle the featured status of a product by sellers. It allows sellers to mark their products as featured or unfeatured, which can help increase the visibility of the product in the catalog. The controller processes the toggle request, validates the seller's authorization to update the product, and updates the product's featured status in the database accordingly. It may also trigger notifications to the admin for approval if required by the platform's workflow.
const toggleProductFeature = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { featured } = req.body;

  const product = await productService.toggleProductFeature(
    productId,
    req.user._id,
    featured,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        `Product ${featured ? "featured" : "unfeatured"} successfully`,
      ),
    );
});

// This controller is used to schedule a flash sale for a specific product by sellers. It allows sellers to set up time-limited promotions for their products, offering discounts or special deals during the flash sale period. The controller processes the flash sale scheduling request, validates the input data (such as start and end times, discount details), and updates the product's flash sale information in the database. It may also trigger notifications to customers about the upcoming flash sale and update the product's visibility in the catalog during the sale period.
const scheduleFlashSale = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  const product = await productService.scheduleFlashSale(
    productId,
    req.user._id,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Flash sale scheduled successfully"));
});

// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================

// This controller is used to approve products by admin. It allows the admin to review and approve products submitted by sellers before they become visible in the catalog. The controller processes the product approval request, validates the admin's authorization to approve the product, and updates the product's status in the database to indicate that it has been approved. It may also trigger notifications to the seller about the approval status of their product.
const approveProducts = asyncHandler(async (req, res) => {
  const productId = req.params;
  const product = await productService.approveProduct(productId);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        product.alreadyApproved
          ? "Product already approved"
          : "Product approved successfully",
      ),
    );
});

// This controller is used to reject products by admin. It allows the admin to review and reject products submitted by sellers that do not meet the platform's guidelines or quality standards. The controller processes the product rejection request, validates the admin's authorization to reject the product, and updates the product's status in the database to indicate that it has been rejected. It also captures the reason for rejection provided by the admin and may trigger notifications to the seller about the rejection status of their product along with the reason for rejection.
const rejectProduct = asyncHandler(async (req, res) => {
  const productId = req.params;
  const { reason } = req.body;

  const product = await productService.rejectProduct(productId, reason);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        product.alreadyRejected
          ? "Product alread rejected "
          : "Product rejected successfully",
      ),
    );
});

// This controller is used to fetch all products for admin with support for pagination, filtering, and sorting. It allows the admin to view and manage all products in the catalog, including those submitted by sellers. The controller processes the query parameters for pagination (page and limit), filtering (e.g., category, approval status), and sorting (e.g., submission date) to return a customized list of products that match the admin's criteria for review and management.
const adminGetAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.adminGetAllProducts(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "All products fetched successfully"));
});

// This controller is used to moderate product content by admin. It allows the admin to review and moderate the content of products submitted by sellers, ensuring that they comply with the platform's guidelines and standards. The controller processes the content moderation request, validates the admin's authorization to moderate the product, and updates the product's content in the database based on the moderation actions taken (e.g., editing product description, removing inappropriate images). It may also trigger notifications to the seller about the moderation actions taken on their product.
const moderateProductContent = asyncHandler(async (req, res) => {
  const productId = req.params;
  const product = await productService.moderateProductContent(
    productId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product moderated successfully"));
});

// This controller is used to toggle the active status of a product by admin. It allows the admin to activate or deactivate products in the catalog, controlling their visibility to customers. The controller processes the toggle request, validates the admin's authorization to update the product status, and updates the product's active status in the database accordingly. It may also trigger notifications to the seller about the change in their product's status.
const toggleProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { isActive } = req.body;

  const product = await productService.toggleProductStatus(productId, isActive);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        product,
        `Product ${isActive ? "activated" : "deactivated"} successfully`,
      ),
    );
});

// This controller is used to perform bulk moderation of products by admin. It allows the admin to review and moderate multiple products at once, streamlining the moderation process for a large number of products. The controller processes the bulk moderation request, validates the admin's authorization to moderate the products, and updates the status or content of the specified products in the database based on the moderation actions taken (e.g., approving, rejecting, or editing multiple products). It may also trigger notifications to the respective sellers about the moderation actions taken on their products.
const bulkModerateProducts = asyncHandler(async (req, res) => {
  const result = await productService.bulkModerateProducts(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Bulk moderation completed"));
});

// Exporting the controllers as an object for easier import in routes
export {
  customerGetAllProducts,
  getProductById,
  getTopRatedProduct,
  getNewArrivalProduct,
  getProductsByCategory,
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
};
