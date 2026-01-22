import { motion } from "framer-motion";
import Hero from "../../components/Hero";
import TopCategories from "../../components/TopCategories";
import FeaturedProducts from "../../components/FeaturedProducts";
import OffersSlider from "../../components/OffersSlider";
import TopBrands from "../../components/TopBrands";
import RazorpayPromo from "../../components/RazorpayPromo";

const Home = () => {
  return (
    <div className="relative overflow-hidden">

      {/* 🌈 GLOBAL ANIMATED BACKGROUND GRADIENT */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">

        {/* PURPLE GLOW */}
        <motion.div
          className="
            absolute -top-24 -left-24
            h-[520px] w-[520px]
            rounded-full
            bg-purple-400/40
            blur-[100px]
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
            blur-[100px]
          "
          animate={{ x: [0, -40, 0], y: [0, -30, 0] }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* PAGE CONTENT */}
      <Hero />
      <TopCategories />
      <FeaturedProducts/>
      <OffersSlider/>
      <TopBrands/>
      <RazorpayPromo/>
      {/* next sections yaha add honge */}

    </div>
  );
};

export default Home;
