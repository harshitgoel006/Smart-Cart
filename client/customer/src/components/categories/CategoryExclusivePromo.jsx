import { motion, useScroll, useTransform } from "framer-motion";
import { FiArrowRight, FiZap } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useRef } from "react";

const CategoryExclusivePromo = ({ category }) => {
  const containerRef = useRef(null);
  
  if (!category) return null;

  return (
    <section ref={containerRef} className="w-full pt-4 pb-24 overflow-hidden bg-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="
          relative w-full mx-auto
          h-[450px] md:h-[550px] lg:h-[650px]
          flex items-center justify-center
          /* PREMIUM GRADIENT BASE */
          bg-[#020617]
          shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]
          overflow-hidden
        "
      >
        {/* --- DYNAMIC BACKGROUND GRADIENT LAYERS --- */}
        
        {/* 1. Deep Radial Center Glow (Purple) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(76,29,149,0.25)_0%,transparent_50%)]" />
        
        {/* 2. Side Ambient Glow (Pink/Magenta) */}
        <motion.div
          animate={{ 
            opacity: [0.2, 0.4, 0.2],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -right-[10%] top-[-10%] w-[50%] h-[70%] bg-pink-600/10 blur-[120px] rounded-full"
        />

        {/* 3. Bottom Corner Glow (Orange/Gold) */}
        <motion.div
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            x: [0, -30, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -left-[5%] -bottom-[10%] w-[40%] h-[50%] bg-orange-500/10 blur-[100px] rounded-full"
        />

        {/* 4. Glass Texture / Noise */}
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* --- CONTENT --- */}
        <div className="relative z-30 text-center px-6 max-w-5xl mx-auto">

          {/* DYNAMIC TAG */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-4 px-8 py-3 bg-white/5 backdrop-blur-2xl rounded-full border border-white/10 mb-10"
          >
            <FiZap className="text-orange-400 size-3 fill-orange-400 animate-pulse" />
            <span className="text-[9px] md:text-[11px] font-black tracking-[0.6em] text-white/80 uppercase">
              {category.name} <span className="text-purple-400">•</span> Exclusive Drop
            </span>
          </motion.div>

          {/* TITLE */}
          <div className="mb-10">
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-7xl  font-black text-white uppercase tracking-tighter leading-none mb-4"
            >
              ELEVATE YOUR <br /> 
              <span className="font-serif  italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 ">{category.name}</span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h2 className=" md:text-5xl lg:text-6xl font-serif  italic text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400 py-2">
                The Curated Edit
              </h2>
            </motion.div>
          </div>


          {/* SUBLINE */}
          <motion.div className="flex items-center justify-center gap-6 mb-12">
            <div className="h-[1px] w-8 md:w-16 bg-white/20" />
            <p className="text-[10px] md:text-xs font-black tracking-[0.4em] uppercase text-zinc-400">
              Limited Drop <span className="text-white mx-2">—</span> <span className="text-white">SAVE 70% Today</span>
            </p>
            <div className="h-[1px] w-8 md:w-16 bg-white/20" />
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <Link
              to={`/products?category=${category.slug}`}
              className="group relative inline-flex items-center gap-6 px-16 py-6 
              bg-white rounded-full overflow-hidden
              font-black text-[11px] md:text-xs tracking-[0.4em] uppercase
              text-black transition-all duration-700
              hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.6)]"
            >
              <div className="absolute inset-0 translate-y-[100%] group-hover:translate-y-0 bg-gradient-to-r from-purple-600 to-pink-500 transition-transform duration-500" />
              
              <span className="relative z-10 group-hover:text-white transition-colors duration-500">
                Explore Collection
              </span>
              <FiArrowRight size={20} className="relative z-10 group-hover:text-white group-hover:translate-x-3 transition-all duration-500" />
            </Link>
          </motion.div>
        </div>

        {/* CUSTOM CSS FOR OUTLINE */}
        <style dangerouslySetInnerHTML={{ __html: `
          .outline-text {
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
            color: transparent;
          }
          @media (min-width: 768px) {
            .outline-text { -webkit-text-stroke: 2px rgba(255,255,255,0.3); }
          }
        `}} />
      </motion.div>
    </section>
  );
};

export default CategoryExclusivePromo;