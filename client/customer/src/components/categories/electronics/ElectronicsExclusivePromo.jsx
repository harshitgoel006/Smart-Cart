import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

// The ElectronicsExclusivePromo component renders a visually striking promotional section for the electronics category. It features a futuristic design with ambient glows, animated text, and a compelling call-to-action button. The section is designed to capture user attention and drive engagement with the latest tech offerings, highlighting an exclusive promotion with up to 70% off on elite tech collections.

const ElectronicsExclusivePromo = () => {
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
          bg-gradient-to-br from-[#1a0b12] via-[#0a0a0a] to-[#2e1a22]
          rounded-none md:rounded-none
          shadow-[0_10_20px_-20px_rgba(0,0,0,0.8)]
        "
      >
        {/* AMBIENT TECH GLOWS */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-900/15 blur-[120px] rounded-full animate-pulse" />

        {/* CONTENT */}
        <div className="relative z-30 text-center px-6 max-w-4xl mx-auto">
          
          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6 shadow-xl"
          >
            <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-amber-400 rounded-full animate-ping" />
            <span className="text-[10px] md:text-xs font-black tracking-[0.5em] text-pink-300 uppercase">
              Next-Gen Ecosystem 2026
            </span>
          </motion.div>

          {/* TITLE */}
          <div className="overflow-hidden space-y-2 mb-8">
            <motion.h1
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
              className="text-3xl md:text-5xl lg:text-7xl font-black text-white uppercase tracking-tight"
            >
              SMARTER LIVING
            </motion.h1>

            <motion.h2
              initial={{ y: "100%" }}
              whileInView={{ y: 0 }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              className="text-xl md:text-4xl lg:text-5xl font-black italic bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400 bg-clip-text text-transparent"
            >
              Plug In to the Future
            </motion.h2>
          </div>

          {/* SUB LINE */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="text-[10px] md:text-sm font-light tracking-[0.3em] uppercase text-gray-300 mb-10"
          >
            Elite Tech Collection •{" "}
            <span className="font-bold text-white">UPTO 70% OFF</span>
          </motion.p>

          {/* CTA LINK */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <Link
              to="/products?category=electronics"
              className="group relative inline-flex items-center gap-3 px-12 py-5
              bg-white/95 backdrop-blur-xl rounded-3xl
              font-black text-[11px] md:text-sm tracking-[0.25em] uppercase
              text-gray-900 shadow-2xl
              hover:shadow-rose-500/30 transition-all duration-500 hover:-translate-y-1"
            >
              Upgrade Now
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-rose-500/20 via-transparent to-pink-500/20 opacity-0 group-hover:opacity-100 transition-all duration-700 rounded-3xl" />
            </Link>
          </motion.div>
        </div>

        {/* TECH TEXTURE */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* SUBTLE SCANLINE EFFECT */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />
      </motion.div>
    </section>
  );
};

export default ElectronicsExclusivePromo;