import HomeHero from "../../components/sections/home/HomeHero";
import TopCategories from "../../components/sections/home/TopCategories";
import TrendingProducts from "../../components/sections/home/TrendingProducts";

// HomePage.jsx
const HomePage = () => {
  return (
    <div className="flex flex-col gap-20"> {/* gap-20 yahan gap create karega */}
      <HomeHero />
      <TopCategories />
      <TrendingProducts/>
    </div>
  );
};
export default HomePage;