import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
  getTrendingProductsByCategory,
  getNewArrivalsByCategory,
} from "../../features/products/productService";

import {
  getCategoryBySlug,
  getDirectSubcategories,
} from "../../features/categories/categoryService";

import ProductSection from "../product/ProductSection";
import CategoryHero from "./CategoryHero";

const CategoryLayout = ({ pathSegments }) => {
  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const currentSlug =
    pathSegments && pathSegments.length > 0
      ? pathSegments[pathSegments.length - 1]
      : null;

  useEffect(() => {
    const loadData = async () => {
      if (!currentSlug) return;

      const cat = await getCategoryBySlug(currentSlug);
      setCategory(cat);

      if (cat) {
        const subs = await getDirectSubcategories(cat._id);
        setSubcategories(subs);
      }

      const trending =
        await getTrendingProductsByCategory(currentSlug);
      setTrendingProducts(trending);

      const arrivals =
        await getNewArrivalsByCategory(currentSlug);
      setNewArrivals(arrivals);
    };

    loadData();
  }, [currentSlug]);

  return (
    <>
      <CategoryHero
        category={category}
        pathSegments={pathSegments}
      />

      {subcategories.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold mb-6">
            Shop by Subcategory
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {subcategories.map((sub) => (
              <Link
                key={sub._id}
                to={`/categories/${[
                  ...pathSegments,
                  sub.slug,
                ].join("/")}`}
                className="p-6 bg-white rounded-xl shadow hover:shadow-lg transition text-center"
              >
                <div className="font-semibold capitalize">
                  {sub.name}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <ProductSection
        title="Trending in this Category"
        products={trendingProducts}
      />

      <ProductSection
        title="New Arrivals"
        products={newArrivals}
      />
    </>
  );
};

export default CategoryLayout;
