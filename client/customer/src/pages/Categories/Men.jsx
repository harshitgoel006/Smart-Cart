import { motion } from "framer-motion";
import MenCategories from "../../components/categories/men/MenCategories";
import MenHero from "../../components/categories/men/MenHero";
import MenNewArrivals from "../../components/categories/men/MenNewArrivals";
import MenAISection from "../../components/categories/men/MenAISection";
import MenPromoCategories from "../../components/categories/men/MenPromoCategories";

const Men = () => {
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
        <MenHero/>
        <MenCategories/>
        <MenNewArrivals/>
        <MenAISection/>
        <MenPromoCategories/>
     
    </div>
  );
};

export default Men;
