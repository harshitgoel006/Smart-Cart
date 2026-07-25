# 📘 Smart Cart Backend API Documentation

## Base URL

```
https://smart-cart-v6yn.onrender.com/api/v1
```

---

# Authentication

Protected routes require a valid JWT Access Token.

```
Authorization: Bearer <access_token>
```

---

# User Authentication APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/users/register` | ❌ | Public | Register a new user account with optional avatar upload. |
| POST | `/users/send-otp` | ❌ | Public | Send email verification OTP. |
| POST | `/users/verify-otp` | ❌ | Public | Verify email OTP. |
| POST | `/users/login` | ❌ | Public | Login user and generate authentication tokens. |
| POST | `/users/send-reset-otp` | ❌ | Public | Send password reset OTP. |
| POST | `/users/verify-reset-otp` | ❌ | Public | Verify password reset OTP. |
| POST | `/users/reset-password` | ❌ | Public | Reset account password. |
| POST | `/users/refresh-token` | ❌ | Public | Generate a new access token using refresh token. |
| POST | `/users/logout` | ✅ | Customer / Seller / Admin | Logout current user. |
| POST | `/users/change-password` | ✅ | Customer / Seller / Admin | Change current password. |

---

# User Profile APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/users/get-user` | ✅ | Customer / Seller / Admin | Fetch logged-in user profile. |
| PATCH | `/users/update-account` | ✅ | Customer / Seller | Update account information. |
| PATCH | `/users/update-avatar` | ✅ | Customer / Seller | Upload or update profile avatar. |
| PATCH | `/users/update-address` | ✅ | Customer | Update customer address. |

---

# Seller APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/users/seller/profile` | ✅ | Seller | Fetch seller profile. |
| POST | `/users/seller/update-account` | ✅ | Seller | Update seller account and store banner. |
| GET | `/users/seller/product-breakdown` | ✅ | Seller | Product-wise sales breakdown. |
| GET | `/users/seller/top-products` | ✅ | Seller | Fetch top-selling products. |
| GET | `/users/seller/daily-sales` | ✅ | Seller | View daily sales analytics. |

---

# Admin User Management APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/users/admin/sellers/:id/approve` | ✅ | Admin | Approve seller account. |
| POST | `/users/admin/sellers/:id/suspend` | ✅ | Admin | Suspend seller account. |
| POST | `/users/admin/sellers/:id/unsuspend` | ✅ | Admin | Remove seller suspension. |
| GET | `/users/admin/users` | ✅ | Admin | List all registered users. |
| GET | `/users/admin/sellers` | ✅ | Admin | List all sellers. |
| GET | `/users/admin/customers` | ✅ | Admin | List all customers. |
| POST | `/users/admin/users/:id/reactivate` | ✅ | Admin | Reactivate a user account. |
| POST | `/users/admin/users/:id/deactivate` | ✅ | Admin | Deactivate a user account. |

---

# Product APIs

