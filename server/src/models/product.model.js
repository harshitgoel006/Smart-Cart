import mongoose from "mongoose";


const optionSchema = new mongoose.Schema({
  value:String,
  stock:Number,
  price:Number,
},
{
  _id:false
})

const variantSchema = new mongoose.Schema({
  lable:String,
  options:[optionSchema]
},{
  _id:false
})
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    finalPrice: {
      type: Number,
    },
    stock: {
      type: Number,
      required: true,
      min:0
    },
    sold: {
      type: Number,
      default: 0,
    },
    images: [
      {
        public_id: {
          type: String,
          required: true
        },
        url: {
          type: String,
          required: true
        }
      }
    ],
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref:"Category",
      required: true,
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Seller ID is required"],
    },
    isActive:{
      type:Boolean,
      default:true
    },
    isArchived:{
      type:Boolean,
      default:false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    approvalStatus:{
      type:String,
      enum:['pending','approved','rejected'],
      default:'pending'
    },
    variants:[variantSchema],
    featured:{
      type:Boolean,
      default:false
    },
    flashSale:{
      start: Date,
      end:Date,
      discount: Number,
      isActive:{
        type:Boolean,
        default:false
      }
    }
  },
  {
    timestamps: true,
  }
);


productSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name.toLowerCase().replace(/\s+/g, "-");
  }
  this.finalPrice = this.price - (this.price * this.discount) / 100;
  next();
});

export const Product = mongoose.model("Product", productSchema);