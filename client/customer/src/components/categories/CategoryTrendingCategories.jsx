import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiArrowUpRight, FiZap, FiActivity } from "react-icons/fi";

import { getDirectSubcategories } from "../../features/categories/categoryService";
import { getProductsByCategorySlug } from "../../features/products/productService";

const CategoryTrendingCategories = ({ category }) => {
  const [trendingSubs, setTrendingSubs] = useState([]);

  useEffect(() => {
    const loadTrending = async () => {
      if (!category?._id) return;
      const subs = await getDirectSubcategories(category._id);

      const subsWithScore = await Promise.all(
        subs.map(async (sub) => {
          const products = await getProductsByCategorySlug(sub.slug);
          const totalSold = products.reduce((sum, p) => sum + (p.sold || 0), 0);
          return { ...sub, totalSold };
        })
      );

      const sorted = subsWithScore
        .sort((a, b) => b.totalSold - a.totalSold)
        .slice(0, 10);

      setTrendingSubs(sorted);
    };
    loadTrending();
  }, [category]);

  if (!trendingSubs.length) return null;

  return (
    <section className="relative py-32 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-50/40 to-white">
      
      {/* ELITE AMBIENT BACKGROUND - REFERENCE PALETTE */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[-5%] w-[45%] h-[45%] bg-purple-200/50 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] right-[-5%] w-[45%] h-[45%] bg-pink-200/50 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">

        {/* HEADER: Pattern Style Sync */}
        <div className="flex flex-col items-center mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-6"
          >
            <span className="text-[10px] font-black tracking-[0.6em] uppercase text-purple-600">
              Luxe Edit
            </span>
          </motion.div>

          <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-gray-950 leading-[0.85] uppercase">
            TRENDING <br />
            <span className="italic font-serif  lowercase text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
               {category?.name || "Collection"}
            </span>
          </h2>
          
          <div className="mt-8 h-1 w-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
        </div>

        {/* GRID: Elite Grid with Reference Styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {trendingSubs.map((sub, i) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.8 }}
                whileHover={{ y: -12 }}
                className="group relative"
              >
                <Link to={`/products?category=${sub.slug}`}>
                  <div className="
                    relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden bg-white
                    border border-purple-100/50
                    shadow-[0_20px_50px_-20px_rgba(168,85,247,0.35)]
                    group-hover:shadow-[0_50px_100px_-30px_rgba(236,72,153,0.45)]
                    transition-all duration-700 transform-gpu
                  ">
                    
                    {/* IMAGE */}
                    <motion.img
                      src={sub.image}
                      alt={sub.name}
                      className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0 transition-all duration-1000"
                      whileHover={{ scale: 1.15 }}
                    />

                    {/* OVERLAY - Gradient Match */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity duration-500" />

                    {/* CONTENT LAYER */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                      <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-3 drop-shadow-md">
                        {sub.name}
                      </span>

                      {/* ELITE ACTION ICON */}
                      <div className="h-10 w-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-2xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white">
                        <FiArrowUpRight size={18} />
                      </div>
                    </div>

                    {/* BOTTOM ACCENT BAR */}
                    <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
                  </div>

                  {/* GHOST INDEX - Reference Decor */}
                  <div className="absolute -z-10 -bottom-3 -left-3 text-7xl font-black text-gray-200/60 opacity-0 group-hover:opacity-100 transition-all duration-500 select-none">
                    {i < 9 ? `0${i + 1}` : i + 1}
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default CategoryTrendingCategories;