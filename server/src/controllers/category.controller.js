import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Category } from '../models/category.model.js';
import { Order } from '../models/order.model.js';
import createAndSendNotification from "../utils/sendNotification.js";
import { categoryService } from '../services/category.service.js';


// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================




// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {

  const tree = await categoryService.getAllCategories();

  return res.status(200).json(
    new ApiResponse(200, tree, "Categories fetched successfully")
  );
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {

  const { categoryId } = req.params;

  const category = await categoryService.getCategoryById(categoryId);
  return res
  .status(200)
  .json(
    new ApiResponse(
        200, 
        category,
        "Category details fetched successfully"
    ));
});

// Get featured categories
const getFeaturedCategories = asyncHandler(async(req, res) =>{
    const categories = await categoryService.getFeaturedCategories();

    if (!categories.length) {
        throw new ApiError(404, "No featured categories found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories,
                "Featured categories fetched successfully"
            )
        );
});

// Get categories by search query
const searchCategories = asyncHandler(async(req, res) =>{
    const {query} = req.query;

    const categories = await categoryService.searchCategories(query);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories,
                "Categories fetched successfully"
            )
        );
});



// ======================================================
// =============== SELLER PANEL HANDLERS ================
// ======================================================



// Get seller category list
const getSellerCategoryList = asyncHandler(async(req, res) =>{

    const categories = await categoryService.getSellerCategoryList();

    return res 
    .status (200)
    .json(
        new ApiResponse(
            200,
            categories,
            "Seller categories fetched successfully"
        )
    )

});

//  select category for product
const selectCategoryForProduct = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    const category = await categoryService.selectCategoryForProduct(categoryId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category selected successfully"
            )
        );
});

// Propose a new category   
const proposeNewCategory = asyncHandler(async(req, res) =>{
    
    const sellerId = req.user._id;

    const newCategory = await categoryService.proposeCategory(
        req.body,
        sellerId
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                1,
                newCategory,
                "New category proposed successfully"
            )
        );
});



// Get category wise performance
const getCategoryPerformance = asyncHandler(async(req, res) =>{
    const sellerId = req.user._id;

    const performanceData = await categoryService.getCategoryPerformance(sellerId);

    if(!performanceData.length){
        throw new ApiError(404, "No performance data found for your categories");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                performanceData,
                "Category performance fetched successfully"
            )
        );
});

// Update category status
const updateCategoryStatus = asyncHandler(async(req, res)=>{
    const {categoryId} = req. params;
    const sellerId = req.user._id;

    const category =  await categoryService.updatePendingCategory(
        categoryId,
        sellerId,
        req.body
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                1,
                category,
                "Category updated successfully"
            )
        );
});


// get category details for edit
const getCategoryDetailsForEdit = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;
    const sellerId = req.user._id;  

    const category = await categoryService.getCategoryForEdit(
        categoryId,
        sellerId
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                1,
                category,
                "Category details fetched successfully for editing"
            )
        );
});

// Delete proposed category
const deleteProposedCategory = asyncHandler(async(req, res ) =>{
    const {categoryId} = req.params;
    const sellerId = req.user._id;

    const result = await categoryService.deletePendingCategory(
        categoryId,
        sellerId
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                0,
                result,
                "Category deleted successfully"
            )
        );
});






// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================



// Get all categories for admin
const getAllCategoriesForAdmin = asyncHandler(async (req, res) => {

  const { page, limit } = req.query;

  const result = await categoryService.getAllCategoriesForAdmin({
    page,
    limit
  });

  return res.status(200).json(
    new ApiResponse(200, result, "Categories fetched successfully")
  );
});

// view category details
const viewCategoryDetails = asyncHandler(async(req, res)=>{
    const {categoryId} = req.params;

    const category = await categoryService.viewCategoryDetails(categoryId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category details fetched successfully"
            )
        );
})

// Approve category
const approveCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    const category = await categoryService.approveCategory(categoryId);

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            category,
            "Category approved successfully"
        )
    );

});

// Reject category
const rejectCategory = asyncHandler(async(req, res ) =>{
    const {categoryId} = req.params;
    const {rejectionReason} = req.body; 

    const category = await categoryService.rejectCategory(
        categoryId,
        rejectionReason
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category rejected successfully"
            )
        );
});

// Create category
const createCategory = asyncHandler(async (req, res) => {

  const category = await categoryService.createCategory(
    req.body,
    req.user._id
  );

  return res.status(201).json(
    new ApiResponse(201, category, "Category created successfully")
  );
});

// Delete category
const deleteCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    const category = await categoryService.deleteCategory(categoryId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category deleted successfully"
            )
        );
});

// Update category
const updateCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    const category = await categoryService.updateCategory(
        categoryId,
        req.body
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category,
                "Category updated successfully"
            )
        );
});

// Restore deleted category
const restoreDeletedCategory = asyncHandler(async(req, res) =>{
    const { categoryId } = req.params;

    const category = await categoryService.restoreDeletedCategory(categoryId);

    return res
        .status(200)
        .json(
            new ApiResponse(200, category, "Category restored successfully")
        );
});

// Get categories statistics
const getCategoriesStatistics = asyncHandler(async(req,res) =>{

    const stats = await categoryService.getCategoriesStatistics();

    if(!stats.length){
        throw new ApiError(404, "No categories statistics found ");
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            stats,
            "Categories statistics fetched successfully"
        )
    )
});

// Bulk update categories status
const bulkUpdateCategoriesStatus = asyncHandler(async(req, res) =>{
    const {categoryIds , status} = req.body;

    const result = await categoryService.bulkUpdateCategoriesStatus(
        categoryIds,
        status
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result,
                `${result} categories updated successfully`
            )
        );

})





export {
    getAllCategories,
    getCategoryById,
    getFeaturedCategories,
    searchCategories,

    getSellerCategoryList,
    selectCategoryForProduct,
    proposeNewCategory,
    getCategoryPerformance,
    updateCategoryStatus,
    getCategoryDetailsForEdit,
    deleteProposedCategory,

    getAllCategoriesForAdmin,
    viewCategoryDetails,
    approveCategory,
    rejectCategory,
    createCategory,
    deleteCategory,
    updateCategory,
    restoreDeletedCategory,
    getCategoriesStatistics,
    bulkUpdateCategoriesStatus
    
}
