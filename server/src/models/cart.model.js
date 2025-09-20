import mongoose from "mongoose";

const cartSchema = new mongoose.Schema
(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            unique:true
        },
        items:[
            {
                product:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:"Product",
                    required:true
                },
                quantity:{
                    type:Number,
                    required:true,
                    min:[1,"quantity can not be less than 1"],
                    default:1
                },
                priceSnapshot:{
                    type:Number,
                    required:true
                }
            }
        ],
        totalItems:{
            type:Number,
            default:0
        },
        totalPrice:{
            type: Number,
            default:0
        }
    },
    {
        timestamps:true
    }
)


//  calculate totals

cartSchema.methods.calculateTotals = async function(){
    let totalItems = 0;
    let totalPrice = 0;

    const productIds = this.items.map(item => item.product);
    const products = await mongoose.model("Product").find({_id: {$in: productIds}});

    for(const item of this.items){
        const product = products.find(p => p._id.toString() === item.product.toString());
        if(product){
            totalItems += item.quantity;
            totalPrice += item.quantity*product.price;
        }
    }

    this.totalItems = totalItems;
    this.totalPrice = totalPrice;
};


//  add items 

cartSchema.methods.addItems = async function(productId, quantity =1, priceSnapshot){
    const index = this.items.findIndex(
        item => item.product.toString() === productId.toString()
    );
    if(index>-1){
        this.items[index].quantity += quantity;
    }
    else{
        this.items.push({product: productId, quantity, priceSnapshot});
    }
    
    await this.calculateTotals();
    return this.save();

}

//  remove items

cartSchema.methods.removeItems = async function(productId){
    this.items = this.items.filter(
        item => item.product.toString() !== productId.toString()
    );

    await this.calculateTotals();
    return this.save();
}

//  clear cart

cartSchema.methods.clearCart = async function(){
    this.items = [];
    this.totalItems = 0;
    this.totalPrice = 0;
    return this.save();
}

export const Cart = mongoose.model("Cart", cartSchema);

