import { Router } from "express";
import {
    getAllProducts,
    getNewArrivalProduct,
    getProductById,
    getProductsByCategory,
    getTopRatedProduct,
    createProduct
 } from "../controllers/product.controller.js";
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { authorizedRole } from "../middlewares/authorizeRole.middleware.js";

const router = Router();

// This route is used to get all products with optional filters
router.route("/").get(getAllProducts);

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


export default router;