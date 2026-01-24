import { motion } from "framer-motion";
import BeautyHero from "../../components/categories/beautyandgrooming/BeautyHero";
import BeautyCategories from "../../components/categories/beautyandgrooming/BeautyCategories";
import BeautyNewArrivals from "../../components/categories/beautyandgrooming/BeautyNewArrivals";
import BeautyAISection from "../../components/categories/beautyandgrooming/BeautyAISection";
import BeautyPromoCategories from "../../components/categories/beautyandgrooming/BeautyPromoCategories";
import BeautyTrendingCategories from "../../components/categories/beautyandgrooming/BeautyTrendingCategories";
import BeautyExclusivePromo from "../../components/categories/beautyandgrooming/BeautyExclusivePromo";
import BeautyTopBrands from "../../components/categories/beautyandgrooming/BeautyBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";


const Beauty = () => {
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
        <BeautyHero/>
        <BeautyCategories/>
        <BeautyNewArrivals/>
        <BeautyAISection/>
        <BeautyPromoCategories/>
        <BeautyTrendingCategories/>
        <BeautyExclusivePromo/>
        <BeautyTopBrands/>
        <TrustBadgeSection/>
     
    </div>
  );
};

export default Beauty;