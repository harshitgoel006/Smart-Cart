import mongoose from 'mongoose';

const wishlistItemSchema = new mongoose.Schema(
    {
        product:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
            unique: true
        },
        
        dateAdded:{
            tyepe:Date,
            default:Date.now
        },
        note:{
            type:String,
            default:'',
            maxlength:500,
        },
        isAvailable:{
            type:Boolean,
            default:true,
        },
        
    },
    {
        timestamps:true,
    },
);

const wishlistSchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        name:{
            type:String,
            required:true,
            default:'My Wishlist',
        },
        items:[wishlistItemSchema],
        privacy:{
            type:String,
            enum:['public','private'],
            default:'private',
        },
        isDefault:{
            type:Boolean,
            default:true,
        },
    },
    {
        timestamps:true,
    }
)




wishlistSchema.index({ user: 1, name: 1 }, { unique: true });
wishlistSchema.methods.addProduct = async function(productId, note = "") {
  const exists = this.items.some(
    (item) => item.product.toString() === productId.toString()
  );
  if (!exists) {
    this.items.push({ product: productId, note });
    await this.save();
  }
};



export const Wishlist = mongoose.model('Wishlist',wishlistSchema);