## Customer

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/products` | ❌ | Public | Retrieve all products. |
| GET | `/products/product/:productId` | ❌ | Public | Get product details. |
| GET | `/products/top-rated` | ❌ | Public | Retrieve top-rated products. |
| GET | `/products/new-arrivals` | ❌ | Public | Retrieve newly added products. |
| GET | `/products/category/:categoryId` | ❌ | Public | Retrieve products by category. |
| GET | `/products/search` | ❌ | Public | Search products. |
| GET | `/products/product/:productId/related` | ❌ | Public | Retrieve related products. |
| GET | `/products/product/:productId/reviews` | ❌ | Public | Get product reviews. |
| POST | `/products/product/:productId/reviews` | ✅ | Customer | Submit a product review. |
| GET | `/products/product/:productId/qna` | ❌ | Public | Get product questions. |
| POST | `/products/product/:productId/qna` | ✅ | Customer | Ask a product question. |

---

## Seller Product APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/products/create` | ✅ | Seller | Create a new product. |
| GET | `/products/seller/product/:productId` | ✅ | Seller | Retrieve seller product details. |
| PUT | `/products/seller/product/:productId` | ✅ | Seller | Update product information. |
| DELETE | `/products/seller/product/:productId` | ✅ | Seller | Delete a product. |
| PATCH | `/products/product/:productId/stock` | ✅ | Seller | Update product stock. |
| PATCH | `/products/product/:productId/variants` | ✅ | Seller | Manage product variants. |
| GET | `/products/product/:productId/orders` | ✅ | Seller | Retrieve orders for a product. |
| POST | `/products/product/:productId/qna/:questionId/respond` | ✅ | Seller | Respond to a customer question. |
| POST | `/products/product/:productId/archive` | ✅ | Seller | Archive a product. |
| POST | `/products/product/:productId/restore` | ✅ | Seller | Restore an archived product. |
| GET | `/products/product/:productId/feedback` | ✅ | Seller | Retrieve product feedback. |
| POST | `/products/product/:productId/toggle-feature` | ✅ | Seller | Toggle featured status. |
| POST | `/products/product/:productId/toggle-active` | ✅ | Seller | Toggle active status. |
| POST | `/products/product/:productId/flash-sale` | ✅ | Seller | Schedule a flash sale. |
| DELETE | `/products/product/:productId/delete-flash-sale` | ✅ | Seller | Remove flash sale. |

---

## Admin Product APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/products/products` | ✅ | Admin | Retrieve all products. |
| POST | `/products/products/:productId/approve` | ✅ | Admin | Approve a product. |
| POST | `/products/products/:productId/reject` | ✅ | Admin | Reject a product. |
| POST | `/products/products/:productId/moderate` | ✅ | Admin | Moderate product content. |
| POST | `/products/product/:productId/toggle-status` | ✅ | Admin | Toggle product visibility. |
| POST | `/products/products/bulk-moderate` | ✅ | Admin | Moderate multiple products. |

---

# Category APIs

## Customer

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/categories` | ❌ | Public | Retrieve all categories. |
| GET | `/categories/featured` | ❌ | Public | Retrieve featured categories. |
| GET | `/categories/search` | ❌ | Public | Search categories. |
| GET | `/categories/:categoryId` | ❌ | Public | Retrieve category details. |
| GET | `/categories/slug/:slug` | ❌ | Public | Retrieve category using slug. |

---

## Seller Category APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/categories/seller/list` | ✅ | Seller | Retrieve seller category list. |
| GET | `/categories/seller/select/:categoryId` | ✅ | Seller | Select category for product creation. |
| POST | `/categories/seller/propose` | ✅ | Seller | Propose a new category. |
| GET | `/categories/seller/performance/:categoryId` | ✅ | Seller | Retrieve category performance. |
| PATCH | `/categories/seller/update-status/:categoryId` | ✅ | Seller | Update proposed category status. |
| GET | `/categories/seller/edit/:categoryId` | ✅ | Seller | Retrieve editable category details. |
| DELETE | `/categories/seller/delete/:categoryId` | ✅ | Seller | Delete proposed category. |

---

## Admin Category APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/categories/admin/list` | ✅ | Admin | Retrieve all categories. |
| GET | `/categories/admin/view/:categoryId` | ✅ | Admin | View category details. |
| PATCH | `/categories/admin/approve/:categoryId` | ✅ | Admin | Approve category. |
| PATCH | `/categories/admin/reject/:categoryId` | ✅ | Admin | Reject category. |
| POST | `/categories/admin/create` | ✅ | Admin | Create a category. |
| DELETE | `/categories/admin/delete/:categoryId` | ✅ | Admin | Delete category. |
| PATCH | `/categories/admin/update/:categoryId` | ✅ | Admin | Update category. |
| PATCH | `/categories/admin/restore/:categoryId` | ✅ | Admin | Restore deleted category. |
| GET | `/categories/admin/statistics` | ✅ | Admin | Retrieve category statistics. |
| PATCH | `/categories/admin/bulk-update` | ✅ | Admin | Bulk update category status. |

