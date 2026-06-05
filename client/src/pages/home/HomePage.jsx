import CategoryGrid from "../../components/sections/home/CategoryGrid";
import DealsLiveNow from "../../components/sections/home/DealsLiveNow";
import FeaturedBrands from "../../components/sections/home/FeaturedBrands";
import HomeHero from "../../components/sections/home/HomeHero";
import SmartCartAI from "../../components/sections/home/SmartCartAI";
import Testimonials from "../../components/sections/home/Testimonials";
import TopCategories from "../../components/sections/home/TopCategories";
import TrendingProducts from "../../components/sections/home/TrendingProducts";
import TrustHighlights from "../../components/sections/home/TrustHighlights";
import WhySmartCart from "../../components/sections/home/WhySmartCart";

// HomePage.jsx
const HomePage = () => {
  return (
    <div className="flex flex-col gap-20"> {/* gap-20 yahan gap create karega */}
      <HomeHero />
      <TopCategories />
      <TrendingProducts/>
      <SmartCartAI/>
      <DealsLiveNow/>
      <CategoryGrid/>
      <FeaturedBrands/>
      <WhySmartCart/>
      <Testimonials/>
      <TrustHighlights/>
      
    </div>
  );
};
export default HomePage;