// This module defines the categoryService object that contains various methods for managing product categories in an e-commerce platform. The service includes functions for retrieving categories for both customers and sellers, proposing new categories, updating and deleting categories, and handling category approvals and rejections by admins. It also includes methods for building a hierarchical tree structure of categories and calculating category performance metrics based on sales data. The service interacts with the Category and Order models, as well as the NotificationService to send notifications to users when certain actions are performed on categories.
import { ApiError } from "../utils/ApiError.js";
import { Category } from "../models/category.model.js";
import { Order } from "../models/order.model.js";
import mongoose from "mongoose";
import { User } from "../models/user.model.js";
import NotificationService from "./notification/notification.service.js";

// The categoryService object encapsulates all the methods related to category management, providing a clear and organized structure for handling category-related operations in the application. Each method is designed to perform specific tasks such as fetching categories, proposing new categories, updating existing ones, and managing the approval process for categories proposed by sellers. The service ensures that all operations are performed with proper validation and error handling, making it a robust component of the application's backend logic.
export const categoryService = {
  // This function takes a flat list of categories and builds a hierarchical tree structure based on the parent-child relationships defined by the parent field in the category documents. It recursively filters the categories to find those that have the specified parent ID and then maps them to include their children. This allows for easy representation of nested categories in the frontend.
  buildTree(categories, parent = null) {
    return categories
      .filter((cat) => {
        if (parent === null) {
          return !cat.parent;
        }
        return String(cat.parent) === String(parent);
      })
      .map((cat) => ({
        ...cat,
        children: this.buildTree(categories, cat._id),
      }));
  },

  // ======================================================
  // =============== CUSTOMER PANNEL HANDLERS =============
  // ======================================================

  // This function retrieves all active categories from the database, sorts them by their order and name, and then builds a hierarchical tree structure from the flat list of categories. If no categories are found, it throws a 404 error. The resulting tree structure allows for easy display of nested categories in the frontend.

  async getAllCategories() {
    const categories = await Category.find({
      isActive: true,
      status: "approved",
    })
      .sort({ order: 1, name: 1 })
      .lean();

    if (!categories.length) {
      throw new ApiError(404, "No categories found");
    }

    return this.buildTree(categories);
  },

  // This function retrieves a specific category by its ID, checks if it is active, and then builds a hierarchical tree structure of its child categories. It first validates the category ID, then fetches the category from the database. If the category is not found or inactive, it throws a 404 error. Finally, it retrieves all active categories to build the tree structure for the specified category.

  async getCategoryById(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId).lean();

    if (!category || !category.isActive) {
      throw new ApiError(404, "Category not found");
    }

    const all = await Category.find({
      isActive: true,
      status: "approved",
    }).lean();

    return {
      ...category,
      children: this.buildTree(all, category._id),
    };
  },

  // This function retrieves all categories that are marked as featured and active from the database, sorts them by their order, and returns the list. Featured categories are typically highlighted in the frontend to promote certain products or categories to customers.

  async getFeaturedCategories() {
    return await Category.find({
      isActive: true,
      isFeatured: true,
      status: "approved",
    })
      .sort({ order: 1 })
      .lean();
  },

  // This function performs a search for categories based on a query string. It uses a regular expression to perform a case-insensitive search on the category names, and it only returns categories that are active. The results are limited to 20 categories to optimize performance and prevent overwhelming the user with too many results.

  async searchCategories(query) {
    if (!query || !query.trim()) {
      throw new ApiError(400, "Search query required");
    }

    const regex = new RegExp(query.trim(), "i");

    return await Category.find({
      name: {
        $regex: regex,
      },
      isActive: true,
      status: "approved",
    })
      .limit(20)
      .lean();
  },

  // ======================================================
  // =============== SELLER PANEL HANDLERS ================
  // ======================================================

  // This function retrieves a list of categories that are active and have been approved, specifically for sellers. The categories are sorted by their order and name. This allows sellers to view and select from the available categories when managing their products.

  async getSellerCategoryList() {
    return await Category.find({
      isActive: true,
      status: "approved",
    })
      .sort({
        order: 1,
        name: 1,
      })
      .lean();
  },

  // This function retrieves a specific category by its ID, ensuring that it is active and has been approved. It validates the category ID, fetches the category from the database, and if the category is not found or does not meet the criteria, it throws a 404 error. This function is typically used when a seller needs to select a category for their product, ensuring that only valid and approved categories are available for selection.

  async selectCategoryForProduct(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
      _id: categoryId,
      isActive: true,
      status: "approved",
    }).lean();

    if (!category) {
      throw new ApiError(404, "Category not available for selection");
    }

    return category;
  },

  // This function allows sellers to propose a new category by providing the necessary data such as name, description, and parent category. It validates the input data, checks for duplicate category names, and creates a new category with a status of "pending". After creating the category, it sends notifications to all active admins to review the proposed category. This function helps in maintaining a controlled process for adding new categories to the platform while involving the admin team for approval.

  async proposeCategory(data, sellerId) {
    const { name, description, parent } = data;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Category name is required");
    }

    if (parent) {
      if (!mongoose.Types.ObjectId.isValid(parent)) {
        throw new ApiError(400, "Invalid parent category ID");
      }

      const parentCategory = await Category.findById(parent);

      if (!parentCategory || !parentCategory.isActive) {
        throw new ApiError(404, "Parent category not found or inactive");
      }
    }

    const existing = await Category.findOne({
      name: {
        $regex: new RegExp(`^${name.trim()}$`, "i"),
      },
    });

    if (existing) {
      throw new ApiError(409, "Category with this name already exists");
    }

    const category = await Category.create({
      name: name.trim(),
      description: description || "",
      parent: parent || null,
      isFeatured: !!isFeatured,

      image: data.image || {},
      bannerImage: data.bannerImage || {},
      icon: data.icon || {},
      sliderImages: data.sliderImages || [],
      tagline: data.tagline || "",

      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      metaKeywords: metaKeywords || "",

      status: "approved",
      isActive: true,
      createdBy: adminId,
    });

    try {
      const admins = await User.find({ role: "admin", isActive: true }).select(
        "_id email",
      );

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
            sellerId,
          },
          email: admin.email,
        });
      }
    } catch (err) {
      console.error("CATEGORY_PROPOSED notification failed:", err);
    }

    return category;
  },

  // This function retrieves performance metrics for categories based on the orders associated with a specific seller. It uses MongoDB's aggregation framework to unwind the order items, filter for items sold by the specified seller and delivered, group the results by category to calculate total sales and revenue, and then look up the category details. The final output includes the category ID, name, total sales, and total revenue, sorted by revenue in descending order. This allows sellers to analyze which categories are performing well in terms of sales and revenue.

  async getCategoryPerformance(sellerId) {
    const data = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $match: {
          "items.seller": new mongoose.Types.ObjectId(sellerId),
          status: "delivered",
        },
      },
      {
        $group: {
          _id: "$items.category",
          totalSales: {
            $sum: "$items.quantity",
          },
          totalRevenue: {
            $sum: {
              $multiply: ["$items.price", "$items.quantity"],
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: "$category",
      },
      {
        $project: {
          categoryId: "$_id",
          categoryName: "$category.name",
          totalSales: 1,
          totalRevenue: 1,
        },
      },
      {
        $sort: {
          totalRevenue: -1,
        },
      },
    ]);
    return data;
  },

  // This function allows sellers to update the details of a category they have proposed, but only if the category is still in a "pending" state. It validates the category ID, checks if the category exists and is proposed by the seller, and then updates the name and description if provided. If the category is not found, not proposed by the seller, or not in a pending state, it throws appropriate errors. This function ensures that sellers can make changes to their proposed categories before they are reviewed by admins.

  async updatePendingCategory(categoryId, sellerId, data) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
      _id: categoryId,
      proposedBy: sellerId,
    });

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    if (category.status !== "pending") {
      throw new ApiError(400, "Only pending categories can be updated");
    }

    if (data.name) {
      category.name = data.name.trim();
    }
    if (data.description) {
      category.description = data.description;
    }

    if (data.image) category.image = data.image;
    if (data.bannerImage) category.bannerImage = data.bannerImage;
    if (data.icon) category.icon = data.icon;
    if (data.sliderImages) category.sliderImages = data.sliderImages;
    if (data.tagline !== undefined) category.tagline = data.tagline;

    await category.save();
    return category;
  },

  // This function retrieves a specific category for editing by a seller, but only if the category is still in a "pending" state and was proposed by the seller. It validates the category ID, checks if the category exists and meets the criteria, and then returns the category details. If the category is not found, not proposed by the seller, or not in a pending state, it throws appropriate errors. This function is typically used to populate an edit form with the current category details before allowing the seller to make changes.

  async getCategoryForEdit(categoryId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
      _id: categoryId,
      proposedBy: sellerId,
    }).lean();

    if (!category) {
      throw new ApiError(404, "Category not found");
    }
    return category;
  },

  // This function allows sellers to delete a category they have proposed, but only if the category is still in a "pending" state. It validates the category ID, checks if the category exists and is proposed by the seller, and then deletes the category if it meets the criteria. If the category is not found, not proposed by the seller, or not in a pending state, it throws appropriate errors. This function ensures that sellers can remove their proposed categories before they are reviewed by admins.

  async deletePendingCategory(categoryId, sellerId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
      _id: categoryId,
      proposedBy: sellerId,
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

  // ======================================================
  // =============== ADMIN PANEL HANDLERS =================
  // ======================================================

  // This function retrieves all categories for admin users, including those that are pending, approved, or rejected. It supports pagination by accepting page and limit parameters, and it populates the proposedBy field to include the name and email of the user who proposed each category. The categories are sorted by their creation date in descending order. The function returns an object containing the total number of categories, the current page, total pages, and the list of categories for the requested page.

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
      categories,
    };
  },

  // This function retrieves the details of a specific category for admin users, including the name and email of the user who proposed the category. It validates the category ID, fetches the category from the database, and if the category is not found, it throws a 404 error. This function is typically used by admins to review the details of a proposed category before making a decision to approve or reject it.

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

  // This function allows admins to approve a category that is in a "pending" state. It validates the category ID, checks if the category exists and is pending, and then updates the category's status to "approved" and sets it as active. After saving the changes, it sends a notification to the seller who proposed the category, informing them of the approval. If the category is not found or not in a pending state, it throws appropriate errors. This function helps maintain a controlled process for approving new categories on the platform.

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
      const seller = await User.findById(category.proposedBy).select(
        "_id email fullname",
      );

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
              categoryName: category.name,
            },
            email: seller.email,
          });
        } catch (err) {
          console.error("CATEGORY_APPROVED notification failed", err);
        }
      }
    }

    return category;
  },

  // This function allows admins to reject a category that is in a "pending" state. It validates the category ID, checks if the category exists and is pending, and then updates the category's status to "rejected", sets it as inactive, and records the reason for rejection. After saving the changes, it sends a notification to the seller who proposed the category, informing them of the rejection and the reason. If the category is not found or not in a pending state, it throws appropriate errors. This function helps maintain a controlled process for rejecting new categories on the platform while providing feedback to sellers.

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
      const seller = await User.findById(category.proposedBy).select(
        "_id email",
      );

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
              reason: category.rejectionReason,
            },
            email: seller.email,
          });
        } catch (err) {
          console.error("CATEGORY_REJECTED notification failed", err);
        }
      }
    }

    return category;
  },

  // This function allows admins to bulk update the status of multiple categories at once. It accepts an array of category IDs and a new status value. The function validates the input, checks that the provided status is valid, and then updates all specified categories to the new status while also setting their active state accordingly. It returns the number of categories that were modified. This function is useful for efficiently managing the approval or rejection of multiple categories in one operation.

  async createCategory(data, adminId) {
    const {
      name,
      description,
      parent,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords,
    } = data;

    if (!name || !name.trim()) {
      throw new ApiError(400, "Category name required");
    }

    if (parent && !mongoose.Types.ObjectId.isValid(parent)) {
      throw new ApiError(400, "Invalid parent category ID");
    }

    const exists = await Category.findOne({
      name: { $regex: new RegExp(`^${name.trim()}$`, "i") },
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
      createdBy: adminId,
    });

    return category;
  },

  // This function allows admins to delete a category, but only if it does not have any subcategories. It validates the category ID, checks if the category exists, and then verifies that there are no child categories referencing it as a parent. If the category has subcategories, it throws an error to prevent deletion. If the category can be safely deleted, it marks it as deleted and inactive without actually removing it from the database (soft delete). This ensures data integrity while allowing for potential restoration of the category in the future.

  async deleteCategory(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findById(categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found");
    }

    const childExists = await Category.exists({ parent: categoryId });

    if (childExists) {
      throw new ApiError(400, "Cannot delete category with subcategories");
    }

    category.isDeleted = true;
    category.isActive = false;

    await category.save();

    return category;
  },

  // This function allows admins to update the details of an existing category. It validates the category ID, checks if the category exists, and then updates the name, parent category, featured status, description, and meta information if provided. It also checks for duplicate category names when updating the name. After making the changes, it saves the category and returns the updated document. This function helps admins maintain accurate and up-to-date information for categories on the platform.

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
        _id: { $ne: categoryId },
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

  // This function allows admins to restore a category that has been previously marked as deleted. It validates the category ID, checks if the category exists and is currently marked as deleted, and then updates the category's isDeleted flag to false and sets it as active. If the category is not found or not marked as deleted, it throws appropriate errors. This function provides a way to recover categories that may have been deleted by mistake or are needed again in the future.

  async restoreDeletedCategory(categoryId) {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new ApiError(400, "Invalid category ID");
    }

    const category = await Category.findOne({
      _id: categoryId,
      isDeleted: true,
    });

    if (!category) {
      throw new ApiError(404, "Deleted category not found");
    }

    category.isDeleted = false;
    category.isActive = true;

    await category.save();

    return category;
  },

  // This function retrieves statistical data for all categories, including the total number of products in each category and the number of active products. It uses MongoDB's aggregation framework to perform a lookup to the products collection, counts the total products and active products for each category, and then sorts the results by category name. This information can be useful for admins to analyze category performance and make informed decisions about category management.

  async getCategoriesStatistics() {
    return await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products",
        },
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
                cond: { $eq: ["$$p.isActive", true] },
              },
            },
          },
        },
      },
      { $sort: { name: 1 } },
    ]);
  },

  // This function allows admins to bulk update the status of multiple categories at once. It accepts an array of category IDs and a new status value. The function validates the input, checks that the provided status is valid, and then updates all specified categories to the new status while also setting their active state accordingly. It returns the number of categories that were modified. This function is useful for efficiently managing the approval or rejection of multiple categories in one operation.

  async bulkUpdateCategoriesStatus(categoryIds, status) {
    const allowed = ["pending", "approved", "rejected"];
    if (!allowed.includes(status)) {
      throw new ApiError(400, "Invalid status");
    }
    const validIds = categoryIds.filter((id) =>
      mongoose.Types.ObjectId.isValid(id),
    );
    if (!validIds.length) {
      throw new ApiError(400, "No valid category IDs provided");
    }
    const result = await Category.updateMany(
      { _id: { $in: validIds } },
      { $set: { status, isActive: status === "approved" } },
    );
    return result.modifiedCount;
  },
};
