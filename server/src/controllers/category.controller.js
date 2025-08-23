import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { Category } from '../models/category.model.js';
import { Order } from '../models/order.model.js';


// ======================================================
// =============== CUSTOMER PANNEL HANDLERS =============
// ======================================================


// Helper function to build a category tree
const buildCategoryTree = (categories, parentId = null) => {
  const categoryTree = [];
  categories.forEach(cat => {
    if ((cat.parentCategory ? cat.parentCategory.toString() : null) === (parentId ? parentId.toString() : null)) {
      const children = buildCategoryTree(categories, cat._id);
      categoryTree.push({
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        isFeatured: cat.isFeatured,
        children: children.length > 0 ? children : undefined,
      });
    }
  });
  return categoryTree;
};

// Get all categories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find(
    {
      isDeleted: false,
      isActive: true
    })
    .sort({ name: 1 });

  if (!categories.length) {
    throw new ApiError(404, "No categories found");
  }
  const categoryTree = buildCategoryTree(categories);
  return res
  .status(200)
  .json(
    new ApiResponse(
        200,
        categoryTree.length,
        categoryTree,
        "Categories fetched successfully"
    ));
});

// Get category by ID
const getCategoryById = asyncHandler(async (req, res) => {

  const { categoryId } = req.params;

  if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category
  .findById(categoryId)
  .lean();

  if (!(category && !category.isDeleted && category.isActive)) {
    throw new ApiError(404, "Category not found");
  }

  const allCategories = await Category
  .find(
    { 
        isDeleted: false, 
        isActive: true 
    })
    .lean();

  const children = buildCategoryTree(allCategories, category._id);

  const categoryData = {
    _id: category._id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    image: category.image,
    isFeatured: category.isFeatured,
    children: children.length > 0 ? children : undefined,
  };

  return res
  .status(200)
  .json(
    new ApiResponse(
        200, 
        categoryData.length,
        categoryData, 
        "Category details fetched successfully"
    ));
});

// Get featured categories
const getFeaturedCategories = asyncHandler(async(req, res) =>{
    const categories = await Category.find(
        { 
            isActive: true, 
            isFeatured: true,
            isDeleted: false
        }
    )
    .sort({ name: 1 });

    if (!categories.length) {
        throw new ApiError(404, "No featured categories found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories.length,
                categories,
                "Featured categories fetched successfully"
            )
        );
});

// Get categories by search query
const searchCategories = asyncHandler(async(req, res) =>{
    const {query} = req.query;

    if(!query || query.trim() === ""){
        throw new ApiError(400, "Search query is required");
    }

    const regex = new RegExp(query.trim(), "i");
    const categories = await Category
    .find({
        name: { $regex: regex },
        isDeleted: false,
        isActive: true
    })
    .sort({ name: 1 });

    if (!categories.length) {
        throw new ApiError(404, "No categories found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories.length,
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
    const categories = await Category.find({
        isActive: true,
        isDeleted: false,
        status: "approved"
    })
    .sort({ name: 1 });

    if(!categories){
        throw new ApiError(404, "No categories available for seller");
    }

    return res 
    .status (200)
    .json(
        new ApiResponse(
            200,
            categories.length,
            categories,
            "Seller categories fetched successfully"
        )
    )

});

//  select category for product
const selectCategoryForProduct = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;
    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category
    .findOne
    ({ 
        _id: categoryId,
        isActive: true,
        isDeleted: false,
        status: "approved"
    });

    if(!category){
        throw new ApiError(404, "Category not found or not available for selection for particular product");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                category.length,
                category,
                "Category selected successfully"
            )
        );
});

