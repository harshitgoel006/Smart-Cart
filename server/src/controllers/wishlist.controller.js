import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { WishlistService } from "../services/wishlist.service.js";

// ======================================================
// =============== CUSTOMER ACCOUNT HANDLERS ============
// ======================================================

// This controller is used for adding a product to the user's wishlist. It expects productId, variantId and an optional note in the request body.
const addProductToWishlist = asyncHandler(async (req, res) => {
  const { productId, variantId, note } = req.body;

  const result = await WishlistService.addProduct(
    req.user._id,
    productId,
    variantId,
    note,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Product added to wishlist"));
});

// This controller is used for removing a product from the user's wishlist. It expects productId and variantId in the request body.
const removeProductFromWishlist = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.body;

  const result = await WishlistService.removeItem(
    req.user._id,
    productId,
    variantId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Product removed from wishlist"));
});

// This controller is used for viewing the user's wishlist. It supports pagination through query parameters page and limit.
const viewWishlist = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Math.min(Number(req.query.limit) || 20, 100);

  const data = await WishlistService.viewWishlist(req.user._id, page, limit);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Wishlist fetched successfully"));
});

// This controller is used for moving a wishlist item to the cart. It expects productId and variantId in the request body.
const moveListItemToCart = asyncHandler(async (req, res) => {
  const { productId, variantId } = req.body;

  const result = await WishlistService.moveToCart(
    req.user._id,
    productId,
    variantId,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Product moved to cart"));
});

// This controller is used for checking the availability of wishlist items. It will update the availability status of each item in the wishlist and return the updated wishlist.
const wishlistItemAvailablity = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const data = await WishlistService.checkAvailability(userId);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Wishlist item availability updated"));
});

// This controller is used for getting the count of items in the user's wishlist. It returns the count as a number in the response.
const getWishlistCount = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const count = await WishlistService.getCount(userId);

  return res
    .status(200)
    .json(
      new ApiResponse(200, { count }, "Wishlist count fetched successfully"),
    );
});

// This controller is used for clearing the user's wishlist. It will remove all items from the wishlist and return a success message.
const clearWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const result = await WishlistService.clearWishlist(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Wishlist cleared successfully"));
});

// This controller is used for updating the privacy setting of a wishlist. It expects wishlistId and privacy (public/private) in the request body.
const wishlistPrivacy = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { wishlistId, privacy } = req.body;

  const result = await WishlistService.updatePrivacy(
    userId,
    wishlistId,
    privacy,
  );

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Wishlist privacy updated"));
});

// This controller is used for creating a new wishlist. It expects name and privacy (public/private) in the request body.
const createNewWishlist = asyncHandler(async (req, res) => {
  const { name, privacy } = req.body;

  const wishlist = await WishlistService.createWishlist(
    req.user._id,
    name,
    privacy,
  );

  return res
    .status(201)
    .json(new ApiResponse(201, wishlist, "Wishlist created successfully"));
});

// This controller is used for fetching all wishlists of the user. It returns an array of wishlists with their details.
const getAllWishlist = asyncHandler(async (req, res) => {
  const data = await WishlistService.getAllWishlists(req.user._id);

  return res
    .status(200)
    .json(new ApiResponse(200, data, "Wishlists fetched successfully"));
});

// This controller is used for setting a wishlist as the default wishlist. It expects wishlistId in the request body.
const setDefaultWishlist = asyncHandler(async (req, res) => {
  const { wishlistId } = req.body;

  const result = await WishlistService.setDefault(req.user._id, wishlistId);

  return res
    .status(200)
    .json(new ApiResponse(200, result, "Default wishlist updated"));
});

// Exporting the controllers as an object for easier import in routes
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
