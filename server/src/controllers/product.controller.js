import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js"
import { ProductQnA } from "../models/productQnA.model.js";
import { Review } from "../models/review.model.js";
import mongoose from "mongoose";
import createAndSendNotification from "../utils/sendNotification.js";




// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================



// Sort handler
function sortHandler(sort) {
  if (sort === "price") return { price: 1 };
  if (sort === "-price") return { price: -1 };
  if (sort === "rating") return { rating: -1 };
  return { createdAt: -1 };
}


// Customer get all products
const customerGetAllProducts = asyncHandler(async (req, res)=>{
    const {search , category, minPrice, maxPrice, sort , page = 1, limit = 10} = req.query;
    const filter = {isActive: true, isDeleted: false, approvalStatus: "approved"};
    if(search){
        filter.$or = [
            {title: {$regex: search, $options: "i"}},
            {description: {$regex: search, $options: "i"}}
        ];
    }
    if(category){
        filter.category = category;
    }
    if(minPrice || maxPrice){
        filter.price = {};
        if(minPrice){
            filter.price.$gte = Number(minPrice);
        }
        if(maxPrice){
            filter.price.$lte  = Number(maxPrice);
        }
    }

    const sortOption = sortHandler(sort);
    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .select("title price discount rating images stock category")
        .populate({
            path: "seller",
            select: "fullname email username avatar"
        });
        return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    total: totalProducts,
                    page: Number(page),
                    limit: Number(limit),
                    products,
                },
                "Products fetched successfully"
            )
        )

});

// Get product by ID
const getProductById = asyncHandler(async (req, res)=>{
    const {productId} = req.params;
    const product = await Product.findById({
        _id: productId,
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved"
    })
    .populate({
        path: "seller",
        select: "fullname email username avatar"
    })
    .populate({
        path: "reviews",
        select: "rating comment user"
    });

    if(!product){
        throw new ApiError(404, "Product not found or not available");
    }
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

    const topProduct = await Product
    .find({
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved"
    })
    .sort({rating: -1})
    .limit(limit)
    .select("title price discount rating images stock category")
    .populate({
      path: "seller",
      select: "fullname email username avatar"
    });

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

    const newArrivals = await Product
    .find({
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved"
    })
    .sort({createdAt : 1})
    .limit(limit)
    .select("title price discount rating images stock category")
    .populate({
      path: "seller",
      select: "fullname email username avatar"
    });

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
    const{sort, page =1, limit = 10} = req.query;

    if(!categoryId){
        throw new ApiError(400, "category Id is required")
    }

    const filter = {
        category: categoryId,
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved"
    }

    let sortOption = sortHandler(sort);

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product
    .find(filter)
    .sort(sortOption)
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .select("title price discount rating images stock category")
    .populate({
      path: "seller",
      select: "fullname email username avatar "
    });

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total: totalProducts,
                page: Number(page),
                limit: Number(limit),
                products
            },
            "Products fetched successfully by category"
        )
    )

});

// search product
const searchProduct = asyncHandler(async(req, res) =>{
    const {query, brand, category, minPrice, maxPrice, sort, tags, page = 1, limit = 10} = req.query;

    const filter = {
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved"
    }
    if(query){
        filter.$or = [
            {
                title:{$regex: query, $options:"i"}
            },
            {
                description:{$regex: query, $options:"i"}
            }
        ];
    }
    if(brand){
        filter.brand = brand;
    }
    if(category){
        filter.category = category;
    }
    if(tags && tags.length > 0){
        filter.tags = {$in: tags.split(",")};
    }
    if(minPrice || maxPrice){
        filter.price = {};
        if(minPrice){
            filter.price.$gte = Number(minPrice);
        }
        if(maxPrice){
            filter.price.$lte = Number(maxPrice);
        }
    }
    let sortOption = sortHandler(sort);

    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) ||10;
    const total = await Product.countDocuments(filter);
    const products = await Product.find(filter)
    .sort(sortOption)
    .skip((pageNum-1)*limitNum)
    .limit(limitNum)
    .select("title price discount rating images stock category")
    .populate({
        path:"seller",
        select: "fullname email username avatar"
    })

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total,
                page: pageNum,
                limit: limitNum,
                products
            },
            "searched products fetched successfully"
        )
    )

});

