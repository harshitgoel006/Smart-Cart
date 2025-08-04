import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Order } from "../models/order.model.js"
import { ProductQnA } from "../models/productQnA.model.js";
import  jwt  from "jsonwebtoken";




// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================



const customerGetAllProducts = asyncHandler(async (req, res)=>{
    const {search , category, minPrice,maxPrice, sort , page = 1, limit = 10} = req.query;
    const filter = {};
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
    let sortOption = {};
    if(sort === "price"){
        sortOption.price = 1;
    }
    else if( sort === "-price"){
        sortOption.price = -1;
    }
    else if(sort === "rating" ){
         sortOption.rating = -1;
    }
    else sortOption.createdAt = -1;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product.find(filter)
        .sort(sortOption)
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate({
            path: "seller",
            select: "fullname email username avatar phone role"
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

const getProductById = asyncHandler(async (req, res)=>{
    const {productId} = req.params;
    const product = await Product
    .findById(productId)
    .populate({
        path: "seller",
        select: "fullname email username avatar phone "
    })
    if(!product){
        throw new ApiError(404, "Product not found");
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

const getTopRatedProduct = asyncHandler(async(req, res) =>{
    const limit = parseInt(req.query.limit) || 10;

    const topProduct = await Product
    .find()
    .sort({rating: -1})
    .limit(limit)
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

const getNewArrivalProduct = asyncHandler(async(req, res)=>{
    const limit =  parseInt(req.query.limit) || 10;

    const newArrivals = await Product
    .find()
    .sort({createdAt : 1})
    .limit(limit)
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

const getProductsByCategory = asyncHandler(async(req, res)=>{
    const {categoryId} = req.params;
    const{sort, page =1, limit = 10} = req.query;

    if(!categoryId){
        throw new ApiError(400, "category Id is required")
    }

    const filter = {category: categoryId}

    let sortOption ={}
    if (sort === "price") sortOption.price = 1;
    else if (sort === "-price") sortOption.price = -1;
    else if (sort === "rating") sortOption.rating = -1;
    else sortOption.createdAt = -1;

    const totalProducts = await Product.countDocuments(filter);
    const products = await Product
    .find(filter)
    .sort(sortOption)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .populate({
      path: "seller",
      select: "fullname email username avatar phone role"
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




// ======================================================
// =============== SELLER PANNEL HANDLERS ===============
// ======================================================




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




const approveProducts = asyncHandler(async(req, res) =>{
    const {id} = req.params;
    const product = await Product.findByIdAndUpdate(
        id,
        {
            approveStatus:"approved", 
            isActive:true
        },
        {
            new:true
        }
    );
    if(!product){
        throw new ApiError(404,"Product not found")
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