import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { categoryService } from "../services/category.service.js";

// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================

// This controller is used to fetch all categories in a hierarchical structure for customers. It retrieves the category tree from the service layer and returns it in the response. This allows customers to easily navigate through categories and subcategories when browsing products. The response includes a success message and the category data.

const getAllCategories = asyncHandler(async (req, res) => {
  const tree = await categoryService.getAllCategories();

  return res
    .status(200)
    .json(new ApiResponse(200, tree, "Categories fetched successfully"));
});

// This controller is responsible for fetching the details of a specific category based on its ID. It retrieves the category information from the service layer and returns it in the response. This allows customers to view detailed information about a category, such as its name, description, and any associated products. The response includes a success message and the category data.

const getCategoryById = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.getCategoryById(categoryId);
  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully"),
    );
});

// This controller is used to fetch a list of featured categories for customers. It retrieves the featured categories from the service layer and returns them in the response. This allows customers to easily discover popular or highlighted categories when browsing products. If no featured categories are found, it throws a 404 error. The response includes a success message and the list of featured categories.

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

// This controller is responsible for searching categories based on a query string provided by the customer. It retrieves the search results from the service layer and returns them in the response. This allows customers to quickly find relevant categories when they have a specific search term in mind. The response includes a success message and the list of matching categories.

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

//This controller is used to fetch a list of categories for the seller dashboard. It retrieves the categories from the service layer and returns them in the response. This allows sellers to view and manage their categories when they log in to their dashboard. The response includes a success message and the list of categories.

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

// This controller is responsible for allowing sellers to select a category for their products. It takes the category ID from the request parameters and retrieves the category information from the service layer. This allows sellers to associate their products with specific categories, making it easier for customers to find their products when browsing. The response includes a success message and the selected category data.

const selectCategoryForProduct = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.selectCategoryForProduct(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category selected successfully"));
});

// This controller is used to allow sellers to propose new categories for their products. It takes the category details from the request body and the seller ID from the authenticated user. It then sends this information to the service layer to create a new category proposal. This allows sellers to suggest new categories that may not currently exist, helping to expand the category options for customers. The response includes a success message and the newly proposed category data.

const proposeNewCategory = asyncHandler(async (req, res) => {
  const sellerId = req.user._id;

  const newCategory = await categoryService.proposeCategory(req.body, sellerId);

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        1,
        newCategory,
        "New category proposed successfully",
      ),
    );
});

// This controller is responsible for fetching the performance data of categories for a specific seller. It retrieves the seller ID from the authenticated user and then calls the service layer to get the performance metrics for the categories associated with that seller. This allows sellers to analyze how their categories are performing in terms of sales, views, or other relevant metrics. If no performance data is found, it throws a 404 error. The response includes a success message and the performance data for the categories.

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

// This controller is used to allow sellers to update the status of their proposed categories. It takes the category ID from the request parameters, the seller ID from the authenticated user, and the new status from the request body. It then sends this information to the service layer to update the status of the proposed category. This allows sellers to manage their category proposals and keep track of their approval status. The response includes a success message and the updated category data.

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
    .json(new ApiResponse(200, 1, category, "Category updated successfully"));
});

// This controller is responsible for fetching the details of a specific category for editing purposes. It takes the category ID from the request parameters and the seller ID from the authenticated user. It then retrieves the category information from the service layer, allowing sellers to view and edit their proposed categories. This is particularly useful for sellers who want to make changes to their category proposals before they are approved by the admin. The response includes a success message and the category details for editing.

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
        1,
        category,
        "Category details fetched successfully for editing",
      ),
    );
});

// This controller is used to allow sellers to delete their proposed categories. It takes the category ID from the request parameters and the seller ID from the authenticated user. It then sends this information to the service layer to delete the pending category proposal. This allows sellers to manage their category proposals and remove any that they no longer wish to pursue. The response includes a success message confirming that the category has been deleted successfully.

const deleteProposedCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const sellerId = req.user._id;

  const result = await categoryService.deletePendingCategory(
    categoryId,
    sellerId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, 0, result, "Category deleted successfully"));
});

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

// This controller is used to fetch all categories for the admin panel. It retrieves the categories from the service layer with pagination support and returns them in the response. This allows admins to view and manage all categories in the system, including those proposed by sellers. The response includes a success message and the list of categories along with pagination details.

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

// This controller is responsible for fetching the details of a specific category for viewing purposes in the admin panel. It takes the category ID from the request parameters and retrieves the category information from the service layer. This allows admins to view detailed information about a category, such as its name, description, status, and any associated products or proposals. The response includes a success message and the category details.

const viewCategoryDetails = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.viewCategoryDetails(categoryId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, category, "Category details fetched successfully"),
    );
});

// This controller is used to allow admins to approve a proposed category. It takes the category ID from the request parameters and sends it to the service layer to update the status of the category proposal to approved. This allows admins to manage category proposals and ensure that only appropriate categories are added to the system. The response includes a success message confirming that the category has been approved successfully.

const approveCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.approveCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category approved successfully"));
});

// This controller is used to allow admins to reject a proposed category. It takes the category ID from the request parameters and the rejection reason from the request body. It then sends this information to the service layer to update the status of the category proposal to rejected. This allows admins to manage category proposals and provide feedback to sellers about why their proposals were not approved. The response includes a success message confirming that the category has been rejected successfully.

const rejectCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  const { rejectionReason } = req.body;

  const category = await categoryService.rejectCategory(
    categoryId,
    rejectionReason,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category rejected successfully"));
});

// This controller is responsible for creating a new category in the system. It takes the category details from the request body and the admin ID from the authenticated user. It then sends this information to the service layer to create a new category. This allows admins to add new categories directly without going through the proposal process. The response includes a success message and the newly created category data.

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body, req.user._id);

  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

// This controller is used to allow admins to delete a category from the system. It takes the category ID from the request parameters and sends it to the service layer to delete the category. This allows admins to manage the categories in the system and remove any that are no longer needed or relevant. The response includes a success message confirming that the category has been deleted successfully.

const deleteCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.deleteCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category deleted successfully"));
});

// This controller is responsible for allowing admins to update the details of an existing category. It takes the category ID from the request parameters and the updated category details from the request body. It then sends this information to the service layer to update the category in the system. This allows admins to manage and maintain accurate category information as needed. The response includes a success message confirming that the category has been updated successfully.

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.updateCategory(categoryId, req.body);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category updated successfully"));
});

// This controller is used to allow admins to restore a previously deleted category. It takes the category ID from the request parameters and sends it to the service layer to restore the category. This allows admins to recover categories that may have been deleted by mistake or that need to be reinstated for any reason. The response includes a success message confirming that the category has been restored successfully.

const restoreDeletedCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const category = await categoryService.restoreDeletedCategory(categoryId);

  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category restored successfully"));
});

// This controller is responsible for fetching statistical data about categories in the system. It retrieves the statistics from the service layer and returns them in the response. This allows admins to gain insights into category performance, popularity, or other relevant metrics that can help inform decision-making and category management strategies. If no statistics are found, it throws a 404 error. The response includes a success message and the categories statistics data.

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

// This controller is used to allow admins to bulk update the status of multiple categories at once. It takes an array of category IDs and the new status from the request body, and sends this information to the service layer to update the status of all specified categories. This allows admins to efficiently manage the status of multiple categories without having to update them individually. The response includes a success message confirming how many categories were updated successfully.

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

// Exporting all the controllers to be used in route definitions. This allows the application to organize the controller functions in a modular way and makes it easier to manage and maintain the codebase. Each controller function can be imported and used in the corresponding route handlers to handle specific API endpoints related to category management for customers, sellers, and admins.

export {
  getAllCategories,
  getCategoryById,
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