// get related products
const getRelatedProducts = asyncHandler(async(req, res) =>{
    const productId = req.params;

    const {page = 1, limit = 10} = req.query;

    const mainProduct = await Product.findById(productId);
    if(!mainProduct){
        throw new ApiError(404, "Product not found");
    }

    let filter = {
        _id : {$ne: productId},
        isActive: true,
        isDeleted: false,
        approvalStatus: "approved",
        category: mainProduct.category
    }
    if(mainProduct.tags || mainProduct.tags.length > 0){
        filter.tags = {$in: mainProduct.tags};
    }
    if(mainProduct.brand){
        filter.brand = mainProduct.brand;
    }
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const total = await Product.countDocuments(filter);

    const products = await Product.find(filter)
    .limitNum(limit)
    .skip((pageNum - 1) * limitNum)
    .select("title price discount rating images stock category")
    .populate({
        path: "seller",
        select: "fullname email username avatar"
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total,
                page: pageNum,
                limit: limitNum,
                products
            },
            "Related products fetched successfully"
        )
    )
});


//  ----------------->>>>>>>>>>>>>>>>>>>> work on Review Model
const getProductReview = asyncHandler(async(req, res) =>{
    const {productId} = req.params;
    const { page = 1, limit = 10} = req.query;
    const filter = {product: productId};
    if(rating){
        filter.rating = Number(rating);
    }
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 10;
    const total = await Review.countDocuments(filter);
    const reviews = await Review.find(filter)
    .sort({createdAt: -1})
    .skip((pageNum - 1) * limitNum)
    .limitNum(limit)
    .populate({
        path: "user",
        select: "fullname email username avatar"
    })

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                total,
                page: pageNum,
                limit: limitNum,
                reviews
            },
            "Product reviews fetched successfully"
        )
    )

    
});


//  ----------------->>>>>>>>>>>>>>>>>>>> work on Review Model
const submitReview = asyncHandler(async(req, res) =>{
    const {productId} = req.params;
    const {rating, comment} = req.body;
    const userId = req.user._id;

    const review = await Review.findOne({produt:productId, user: userId});
    if(review){
        review.rating = rating;
        review.comment = comment;
        await review.save();
    }
    else{
         review = await Review.create({
            product: productId,
            user: userId,
            order: orderId,              // REQUIRED
            orderItem: orderItemId || null,
            rating,
            title,
            comment
        });
    }

    const stats = await Review.aggregate([
        {
            $match: {product: new mongoose.Types.ObjectId(productId)}
        },
        {
            $group:{
                _id: productId, 
                averageRating: {
                    $avg: "$rating"
                }, 
                total: {
                    $sum: 1
                }
            }
        }
    ]);
    if(stats.length > 0){
        await Product.findByIdAndUpdate(
            productId,
            {
                rating: stats[0].averageRating,
                totalReviews: stats[0].total
            },
            {
                new:true
            }
        );
    }
    return res 
    .status(201)
    .json(
        new ApiResponse(
            201,
            review.isNew ? "Review submitted successfully" : "Review updated successfully"
        )
    );

});

// get product QnA
const getProductQnA = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const filter = { product: productId };
  const pageNum = parseInt(page, 10) || 1;
  const limitNum = parseInt(limit, 10) || 10;

  const total = await ProductQnA.countDocuments(filter);
  const qnaList = await ProductQnA.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum)
    .populate({ path: "user", select: "fullname avatar username" })
    .populate({ path: "answers.answeredBy", select: "fullname username avatar role" }); // assuming answers is an array

  return res.status(200).json(new ApiResponse(
    200,
    { total, page: pageNum, limit: limitNum, qna: qnaList },
    "Product QnA fetched successfully"
  ));
});

