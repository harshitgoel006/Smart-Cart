import { motion } from "framer-motion";
import HomeLivingHero from "../../components/categories/homeliving/HomeLivingHero";
import HomeLivingCategories from "../../components/categories/homeliving/HomeLivingCategories";
import HomeLivingAISection from "../../components/categories/homeliving/HomeLivingAISection";
import HomeLivingNewArrivals from "../../components/categories/homeliving/HomeLivingNewArrivals";
import HomeLivingPromoCategories from "../../components/categories/homeliving/HomeLivingPromoCategories";
import HomeLivingTrendingCategories from "../../components/categories/homeliving/HomeLivingTrendingCategories";
import HomeLivingExclusivePromo from "../../components/categories/homeliving/HomeLivingExclusivePromo";
import HomeLivingTopBrands from "../../components/categories/homeliving/HomeLivingTopBrands";
import TrustBadgeSection from "../../components/TrustBadgeSection";



const HomeLiving = () => {
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
        <HomeLivingHero/>
        <HomeLivingCategories/>
        <HomeLivingNewArrivals/>
        <HomeLivingAISection/>
        <HomeLivingPromoCategories/>
        <HomeLivingTrendingCategories/>
        <HomeLivingExclusivePromo/>
        <HomeLivingTopBrands/>
        <TrustBadgeSection/>
     
    </div>
  );
};

export default HomeLiving;