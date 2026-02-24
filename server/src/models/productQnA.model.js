import mongoose from "mongoose";

const productQnASchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
      index: true
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    question: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 1000
    },

    answer: {
      type: String,
      trim: true,
      maxlength: 2000
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    answeredAt: Date,

    status: {
      type: String,
      enum: ["pending", "answered", "rejected", "hidden"],
      default: "pending",
      index: true
    },

    helpfulCount: {
      type: Number,
      default: 0,
      index:true
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
);

//////////////////////////////////////////////////////////
// AUTO FILTER SOFT DELETED
//////////////////////////////////////////////////////////

productQnASchema.query.active = function () {
  return this.where(
    { 
      isDeleted: false 
    }
  );
  
};

//////////////////////////////////////////////////////////
// PERFORMANCE INDEXES
//////////////////////////////////////////////////////////

productQnASchema.index({ product: 1, status: 1 });
productQnASchema.index({ seller: 1, status: 1 });
productQnASchema.index({ user: 1 });

export const ProductQnA = mongoose.model("ProductQnA", productQnASchema);