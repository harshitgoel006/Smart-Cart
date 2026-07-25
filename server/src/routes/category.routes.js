import { Router } from "express";
import {
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
} from "../controllers/category.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================

router.route("/").get(getAllCategories);

router.route("/featured").get(getFeaturedCategories);

router.route("/search").get(searchCategories);

router.route("/:categoryId").get(getCategoryById);

router.route("/slug/:slug").get(getCategoryBySlug);


// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================

router
  .route("/seller/list")
  .get(verifyJWT, authorizedRole("seller"), getSellerCategoryList);

router
  .route("/seller/select/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), selectCategoryForProduct);

router
  .route("/seller/propose")
  .post(verifyJWT, authorizedRole("seller"), proposeNewCategory);

router
  .route("/seller/performance/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), getCategoryPerformance);

router
  .route("/seller/update-status/:categoryId")
  .patch(verifyJWT, authorizedRole("seller"), updateCategoryStatus);

router
  .route("/seller/edit/:categoryId")
  .get(verifyJWT, authorizedRole("seller"), getCategoryDetailsForEdit);

router
  .route("/seller/delete/:categoryId")
  .delete(verifyJWT, authorizedRole("seller"), deleteProposedCategory);

// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================

router
  .route("/admin/list")
  .get(verifyJWT, authorizedRole("admin"), getAllCategoriesForAdmin);

router
  .route("/admin/view/:categoryId")
  .get(verifyJWT, authorizedRole("admin"), viewCategoryDetails);

router
  .route("/admin/approve/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), approveCategory);

router
  .route("/admin/reject/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), rejectCategory);

router
  .route("/admin/create")
  .post(verifyJWT, authorizedRole("admin"), createCategory);

router
  .route("/admin/delete/:categoryId")
  .delete(verifyJWT, authorizedRole("admin"), deleteCategory);

router
  .route("/admin/update/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), updateCategory);

router
  .route("/admin/restore/:categoryId")
  .patch(verifyJWT, authorizedRole("admin"), restoreDeletedCategory);

router
  .route("/admin/statistics")
  .get(verifyJWT, authorizedRole("admin"), getCategoriesStatistics);

router
  .route("/admin/bulk-update")
  .patch(verifyJWT, authorizedRole("admin"), bulkUpdateCategoriesStatus);

export default router;
