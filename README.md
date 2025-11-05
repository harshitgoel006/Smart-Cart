SmartCart Backend --

Overview --

SmartCart is a modern, secure, and scalable e-commerce backend built using Node.js, Express, MongoDB, Cloudinary, and JWT.
It supports production-ready user, product, and order management flows – as well as multi-role authentication and enterprise-grade features for admin, seller, and customer panels.

Folder Structure --


smartcart-backend/
  └── server/
      ├── node_modules/
      ├── public/
      │   └── temp/
      ├── src/
      │   ├── config/
      │   ├── controllers/
      │   ├── db/
      │   ├── middlewares/
      │   ├── models/
      │   ├── routes/
      │   ├── utils/
      │   ├── constant.js
      │   ├── app.js
      │   ├── index.js
      ├── .env
      ├── .gitignore
      ├── package.json
      └── README.md

Features --

Role-based authentication: Customer, Seller, Admin (OTP, JWT)
Product & Category management: CRUD, moderation, analytics, archive
Cart & wishlist support
Coupon and discount engine
Order module: QR-based real-time tracking, refund/return, notifications
Payment logic ready for centralized gateway integration
Admin, Seller, and Customer workflows
File/image cloud storage (Cloudinary)
Secure RESTful APIs, robust error handling & middleware
Scalable, ready for CI/CD and production

Full Workflows --

1. User Registration & Authentication Workflow --

Step 1: User requests registration (POST /users/register) with details (email, phone, password, avatar, etc.)
Step 2: Backend sends OTP to user email for verification.
Step 3: User submits OTP via verify API (POST /users/verify-otp)
Step 4: Upon successful OTP validation, backend creates account, stores hashed password, sets up initial profile
Step 5: User logs in (POST /users/login) → receives JWT/refresh tokens for further requests
Step 6: Endpoints for password change, reset via "forgot password," and profile update are available

Security:

Passwords are always hashed (bcrypt)
JWT tokens + refresh mechanism
Email and phone verification
Role-specific logic (e.g. seller approval, admin-only endpoints)

2. Customer Panel --

Core features:

Register, log in/out, update profile, change password
Browse, search, and filter approved products
View product details (including images, reviews, Q&A)
Add/remove from wishlist and shopping cart
Place orders (checkout flow), view order status, track with QR (if enabled)
Apply coupons and discounts at checkout
View order history, cancel, request return/refund
Submit questions and product reviews
 
3. Seller Panel --

Core features:

Register and update seller profile
Await approval (handled by admin) before listing products
Add, edit, archive products and manage stock/variants
View and track live orders (products sold), order status, and handle returns
Access sales analytics (daily/periodic sales data)
View product questions and reply as needed

4. Admin Panel --

Core features:

Full user management: list/search/filter customers and sellers
Approve/reject/suspend seller accounts, deactivate/reactivate users
Moderate and approve product/category submissions
Access analytics (user growth, product/category stats, revenue analytics)
Manage all orders and returns, refunds
Control coupons, discounts, and promotional content
Handle reported content, system logs, audit trails

API Structure --

All APIs are fully modular and secured with appropriate middleware.
RESTful standards for resource CRUD
JWT-protected endpoints
Role-based access filters
Proper error response structure (statusCode, message, etc.)

Tech Stack --

Node.js, Express.js
MongoDB, Mongoose
JWT (authentication), bcrypt (passwords)
Cloudinary (file/image storage)
REST API, Postman
(Scalable for React/Next.js frontend & mobile clients)

Local Setup --

bash
git clone <repo-url>
cd smartcart-backend/server
npm install
# Set up your .env file (see .env.example for all variables)
npm run dev


Future Work & Roadmap -- 

Frontend Integration: Connect current backend to dedicated admin, seller, and customer frontends using React/Next.js. Build Progressive Web App (PWA) clients for mobile compatibility.

Real-Time Notifications: Implement a scalable notification engine using WebSockets (e.g., Socket.IO) to deliver instant order status updates, promotions, and admin alerts.

AI-Powered Analytics: Add dashboards and predictive analytics using machine learning for sales trends, customer segmentation, and inventory suggestions.

CI/CD & Automated Testing: Set up continuous integration and deployment pipelines (GitHub Actions, Docker, or similar). Increase and automate API test coverage.

Payment Gateway Integration: Integrate with production-ready payment gateways (e.g., Razorpay, Stripe, PayPal) for secure online transactions and refunds.

Multi-Language & Currency Support: Expand for global users by adding i18n/localisation (multiple languages and currencies).

Advanced Security: Add 2FA (Two Factor Authentication), rate limiting, logging/monitoring, and vulnerability auto-scanning.

Microservices Architecture: Refactor monolith into independent microservices (user, catalog, order, payment) to support higher scalability and easier maintenance.

Plugin Marketplace: Allow new modules and integrations (shipping partners, marketing, analytics) from the community.

Documentation & Developer Portal: Publish a live API documentation website and onboarding portal for future contributors and integrations.


Contributing
PRs and feedback are always welcome! For custom demo or project walkthrough, connect via LinkedIn.

License
MIT

Contact
Harshit Goel



For Demo/Queries: harshitgoel885@gmail.com