// ask product question
const askProductQuestion = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { question } = req.body;
  const userId = req.user._id; // Auth middleware

  if (!question || !question.trim()) {
    throw new ApiError(400, "Question text is required");
  }

  // (Optional) Check if product exists and is active
  const product = await Product.findOne(
    { 
        _id: productId, 
        isActive: true, 
        isDeleted: false, 
        approvalStatus: "approved" 
    });
  if (!product) throw new ApiError(404, "Product not found or unavailable");

  const newQnA = await ProductQnA.create({
    product: productId,
    user: userId,
    question,
    isAnswered: false
  });

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
  const {
    name,
    description,
    price,
    stock,
    brand,
    category,
    variants
  } = req.body;

  if (!name || !description || !price || !stock  || !category ) {
    throw new ApiError(400, "Required fields are missing");
  }

  if(!req.files || req.files.length === 0){
    throw new ApiError(400, "Atleast one image is required")
  }

  const images =[];
  for(const file of  req.files){
    const uploadResult = await uploadOnCloudinary(file.path);
    images.push({
        url: uploadResult.url,
        public_id: uploadResult.public_id
    });
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    brand,
    category,
    images, 
    seller: req.user?._id,
    variants: variants ? JSON.parse(variants) :[],
    approvalStatus: 'pending',
    isActive:true
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully & pending admin approval"));
});

// this controller is used to get all products of a seller
const getSellerProduct = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;
    const {status, category, page = 1, limit = 10}= req.query;

    const filter = {seller:sellerId};
    if(status) filter.approvalStatus = status;
    if(category) filter.category = category;

    const products = await Product
    .find(filter)
    .skip((page-1)*limit)
    .limit(parseInt(limit))
    .sort({createdAt:-1});

    const total = await Product.countDocuments(filter);

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                count: products.length,
                total,
                page:parseInt(page),
                products
            },
            "Products fetched successfully"
        )
    )
});

// this controller is used to update product details by seller
const updateProduct = asyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const sellerId = req.user._id;

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found");
    }
    if(product.seller.toString() !== sellerId.toString()){
        throw new ApiError(403, "Not authorized");
    }

    const updates = req.body;
    if(req.files && req.files >0 )
        {
            for(const img of product.images)
                {
                    await uploadOnCloudinary.v2.uploader.destroy(img.public_id)
                }
            const images = [];
            for(const file of req.files)
                {
                    const uploadResult = await uploadOnCloudinary(file.path)
                    images.push(
                        {
                            url: uploadResult.url,
                            public_id: uploadResult.public_id
                        }
                    );
                }
            updates.images = images;
        }
    updates.approvalStatus = 'pending',
    product = await Product.findByIdAndUpdate
    (
        productId, 
        updates,
        {
            new:true
        }
    )

    try{
        await createAndSendNotification({
            recipientId: product.seller,
            recipientRole:"seller",
            recipientEmail: req.user.email,
            type:"PRODUCT_STATUS_TOGGLED",
            title:"Product updated & pending approval",
            message: `Your product "${product.name}" was updated and is pending admin approval.`,
            relatedEntity:{
                entityType: "product", 
                entityId: product._id
            },
            channels:["in-app", "email"],
            meta:{
                productId:product._id,
                productName: product.name,
                status: product.approvalStatus,
            },
        });
    }catch(e){
        console.error("Failed to send PRODUCT_STATUS_TOGGLED createAndSendNotification",e)
    }

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
const deleteProduct = asyncHandler(async(req, res) =>{
    const productId = req.params;
    const sellerId = req.user._id;

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found")
    }
    if(product.seller.toString() !== sellerId.toString()){
        throw new ApiError(403, "Not authorized");
    }
    product.isDeleted = true;
    await product.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Product deleted successfully"
        )
    )
});

// this controller is used to manage product stock by seller
const manageProductStock = asyncHandler(async(req, res)=>{
    const productId = req.params.id;
    const{ stock } = req.body;
    if(stock === undefined){
        throw new ApiError(400, "Stock value is required")
    }
    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found");
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403,"Not authorized");
    }
    product.stock = stock;
    await product.save();

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


// ----------->>>>>   >>>>>  >>>>> WORK ON IT || PENDING 

const bulkProductUpload = asyncHandler(async(req, res) =>{
    const file = req.file;
    if(!file){
        throw new ApiError(400, "CSV/Excel file is required")
    }

});

// this controller is used to manage product variants by seller
const variantManagement = asyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const {variants} = req.body;

    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found")
    }
    if(product.seller.toString()!== req.user._id.toString()){
        throw new ApiError(403,"Not authorized");
    }
    product.variants = variants;
    await product.save();

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
    const order = await Order
    .find({"items.product": productId, seller: req.user._id})
    .populate("user", "fullname email")
    .sort({createdAt:-1});

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                order,
                count:order.length
            },
            
        )
    )
});

