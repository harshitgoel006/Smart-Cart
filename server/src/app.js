import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleMulterError } from "./middlewares/multerError.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";

import uploadRouter from "./routes/upload.routes.js";
import userRouter from "./routes/user.routes.js";
import productRouter from "./routes/product.routes.js";
import categoryRouter from "./routes/category.routes.js";
import cartRouter from "./routes/cart.routes.js";
import wishlistRouter from "./routes/wishlist.routes.js";
import orderRouter from "./routes/order.routes.js";
import notificationRouter from "./routes/notification.routes.js";
import reviewRouter from "./routes/review.routes.js";
import paymentRouter from "./routes/payment.routes.js";
import bannerRoutes from "./routes/banner.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

const API_PREFIX = "/api/v1";

app.use("${API_PREFIX}/uploads", uploadRouter);
app.use("${API_PREFIX}/users", userRouter);
app.use("${API_PREFIX}/products", productRouter);
app.use("${API_PREFIX}/categories", categoryRouter);
app.use("${API_PREFIX}/carts", cartRouter);
app.use("${API_PREFIX}/wishlists", wishlistRouter);
app.use("${API_PREFIX}/orders", orderRouter);
app.use("${API_PREFIX}/notifications", notificationRouter);
app.use("${API_PREFIX}/reviews", reviewRouter);
app.use("${API_PREFIX}/payments", paymentRouter);
app.use("${API_PREFIX}/banners", bannerRoutes);

app.use(handleMulterError);
app.use(errorHandler);

app.get("/", (_, res) => {
    res.json({
        success: true,
        message: "Smart Cart Backend API is running."
    });
});

app.get("/health", (_, res) => {
    res.status(200).json({
        success: true
    });
});

export { app };