// Propose a new category
const proposeNewCategory = asyncHandler(async(req, res) =>{
    
    const{name, description, parentCategoryId, tags} = req.body;

    const sellerId = req.user._id;

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Category name is required");
    }

    const existingCategory = await Category
    .findOne({
        name: name.trim()
    });

    if(existingCategory){
        throw new ApiError(400, "Category with this name already exists");
    }

    const newCategory = await Category.create({
        name: name.trim(),
        description: description || "",
        parentCategory: parentCategoryId || null,
        isProposed: true,
        status: "pending",
        proposedBy: sellerId,
        isActive: false,
        isDeleted: false
    });

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

    const performanceData = await Order.aggregate([
        {
            $match:{
                seller: sellerId,
                status: "completed",
            }
        },
        {
            $group:{
                _id:"$products.categoryId",
                totalSales:{
                    $sum:"$products.quantity"
                },
                totalRevenue:{
                    $sum:{
                        $multiply:[
                            "$products.price",
                            "$products.quantity"
                        ]
                    }
                },
            },
        },
        {
            $lookup: {
                from:"categories",
                localField:"_id",
                foreignField:"_id",
                as:"category"
            }
        },
        {
            $unwind: "$category"
        },
        {
            $project: {
                categoryId: "$_id",
                categoryName: "$category.name",
                totalSales: 1,
                totalRevenue: 1,
            }
        },
        {
            $sort:{
                totalRevenue: -1
            }
        }
    ]);
    if(!performanceData.length){
        throw new ApiError(404, "No performance data found for your categories");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                performanceData.length,
                performanceData,
                "Category performance fetched successfully"
            )
        );
});

// Update category status
const updateCategoryStatus = asyncHandler(async(req, res)=>{
    const {categoryId} = req. params;
    const sellerId = req.user._id;
    const {description , name} = req.body;

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category
    .findOne({
        _id: categoryId,
        proposedBy: sellerId
    });

    if(!category){
        throw new ApiError(404, "Category not found or not available for update");
    }

    if(category.status !== "pending"){
        throw new ApiError(400, "Category is not in pending status");
    }

    if (name && name.trim() !== "") {
        category.name = name.trim();

    }
    if(description){
        category.description = description;
    }
    await category.save();

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

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category
    .findOne({
        _id : categoryId,
        proposedBy: sellerId
    });

    if(!category){
        throw new ApiError(404, "Category not found or not available for editing");
    }

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

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category
    .findOne({
        _id: categoryId,
        proposedBy: sellerId
    });

    if(!category){
        throw new ApiError(404, "Category not found or not available for deletion");
    }
     if (category.status !== "pending") {
        throw new ApiError(400, "You cannot delete category once reviewed");
    }

    await category.deleteOne();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                0,
                null,
                "Category deleted successfully"
            )
        );
});





// ======================================================
// =============== ADMIN PANEL HANDLERS =================
// ======================================================



// Get all categories for admin
const getAllCategoriesForAdmin = asyncHandler(async(req, res) =>{
    const categories = await Category
    .find({})
    .populate("proposedBy", "name email")
    .sort({ createdAt: -1 });

    if(!categories || categories.length === 0){
        throw new ApiError(404, "No categories found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                categories.length,
                categories,
                "Categories fetched successfully"
            )
        );
});

// view category details
const viewCategoryDetails = asyncHandler(async(req, res)=>{
    const {categoryId} = req.params;

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category
    .findById(categoryId)
    .populate("parentCategory", "name")
    .populate("proposedBy", "name email");

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                1,
                category,
                "Category details fetched successfully"
            )
        );
})

// Approve category
const approveCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    if(category.status !== "pending"){
        throw new ApiError(400, "Only pending categories can be approved");
    }

    if(category.status === "approved"){
        throw new ApiError(400, "Category is already approved");
    }

    category.status = "approved";
    category.isActive = true;
    await category.save();

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            1,
            category,
            "Category approved successfully"
        )
    );

});

// Reject category
const rejectCategory = asyncHandler(async(req, res ) =>{
    const {categoryId} = req.params;
    const {rejectionReason} = req.body; 

    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if(!category){
        throw new ApiError(404, "Category not found");
    }

    if(category.status !== "pending"){
        throw new ApiError(400, "Only pending categories can be rejected");
    }
    if(category.status === "rejected"){
        throw new ApiError(400, "Category is already rejected");
    }

    category.status = "rejected";
    category.isActive = false;
    category.rejectionReason = rejectionReason || "No reason provided";
    await category.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                1,
                category,
                "Category rejected successfully"
            )
        );
});

// Create category
const createCategory  = asyncHandler(async(req, res) =>{

    const {name, description, parentCategoryId, isFeatured , metaTitle, metaDescription, metaKeywords} = req.body;

    if(!name || name.trim() === ""){
        throw new ApiError(400, "Category name is required");
    }

    const existingCategory = await Category.findOne({ name: name.trim() });

    if (existingCategory) {
        throw new ApiError(400, "Category with this name already exists");
    }

    const newCategory = await Category.create({
        name: name.trim(),
        description: description || "",
        parentCategory: parentCategoryId || null,
        isFeatured: isFeatured || false,
        metaTitle: metaTitle || "",
        metaDescription: metaDescription || "",
        metaKeywords: metaKeywords || "",
        status: "approved",
        isActive: true,
        isDeleted: false
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                1,
                newCategory,
                "Category created successfully"
            )
        );
});

