import { motion } from "framer-motion";
import FashionHero from "../../components/categories/fashion/FashionHero";
import FashionCategories from "../../components/categories/fashion/FashionCategories";
import FashionNewArrivals from "../../components/categories/fashion/FashionNewArrivals";
import FashionAISection from "../../components/categories/fashion/FashionAISection";
import FashionPromoCategories from "../../components/categories/fashion/FashionPromoCategories";
import FashionTrendingCategories from "../../components/categories/fashion/FashionTrendingCategories";
import FashionExclusivePromo from "../../components/categories/fashion/FashionExclusivePromo";
import FashionTopBrands from "../../components/categories/fashion/FashionTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";



const Fashion = () => {
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
      <FashionHero/>
      <FashionCategories/>
      <FashionNewArrivals/>
      <FashionAISection/>
      <FashionPromoCategories/>
      <FashionTrendingCategories/>
      <FashionExclusivePromo/>
      <FashionTopBrands/>
      <TrustBadgeSection/>
    </div>
  );
};

export default Fashion;