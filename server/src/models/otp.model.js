import mongoose from "mongoose";
import bcrypt from "bcrypt";

const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
    },

    otpHash: {
      type: String,
      required: true,
      select: false,
    },

    purpose: {
      type: String,
      enum: ["email_verification", "password_reset", "phone_verification"],
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["customer", "seller", "admin"],
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 5,
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000,
    },
  },
  { timestamps: true },
);

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otpHash")) return next();
  this.otpHash = await bcrypt.hash(this.otpHash, 10);
  next();
});

otpSchema.methods.verifyOTP = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otpHash);
};

otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.model("OTP", otpSchema);