---

# Upload APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/uploads/single` | ❌ | Public | Upload a single file. |
| POST | `/uploads/multiple` | ❌ | Public | Upload up to 5 files. |

---

# Cart APIs

## Customer Cart APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/cart/add` | ✅ | Customer | Add product to cart. |
| GET | `/cart` | ✅ | Customer | Retrieve all cart items. |
| PUT | `/cart/update/:itemId` | ✅ | Customer | Update cart item quantity. |
| DELETE | `/cart/remove/:itemId` | ✅ | Customer | Remove an item from the cart. |
| DELETE | `/cart/clear` | ✅ | Customer | Remove all items from the cart. |
| POST | `/cart/apply-coupon` | ✅ | Customer | Apply coupon to the cart. |

---

## Admin Cart APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/cart/cart-analytics` | ✅ | Admin | Retrieve cart analytics. |
| POST | `/cart/coupons` | ✅ | Admin | Create a coupon. |
| PUT | `/cart/coupons/:couponId` | ✅ | Admin | Update coupon details. |
| GET | `/cart/coupon/list` | ✅ | Admin | Retrieve all coupons. |
| PUT | `/cart/cart/reset/:userId` | ✅ | Admin | Reset a customer's cart. |

---

# Wishlist APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/wishlists/items` | ✅ | Customer | Add a product to the wishlist. |
| DELETE | `/wishlists/items/:itemId` | ✅ | Customer | Remove a product from the wishlist. |
| GET | `/wishlists` | ✅ | Customer | Retrieve the default wishlist. |
| POST | `/wishlists/items/:itemId/move-to-cart` | ✅ | Customer | Move a wishlist item to the cart. |
| GET | `/wishlists/check-availability` | ✅ | Customer | Check wishlist item availability. |
| GET | `/wishlists/count` | ✅ | Customer | Get wishlist item count. |
| DELETE | `/wishlists/clear` | ✅ | Customer | Clear the wishlist. |
| PUT | `/wishlists/privacy` | ✅ | Customer | Update wishlist privacy settings. |
| POST | `/wishlists/create` | ✅ | Customer | Create a new wishlist. |
| GET | `/wishlists/all` | ✅ | Customer | Retrieve all user wishlists. |
| POST | `/wishlists/set-default` | ✅ | Customer | Set the default wishlist. |

---

# Order APIs

## Customer Order APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/orders/orders` | ✅ | Customer | Place a new order. |
| GET | `/orders/orders` | ✅ | Customer | Retrieve order history. |
| GET | `/orders/orders/:orderId` | ✅ | Customer | Retrieve order details. |
| GET | `/orders/orders/:orderId/track` | ✅ | Customer | Track an order. |
| POST | `/orders/orders/:orderId/cancel` | ✅ | Customer | Cancel an order. |
| POST | `/orders/orders/:orderId/return` | ✅ | Customer | Submit a return request. |
| POST | `/orders/orders/:orderId/refund` | ✅ | Customer | Submit a refund request. |
| GET | `/orders/orders/:orderId/invoice` | ✅ | Customer | Download invoice. |
| POST | `/orders/orders/apply-coupon` | ✅ | Customer | Apply coupon during checkout. |

---

## Seller Order APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/orders/seller/orders` | ✅ | Seller | Retrieve seller orders. |
| GET | `/orders/seller/orders/:orderId` | ✅ | Seller | Retrieve seller order details. |
| PATCH | `/orders/seller/orders/update-status` | ✅ | Seller | Update order status. |
| PATCH | `/orders/seller/orders/update-tracking` | ✅ | Seller | Update shipment tracking information. |
| POST | `/orders/seller/orders/tracking-event` | ✅ | Seller | Add shipment tracking event. |
| POST | `/orders/seller/orders/return-request` | ✅ | Seller | Handle customer return request. |
| POST | `/orders/seller/orders/refund-request` | ✅ | Seller | Handle customer refund request. |
| GET | `/orders/seller/sales-analytics` | ✅ | Seller | Retrieve sales analytics. |

