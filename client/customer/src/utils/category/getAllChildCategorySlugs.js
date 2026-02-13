export const getAllChildCategorySlugs = (categories, parentSlug) => {
  const parent = categories.find(cat => cat.slug === parentSlug);

  if (!parent) return [];

  const result = [parent.slug];

  const findChildren = (parentId) => {
    const children = categories.filter(
      cat => cat.parentCategory === parentId
    );

    children.forEach(child => {
      result.push(child.slug);
      findChildren(child._id);
    });
  };

  findChildren(parent._id);

  return result;
};
