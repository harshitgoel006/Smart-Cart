import mongoose, { mongo, Mongoose } from "mongoose";

const productQnASchema = new mongoose.Schema
(
    {
        product :{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",   //customer ref
            required:true
        },
        question:{
            type:String,
            required:true
        },
        answer:{
            type:String
        },
        answeredBy:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",   // seller ref
        }
    },
    {
        timestamps:true
    }
)


export const ProductQnA = mongoose.model("ProductQnA",productQnASchema);