import { Router } from "express";
import{
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
    bulkUpdateCategoriesStatus
} from "../controllers/category.controller.js";
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";



const router = Router();


// ======================================================
// =============== CUSTOMER PANEL HANDLERS ==============
// ======================================================




// This route is for getting all categories
router.route("/").get(getAllCategories);

// This route is for getting a category by ID
router.route("/:categoryId").get(getCategoryById);

// This route is for getting featured categories
router.route("/featured").get(getFeaturedCategories);

// This route is for searching categories
router.route("/search").get(searchCategories);

// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================




// This route is for getting the list of categories available for sellers
router.route("/seller/list").get(
    verifyJWT, 
    authorizedRole("seller"), 
    getSellerCategoryList
);

// This route is for selecting a category for a product
router.route("/seller/select/:categoryId").get(
    verifyJWT,
    authorizedRole("seller"),
    selectCategoryForProduct
);

// This route is for proposing a new category
router.route("/seller/propose").post(
    verifyJWT,
    authorizedRole("seller"),
    proposeNewCategory
);

// This route is for getting the performance of a category
router.route("/seller/performance/:categoryId").get(
    verifyJWT,
    authorizedRole("seller"),
    getCategoryPerformance
);

// This route is for updating the status of a category
router.route("/seller/update-status/:categoryId").patch(
    verifyJWT,
    authorizedRole("seller"),
    updateCategoryStatus
);

// This route is for getting the details of a category for editing
router.route("/seller/edit/:categoryId").get(
    verifyJWT,
    authorizedRole("seller"),
    getCategoryDetailsForEdit
);

// This route is for deleting a proposed category
router.route("/seller/delete/:categoryId").delete(
    verifyJWT,
    authorizedRole("seller"),
    deleteProposedCategory
);



// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================



// This route is for getting all categories for admin
router.route("/admin/list").get(
    verifyJWT,
    authorizedRole("admin"),
    getAllCategoriesForAdmin
);

// This route is for viewing category details
router.route("/admin/view/:categoryId").get(
    verifyJWT,
    authorizedRole("admin"),
    viewCategoryDetails
);

// This route is for approving a category
router.route("/admin/approve/:categoryId").patch(
    verifyJWT,
    authorizedRole("admin"),
    approveCategory
);

// This route is for rejecting a category
router.route("/admin/reject/:categoryId").patch(
    verifyJWT,
    authorizedRole("admin"),
    rejectCategory
);

// This route is for creating a new category
router.route("/admin/create").post(
    verifyJWT,
    authorizedRole("admin"),
    createCategory
);

// This route is for deleting a category
router.route("/admin/delete/:categoryId").delete(
    verifyJWT,
    authorizedRole("admin"),
    deleteCategory
);

// This route is for updating a category
router.route("/admin/update/:categoryId").patch(
    verifyJWT,
    authorizedRole("admin"),
    updateCategory
);

// This route is for restoring a deleted category
router.route("/admin/restore/:categoryId").patch(
    verifyJWT,
    authorizedRole("admin"),
    restoreDeletedCategory
);

// This route is for getting category statistics
router.route("/admin/statistics").get(
    verifyJWT,
    authorizedRole("admin"),
    getCategoriesStatistics
);

// This route is for bulk updating categories status
router.route("/admin/bulk-update").patch(
    verifyJWT,
    authorizedRole("admin"),
    bulkUpdateCategoriesStatus
);

export default router;
