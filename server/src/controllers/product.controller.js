import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { productService } from "../services/product.service.js";




// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================



 


// Customer get all products
const customerGetAllProducts = asyncHandler(async (req, res) => {
    
    const product = await productService.customerGetAllProducts(req.query);
    return res.status(200).json(
        new ApiResponse(
            200,
            product,
            "Products fetched successfully"
        )
    );
});

// Get product by ID
const getProductById = asyncHandler(async (req, res)=>{
    const {productId} = req.params;
    const product = await productService.getProductById(productId);
    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                product,
                "Product fetched successfully"
            )
        )

});

// Get top rated products
const getTopRatedProduct = asyncHandler(async(req, res) =>{
    const limit = parseInt(req.query.limit, 10) || 10;

    const topProduct = await productService.getTopRatedProduct(limit);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            topProduct,
            "Top rated products fetched successfully"
        )
    )
});

// get new Arrival products
const getNewArrivalProduct = asyncHandler(async(req, res)=>{
    const limit =  parseInt(req.query.limit, 10) || 10;

    const newArrivals = await productService.getNewArrivalProduct(limit);

    return res
    .status(200)
    .json(
    new ApiResponse(
        200, 
        newArrivals, 
        "New arrival products fetched successfully"
    )
  );
});

//  get products by their category
const getProductsByCategory = asyncHandler(async(req, res)=>{
    const {categoryId} = req.params;
    const products = await productService.getProductsByCategory(
        categoryId,
        req.query
    );
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            products,
            "Products fetched successfully by category"
        )
    )

});

// search product
const searchProduct = asyncHandler(async(req, res) =>{
    const products = await productService.searchProduct(req.query);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            products,
            "searched products fetched successfully"
        )
    )

});

// get related products
const getRelatedProducts = asyncHandler(async(req, res) =>{
    const {productId} = req.params;

    const products = await productService.getRelatedProducts(
        productId,
        req.query
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            products,
            "Related products fetched successfully"
        )
    )
});

// get product reviews
const getProductReview = asyncHandler(async(req, res) => {
    const {productId} = req.params;
    const reviews = await productService.getProductReviews(
        productId,
        req.query
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            reviews,
            "Product reviews fetched successfully"
        )
    )

    
});

// submit review
const submitReview = asyncHandler(async(req, res) => {
    const {productId} = req.params;
    const userId = req.user._id;
    const reviews = await productService(
        productId,
        userId,
        req.body
    )
    return res 
    .status(201)
    .json(
        new ApiResponse(
            201,
            reviews.review,
            reviews.message
        )
    );

});

// get product QnA
const getProductQnA = asyncHandler(async (req, res) => {
    const { productId } = req.params;
    const data = await productService.getProductQnA(
        productId,
        req.query
    );
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            data,
            "Product QnA fetched successfully"
        )
    );
});

// ask product question
const askProductQuestion = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const userId = req.user._id; // Auth middleware

  const newQnA = await productService.askProductQuestion(

    productId,
    userId,
    question
  )

  return res.status(201).json(new ApiResponse(
    201,
    newQnA,
    "Product question submitted successfully"
  ));
});










// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================



// this controller is used to create a new product by seller
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(
    req.user._id,
    req.body,
    req.files
  );

  return res
    .status(201)
    .json(
        new ApiResponse(
            201, 
            product, 
            "Product created successfully & pending admin approval"
        )
    );
});

// this controller is used to get all products of a seller
const getSellerProduct = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;
    const products = await productService.getSellerProducts(
        sellerId,
        req.query
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            products,
            "Products fetched successfully"
        )
    )
});

// this controller is used to update product details by seller
const updateProduct = asyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const sellerId = req.user._id;

    const product = await productService.updateProduct(
        productId,
        sellerId,
        req.body,
        req.files
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product updated & pending admin approval"
        )
    )

        
    
});

// this controller is used to delete a product by seller
const deleteProduct = asyncHandler(async (req, res) => {

  const result = await productService.deleteProduct(
    req.params.productId,
    req.user._id
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      null,
      result.message
    )
  );
});

// this controller is used to manage product stock by seller
const manageProductStock = asyncHandler(async(req, res)=>{
    const productId = req.params.productId;
    const{ stock } = req.body;

    const product = await productService.manageProductStock(
        productId,
        req.user._id,
        stock
    )

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Stock updated successfully"
        )
    )

}) ;

// this controller is used to manage product variants by seller
const variantManagement = asyncHandler(async(req, res) =>{
    const productId = req.params.productId;
    const {variants} = req.body;

    const product = await productService.variantManagement(
        productId,
        req.user._id,
        variants
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Variants updated successfully"
        )
    )
});

