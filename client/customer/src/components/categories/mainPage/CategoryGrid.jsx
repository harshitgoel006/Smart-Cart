import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiZap } from "react-icons/fi";
import { getTopLevelCategories } from "../../../features/categories/categoryService";
import { categoryLayoutConfig } from "../../../data/categories/categoryLayoutConfig";

const ExploreDepartments = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getTopLevelCategories();
        setCategories([...data, { slug: "more", name: "More", comingSoon: true }]);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  // PERFORMANCE OPTIMIZED ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.05, 
        delayChildren: 0.1 
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 }, 
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4, 
        ease: "easeOut" // Tween animation for lighter CPU load
      } 
    }
  };

  return (
    <section className="relative py-32 bg-white overflow-hidden transform-gpu">
      {/* BACKGROUND GLOWS - Simplified for performance */}
      <div className="pointer-events-none absolute inset-0 opacity-50">
        <div className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] bg-purple-100 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-pink-100 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="mb-24 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <div className="h-[1px] w-12 bg-zinc-200" />
            <span className="text-[10px] font-black tracking-[0.4em] uppercase text-zinc-400">
              Lifestyle Categories
            </span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-6xl md:text-7xl font-black tracking-[-0.05em] uppercase leading-[0.85] text-zinc-900"
          >
            DISCOVER <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal px-2">
              dimensions.
            </span>
          </motion.h2>
        </div>

        {/* BENTO GRID */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 auto-rows-[260px]"
        >
          {categories.map((item, i) => {
            const layout = categoryLayoutConfig[item.slug] || {
              gridSize: "md:col-span-1 md:row-span-1",
              accent: "from-purple-600/20",
            };

            return (
              <motion.div
                key={item.slug || i}
                variants={cardVariants}
                className={`${layout.gridSize} relative group transform-gpu`}
                style={{ willChange: "transform, opacity" }} // Force GPU acceleration
              >
                {item.comingSoon ? (
                  /* COMING SOON CARD */
                  <div className="h-full w-full rounded-[3.5rem] bg-zinc-50 border border-dashed border-zinc-200 flex flex-col items-center justify-center p-6 text-center">
                    <FiZap className="text-purple-500 mb-4" size={28} />
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.25em] leading-relaxed">
                      Next Drop <br/> Coming Soon
                    </span>
                  </div>
                ) : (
                  /* CATEGORY CARD */
                  <Link 
                    to={`/categories/${item.slug}`} 
                    className="block h-full w-full relative overflow-hidden rounded-[3.5rem] bg-zinc-100 shadow-sm transition-transform duration-500 group-hover:-translate-y-2"
                  >
                    {/* Lazy Loaded Image */}
                    <img
                      src={item.image}
                      alt={item.name}
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                    />

                    {/* Palette Overlays */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${layout.accent} to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-500`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    {/* Content */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="h-12 w-12 rounded-2xl bg-white/20 border border-white/20 flex items-center justify-center">
                          <FiArrowUpRight className="text-white text-xl" />
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-white text-3xl font-black tracking-tighter uppercase leading-none drop-shadow-md">
                          {item.name}
                        </h3>
                        <div className="h-[3px] w-0 bg-gradient-to-r from-purple-400 to-pink-400 group-hover:w-full transition-all duration-500 rounded-full" />
                      </div>
                    </div>

                    {/* Subtle Inner Border */}
                    <div className="absolute inset-6 border border-white/5 rounded-[2.2rem] pointer-events-none" />
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreDepartments;
