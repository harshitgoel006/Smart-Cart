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
      index: true
    },

    otpHash: {
      type: String,
      required: true,
      select: false
    },

    purpose: {
      type: String,
      enum: ["email_verification", "password_reset", "phone_verification"],
      required: true,
      index: true
    },

    attempts: {
      type: Number,
      default: 0
    },
    maxAttempts: {
      type:Number,
      default:5
    },

    expiresAt: {
      type: Date,
      default: () => Date.now() + 5 * 60 * 1000,
      index: true
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// TTL AUTO DELETE
//////////////////////////////////////////////////////////

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

//////////////////////////////////////////////////////////
// HASH OTP BEFORE SAVE
//////////////////////////////////////////////////////////

otpSchema.pre("save", async function (next) {
  if (!this.isModified("otpHash")) return next();
  this.otpHash = await bcrypt.hash(this.otpHash, 10);
  next();
});

//////////////////////////////////////////////////////////
// METHOD: VERIFY OTP
//////////////////////////////////////////////////////////

otpSchema.methods.verifyOTP = async function (enteredOtp) {
  return await bcrypt.compare(enteredOtp, this.otpHash);
};

//////////////////////////////////////////////////////////
// COMPOUND INDEX (EMAIL + PURPOSE)
//////////////////////////////////////////////////////////

otpSchema.index({ email: 1, purpose: 1 });

export const OTP = mongoose.model("OTP", otpSchema);