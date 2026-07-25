# 🛒 Smart Cart Backend

A production-inspired E-Commerce Backend built using **Node.js, Express.js, MongoDB, and JWT Authentication**.  
This project implements a complete backend architecture for an online marketplace with secure authentication, seller management, order processing, notifications, analytics, and role-based access control.

> ⚠️ This project is developed for learning and placement purposes. The payment module currently uses a dummy/simulated flow instead of a live payment gateway.

---

# 🚀 Features

## Authentication

- User Registration
- Email OTP Verification
- Secure Login
- JWT Authentication
- Refresh Token Authentication
- Logout
- Forgot Password
- Password Reset via OTP
- Change Password

---

## Customer

- Manage Profile
- Upload Avatar
- Manage Addresses
- Browse Products
- Search Products
- Add to Cart
- Wishlist
- Place Orders
- Order History
- Product Reviews

---

## Seller

- Seller Profile
- Store Banner Upload
- Product Management
- Order Management
- Product-wise Sales Analytics
- Daily Sales Analytics
- Top Selling Products

---

## Admin

- Approve Sellers
- Suspend Sellers
- Reactivate Sellers
- Deactivate Users
- View Customers
- View Sellers
- Manage Users

---

## Notifications

- New User Registration
- Password Changed
- Password Reset
- Seller Approval
- Seller Suspension
- Profile Updates

---

## Media Upload

- Avatar Upload
- Store Banner Upload
- Cloudinary Integration

---

# 🛠 Tech Stack

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- JWT
- Refresh Tokens
- bcrypt

### Cloud Storage

- Cloudinary

### Email Service

- Nodemailer

### Others

- Multer
- Cookie Parser
- CORS

---

# 📂 Folder Structure

```text
src
│
├── controllers
├── services
├── routes
├── models
├── middlewares
├── utils
├── config
└── app.js
```

---

# 🔐 Authentication Flow

```text
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
Access Token + Refresh Token
```

---

# 👥 Roles

- Customer
- Seller
- Admin

---

# 📊 Analytics

Seller Dashboard includes

- Product-wise Revenue
- Product-wise Sales
- Daily Sales
- Top Selling Products

---

# 🔑 Environment Variables

Create a `.env` file.

```env
PORT=8000

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

EMAIL_USER=
EMAIL_PASS=

CORS_ORIGIN=
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/yourusername/smart-cart-backend.git
```

Install dependencies

```bash
npm install
```

Create `.env`

Start development server

```bash
npm run dev
```

---

# 📬 API Modules

- Authentication
- User
- Product
- Category
- Cart
- Wishlist
- Orders
- Reviews
- Notifications
- Payments
- Banner

---

# 🧪 Testing

The APIs were tested using **Postman**.

---

# 📌 Architecture

The backend follows a layered architecture.

```
Routes
    │
    ▼
Controllers
    │
    ▼
Services
    │
    ▼
Models
```

Business logic is handled inside the Service layer while Controllers remain lightweight.

---

# 🚧 Future Improvements

- Live Payment Gateway Integration (Razorpay / Stripe)
- Redis Caching
- Docker Support
- CI/CD Pipeline
- Elasticsearch
- API Rate Limiting
- WebSockets

---

# 👨‍💻 Author

**Your Name**

B.Tech Computer Science

DIT University

---

# 📄 License

This project is developed for educational and placement purposes.