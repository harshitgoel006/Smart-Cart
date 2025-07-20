import mongoose from "mongoose";


const categorySchema = new mongoose.Schema(
    {
        name :{
            type: String,
            required: [true,"Category name is required"],
            trim: true,
            unique: true
        },
        description:{
            type: true,
            default:""
        },
        image:{
            type: String,
            default:""
        },
        isFeatured:{
            type: Boolean,
            default: false,
        },
        isDeleted:{
            type: Boolean,
            default:false
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    },
    {
        timestamps:true
    });


    export const Category = mongoose.model("Category", categorySchema);