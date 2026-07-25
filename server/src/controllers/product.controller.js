import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { productService } from "../services/product.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

const customerGetAllProducts = asyncHandler(async (req, res) => {
  const product = await productService.customerGetAllProducts(req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.getProductById(productId);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product fetched successfully"));
});

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

const searchProduct = asyncHandler(async (req, res) => {
  const products = await productService.searchProduct(req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, products, "searched products fetched successfully"),
    );
});

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

const getProductReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const reviews = await productService.getProductReviews(productId, req.query);

  return res
    .status(200)
    .json(
      new ApiResponse(200, reviews, "Product reviews fetched successfully"),
    );
});

const submitReview = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;
  const reviews = await productService.submitReview(
    productId,
    userId,
    req.body,
  );
  return res
    .status(201)
    .json(new ApiResponse(201, reviews.review, reviews.message));
});

const getProductQnA = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const data = await productService.getProductQnA(productId, req.query);
  return res
    .status(200)
    .json(new ApiResponse(200, data, "Product QnA fetched successfully"));
});

const askProductQuestion = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const userId = req.user._id;

  const newQnA = await productService.askProductQuestion(productId, userId, {
    question,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, newQnA, "Product question submitted successfully"),
    );
});

// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================

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

const getSellerProduct = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;
  const products = await productService.getSellerProducts(sellerId, req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "Products fetched successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
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

const deleteProduct = asyncHandler(async (req, res) => {
  const result = await productService.deleteProduct(
    req.params.productId,
    req.user._id,
  );

  return res.status(200).json(new ApiResponse(200, null, result.message));
});

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

const getProductOrders = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
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

const archiveProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
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

const restoreArchiveProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;

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

const getProductFeedback = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
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

const toggleSellerProductField = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { featured, isActive } = req.body;

  let field;
  let value;

  if (typeof featured === "boolean") {
    field = "featured";
    value = featured;
  } else if (typeof isActive === "boolean") {
    field = "isActive";
    value = isActive;
  } else {
    throw new ApiError(
      400,
      "Either featured or isActive must be provided",
    );
  }

  const result = await productService.toggleProductField({
    productId,
    actorId: req.user._id,
    field,
    value,
    isAdmin: false,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

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

const removeFlashSale = asyncHandler(async(req,res) => {
  const {productId} = req.params;

  const product  = await productService.removeFlashSale(productId, req.user._id);

  return res
  .status(200)
  .json(
    new ApiResponse(
      200,
      product,
      "Flash sale removed successfully",
    )
  )
})

// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================

const approveProducts = asyncHandler(async (req, res) => {
  const { productId } = req.params;
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

const rejectProduct = asyncHandler(async (req, res) => {
  const { productId } = req.params;
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

const adminGetAllProducts = asyncHandler(async (req, res) => {
  const products = await productService.adminGetAllProducts(req.query);

  return res
    .status(200)
    .json(new ApiResponse(200, products, "All products fetched successfully"));
});

const moderateProductContent = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const product = await productService.moderateProductContent(
    productId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product moderated successfully"));
});

const toggleAdminProductStatus = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { isActive } = req.body;

  const result = await productService.toggleProductField({
    productId,
    field: "isActive",
    value: isActive,
    isAdmin: true,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, result.message));
});

const bulkModerateProducts = asyncHandler(async (req, res) => {
  const result = await productService.bulkModerateProducts(req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Bulk moderation completed"));
});

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
  toggleSellerProductField,
  scheduleFlashSale,
  removeFlashSale,
  approveProducts,
  rejectProduct,
  adminGetAllProducts,
  moderateProductContent,
  toggleAdminProductStatus,
  bulkModerateProducts,
};
