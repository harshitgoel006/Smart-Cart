import { motion } from "framer-motion";
import GroceriesHero from "../../components/categories/groceries/GroceriesHero";
import GroceriesCategories from "../../components/categories/groceries/GroceriesCategories";
import GroceriesNewArrivals from "../../components/categories/groceries/GroceriesNewArrivals";
import GroceriesAISection from "../../components/categories/groceries/GroceriesAISection";
import GroceriesPromoCategories from "../../components/categories/groceries/GroceriesPromoCategories";
import GroceriesTrendingCategories from "../../components/categories/groceries/GroceriesTrendingCategories";
import GroceriesExclusivePromo from "../../components/categories/groceries/GroceriesExclusivePromo";
import GroceriesTopBrands from "../../components/categories/groceries/GroceriesTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";



const Groceries = () => {
  return (
    <div className="min-h-screen">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* PURPLE GLOW */}
        <motion.div
          className="
            absolute -top-24 -left-24
            h-[520px] w-[520px]
            rounded-full
            bg-purple-400/40
            blur-[50px]
          "
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* PINK GLOW */}
        <motion.div
          className="
            absolute top-1/3 -right-24
            h-[520px] w-[520px]
            rounded-full
            bg-pink-400/40
            blur-[50px]
          "
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
      <GroceriesHero/>
      <GroceriesCategories/>
      <GroceriesNewArrivals/>
      <GroceriesAISection/>
      <GroceriesPromoCategories/>
      <GroceriesTrendingCategories/>
      <GroceriesExclusivePromo/>
      <GroceriesTopBrands/>
      <TrustBadgeSection/>
    </div>
  );
};

export default Groceries;