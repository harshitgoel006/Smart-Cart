import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Product } from "../models/product.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  jwt  from "jsonwebtoken";



const getAllProducts = asyncHandler(async (req, res)=>{
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

})


 const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock,
    brand,
    category
  } = req.body;

  if (!name || !description || !price || !stock || !brand || !category) {
    throw new ApiError(400, "All fields are required");
  }

  const localImagePaths = req.files?.map(file => file.path);

  if (!localImagePaths || localImagePaths.length === 0) {
    throw new ApiError(400, "At least one image is required");
  }

  const uploadedImages = [];

  for (const localPath of localImagePaths) {
    const result = await uploadOnCloudinary(localPath);
    if (result?.url && result?.public_id) {
      uploadedImages.push({
        url: result.url,
        public_id: result.public_id
      });
    }
  }

  const product = await Product.create({
    name,
    description,
    price,
    stock,
    brand,
    category,
    images: uploadedImages, // add here
    seller: req.user?._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});


export {
    getAllProducts,
    getProductById,
    getTopRatedProduct,
    getNewArrivalProduct,
    getProductsByCategory,
    createProduct
}