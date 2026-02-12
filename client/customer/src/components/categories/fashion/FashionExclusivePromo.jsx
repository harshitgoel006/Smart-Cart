import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// A visually stunning and immersive fashion exclusive promo section that captures the essence of style and sophistication. The design features a clean and modern layout with a focus on high-quality imagery, bold typography, and subtle animations to create an engaging user experience. The promo is presented as a large, captivating card with a stylish overlay, and a clear call-to-action that invites users to explore the exclusive collection. The use of soft gradients, elegant fonts, and dynamic hover effects adds a touch of luxury and exclusivity to the overall design, making it an irresistible gateway to the world of fashion.

const FashionExclusivePromo = () => {
  return (
    <section className="w-full pt-2 pb-20 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="
          relative w-full
          h-[420px] md:h-[520px] lg:h-[580px]
          flex items-center justify-center
          bg-gradient-to-br from-[#0c0c0c] via-[#050505] to-[#12122b]
          rounded-none
          shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)]
        "
      >
        {/* AMBIENT GLOWS - Adjusted for a more vibrant spectrum */}
        <div className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-rose-900/10 blur-[130px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-indigo-900/15 blur-[130px] rounded-full animate-pulse transition-all duration-1000" />

        {/* CONTENT */}
        <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">
          
          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 mb-8 shadow-2xl"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-rose-500 to-indigo-500 rounded-full animate-ping" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.5em] text-gray-300 uppercase">
              Global Edit / Autumn 2026
            </span>
          </motion.div>

          {/* TITLE - Balanced for all categories */}
          <div className="overflow-hidden space-y-3 mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase tracking-tighter"
            >
              CURATED FOR LIFE
            </motion.h1>

            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="text-xl md:text-4xl lg:text-5xl font-black italic bg-gradient-to-r from-rose-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent"
            >
              Express Every Version of You
            </motion.h2>
          </div>

          {/* SUB LINE */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-[10px] md:text-sm font-light tracking-[0.4em] uppercase text-gray-400 mb-12"
          >
            All-Gender Essentials • Kids Wear •{" "}
            <span className="font-bold text-white">UP TO 60% OFF</span>
          </motion.p>

          {/* CTA LINK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link
              to="/all-products"
              className="group relative inline-flex items-center gap-4 px-14 py-6
              bg-white text-black rounded-full
              font-black text-[11px] md:text-xs tracking-[0.3em] uppercase
              shadow-[0_20px_40px_-10px_rgba(255,255,255,0.2)]
              hover:bg-black hover:text-white transition-all duration-500 hover:-translate-y-1 border-2 border-transparent hover:border-white"
            >
              Shop The New Drop
              <FiArrowRight className="group-hover:translate-x-2 transition-transform text-lg" />
              <span className="absolute inset-0 bg-gradient-to-r from-rose-500/10 via-transparent to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-full" />
            </Link>
          </motion.div>
        </div>

        {/* GRAINY OVERLAY */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </motion.div>
    </section>
  );
};

export default FashionExclusivePromo;