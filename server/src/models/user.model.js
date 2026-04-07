import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// This schema defines the structure for user documents in the MongoDB database. It includes fields for username, fullname, email, password, avatar, phone, role, refresh tokens, account status, verification status, addresses, and seller profile. The schema also includes indexes on commonly queried fields to optimize performance. Pre-save middleware is used to hash passwords before saving, and instance methods are defined for password comparison and token generation.
const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid pincode"],
    },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: false },
);

// This schema defines the structure for the seller profile, which is a subdocument within the user schema. It includes fields for shop name, store banner, shop address, GST number, business type, bank account details, and flags for approval and suspension status. The GST number field includes a regex pattern to validate the format of Indian GST numbers.
const sellerProfileSchema = new mongoose.Schema(
  {
    shopName: String,
    storeBanner: String,
    shopAddress: String,
    gstNumber: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST number",
      ],
    },
    businessType: String,
    accountHolderName: String,
    bankAccountNumber: String,
    ifscCode: String,
    upiId: String,
    storeBanner_public_id: String,
    isSellerApproved: { type: Boolean, default: false },
    isSellerSuspended: { type: Boolean, default: false },
    isSellerProfileComplete: { type: Boolean, default: false },
  },
  { _id: false },
);

// This is the main schema for users, which incorporates the addressSchema and sellerProfileSchema as subdocuments. It captures all relevant information about a user, including their credentials, contact details, role, account status, verification status, and any associated refresh tokens for authentication. The schema also includes indexes to optimize queries based on email, username, role, and account status.
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    fullname: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    avatar: String,
    avatar_public_id: String,

    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"],
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
      index: true,
    },

    refreshTokens: [
      {
        tokenHash: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        expiresAt: {
          type: Date,
          required: true,
        },
      },
    ],

    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    addresses: [addressSchema],

    sellerProfile: sellerProfileSchema,
  },
  { timestamps: true },
);

// Indexes for optimizing queries based on email, username, role, and account status.
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isDeleted: 1, isActive: 1 });

// Pre-save middleware to hash the password before saving the user document. This ensures that passwords are stored securely in the database.
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// This method compares a given password with the hashed password stored in the database. It uses bcrypt's compare function to check if the entered password, when hashed, matches the stored password hash. This is used for authentication purposes when a user attempts to log in.
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// This method generates a JWT access token for the user. The token includes the user's ID and role as payload, and is signed with a secret key defined in the environment variables. The token has an expiration time also defined in the environment variables, defaulting to 15 minutes if not specified.
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" },
  );
};

// This method generates a JWT refresh token for the user. Similar to the access token, it includes the user's ID as payload and is signed with a different secret key defined in the environment variables. The refresh token has a longer expiration time, defaulting to 7 days if not specified. This token can be used to obtain new access tokens without requiring the user to log in again.
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
  });
};

// This method converts the user document to a JSON object and removes sensitive fields such as password and refresh tokens before returning it. This is useful for sending user data in API responses without exposing sensitive information.
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

// This method hashes a given token using the SHA-256 algorithm. It is used to securely store refresh tokens in the database by hashing them before saving, which adds an extra layer of security in case of a database breach.
userSchema.methods.hashToken = function (token) {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const User = mongoose.model("User", userSchema);
