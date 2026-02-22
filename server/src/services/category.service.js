import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { Category } from '../models/category.model.js';
import { Order } from '../models/order.model.js';


// Helper function to build a category tree
const buildTree = (categories, parentId = null) => {
  return categories
    .filter(cat =>
      (cat.parent ? cat.parent.toString() : null) ===
      (parentId ? parentId.toString() : null)
    )
    .map(cat => ({
      _id: cat._id,
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      isFeatured: cat.isFeatured,
      children: this.buildTree(categories, cat._id)
    }));
}


export const categoryService = {

    async getAllCategories() {
        const categories = await Category.find({ isActive: true })
        .sort({ order: 1, name: 1 })
        .lean();
        
        if (!categories.length) {
            throw new ApiError(404, "No categories found");
        }
        
        return this.buildTree(categories);
    },

    async getCategoryById(categoryId) {
        
        if (!mongoose.Types.ObjectId.isValid(categoryId)) {
            throw new ApiError(400, "Invalid category ID");
        }
        
        const category = await Category.findById(categoryId).lean();
        
        if (!category || !category.isActive) {
            throw new ApiError(404, "Category not found");
        }
        
        const all = await Category.find({ isActive: true }).lean();
        
        return {
            ...category,
            children: this.buildTree(all, category._id)
        };
    },

    async getFeaturedCategories() {
        return await Category.find({
            isActive: true,
            isFeatured: true
        })
        .sort({ order: 1 })
        .lean();
    },

async searchCategories(query) {
        
        if (!query || !query.trim()) {
            throw new ApiError(400, "Search query required");
        }
        
        const regex = new RegExp(query.trim(), "i");

        return await Category.find(
            {
                name: { 
                    $regex: regex 
                },
                isActive: true
            }
        )
        .limit(20)
        .lean();
},

async getSellerCategoryList() {

  return await Category.find({
    isActive: true,
    status: "approved"
  })
  .sort({ order: 1, name: 1 })
  .lean();
},


async selectCategoryForProduct(categoryId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isActive: true,
    status: "approved"
  }).lean();

  if (!category) {
    throw new ApiError(404, "Category not available for selection");
  }

  return category;
},


async proposeCategory(data, sellerId) {

  const { name, description, parent } = data;

  // 1️⃣ Basic validation
  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name is required");
  }

  // 2️⃣ Parent validation (if provided)
  if (parent) {
    if (!mongoose.Types.ObjectId.isValid(parent)) {
      throw new ApiError(400, "Invalid parent category ID");
    }

    const parentCategory = await Category.findById(parent);
    if (!parentCategory || !parentCategory.isActive) {
      throw new ApiError(404, "Parent category not found or inactive");
    }
  }

  // 3️⃣ Prevent duplicate name (case insensitive)
  const existing = await Category.findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
  });

  if (existing) {
    throw new ApiError(409, "Category with this name already exists");
  }

  // 4️⃣ Create pending category
  const category = await Category.create({
    name: name.trim(),
    description: description || "",
    parent: parent || null,
    status: "pending",
    isActive: false,
    proposedBy: sellerId
  });

  // 5️⃣ Notify all active admins
  try {
    const admins = await User.find({
      role: "admin",
      isActive: true
    }).select("_id email");

    for (const admin of admins) {
      await NotificationService.emit("CATEGORY_PROPOSED", {
        recipient: admin._id,
        recipientRole: "admin",
        category: "category",
        entityType: "Category",
        entityId: category._id,
        priority: "medium",
        meta: {
          categoryName: category.name,
          sellerId
        },
        email: admin.email
      });
    }

  } catch (err) {
    console.error("CATEGORY_PROPOSED notification failed:", err);
  }

  return category;
},

async getCategoryPerformance(sellerId) {

  const data = await Order.aggregate([

    { $unwind: "$items" },

    {
      $match: {
        "items.seller": new mongoose.Types.ObjectId(sellerId),
        status: "delivered"
      }
    },

    {
      $group: {
        _id: "$items.category",
        totalSales: { $sum: "$items.quantity" },
        totalRevenue: {
          $sum: { $multiply: ["$items.price", "$items.quantity"] }
        }
      }
    },

    {
      $lookup: {
        from: "categories",
        localField: "_id",
        foreignField: "_id",
        as: "category"
      }
    },

    { $unwind: "$category" },

    {
      $project: {
        categoryId: "$_id",
        categoryName: "$category.name",
        totalSales: 1,
        totalRevenue: 1
      }
    },

    { $sort: { totalRevenue: -1 } }

  ]);

  return data;
},


async updatePendingCategory(categoryId, sellerId, data) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    proposedBy: sellerId
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.status !== "pending") {
    throw new ApiError(400, "Only pending categories can be updated");
  }

  if (data.name) category.name = data.name.trim();
  if (data.description) category.description = data.description;

  await category.save();

  return category;
},

async getCategoryForEdit(categoryId, sellerId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    proposedBy: sellerId
  }).lean();

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
},


async deletePendingCategory(categoryId, sellerId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    proposedBy: sellerId
  });

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.status !== "pending") {
    throw new ApiError(400, "Cannot delete reviewed category");
  }

  await category.deleteOne();

  return true;
},


