// This module sets up the Express application for the server, configuring middleware for CORS, JSON parsing, URL encoding, static file serving, and cookie parsing. It also imports and declares various routes for handling different aspects of the application such as uploads, users, products, categories, carts, wishlists, orders, notifications, reviews, and payments. The configured Express app is then exported for use in other parts of the server application.

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { handleMulterError } from "./middlewares/multerError.middleware.js";

const app = express();

// Configuring middleware for CORS, JSON parsing, URL encoding, static file serving, and cookie parsing. The CORS configuration allows requests from the specified origin and includes credentials (like cookies) in cross-origin requests. The JSON and URL-encoded parsers are set with a limit of 16kb to prevent excessively large payloads. Static files are served from the 'public' directory, and cookie parsing is enabled to handle cookies in incoming requests.
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

// Importing route handlers for different parts of the application, such as uploads, users, products, categories, carts, wishlists, orders, notifications, reviews, and payments. These route handlers will define the specific endpoints and logic for handling requests related to each of these resources.

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

import { errorHandler } from "./middlewares/error.middleware.js";

// Mounting the imported routers on specific paths. Each router will handle requests that match its base path, allowing for organized and modular handling of different resources in the application. For example, requests to "/api/v1/users" will be handled by the userRouter, while requests to "/api/v1/products" will be handled by the productRouter, and so on for each resource type.
app.use("/api/v1/uploads", uploadRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/wishlists", wishlistRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", paymentRouter);
app.use("/api/v1/banners", bannerRoutes);

app.use(errorHandler);
app.use(handleMulterError);

export { app };
