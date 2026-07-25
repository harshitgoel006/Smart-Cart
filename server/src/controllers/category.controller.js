import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { categoryService } from "../services/category.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================


const getAllCategories = asyncHandler(async (req, res) => {
  const tree = await categoryService.getAllCategories();

  return res
    .status(200)
    .json(new ApiResponse(200, tree, "Categories fetched successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.getCategoryById(categoryId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully"),
    );
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;

  const category = await categoryService.getCategoryBySlug(slug);

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully"),
    );
});

const getFeaturedCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getFeaturedCategories();

  if (!categories.length) {
    throw new ApiError(404, "No featured categories found");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Featured categories fetched successfully",
      ),
    );
});

const searchCategories = asyncHandler(async (req, res) => {
  const { query } = req.query;

  const categories = await categoryService.searchCategories(query);

  return res
    .status(200)
    .json(new ApiResponse(200, categories, "Categories fetched successfully"));
});

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================


const getSellerCategoryList = asyncHandler(async (req, res) => {
  const categories = await categoryService.getSellerCategoryList();

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        categories,
        "Seller categories fetched successfully",
      ),
    );
});

const selectCategoryForProduct = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.selectCategoryForProduct(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category selected successfully"));
});

const proposeNewCategory = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const newCategory = await categoryService.proposeCategory(req.body, sellerId);

  return res
    .status(201)
    .json(
      new ApiResponse(201, newCategory, "New category proposed successfully"),
    );
});

const getCategoryPerformance = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const performanceData =
    await categoryService.getCategoryPerformance(sellerId);

  if (!performanceData.length) {
    throw new ApiError(404, "No performance data found for your categories");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        performanceData,
        "Category performance fetched successfully",
      ),
    );
});

const updateCategoryStatus = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const sellerId = req.user._id;

  const category = await categoryService.updatePendingCategory(
    categoryId,
    sellerId,
    req.body,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const getCategoryDetailsForEdit = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const sellerId = req.user._id;

  const category = await categoryService.getCategoryForEdit(
    categoryId,
    sellerId,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        category,
        "Category details fetched successfully for editing",
      ),
    );
});

const deleteProposedCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const sellerId = req.user._id;

  const result = await categoryService.deletePendingCategory(
    categoryId,
    sellerId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Category deleted successfully"));
});

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

const getAllCategoriesForAdmin = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;

  const result = await categoryService.getAllCategoriesForAdmin({
    page,
    limit,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Categories fetched successfully"));
});

const viewCategoryDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.viewCategoryDetails(categoryId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully"),
    );
});

const approveCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.approveCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category approved successfully"));
});

const rejectCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const rejectionReason = req.body.rejectionReason || req.body.reason;

  const category = await categoryService.rejectCategory(
    categoryId,
    rejectionReason,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category rejected successfully"));
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.deleteCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category deleted successfully"));
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.updateCategory(categoryId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

const restoreDeletedCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.restoreDeletedCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category restored successfully"));
});

const getCategoriesStatistics = asyncHandler(async (req, res) => {
  const stats = await categoryService.getCategoriesStatistics();

  if (!stats.length) {
    throw new ApiError(404, "No categories statistics found ");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, stats, "Categories statistics fetched successfully"),
    );
});

const bulkUpdateCategoriesStatus = asyncHandler(async (req, res) => {
  const { categoryIds, status } = req.body;

  const result = await categoryService.bulkUpdateCategoriesStatus(
    categoryIds,
    status,
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, result, `${result} categories updated successfully`),
    );
});

export {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  getFeaturedCategories,
  searchCategories,
  getSellerCategoryList,
  selectCategoryForProduct,
  proposeNewCategory,
  getCategoryPerformance,
  updateCategoryStatus,
  getCategoryDetailsForEdit,
  deleteProposedCategory,
  getAllCategoriesForAdmin,
  viewCategoryDetails,
  approveCategory,
  rejectCategory,
  createCategory,
  deleteCategory,
  updateCategory,
  restoreDeletedCategory,
  getCategoriesStatistics,
  bulkUpdateCategoriesStatus,
};
