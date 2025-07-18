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

})

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

})



export {
    getAllProducts,
    getProductById
}