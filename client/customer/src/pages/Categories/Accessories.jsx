import { motion } from "framer-motion";
import AccessoriesHero from "../../components/categories/accessories/AccessoriesHero";
import AccessoriesCategories from "../../components/categories/accessories/AccessoriesCategories";
import AccessoriesNewArrivals from "../../components/categories/accessories/AccessoriesNewArrivals";
import AccessoriesAISection from "../../components/categories/accessories/AccessoriesAISection";
import AccessoriesPromoCategories from "../../components/categories/accessories/AccessoriesPromoCategories";
import AccessoriesTrendingCategories from "../../components/categories/accessories/AccessoriesTrendingCategories";
import AccessoriesExclusivePromo from "../../components/categories/accessories/AccessoriesExclusivePromo";
import AccessoriesTopBrands from "../../components/categories/accessories/AccessoriesTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";



const Accessories = () => {
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
        <AccessoriesHero/>
        <AccessoriesCategories/>
        <AccessoriesNewArrivals/>
        <AccessoriesAISection/>
        <AccessoriesPromoCategories/>
        <AccessoriesTrendingCategories/>
        <AccessoriesExclusivePromo/>
        <AccessoriesTopBrands/>
        <TrustBadgeSection/>
     
    </div>
  );
};

export default Accessories;