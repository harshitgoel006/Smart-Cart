# 🛒 Smart Cart Backend API

A production-inspired **E-Commerce Backend API** built with **Node.js, Express.js, MongoDB, and JWT Authentication**.

The project follows a scalable layered architecture and provides secure authentication, role-based authorization, product management, order processing, reviews, notifications, media uploads, analytics, and seller/admin management.

> ⚠️ This project is developed for learning and placement purposes. The payment module currently uses a dummy/simulated payment flow instead of a live payment gateway.

---

# 🌐 Live API

### Base URL

https://smart-cart-v6yn.onrender.com

### Health Check

GET https://smart-cart-v6yn.onrender.com/health

---

# 🚀 Features

## 🔐 Authentication

- User Registration
- Email OTP Verification
- Secure Login
- JWT Authentication
- Refresh Token Authentication
- Logout
- Forgot Password
- Password Reset using OTP
- Change Password
- Avatar Upload

---

## 👤 Customer Features

- Manage Profile
- Manage Addresses
- Browse Products
- Product Search
- Category Filtering
- Product Reviews
- Product Q&A
- Cart Management
- Wishlist Management
- Place Orders
- Order Tracking
- Order History
- Cancel Orders
- Return Requests
- Refund Requests
- Download Invoice
- Notifications

---

## 🛍 Seller Features

- Seller Profile
- Store Banner Upload
- Product CRUD
- Product Variants
- Product Stock Management
- Product Archive & Restore
- Flash Sale Management
- Product Q&A Response
- Product Feedback
- Product Orders
- Product-wise Sales Analytics
- Daily Sales Analytics
- Top Selling Products

---

## 🛡 Admin Features

- User Management
- Customer Management
- Seller Management
- Seller Approval
- Seller Suspension
- Product Moderation
- Category Moderation
- Banner Management
- Review Moderation
- Order Management
- Refund Approval
- Return Approval
- Audit Logs
- Analytics

---

## 🛒 Cart & Wishlist

- Add to Cart
- Update Cart
- Remove Cart Items
- Clear Cart
- Apply Coupons
- Multiple Wishlists
- Wishlist Privacy
- Move Wishlist Item to Cart
- Wishlist Availability Check

---

## ⭐ Reviews

- Create Review
- Update Review
- Delete Review
- Product Reviews
- Seller Replies
- Helpful Reviews
- Report Review
- Review Analytics
- Featured Reviews

---

## 📦 Orders

- Place Order
- Track Order
- Order History
- Order Details
- Download Invoice
- Apply Coupon
- Return Request
- Refund Request
- Seller Order Management
- Admin Order Management

---

## 📤 Media Upload

- Avatar Upload
- Product Images
- Store Banner Upload
- Cloudinary Integration

---

## 🔔 Notification System

- Registration Notifications
- Password Change Notifications
- Seller Notifications
- Order Notifications
- Read Notifications
- Mark All Notifications as Read

---

# 🛠 Tech Stack

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- Mongoose

## Authentication

- JWT
- Refresh Tokens
- bcrypt

## File Storage

- Cloudinary

## Email Service

- Brevo Transactional Email API

## Others

- Multer
- Cookie Parser
- CORS

---

# 📂 Project Structure

```
src
│
├── config
├── controllers
├── db
├── middlewares
├── models
├── routes
├── seed
├── services
├── utils
│
├── app.js
├── constant.js
└── index.js
```

---

# 🔐 Authentication Flow

```
Register
     │
     ▼
Send OTP
     │
     ▼
Verify OTP
     │
     ▼
Create Account
     │
     ▼
Login
     │
     ▼
Access Token
     │
     ▼
Protected APIs
```

---

# 👥 Roles

| Role | Access |
|------|--------|
| Customer | Shopping, Cart, Wishlist, Orders |
| Seller | Product & Store Management |
| Admin | Platform Management |

---

# 📊 Analytics

### Seller Dashboard

- Product-wise Sales
- Product-wise Revenue
- Daily Sales
- Top Selling Products

### Admin Dashboard

- Order Management
- User Management
- Category Management
- Review Moderation
- Seller Management

---

# 📬 API Modules

| Module | Description |
|---------|-------------|
| Authentication | Register, Login, OTP, Password Reset |
| Users | Profile & Address Management |
| Products | CRUD, Search, Reviews, Q&A |
| Categories | CRUD & Moderation |
| Cart | Cart & Coupons |
| Wishlist | Wishlist Management |
| Orders | Order Lifecycle |
| Reviews | Product Reviews |
| Notifications | Notification APIs |
| Payments | Dummy Payment Flow |
| Upload | Media Upload |
| Banner | Banner Management |

---

# 📡 API Prefix

```
/api/v1
```

Example

```
GET /api/v1/products
POST /api/v1/users/login
POST /api/v1/orders/orders
```

---

# 🔑 Environment Variables

Create a `.env` file.

```env
PORT=

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

BREVO_API_KEY=

CORS_ORIGIN=
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/harshitgoel006/Smart-Cart.git
```

Go to project directory

```bash
cd Smart-Cart
```

Install dependencies

```bash
npm install
```

Create a `.env` file

Start development server

```bash
npm run dev
```

---

# 🚀 Deployment

Backend is deployed on **Render**

Live URL

```
https://smart-cart-v6yn.onrender.com
```

Database

- MongoDB Atlas

Storage

- Cloudinary

Email Service

- Brevo

---

# 🧪 API Testing

All APIs have been tested using **Postman**.

---

# 🏗 Architecture

```
Client
    │
    ▼
Express Routes
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Models
    │
    ▼
MongoDB
```

Business logic is handled inside the **Service Layer**, while Controllers remain lightweight and focused on request/response handling.

---

# 🔒 Security

- JWT Authentication
- Refresh Token Authentication
- Password Hashing (bcrypt)
- Email OTP Verification
- Protected Routes
- Role-Based Authorization
- Centralized Error Handling
- Input Validation
- Secure Cookies

---

# 🚧 Future Improvements

- Razorpay / Stripe Integration
- Redis Caching
- Docker Support
- CI/CD Pipeline
- API Rate Limiting
- Elasticsearch
- WebSockets
- Swagger / OpenAPI Documentation
- Unit & Integration Testing

---

# 👨‍💻 Author

**Harshit Goel**

B.Tech Computer Science (Cloud Computing & Blockchain)

DIT University

GitHub

https://github.com/harshitgoel006

---

# 📄 License

This project is developed for educational, learning, and placement purposes.