---

## Admin Order APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/orders/admin/orders` | ✅ | Admin | Retrieve all orders. |
| GET | `/orders/admin/orders/:orderId` | ✅ | Admin | Retrieve order details. |
| PATCH | `/orders/admin/orders/manual-status-update` | ✅ | Admin | Manually update order status. |
| POST | `/orders/admin/refunds/approve` | ✅ | Admin | Approve refund request. |
| POST | `/orders/admin/returns/approve` | ✅ | Admin | Approve return request. |
| GET | `/orders/admin/orders/export` | ✅ | Admin | Export order report. |
| GET | `/orders/admin/audit-logs` | ✅ | Admin | Retrieve audit logs. |
| PATCH | `/orders/admin/escalations/handle` | ✅ | Admin | Handle escalated cases. |

---

# Review APIs

## Customer Review APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/reviews/reviews` | ✅ | Customer | Create a review. |
| PUT | `/reviews/reviews/:reviewId` | ✅ | Customer | Update a review. |
| DELETE | `/reviews/reviews/:reviewId` | ✅ | Customer | Delete a review. |
| GET | `/reviews/products/:productId/reviews` | ❌ | Public | Retrieve reviews for a product. |
| GET | `/reviews/my/reviews` | ✅ | Customer | Retrieve current user's reviews. |
| POST | `/reviews/reviews/:reviewId/helpful` | ✅ | Customer | Mark a review as helpful. |
| POST | `/reviews/reviews/:reviewId/report` | ✅ | Customer | Report a review. |

---

## Seller Review APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/reviews/seller/reviews` | ✅ | Seller | Retrieve seller reviews. |
| POST | `/reviews/seller/reviews/:reviewId/reply` | ✅ | Seller | Reply to a review. |
| GET | `/reviews/seller/reviews/summary` | ✅ | Seller | Retrieve review summary. |

---

## Admin Review APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/reviews/admin/reviews` | ✅ | Admin | Retrieve all reviews. |
| GET | `/reviews/admin/reviews/view/:reviewId` | ✅ | Admin | Retrieve review details. |
| POST | `/reviews/admin/reviews/moderate/:reviewId` | ✅ | Admin | Moderate a review. |
| PATCH | `/reviews/admin/reviews/feature/:reviewId` | ✅ | Admin | Feature or unfeature a review. |
| DELETE | `/reviews/admin/reviews/delete/:reviewId` | ✅ | Admin | Delete a review. |
| GET | `/reviews/admin/reviews/analytics` | ✅ | Admin | Retrieve review analytics. |

---

# Notification APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/notifications/my-notifications` | ✅ | Authenticated User | Retrieve notifications. |
| PATCH | `/notifications/mark-notification-read/:id` | ✅ | Authenticated User | Mark a notification as read. |
| PATCH | `/notifications/mark-all-notifications-read` | ✅ | Authenticated User | Mark all notifications as read. |

---

# Banner APIs

## Public APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| GET | `/banners` | ❌ | Public | Retrieve active banners. |

---

## Admin Banner APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/banners` | ✅ | Admin | Create a banner. |
| PUT | `/banners/:bannerId` | ✅ | Admin | Update a banner. |
| DELETE | `/banners/:bannerId` | ✅ | Admin | Delete a banner. |
| GET | `/banners/admin/all` | ✅ | Admin | Retrieve all banners. |

---

# Payment APIs

| Method | Endpoint | Authentication | Role | Description |
|---------|----------|---------------|------|-------------|
| POST | `/payments/initiate` | ✅ | Customer | Initiate dummy payment. |
| POST | `/payments/complete` | ✅ | Customer | Complete dummy payment. |

---

# Standard API Response

## Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": {}
}
```

## Error Response

```json
{
  "success": false,
  "message": "Something went wrong.",
  "errors": []
}
```

---

# HTTP Status Codes

| Status Code | Meaning |
|-------------|---------|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 500 | Internal Server Error |