// this controller is used to respond to product QnA by seller
const respondToProductQnA = asyncHandler(async(req,res)=>{
    const {productId, questionId} = req.params;
    const {answer} = req.body;

    const qna = await ProductQnA.findById(questionId);
    if(!qna || qna.product.toString()!== productId){
        throw new ApiError(404, "Question not found for this product");
    }
    const product = await Product.findById(productId)
    if(!product || product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized to answer questions for this product")
    }

    qna.answer = answer;
    qna.answeredBy = req.user._id;
    await qna.save();

    try{
        await createAndSendNotification ({
            recipientId: qna.user,
            recipientRole: "customer",
            recipientEmail: null,
            type: "SYSTEM_ANNOUNCEMENT_CUSTOMER",
            title: "Your product question was answered",
            message:`Your question on product "${product.name}" has a new answer.`,
            relatedEntity: {
                entityType:"product",
                entityId: product._id,
            },
            channels: ["in-app"],
            meta:{
                productId: product._id,
                productName: product.name,
                questionId: qna._id,
                answer,
            }
        });
    }catch(e){
        console.error("Failed to send QnA answer notification", e)
    }

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
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(404, "Product not found")
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }
    product.isActive = false;
    product.isArchived = true;
    await product.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Product archived suucessfully"
        )
    )
});

// this controller is used to restore an archived product by seller
const restoreArchiveProduct = asyncHandler(async(req, res) =>{
    const product = await Product.findById(req.params.id);
    if(!product){
        throw new ApiError(404, "Product not found")
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }
    product.isActive = true;
    product.isArchived = false;
    await product.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Product restotred suucessfully"
        )
    )
});

// this controller is used to get product feedback by seller
const getProductFeedback = asyncHandler(async(req,res) =>{
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "Product not found");
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }
    const reviews = await Review 
    .find({product: productId})
    .sort({createdAt:-1})
    .limit(10);
    const avgRating = await Review.aggregate([
        {
            $match: {
                product:product._id
            },
        },
        {
            $group:{
                _id:"$product",
                avg:{
                    $avg: "$rating"
                },
                count:{
                    $sum:1
                }
            }
        }
    ]);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            {
                avgRating: avgRating[0]?.avg?? 0,
                reviewCount: avgRating[0]?.count ?? 0,
                recentReviews: reviews
            },
            "Product feedback fetched successfully"
        )
    )

});

//  this controller is used to feature/unfeature a product by seller
const toggleProductFeature = asyncHandler(async(req, res) =>{
    const productId = req.params;
    const{featured} = req.body;

    if(featured){
        const featuredCount = await Product.countDocuments(
            {
                seller: req.user._id, 
                featured:true
            }
        )
    };
    if(featuredCount >=5){
        throw new ApiError(400, "Feature limit reached (max 5)")
    }
    const product = await Product.findById(productId)
    if(!product){
        throw new ApiError(404, "Product not found")
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }
    product.featured = featured;
    await product.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            `Product ${featured ? "featured" : "unfeatured"}successfully`
        )
    )
});

// this controller is used to schedule flash sale for a product by seller
const scheduleFlashSale = asyncHandler(async(req, res) =>{
    const productId = req.params.id;

    const {start, end , discount} = req.body;

    if(!(start && end && discount)){
        throw new ApiError(400, "All fields are required");
    }
    if(new Date(start) >= new Date(end)){
        throw new ApiError(400, "Start must be before end")
    }
    const product = await Product.findById(productId);
    if(!product){
        throw new ApiError(404, "product not found")
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }
    product.flashSale = {
        start: new Date(start),
        end: new Date(end),
        discount,
        isActive:true
    };
    await product.save();

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

// ----------->>>>>   >>>>>  >>>>> WORK ON IT || PENDING 

const getProductPerformanceAnalytics = asyncHandler(async(req, res) =>{
    const productId = req.params.id;
    const range = req.query.range || '30d';

    const product = await Product.findById(productId);
    
    if(!product){
        throw new ApiError(404, "product not found")
    }
    if(product.seller.toString() !== req.user._id.toString()){
        throw new ApiError(403, "Not authorized")
    }

})



// ======================================================
// =============== ADMIN PANNEL HANDLERS ================
// ======================================================



// this controller is used to approve products by admin
const approveProducts = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        {
            approvalStatus:"approved", 
            isActive:true
        },
        {
            new:true
        }
    );
    if(!product){
        throw new ApiError(404,"Product not found")
    }

    try {
        await createAndSendNotification({
            recipientId: product.seller._id,
            recipientRole: "seller",
            recipientEmail: product.seller.email,
            type: "PRODUCT_APPROVED",
            title: "Product approved",
            message: `Your product "${product.name}" has been approved and is now live.`,
            relatedEntity: { 
                entityType: "product", 
                entityId: product._id 
            },
            channels: ["in-app", "email"],
            meta: {
                productId: product._id,
                productName: product.name,
            },
        });
    }catch (e) {
        console.error("Failed to send PRODUCT_APPROVED notification", e);
    }
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product approved successfully"
        )
    )


});

