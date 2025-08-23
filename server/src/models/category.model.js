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
        parentCategory:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            default: null,
        },
        isFeatured:{
            type: Boolean,
            default: false,
        },
        isDeleted:{
            type: Boolean,
            default:false
        },
        isActive:{
            type: Boolean,
            default: true
        },
        metaTitle: { 
            type: String, 
            default: "" 
        },
        metaDescription: { 
            type: String, 
            default: "" 
        },
        metaKeywords: { 
            type: String, 
            default: "" 
        },
        createdBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
        updatedBy:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    },
    {
        timestamps:true
    });

    categorySchema.pre("save", async function (next){
        if(this.isModified("name")){
            this.slug = this
            .name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
        }
        next();
    })
    export const Category = mongoose.model("Category", categorySchema);