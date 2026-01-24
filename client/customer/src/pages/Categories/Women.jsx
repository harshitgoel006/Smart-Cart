import { motion } from "framer-motion";
import WomenHero from "../../components/categories/women/WomenHero";
import WomenCategories from "../../components/categories/women/WomenCategories";
import WomenNewArrivals from "../../components/categories/women/WomenNewArrivals";
import WomenAISection from "../../components/categories/women/WomenAISection";
import WomenPromoCategories from "../../components/categories/women/WomenPromoCategories";
import WomenTrendingCategories from "../../components/categories/women/WomenTrendingCategories";
import WomenExclusivePromo from "../../components/categories/women/WomenExclusivePromo";
import WomenTopBrands from "../../components/categories/women/WomenTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";







const Women = () => {
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
        <WomenHero/>
        <WomenCategories/>
        <WomenNewArrivals/>
        <WomenAISection/>
        <WomenPromoCategories/>
        <WomenTrendingCategories/>
        <WomenExclusivePromo/>
        <WomenTopBrands/>
        <TrustBadgeSection/>
     
    </div>
  );
};

export default Women;