import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
import CategorySubcategoryGrid from "./CategorySubcategoryGrid";
import CategoryNewArrivals from "./CategoryNewArrivals";
import CategoryAISection from "./CategoryAISection";
import CategoryPromoSection from "./CategoryPromoSection";
import CategoryTrendingCategories from "./CategoryTrendingCategories";
import CategoryExclusivePromo from "./CategoryExclusivePromo";
import CategoryTopBrands from "./CategoryTopBrands";
import TrustBadgeSection from "../TrustBadgeSection";



const CategoryLayout = ({ pathSegments }) => {
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [subcategories, setSubcategories] = useState([]); // ✅ FIXED
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);

  const currentSlug =
    pathSegments?.length > 0
      ? pathSegments[pathSegments.length - 1]
      : null;

  const isSubcategory = pathSegments?.length > 1;

  useEffect(() => {
    if (!currentSlug) return;

    // 🔥 If subcategory → redirect to products page
    if (isSubcategory) {
      navigate(`/products?category=${currentSlug}`);
      return;
    }

    const loadData = async () => {
      const cat = await getCategoryBySlug(currentSlug);
      setCategory(cat);

      if (!cat) return;

      // ✅ Load subcategories
      const subs = await getDirectSubcategories(cat._id);
      setSubcategories(subs);

      // ✅ Load trending
      const trending =
        await getTrendingProductsByCategory(currentSlug);
      setTrendingProducts(trending);

      // ✅ Load new arrivals
      const arrivals =
        await getNewArrivalsByCategory(currentSlug);
      setNewArrivals(arrivals);
    };

    loadData();
  }, [currentSlug, isSubcategory, navigate]);

  if (isSubcategory) return null;

  return (
    <>
      {/* HERO */}
      <CategoryHero category={category} />

      {/* SUBCATEGORY GRID (limit inside component if needed) */}
      <CategorySubcategoryGrid category={category} />

      {/* NEW ARRIVALS (limit 8 inside component OR slice here) */}
      <CategoryNewArrivals products={newArrivals} />

      {/* AI SECTION */}
      <CategoryAISection category={category} />

      {/* PROMO SECTION (dynamic from DB) */}
      <CategoryPromoSection subcategories={subcategories} />

        {/* TRENDING SUBCATEGORIES */}
      <CategoryTrendingCategories category={category} />

        {/* EXCLUSIVE PROMO */}
        <CategoryExclusivePromo category={category} />

        {/* TOP BRANDS */}
        <CategoryTopBrands category={category} />

      <TrustBadgeSection/>


      
    </>
  );
};

export default CategoryLayout;
