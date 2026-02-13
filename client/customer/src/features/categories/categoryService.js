import { categories } from "../../data/categories";

export const getAllCategories = async () => {
  return categories;
};

export const getCategoryBySlug = async (slug) => {
  return categories.find((cat) => cat.slug === slug);
};

export const getDirectSubcategories = async (parentId) => {
  return categories.filter(
    (cat) => cat.parentCategory === parentId
  );
};

export const getAllChildCategorySlugs = (parentSlug) => {
  const parent = categories.find(
    (cat) => cat.slug === parentSlug
  );

  if (!parent) return [];

  const result = [parent.slug];

  const findChildren = (parentId) => {
    const children = categories.filter(
      (cat) => cat.parentCategory === parentId
    );

    children.forEach((child) => {
      result.push(child.slug);
      findChildren(child._id);
    });
  };

  findChildren(parent._id);

  return result;
};
