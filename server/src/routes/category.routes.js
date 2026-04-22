// This module defines the routes for handling category-related operations in the e-commerce application. It includes routes for both customer and seller panels, as well as admin panel handlers for managing categories. The routes are protected with JWT authentication and role-based authorization to ensure that only authorized users can access certain endpoints. The route handlers are imported from the category.controller.js file, which contains the logic for processing the requests and interacting with the database to perform CRUD operations on categories, as well as other related functionalities such as searching, proposing new categories, and managing category performance metrics.

import { Router } from "express";
import {
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
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

// This route is used for getting all categories, with optional query parameters for filtering by status, searching by name, and pagination. It allows customers to browse through the available categories in the e-commerce application.
router.route("/").get(getAllCategories);

// This route is used for getting a list of featured categories. Featured categories are typically highlighted or promoted categories that may have special offers or be popular among customers. This allows customers to easily find and explore these highlighted categories.
router.route("/featured").get(getFeaturedCategories);

// This route is used for searching categories based on a query string. It allows customers to search for categories by name or other relevant fields, making it easier for them to find specific categories they are interested in. The search functionality can help improve the user experience by providing quick access to relevant categories based on customer input.
router.route("/search").get(searchCategories);

// This route is used for getting the details of a specific category by its ID. It allows customers to view the information about a particular category, including its name, description, image, and other relevant details.
router.route("/:categoryId").get(getCategoryById);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

// This route is for getting the list of categories for sellers. It requires the seller to be authenticated and authorized to access this information. The route will return a list of categories that the seller can manage or select from when adding or updating products in their inventory.
router
  .route("/seller/list")
  .get(verifyJWT, authorizedRole("seller"), getSellerCategoryList);

// This route is for selecting a category for a product. It requires the seller to be authenticated and authorized to perform this action. The route will allow the seller to associate a product with a specific category, which can help in organizing products and improving the shopping experience for customers.
router
  .route("/seller/select/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), selectCategoryForProduct);

// This route is for proposing a new category by a seller. It requires the seller to be authenticated and authorized to propose new categories. The route will allow sellers to submit proposals for new categories that they believe should be added to the platform, which can then be reviewed and approved by administrators. This feature encourages sellers to contribute to the growth of the category offerings on the e-commerce platform.
router
  .route("/seller/propose")
  .post(verifyJWT, authorizedRole("seller"), proposeNewCategory);

// This route is for getting the performance metrics of a specific category for sellers. It requires the seller to be authenticated and authorized to access this information. The route will return performance data such as sales, views, and other relevant metrics for the specified category, helping sellers to analyze the performance of their products within that category and make informed decisions about their inventory and marketing strategies.
router
  .route("/seller/performance/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), getCategoryPerformance);

// This route is for updating the status of a category proposed by a seller. It requires the seller to be authenticated and authorized to perform this action. The route will allow sellers to update the status of their proposed categories, such as marking them as active, inactive, or deleted, based on the review process and feedback from administrators. This helps sellers to manage their proposed categories effectively and keep track of their status in the approval process.
router
  .route("/seller/update-status/:categoryId")
  .patch(verifyJWT, authorizedRole("seller"), updateCategoryStatus);

//  This route is for getting the details of a category for editing purposes by a seller. It requires the seller to be authenticated and authorized to access this information. The route will return the current details of the specified category, allowing the seller to make necessary edits or updates to the category information as needed. This feature helps sellers to maintain accurate and up-to-date information about their categories, ensuring that customers have the best possible experience when browsing through the categories on the e-commerce platform.
router
  .route("/seller/edit/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), getCategoryDetailsForEdit);

// This route is for deleting a proposed category by a seller. It requires the seller to be authenticated and authorized to perform this action. The route will allow sellers to delete their proposed categories that are no longer needed or relevant, helping them to manage their proposals effectively and keep the category offerings on the platform organized and up-to-date. This feature also allows sellers to remove any categories that may have been rejected or are no longer viable for their product offerings.
router
  .route("/seller/delete/:categoryId")
  .delete(verifyJWT, authorizedRole("seller"), deleteProposedCategory);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

// This route is for getting all categories for admin users, including those that are pending, approved, or rejected. It supports pagination by accepting page and limit parameters, and it populates the proposedBy field to include the name and email of the user who proposed each category. The categories are sorted by their creation date in descending order. The function returns an object containing the total number of categories, the current page, total pages, and the list of categories for the requested page.
router
  .route("/admin/list")
  .get(verifyJWT, authorizedRole("admin"), getAllCategoriesForAdmin);

// This route is for viewing the details of a specific category by its ID for admin users. It requires the admin to be authenticated and authorized to access this information. The route will return detailed information about the specified category, including its name, description, image, parent category, hierarchy level, path, product count, status flags (featured, active, deleted), rejection reason (if applicable), proposed by user information, tags, order for sorting, meta information for SEO, and references to the users who created and updated the category. This allows administrators to review and manage categories effectively within the e-commerce platform.
router
  .route("/admin/view/:categoryId")
  .get(verifyJWT, authorizedRole("admin"), viewCategoryDetails);

// This route is for approving a category proposed by a seller. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to approve proposed categories, changing their status to active and making them available for customers to view and select when browsing through the categories on the e-commerce platform. This feature helps administrators to manage the category offerings effectively and ensure that only relevant and appropriate categories are made available to customers.
router
  .route("/admin/approve/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), approveCategory);

// This route is for rejecting a category proposed by a seller. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to reject proposed categories, changing their status to rejected and providing a reason for the rejection. This helps administrators to manage the category offerings effectively and ensure that only relevant and appropriate categories are made available to customers, while also providing feedback to sellers on why their proposed categories were not approved.
router
  .route("/admin/reject/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), rejectCategory);

// This route is for creating a new category by an admin user. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to create new categories directly, without going through the proposal process, which can be useful for quickly adding important categories or managing the category structure more efficiently. This feature helps administrators to maintain a well-organized and comprehensive category system within the e-commerce platform, ensuring that customers have access to a wide range of relevant categories when browsing through products.
router
  .route("/admin/create")
  .post(verifyJWT, authorizedRole("admin"), createCategory);

// This route is for deleting a category by an admin user. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to delete categories that are no longer needed or relevant, helping them to manage the category offerings effectively and keep the category structure organized and up-to-date. This feature also allows administrators to remove any categories that may have been created in error or are no longer viable for the product offerings on the e-commerce platform.
router
  .route("/admin/delete/:categoryId")
  .delete(verifyJWT, authorizedRole("admin"), deleteCategory);

// This route is for updating a category by an admin user. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to update the details of an existing category, such as its name, description, image, parent category, hierarchy level, path, product count, status flags (featured, active, deleted), tags, order for sorting, and meta information for SEO. This feature helps administrators to maintain accurate and up-to-date information about categories, ensuring that customers have the best possible experience when browsing through the categories on the e-commerce platform.
router
  .route("/admin/update/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), updateCategory);

// This route is for restoring a deleted category by an admin user. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to restore categories that have been marked as deleted (isDeleted: true), changing their status back to active and making them available again for customers to view and select when browsing through the categories on the e-commerce platform. This feature provides a way to recover categories that may have been deleted in error or are needed again in the future, helping administrators to manage the category offerings effectively and maintain a well-organized category structure.
router
  .route("/admin/restore/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), restoreDeletedCategory);

// This route is for getting statistics about categories for admin users. It requires the admin to be authenticated and authorized to access this information. The route will return various statistics related to categories, such as the total number of categories, the number of active categories, the number of featured categories, the number of deleted categories, and other relevant metrics that can help administrators to analyze and manage the category offerings effectively within the e-commerce platform. This information can be valuable for making informed decisions about category management and optimization strategies.
router
  .route("/admin/statistics")
  .get(verifyJWT, authorizedRole("admin"), getCategoriesStatistics);

// This route is for bulk updating the status of multiple categories by an admin user. It requires the admin to be authenticated and authorized to perform this action. The route will allow administrators to update the status of multiple categories at once, such as marking them as active, inactive, or deleted, based on the provided category IDs and the desired status. This feature helps administrators to manage their categories more efficiently, especially when dealing with a large number of categories that require similar updates, saving time and effort in maintaining the category offerings on the e-commerce platform.
router
  .route("/admin/bulk-update")
  .patch(verifyJWT, authorizedRole("admin"), bulkUpdateCategoriesStatus);

export default router;
