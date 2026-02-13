import { categories } from "../../data/categories";

const ProductFilters = ({ query, setSearchParams }) => {
  const selectedCategory = query.category || "";

  const handleCategoryChange = (slug) => {
    const newParams = { ...query };

    if (slug) {
      newParams.category = slug;
    } else {
      delete newParams.category;
    }

    newParams.page = 1; // reset page

    setSearchParams(newParams);
  };

  return (
    <div className="w-64 bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        Filters
      </h2>

      <div className="space-y-3">
        <button
          onClick={() => handleCategoryChange("")}
          className={`block w-full text-left ${
            selectedCategory === ""
              ? "font-bold text-purple-600"
              : ""
          }`}
        >
          All Categories
        </button>

        {categories
          .filter((cat) => !cat.parentCategory)
          .map((cat) => (
            <button
              key={cat._id}
              onClick={() =>
                handleCategoryChange(cat.slug)
              }
              className={`block w-full text-left ${
                selectedCategory === cat.slug
                  ? "font-bold text-purple-600"
                  : ""
              }`}
            >
              {cat.name}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ProductFilters;
