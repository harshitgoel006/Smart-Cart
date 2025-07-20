import mongoose from "mongoose";


const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description:{
            type: String,
            required: true,
            trim: true,
        },
        price:{
            type: Number,
            required: true,
            min: 0,
        },
        discount:{
            type: Number,
            default: 0
        },
        finalPrice:{
            type: Number
        },
        stock:{
            type: Number,
            required: true
        },
        sold:{
            type: Number,
            default: 0
        },
        images:{
            type: String,
            required: true,
        },
        brand:{
            type: String,
            required: true,
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"Category",
            required: true,
        },
        ratings:{
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        reviews:{
            type: Number,
            default: 0
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ],
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Seller ID is required"]
        },
        isDeleted: {
            type: Boolean,
            default: false
        }


    },
    {
        timestamps: true,

    }
)


productSchema.pre("save", function(next){
    this.finalPrice = this.price - ((this.price * this.discount) / 100);
  next();
});

export const Product = mongoose.model("Product", productSchema);