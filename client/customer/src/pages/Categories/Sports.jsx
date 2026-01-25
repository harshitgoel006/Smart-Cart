import { motion } from "framer-motion";
import SportsHero from "../../components/categories/sports/SportsHero";
import SportsCategories from "../../components/categories/sports/SportsCategories";
import SportsNewArrivals from "../../components/categories/sports/SportsNewArrivals";
import SportsAISection from "../../components/categories/sports/SportsAISection";
import SportsPromoCategories from "../../components/categories/sports/SportsPromoCategories";
import SportsTrendingCategories from "../../components/categories/sports/SportsTrendingCategories";
import SportsExclusivePromo from "../../components/categories/sports/SportsExclusivePromo";
import SportsTopBrands from "../../components/categories/sports/SportsTopBrands";
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
      <SportsHero/>
      <SportsCategories/>
      <SportsNewArrivals/>
      <SportsAISection/>
      <SportsPromoCategories/>
      <SportsTrendingCategories/>
      <SportsExclusivePromo/>
      <SportsTopBrands/>
      <TrustBadgeSection/>
    </div>
  );
};

export default Accessories;