async getAllCategoriesForAdmin({ page = 1, limit = 20 }) {

  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const categories = await Category.find({})
    .populate("proposedBy", "fullname email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Category.countDocuments();

  return {
    total,
    page,
    totalPages: Math.ceil(total / limit),
    categories
  };
},


async viewCategoryDetails(categoryId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId)
    .populate("parent", "name slug")
    .populate("proposedBy", "fullname email")
    .lean();

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return category;
},

async approveCategory(categoryId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.status !== "pending") {
    throw new ApiError(400, "Only pending categories can be approved");
  }

  category.status = "approved";
  category.isActive = true;

  await category.save();

  // Notify seller
  if (category.proposedBy) {
    const seller = await User.findById(category.proposedBy)
      .select("_id email fullname");

    if (seller) {
      try {
        await NotificationService.emit("CATEGORY_APPROVED", {
          recipient: seller._id,
          recipientRole: "seller",
          category: "category",
          entityType: "Category",
          entityId: category._id,
          priority: "high",
          meta: {
            categoryName: category.name
          },
          email: seller.email
        });
      } catch (err) {
        console.error("CATEGORY_APPROVED notification failed", err);
      }
    }
  }

  return category;
},


async rejectCategory(categoryId, reason) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (category.status !== "pending") {
    throw new ApiError(400, "Only pending categories can be rejected");
  }

  category.status = "rejected";
  category.isActive = false;
  category.rejectionReason = reason || "No reason provided";

  await category.save();

  // Notify seller
  if (category.proposedBy) {
    const seller = await User.findById(category.proposedBy)
      .select("_id email");

    if (seller) {
      try {
        await NotificationService.emit("CATEGORY_REJECTED", {
          recipient: seller._id,
          recipientRole: "seller",
          category: "category",
          entityType: "Category",
          entityId: category._id,
          priority: "medium",
          meta: {
            categoryName: category.name,
            reason: category.rejectionReason
          },
          email: seller.email
        });
      } catch (err) {
        console.error("CATEGORY_REJECTED notification failed", err);
      }
    }
  }

  return category;
},

async createCategory(data, adminId) {

  const {
    name,
    description,
    parent,
    isFeatured,
    metaTitle,
    metaDescription,
    metaKeywords
  } = data;

  if (!name || !name.trim()) {
    throw new ApiError(400, "Category name required");
  }

  if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
    throw new ApiError(400, "Invalid parent category ID");
  }

  const exists = await Category.findOne({
    name: { $regex: new RegExp(`^${name.trim()}$`, "i") }
  });

  if (exists) {
    throw new ApiError(409, "Category already exists");
  }

  const category = await Category.create({
    name: name.trim(),
    description: description || "",
    parent: parent || null,
    isFeatured: !!isFeatured,
    metaTitle: metaTitle || "",
    metaDescription: metaDescription || "",
    metaKeywords: metaKeywords || "",
    status: "approved",
    isActive: true,
    createdBy: adminId
  });

  return category;
},

async deleteCategory(categoryId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  // Prevent deleting category that has children
  const childExists = await Category.exists({ parent: categoryId });

  if (childExists) {
    throw new ApiError(400, "Cannot delete category with subcategories");
  }

  category.isDeleted = true;
  category.isActive = false;

  await category.save();

  return category;
},


async updateCategory(categoryId, data) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  if (data.name && data.name.trim() !== category.name) {

    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") },
      _id: { $ne: categoryId }
    });

    if (exists) {
      throw new ApiError(409, "Category name already exists");
    }

    category.name = data.name.trim();
  }

  if (data.parent) {
    if (!mongoose.Types.ObjectId.isValid(data.parent)) {
      throw new ApiError(400, "Invalid parent ID");
    }
    category.parent = data.parent;
  }

  if (typeof data.isFeatured === "boolean") {
    category.isFeatured = data.isFeatured;
  }

  category.description = data.description ?? category.description;
  category.metaTitle = data.metaTitle ?? category.metaTitle;
  category.metaDescription = data.metaDescription ?? category.metaDescription;
  category.metaKeywords = data.metaKeywords ?? category.metaKeywords;

  await category.save();

  return category;
},

async restoreDeletedCategory(categoryId) {

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new ApiError(400, "Invalid category ID");
  }

  const category = await Category.findOne({
    _id: categoryId,
    isDeleted: true
  });

  if (!category) {
    throw new ApiError(404, "Deleted category not found");
  }

  category.isDeleted = false;
  category.isActive = true;

  await category.save();

  return category;
},

async getCategoriesStatistics() {

  return await Category.aggregate([
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "category",
        as: "products"
      }
    },
    {
      $project: {
        name: 1,
        totalProducts: { $size: "$products" },
        activeProducts: {
          $size: {
            $filter: {
              input: "$products",
              as: "p",
              cond: { $eq: ["$$p.isActive", true] }
            }
          }
        }
      }
    },
    { $sort: { name: 1 } }
  ]);
},


async bulkUpdateCategoriesStatus(categoryIds, status) {

  const allowed = ["pending", "approved", "rejected"];

  if (!allowed.includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const validIds = categoryIds.filter(id =>
    mongoose.Types.ObjectId.isValid(id)
  );

  if (!validIds.length) {
    throw new ApiError(400, "No valid category IDs provided");
  }

  const result = await Category.updateMany(
    { _id: { $in: validIds } },
    {
      $set: {
        status,
        isActive: status === "approved"
      }
    }
  );

  return result.modifiedCount;
},





}