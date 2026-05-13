import mongoose from "mongoose";

// This schema defines the structure for storing verified email addresses in the database. It includes fields for the email address, the role associated with the email (either "customer" or "seller"), and an expiration time for the verification. The schema also includes an index on the expiresAt field to automatically remove expired documents after a certain period.
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
  { timestamps: true },
);

// This index ensures that documents in the "VerifiedEmail" collection will automatically expire and be removed from the database once the expiresAt time has passed. The expireAfterSeconds: 0 option means that the document will be removed immediately after the expiresAt time is reached.
verifiedEmailSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);

export const VerifiedEmail = mongoose.model(
  "VerifiedEmail",
  verifiedEmailSchema,
);
