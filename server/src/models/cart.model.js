import mongoose from "mongoose";

const cartSchema = new mongoose.Schema
(
    {
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
            Unique:true
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

    for(const item of this.items){
        const product = await mongoose.model("Product").findByIf(item.product);
        if(product){
            totalItems += item.quantity;
            totalPrice += item.quantity*product.price;
        }
    }

    this.totalItems = totalItems;
    this.totalPrice = totalPrice;
};


//  add items 

cartSchema.methods.addItems = async function(productId, quantity =1){
    const index = this.items.findIndex(
        item => item.product.toString() === productId.toString()
    );
    if(index>-1){
        this.items[index].quantity += quantity;
    }
    else{
        this.items.push({product: productId, quantity});
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

     