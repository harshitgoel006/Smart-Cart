import {asyncHandler} from '../utils/asyncHandler.js';
import { Wishlist } from "../models/wishlist.model.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js";
import { Cart } from '../models/cart.model.js';




// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================




// Add product to wishlist
const addProductToWishlist = asyncHandler(async(req, res)=>{
    const userId = req.user._id;
    const {productId, note} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    let wishlist = await Wishlist.findOne({ user: userId, isDefault: true });

    if(!wishlist){
        wishlist = new Wishlist({
            user: userId,
            isDefault:true,
            items:[],
        });
    }

    await wishlist.addProduct(productId, note || "");
    wishlist = await wishlist.populate("items.product");

    return res
    .status(200)
    .json(
        new ApiResponse(
            200, 
            true,
            wishlist,
            "Product added to wishlist", 
        )
    );

});

// Remove product from wishlist
const removeProductFromWishlist = asyncHandler(async(req, res)=>{

    const userId = req.user._id;
    const {productId} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    const wishlist = await Wishlist.findOne({user: userId, isDefault:true});

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    const intialItemCount = wishlist.items.length;
    wishlist.items = wishlist.items.filter(
        (item) => item.product.toString() !== productId
    )

    if(wishlist.items.length === intialItemCount){
        throw new ApiError(404, "Product not found in wishlist");
    }
    await wishlist.save();
    await wishlist.populate("items.product");
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlist,
            "Product removed from wishlist",
        )
    );
});

// View wishlist
const viewWishlist = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

    const wishlistId = req.params.wishlistId || null;

    let wishlist;

    if(wishlistId){
        wishlist = await Wishlist.findOne({_id: wishlistId, user:userId});
    }
    else{
        wishlist = await Wishlist.findOne({user:userId, isDefault:true});
    }

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    await wishlist.populate("items.product");

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlist,
            "wishlist fetched successfully",
            
        )
    );
});

// Move wishlist item to cart
const moveListItemToCart = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {productId} = req.body;

    if(!productId){
        throw new ApiError(400, "Product ID is required");
    }

    const wishlist = await Wishlist.findOne({user:userId, isDefault:true});

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    const itemIndex = wishlist.items.findIndex(
    (item) => item.product.toString() === productId
  );
    if(itemIndex === -1){
        throw new ApiError(404, "Product not found in wishlist");
    }
    wishlist.items.splice(itemIndex, 1);

    

    let cart = await Cart.findOne({user: userId});
    if(!cart){
        cart = new Cart({user:userId, items:[]});
    }

    const cartItem = cart.items.find(
        (item) => item.product.toString() === productId
    );
    if(cartItem){
        cartItem.quantity += 1;
    }
    else{
        cart.items.push({product: productId, quantity:1});
    }

    await wishlist.save();
    await cart.calculateTotals();
    await cart.save();

    await wishlist.populate("items.product");
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            {
                wishlist, 
                cart
            },
            "Product moved to cart",
            
        )
    );

});

// Check wishlist item availability
const wishlistItemAvailablity = asyncHandler(async(req,res) =>{
    const userId = req.user._id;

    let wishlist = await Wishlist.findOne({user:userId, isDefault:true});
    if(!wishlist){
        throw new ApiError(404, "Wishlist not found ");
    }
    for(const item of wishlist.items){
        const product = await Product.findById(item.product);
        item.isAvailable = product && product.stock > 0;

    }
    await wishlist.save();
    wishlist = await wishlist.populate("items.product");

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlist,
            "Wishlist item availability updated",
        )
    );
});

// Get wishlist count
const  getWishlistCount = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({user:userId, isDefault:true});

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    const count = wishlist ? wishlist.items.length : 0 ;

    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        true, 
        {count},
        "Wishlist count fetched successfully",
    ));
});

// Clear wishlist
const clearWishlist = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const wishlist = await Wishlist.findOne({user:userId, isDefault:true});

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.items = [];

    await wishlist.save();
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlist,
            "Wishlist cleared successfully",
        )
    );
});

// Update wishlist privacy
const wishlistPrivacy = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

    const {privacy} = req.body;

    if(!['public','private'].includes(privacy)){
        throw new ApiError(400, "Invalid privacy setting");
    }

    const wishlist = await Wishlist.findOne({user:userId, isDefault:true});

    if(!wishlist){
        throw new ApiError(404, "Wishlist not found");
    }

    wishlist.privacy = privacy;

    await wishlist.save();
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, 
            true,
            wishlist,
            "Wishlist privacy updated",
        )
    );
});

// Create new wishlist
const  createNewWishlist = asyncHandler(async(req, res)=>{
    const userId = req.user._id;

    const {name, privacy} = req.body;

    if(!name){
        throw new ApiError(400, "Wishlist name is required");
    }
    if(privacy && !['public','private'].includes(privacy)){
        throw new ApiError(400, "Invalid privacy setting");
    }

    const existingWishlist = await Wishlist.findOne({user:userId, name});
    if(existingWishlist){
        throw new ApiError(400, "Wishlist with this name already exists");
    }
    const wishlist = new Wishlist({
        user: userId,
        name,
        privacy: privacy || 'private',
        items:[],
        isDefault:false,
    });

    await wishlist.save();

    return res 
    .status(201)
    .json(
        new ApiResponse(
            201, 
            true,
            wishlist,
            "Wishlist created successfully",
        )
    );
});

// Get all wishlists
const getAllWishlist = asyncHandler(async(req, res) =>{

    const userId = req.user._id;

    const wishlists = await Wishlist
    .find({user:userId})
    .populate("items.product");

    if(!wishlists || wishlists.length === 0){
        throw new ApiError(404, "No wishlists found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlists,
            "Wishlists fetched successfully",
        )
    );
});

// Set default wishlist
const setDefaultWishlist = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

    const {wishlistId} = req.body;

    if(!wishlistId){
        throw new ApiError(400, "Wishlist ID is required");
    }
    const wishlist = await Wishlist.findOne({ _id: wishlistId, user: userId });
    if (!wishlist) {
        throw new ApiError(404, "Wishlist not found");
    }

    await Wishlist.updateMany(
        {
            user:userId,
            isDefault:true
        },
        {
            isDefault:false
        }
    );

    wishlist.isDefault = true;
    await wishlist.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            true,
            wishlist,
            "Default wishlist updated",
        )
    );
});

export {
    addProductToWishlist,
    removeProductFromWishlist,
    viewWishlist,
    moveListItemToCart,
    wishlistItemAvailablity,
    getWishlistCount,
    clearWishlist,
    wishlistPrivacy,
    createNewWishlist,
    getAllWishlist,
    setDefaultWishlist,
};

