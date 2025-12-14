import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express(); 

app.use(cors({
  origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));    
app.use(express.static('public'));
app.use(cookieParser());







// Importing routes

import uploadRouter  from './routes/upload.routes.js';
import userRouter from './routes/user.routes.js'
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.routes.js';
import cartRouter  from './routes/cart.routes.js';
import wishlistRouter from './routes/wishlist.routes.js';
import orderRouter from './routes/order.routes.js';
import notificationRouter from './routes/notification.routes.js';





// Declaring routes

app.use('/api/v1/uploads', uploadRouter);
app.use("/api/v1/users" , userRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/carts", cartRouter);
app.use("/api/v1/wishlists", wishlistRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/notifications", notificationRouter);

export {app}