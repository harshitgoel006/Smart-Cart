import mongoose from "mongoose";

const verifiedEmailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    role: {
      type: String,
      enum: ["customer", "seller"],
      required: true,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000, 
    },
  },
  { timestamps: true }
);

// Auto delete after expiry
verifiedEmailSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const VerifiedEmail = mongoose.model(
  "VerifiedEmail",
  verifiedEmailSchema
);