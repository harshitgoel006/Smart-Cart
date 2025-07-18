import { Router } from "express";
import {
    getAllProducts,
    getProductById
 } from "../controllers/product.controller.js";
import{upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// This route is used to get all products with optional filters
router.route("/product/:get-all").get(getAllProducts);


router.route("/product/:productId").get(getProductById);


export default router;