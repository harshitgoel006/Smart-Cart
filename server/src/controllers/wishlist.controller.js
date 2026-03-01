import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiResponse } from "../utils/ApiResponse.js";
import { WishlistService } from '../services/wishlist.service.js';





// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================




// Add product to wishlist
const addProductToWishlist = asyncHandler(async (req, res) => {

  const { productId, variantId, note } = req.body;

  const result = await WishlistService.addProduct(
    req.user._id,
    productId,
    variantId,
    note
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Product added to wishlist"
    )
  );
});

// Remove product from wishlist
const removeProductFromWishlist = asyncHandler(async (req, res) => {

  const { productId, variantId } = req.body;

  const result = await WishlistService.removeItem(
    req.user._id,
    productId,
    variantId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Product removed from wishlist"
    )
  );
});

// View wishlist
const viewWishlist = asyncHandler(async (req, res) => {

  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const data = await WishlistService.viewWishlist(
    req.user._id,
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Wishlist fetched successfully"
    )
  );
});

// Move wishlist item to cart
const moveListItemToCart = asyncHandler(async (req, res) => {

  const { productId, variantId } = req.body;

  const result = await WishlistService.moveToCart(
    req.user._id,
    productId,
    variantId,
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Product moved to cart"
    )
  );
});

// Check wishlist item availability
const wishlistItemAvailablity = asyncHandler(async(req,res) =>{
    const userId = req.user._id;

    const data = await WishlistService.checkAvailability(
        userId
    )

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "Wishlist item availability updated",
        )
    );
});

// Get wishlist count
const  getWishlistCount = asyncHandler(async(req, res) =>{
    const userId = req.user._id;

    const count = await WishlistService.getCount(userId);

    return res 
    .status(200)
    .json(new ApiResponse(
        200,
        {count},
        "Wishlist count fetched successfully",
    ));
});

// Clear wishlist
const clearWishlist = asyncHandler(async(req, res) => {
    const userId = req.user._id;

    const result = await WishlistService.clearWishlist(userId);
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            "Wishlist cleared successfully",
        )
    );
});

// Update wishlist privacy
const wishlistPrivacy = asyncHandler(async(req, res) =>{
    const userId = req.user._id;
    const {wishlistId, privacy} = req.body;

    const result = await WishlistService.updatePrivacy(
        userId,
        wishlistId,
        privacy
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200, 
            result,
            "Wishlist privacy updated",
        )
    );
});

// Create new wishlist
const createNewWishlist = asyncHandler(async (req, res) => {

  const { name, privacy } = req.body;

  const wishlist = await WishlistService.createWishlist(
    req.user._id,
    name,
    privacy
  );

  return res.status(201).json(
    new ApiResponse(
      201,
      wishlist,
      "Wishlist created successfully"
    )
  );
});

// Get all wishlists
const getAllWishlist = asyncHandler(async (req, res) => {

  const data = await WishlistService.getAllWishlists(
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      data,
      "Wishlists fetched successfully"
    )
  );
});

// Set default wishlist
const setDefaultWishlist = asyncHandler(async (req, res) => {

  const { wishlistId } = req.body;

  const result = await WishlistService.setDefault(
    req.user._id,
    wishlistId
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Default wishlist updated"
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

