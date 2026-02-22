src/
├── app.js                 # Express app setup & middleware registration
├── index.js               # Server entry point
├── constant.js            # Global constants & enums
│
├── config/                # Environment & third-party service configs
│
├── db/
│   └── index.js           # Database connection & setup
│
├── jobs/                  # Background jobs (emails, notifications)
│   ├── email.job.js
│   └── notification.job.js
│
├── middlewares/           # Auth, RBAC, file upload middlewares
│   ├── auth.middleware.js
│   ├── authorizeRole.middleware.js
│   └── multer.middleware.js
│
├── controllers/           # Handle HTTP requests & responses (thin layer)
│   ├── cart.controller.js
│   ├── category.controller.js
│   ├── notification.controller.js
│   ├── order.controller.js
│   ├── payment.controller.js
│   ├── product.controller.js
│   ├── review.controller.js
│   ├── upload.controller.js
│   ├── user.controller.js
│   └── wishlist.controller.js
│
├── services/              # Business logic layer
│   ├── cart.service.js
│   ├── category.service.js
│   ├── notification.service.js
│   ├── order.service.js
│   ├── payment.service.js
│   ├── product.service.js
│   ├── review.service.js
│   ├── upload.service.js
│   ├── user.service.js
│   └── wishlist.service.js
│
├── repositories/          # Data access layer (DB interactions)
│   ├── cart.repository.js
│   ├── category.repository.js
│   ├── notification.repository.js
│   ├── order.repository.js
│   ├── payment.repository.js
│   ├── product.repository.js
│   ├── review.repository.js
│   ├── upload.repository.js
│   ├── user.repository.js
│   └── wishlist.repository.js
│
├── models/                # Database schemas / ORM models
│   ├── cart.model.js
│   ├── category.model.js
│   ├── coupon.model.js
│   ├── escalation.model.js
│   ├── notification.model.js
│   ├── order.model.js
│   ├── otp.model.js
│   ├── payment.model.js
│   ├── product.model.js
│   ├── productQnA.model.js
│   ├── review.model.js
│   ├── user.model.js
│   └── wishlist.model.js
│
├── routes/                # API route definitions
│   ├── cart.routes.js
│   ├── category.routes.js
│   ├── notification.routes.js
│   ├── order.routes.js
│   ├── payment.routes.js
│   ├── product.routes.js
│   ├── review.routes.js
│   ├── upload.routes.js
│   ├── user.routes.js
│   └── wishlist.routes.js
│
├── validators/            # Request validation schemas
│   ├── cart.validator.js
│   ├── category.validator.js
│   ├── notification.validator.js
│   ├── order.validator.js
│   ├── payment.validator.js
│   ├── product.validator.js
│   ├── review.validator.js
│   ├── upload.validator.js
│   ├── user.validator.js
│   └── wishlist.validator.js
│
└── utils/                 # Shared utilities & helpers
    ├── ApiError.js        # Custom error class
    ├── ApiResponse.js     # Standardized API responses
    ├── asyncHandler.js   # Async error wrapper
    ├── cloudinary.js     # Cloudinary integration
    ├── notificationEmailTemplates.js
    ├── qrCodeGenerators.js
    ├── sendEmail.js
    └── sendNotification.js