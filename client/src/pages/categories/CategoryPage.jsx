import { useParams } from "react-router-dom";

import CategoryHero from "../../components/sections/categories/CategoryHero";
import ShopByCategory from "../../components/sections/categories/ShopByCategory";

import { categoryHeroData } from "../../content/categories/categoryPagesHeroData";
import { categoryShopData } from "../../content/categories/categoryShopData";

import FeaturedBrands from "../../components/sections/categories/FeaturedBrands";

import { categoryBrandsData } from "../../content/categories/categoryBrandsData";
import CategoryTrustStrip from "../../components/sections/categories/CategoryTrustStrip";

import ProductCarouselSection from "../../components/sections/categories/ProductCarouselSection";
import { categoryTrendingData } from "../../content/categories/categoryTrendingData";

import { categoryNewArrivalData } from "../../content/categories/categoryNewArrivalData";

import CategoryEditorialBanner from "../../components/sections/categories/CategoryEditorialBanner";
import { categoryEditorialData } from "../../content/categories/categoryEditorialData";

const CategoryPage = () => {
  const { slug } = useParams();

  const heroData = categoryHeroData[slug];

  if (!heroData) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-20">Category not found.</div>
    );
  }

  return (
    <div className="flex flex-col gap-20">
      <CategoryHero heroData={heroData} slug={slug} />

      <ShopByCategory
        title="Categories To Explore"
        categories={categoryShopData[slug] || []}
      />

      <ProductCarouselSection
        tag="TRENDING"
        title="Trending Collection"
        description="Explore the highest-rated products curated from our top collections."
        products={categoryTrendingData[slug]}
        viewAllLink={`/products?category=${slug}&sort=top-rated`}
      />

      <ProductCarouselSection
        tag="LATEST"
        title="New Arrivals"
        description="Fresh arrivals from premium brands, curated just for your wardrobe."
        products={categoryNewArrivalData[slug]}
        viewAllLink={`/products?category=${slug}&sort=newest`}
      />

      <FeaturedBrands
        title="Brands We Love"
        brands={categoryBrandsData[slug] || []}
      />

      <CategoryEditorialBanner
    editorial={categoryEditorialData[slug]}
/>

      <CategoryTrustStrip />
    </div>
  );
};

export default CategoryPage;
