import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: {
      type: String,
      required: true,
      match: [/^[1-9][0-9]{5}$/, "Invalid pincode"]
    },
    country: { type: String, default: "India" },
    isDefault: { type: Boolean, default: false }
  },
  { _id: false }
);

const sellerProfileSchema = new mongoose.Schema(
  {
    shopName: String,
    storeBanner: String,
    shopAddress: String,
    gstNumber: {
      type: String,
      match: [
        /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
        "Invalid GST number"
      ]
    },
    businessType: String,
    accountHolderName: String,
    bankAccountNumber: String,
    ifscCode: String,
    upiId: String,
    isSellerApproved: { type: Boolean, default: false },
    isSellerSuspended: { type: Boolean, default: false },
    isSellerProfileComplete: { type: Boolean, default: false }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    fullname: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"]
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    avatar: String,
    avatar_public_id: String,

    phone: {
      type: String,
      required: true,
      match: [/^[6-9]\d{9}$/, "Invalid Indian phone number"]
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      default: "customer",
      index: true
    },

    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],

    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },

    isEmailVerified: { type: Boolean, default: false },
    isPhoneVerified: { type: Boolean, default: false },

    addresses: [addressSchema],

    sellerProfile: sellerProfileSchema
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// INDEX OPTIMIZATION
//////////////////////////////////////////////////////////

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isDeleted: 1, isActive: 1 });

//////////////////////////////////////////////////////////
// PASSWORD HASH
//////////////////////////////////////////////////////////

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  next();
});

//////////////////////////////////////////////////////////
// METHODS
//////////////////////////////////////////////////////////

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      role: this.role
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m" }
  );
};

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d" }
  );
};

//////////////////////////////////////////////////////////
// REMOVE SENSITIVE FIELDS
//////////////////////////////////////////////////////////

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  return obj;
};

export const User = mongoose.model("User", userSchema);