// Delete category
const deleteCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;
    if(!categoryId.match(/^[0-9a-fA-F]{24}$/)){
        throw new ApiError(400, "Invalid category ID");
    }
    const category = await Category.findById(categoryId);
    if(!category){
        throw new ApiError(404, "Category not found");
    }

    category.isDeleted = true;
    category.isActive = false;
    await category.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                1,
                category,
                "Category deleted successfully"
            )
        );
});

// Update category
const updateCategory = asyncHandler(async(req, res) =>{
    const {categoryId} = req.params;

    const { name, description, parentCategoryId, isFeatured, metaTitle, metaDescription, metaKeywords, status, isActive } = req.body;

    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    if (name && name.trim() !== category.name) {
    const existingCategory = await Category.findOne({ name: name.trim(), _id: { $ne: categoryId } });

    if (existingCategory) {
      throw new ApiError(409, "Category name already exists");
    }

    category.name = name.trim();
  }

    category.description = description || category.description;
    category.parentCategory = parentCategoryId !== undefined ? parentCategoryId : category.parentCategory;
    category.isFeatured = typeof isFeatured === "boolean" ? isFeatured : category.isFeatured;
    category.metaTitle = metaTitle || category.metaTitle;
    category.metaDescription = metaDescription || category.metaDescription;
    category.metaKeywords = metaKeywords || category.metaKeywords;
    category.status = status || category.status;
    category.isActive = typeof isActive === "boolean" ? isActive : category.isActive;

    await category.save();

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

// Restore deleted category
const restoreDeletedCategory = asyncHandler(async(req, res) =>{
    const { categoryId } = req.params;
    if (!categoryId.match(/^[0-9a-fA-F]{24}$/)) {
        throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({ _id: categoryId, isDeleted: true });
    if (!category) {
        throw new ApiError(404, "Deleted category not found");
    }
    category.isDeleted = false;
    category.isActive = true;
    await category.save();

    return res
        .status(200)
        .json(
            new ApiResponse(200, 1, category, "Category restored successfully")
        );
});

// Get categories statistics
const getCategoriesStatistics = asyncHandler(async(req,res) =>{
    const stats = await Category.aggregate([
        {
            $lookup:{
                from:"products",
                localField:"_id",
                foreignField:"category",
                as:"products"
            }
        },
        {
            $project:{
                name: 1,
                totalProductss:{
                    $size: "$products"
                },
                activeProducts:{
                    $size: {
                        $filter:{
                            input: "$products",
                            as:"product",
                            cond: {
                                $eq:["$$product.isActive",true]
                            }
                        }
                    }
                }
            }
        },
        {
            $sort: {
                name: 1
            }
        }
    ]);

    if(!stats.length){
        throw new ApiError(404, "No categories statistics found ");
    }

    return res 
    .status(200)
    .json(
        new ApiResponse(
            200,
            stats.length,
            stats,
            "Categories statistics fetched successfully"
        )
    )
});

// Bulk update categories status
const bulkUpdateCategoriesStatus = asyncHandler(async(req, res) =>{
    const {categoryIds , status} = req.body;

    if(!Array.isArray(categoryIds) || categoryIds.length === 0){
        throw new ApiError(400, "Category IDs are required");
    }

    const allowedStatuses = ["pending", "approved", "rejected"];

    if(!allowedStatuses.includes(status)){
        throw new ApiError(400, `Status must be one of ${allowedStatuses.join(", ")}`);
    }

    const objectIds = categoryIds.filter(
        id=> id.match(/^[0-9a-fA-F]{24}$/)
    )
    if (objectIds.length === 0) {
        throw new ApiError(400, "No valid category IDs provided");
    }

    const result = await Category.updateMany(
        { _id: { $in: objectIds } },
        { $set: { status, isActive: status === "approved" } }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                result.modifiedCount,
                null,
                `${result.modifiedCount} categories updated successfully`
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
