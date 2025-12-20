import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Product",
            required: true,
            index: true,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required: true,
            index: true,
        },

        order:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Order",
            required: true,
            index: true,
        },
        orderItem:{
            type: mongoose.Schema.Types.ObjectId,
            default: null,
        },
        rating:{
            type: Number,
            required: [true, "Rating must be provided"],
            min: 1,
            max: 5,
        },
        title:{
            type: String,
            default: "",
            trim: true,
            maxlength: 150,
        },
        comment:{
            type: String,
            trim: true,
            maxlength: 4000,
            default: "",
        },
        images:[
            {
                url:{
                    type:String,
                    required: true,
                },
                altText:{
                    type:String,
                    default: "",
                    trim: true,
                }
            }
        ],

        aspects:[
            {
                key: {
                    type: String,
                    required: true,
                    trim: true,
                },
                score:{
                    type:String,
                    min:1,
                    max:5,
                    required: true,
                }

            }
        ],
        isVerifiedPurchase:{
            type: Boolean,
            default: false,
            index: true,
        },
        isFeatured:{
            type: Boolean,
            default: false,
        },
        status:{
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending",
            index: true,
        },
        rejectionReason:{
            type: String,
            default: "",
            trim: true,
        },
        helpfulCount:{
            type: Number,
            default: 0,
        },
        notHelpfulCount:{
            type: Number,
            default: 0,
        },
        helpfulVotes:[
            {
                user:{
                    type: mongoose.Schema.Types.ObjectId,
                    ref:"User",
                },
                value:{
                    type:String,
                    enum:["up","down"],
                },
            }
        ],
        reportedCount: {
            type: Number,
            default: 0,
        },
        reports: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },
                reason: {
                    type: String,
                    trim: true,
                    default: "",
                },
                reportedAt: {
                    type: Date,
                    default: Date.now,
                },
            },
        ],
        sellerResponse: {
            message: {
                type: String,
                trim: true,
                default: "",
            },
            respondedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null,
            },
            respondedAt: {
                type: Date,
                default: null,
            },
        },
        isDeleted: {
            type: Boolean,
            default: false,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

reviewSchema.index(
  { product: 1, user: 1, orderItem: 1 },
  { unique: true, sparse: true }
);

reviewSchema.index({
  product: 1,
  status: 1,
  isDeleted: 1,
});

reviewSchema.statics.calculateProductRating = async function (productId) {
  const mongooseId = new mongoose.Types.ObjectId(productId);

  const result = await this.aggregate([
    {
      $match: {
        product: mongooseId,
        status: "approved",
        isDeleted: false,
      },
    },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (!result.length) {
    return { avgRating: 0, totalReviews: 0 };
  }
  return {
    avgRating: result[0].avgRating,
    totalReviews: result[0].totalReviews,
  };
};


export const Review = mongoose.model("Review", reviewSchema);
    