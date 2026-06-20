import CategoriesHero from "../../components/sections/categories/CategoriesHero";
import CategoryEditorialGrid from "../../components/sections/categories/CategoryEditorialGrid";
import CategoryTrustStrip from "../../components/sections/categories/CategoryTrustStrip";

const CategoriesPage = () => {
  return (
    <div className="flex flex-col gap-20">
      <CategoriesHero/>
      <CategoryEditorialGrid/>
      <CategoryTrustStrip/>
    </div>
  );
};

export default CategoriesPage;