// this controller is used to reject products by admin
const rejectProduct = asyncHandler(async (req,res) =>{
    const {id} = req.params;
    const {reason} = req.body;
    const product = await Product.findByIdAndUpdate(
        id,
        {
            approvalStatus: "rejected",
            isActive:false
        },
        {
            new:true
        }
    );
    if(!product){
        throw new ApiError(404,"Product not found");
    }

    try {
        await createAndSendNotification({
            recipientId: product.seller._id,
            recipientRole: "seller",
            recipientEmail: product.seller.email,
            type: "PRODUCT_REJECTED",
            title: "Product rejected",
            message: `Your product "${product.name}" was rejected by admin.`,
            relatedEntity: { 
                entityType: "product", 
                entityId: product._id 
            },
            channels: ["in-app", "email"],
            meta: {
                productId: product._id,
                productName: product.name,
                reason: reason || "Not specified",
            },
        });
    } catch (e) {
        console.error("Failed to send PRODUCT_REJECTED notification", e);
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product rejected successfully",
            {reason}
        )
    )
    
});

// this controller is used to get all products by admin
const adminGetAllProducts = asyncHandler(async(req,res) =>{
    const {status, seller, isActive}= req.query;
    const filter = {};
    if(status) filter.approvalStatus = status;
    if(seller) filter.seller = seller;
    if(isActive !== undefined) filter.isActive = isActive === 'true';
    const products = await Product
    .find(filter)
    .populate("seller", "fullname email")
    .populate("category" ,"name");

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
    const updates = req.body;
    if(!updates){
        throw new ApiError(404, "Atleast one update is required")
    }
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        updates,
        {
            new:true
        }
    );
    if(!product){
        throw new ApiError(404, "Product not found")
    }

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
const toggleProductStatus = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    const {isActive} = req.body;
    if(!isActive){
        throw new ApiError(404, "status is required")
    }
    const product = await Product.findByIdAndUpdate(
        id,
        {
            isActive
        },
        {
            new:true
        }
    );
    if(!product){
        throw new ApiError(404,"Product not found");
    }

    try {
        await createAndSendNotification({
            recipientId: product.seller._id,
            recipientRole: "seller",
            recipientEmail: product.seller.email,
            type: "PRODUCT_STATUS_TOGGLED",
            title: "Product status updated",
            message: `Admin ${isActive ? "activated" : "deactivated"} your product "${product.name}".`,
            relatedEntity: { entityType: "product", entityId: product._id },
            channels: ["in-app", "email"],
            meta: { 
                productId: product._id, 
                productName: product.name, 
                status: isActive ? "active" : "inactive",
            },
        });
    } catch (e) {
        console.error("Failed to send PRODUCT_STATUS_TOGGLED notification",e);
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            product,
            "Product status updated successfully"
        )
    )

});

// this controller is used to bulk moderate products by admin
const bulkModerateProducts = asyncHandler(async(req, res) =>{
    const {ids, action} = req.body;
    if(!ids || !action){
        throw new ApiError(404, "All fields are required")
    }
    const update = action === "approve" 
    ?{approvalStatus:"approved", isActive:true}
    :{approvalStatus:"rejected", isActive:false};

    const result = await Product.updateMany(
        {
            _id:{
                $in: ids
            }
        },
        update
    );
    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            result,
            `Products ${action}d successfully`
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