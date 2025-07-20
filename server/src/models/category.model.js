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
            type: String,
            default:""
        },
        image:{
            type: String,
            default:""
        },
        slug:{
            type: String,
            lowercase:true,
            unique: true
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

    categorySchema.pre("save", async function (next){
        if(this.isModified("name")){
            this.slug = this.name.toLowerCase().replace(/\s+/g, "-")
        }
        next();
    })
    export const Category = mongoose.model("Category", categorySchema);