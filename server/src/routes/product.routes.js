import { Router } from "express";
import {
    customerGetAllProducts,
    getNewArrivalProduct,
    getProductById,
    getProductsByCategory,
    getTopRatedProduct,
    createProduct,
    approveProducts,
    rejectProduct,
    adminGetAllProducts,
    moderateProductContent,
    toggleProductStatus,
    bulkModerateProducts,
    getSellerProduct
 } from "../controllers/product.controller.js";
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";


const router = Router();

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