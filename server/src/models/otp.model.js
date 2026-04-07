import mongoose from "mongoose";
import bcrypt from "bcrypt";

// This schema defines the structure of OTP (One-Time Password) documents in the MongoDB database. It includes fields for the user's email, hashed OTP, purpose of the OTP, number of attempts, maximum allowed attempts, and expiration time. The schema also includes indexes for efficient querying and a method to verify the entered OTP against the stored hash.
const otpSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email format"],
      index: true,
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
      index: true,
    },
  },
  { timestamps: true },
);

// This index ensures that OTP documents will automatically expire and be removed from the database once the expiresAt time has passed. The expireAfterSeconds: 0 option means that the document will be removed immediately after the expiresAt time is reached.
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// This pre-save middleware hashes the OTP before saving it to the database. It checks if the otpHash field has been modified, and if so, it hashes the new OTP value using bcrypt with a salt round of 10. This ensures that the actual OTP is not stored in plain text in the database, enhancing security.
otpSchema.pre("save", async function (next) {
  if (!this.isModified("otpHash")) return next();
  this.otpHash = await bcrypt.hash(this.otpHash, 10);
  next();
});

// This method allows for verifying an entered OTP against the stored hashed OTP. It uses bcrypt's compare function to check if the entered OTP, when hashed, matches the stored otpHash. This is used to validate the OTP during processes like email verification or password reset.
otpSchema.methods.verifyOTP = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otpHash);
};

otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.model("OTP", otpSchema);