// this controller is used to get orders for a specific product by seller
const getProductOrders = asyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const sellerId = req.user._id;
    const order = await productService.getProductOrders(
        productId,
        sellerId,
        req.query
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            order,
            "product order fetched successfully"
            
        )
    )
});

// this controller is used to respond to product QnA by seller
const respondToProductQnA = asyncHandler(async(req,res)=>{
    const {productId, questionId} = req.params;
    const sellerId = req.user._id;

    const qna = await productService.respondToProductQnA(
        productId,
        questionId,
        sellerId,
        req.body
    );

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            qna,
            "Answer submitted"
        )
    );
});

// this controller is used to archive a product by seller
const archiveProduct = asyncHandler(async(req, res) =>{
    const productId = req.params;
    const result = await productService.archiveProduct(
        productId,
        req.user._id
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            result.alreadyArchived?"Product already archived":"Product archived successfully"
        )
    );
});

// this controller is used to restore an archived product by seller
const restoreArchiveProduct = asyncHandler(async(req, res) =>{
    const productId = req.params;

    const result = await productService.restoreArchiveProduct(
        productId,
        req.user._id
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            result.notArchived ? "Product is not archived" : "Product restored successfully"
        )
    );
});

// this controller is used to get product feedback by seller
const getProductFeedback = asyncHandler(async(req,res) =>{
    const productId = req.params.id;
    const productFeedback = await productService.getProductFeedback(
        productId,
        req.user._id,
        req.query
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            productFeedback,
            "Product feedback fetched successfully"
        )
    )

});

//  this controller is used to feature/unfeature a product by seller
const toggleProductFeature = asyncHandler(async(req, res) => {
  const productId = req.params.productId;  
  const { featured } = req.body;    

  const product = await productService.toggleProductFeature(
    productId,
    req.user._id,
    featured
  );
  
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            `Product ${featured ? "featured" : "unfeatured"} successfully`
        )
    );
});

// this controller is used to schedule flash sale for a product by seller
const scheduleFlashSale = asyncHandler(async(req, res) =>{
    const productId = req.params.productId;

    const product = await productService.scheduleFlashSale(
        productId,
        req.user._id,
        req.body
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Flash sale scheduled successfully"
        )
    );
});





// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================



// this controller is used to approve products by admin
const approveProducts = asyncHandler(async(req, res) =>{
    const productId = req.params;
    const product = await productService.approveProduct(productId);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            product.alreadyApproved ? "Product already approved" : "Product approved successfully"
        )
    );
});

// this controller is used to reject products by admin
const rejectProduct = asyncHandler(async (req,res) =>{
    const productId = req.params;
    const {reason} = req.body;

    const product = await productService.rejectProduct(
        productId,
        reason
    );
    

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            product.alreadyRejected ? "Product alread rejected " : "Product rejected successfully"
        )
    );
    
});

// this controller is used to get all products by admin
const adminGetAllProducts = asyncHandler(async(req,res) =>{

    const products = await productService.adminGetAllProducts(req.query);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            products,
            "All products fetched successfully"
        )
    )
});

//  this controller is used to moderate product content by admin
const moderateProductContent = asyncHandler(async(req, res) =>{
    const productId = req.params;
    const product = await productService.moderateProductContent(
        productId,
        req.body
    );

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product moderated successfully"
        )
    )
});

// this controller is used to toggle product status by admin
const toggleProductStatus = asyncHandler(async (req, res) => {

  const { productId } = req.params;
  const { isActive } = req.body;

  const product = await productService.toggleProductStatus(
    productId,
    isActive
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      product,
      `Product ${isActive ? "activated" : "deactivated"} successfully`
    )
  );
});

// this controller is used to bulk moderate products by admin
const bulkModerateProducts = asyncHandler(async (req, res) => {

  const result = await productService.bulkModerateProducts(req.body);

  return res.status(200).json(
    new ApiResponse(
      200,
      result,
      "Bulk moderation completed"
    )
  );
});









export {
    customerGetAllProducts,
    getProductById,
    getTopRatedProduct,
    getNewArrivalProduct,
    getProductsByCategory,
    searchProduct,
    getRelatedProducts,
    getProductReview,
    submitReview,
    getProductQnA,
    askProductQuestion,
    

    createProduct,
    getSellerProduct,
    updateProduct,
    deleteProduct,
    manageProductStock,
    variantManagement,
    getProductOrders,
    respondToProductQnA,
    archiveProduct,
    restoreArchiveProduct,
    getProductFeedback,
    toggleProductFeature,
    scheduleFlashSale,


    approveProducts,
    rejectProduct,
    adminGetAllProducts,
    moderateProductContent,
    toggleProductStatus,
    bulkModerateProducts
}
