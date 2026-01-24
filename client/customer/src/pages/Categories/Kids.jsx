import { motion } from "framer-motion";
import KidsHero from "../../components/categories/kids/KidsHero";
import KidsCategories from "../../components/categories/kids/KidsCategories";
import KidsNewArrivals from "../../components/categories/kids/KidsNewArrivals";
import KidsAISection from "../../components/categories/kids/KidsAISection";
import KidsPromoCategories from "../../components/categories/kids/KidsPromoCategories";
import KidsTrendingCategories from "../../components/categories/kids/KidsTrendingCategories";
import KidsExclusivePromo from "../../components/categories/kids/KidsExclusivePromo";
import KidsTopBrands from "../../components/categories/kids/KIdsTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";


const Kids = () => {
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
        <KidsHero />
        <KidsCategories/>
        <KidsNewArrivals/>
        <KidsAISection/>
        <KidsPromoCategories/>
        <KidsTrendingCategories/>
        <KidsExclusivePromo/>
        <KidsTopBrands/>
        <TrustBadgeSection/>

        
        
     
    </div>
  );
};

export default Kids;