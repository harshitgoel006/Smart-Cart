import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiLayers } from "react-icons/fi";
import { getDirectSubcategories } from "../../features/categories/categoryService";

const CategorySubcategoryGrid = ({ category }) => {
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    const loadSubs = async () => {
      if (!category?._id) return;
      const subs = await getDirectSubcategories(category._id);
      setSubcategories(subs);
    };
    loadSubs();
  }, [category]);

  if (!subcategories.length) return null;

  return (
    <section className="relative py-32 bg-white overflow-hidden transform-gpu">
      {/* ROYAL BACKGROUND DETAIL */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-zinc-50/50 -skew-x-12 translate-x-1/2 pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">

        {/* HEADER: ROYAL TYPOGRAPHY */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8 border-b border-zinc-100 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <FiLayers className="text-purple-500 text-xs" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-400">
                Refine Selection
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em] uppercase leading-none text-zinc-900">
              SHOP <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal px-2">
                {category?.name}.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="max-w-[200px] text-right"
          >
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-relaxed">
              Explore curated sub-collections tailored for excellence.
            </p>
          </motion.div>
        </div>

        {/* SUB-CATEGORY GRID: LUXURY CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {subcategories.slice(0, 6).map((sub, i) => (

            <motion.div
              key={sub._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: i * 0.05, 
                duration: 0.4, 
                ease: "easeOut" 
              }}
              className="group relative transform-gpu"
              style={{ willChange: "transform, opacity" }}
            >
              <Link
                to={`/categories/${category.slug}/${sub.slug}`}
                className="relative block h-[320px] overflow-hidden rounded-[3.5rem] bg-zinc-100 shadow-sm transition-all duration-700 group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] group-hover:-translate-y-2"
              >
                {/* IMAGE WITH ZOOM EFFECT */}
                <img
                  src={sub.image}
                  alt={sub.name}
                  loading="lazy"
                  className="h-full w-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-[1.2s] ease-out"
                />

                {/* OVERLAYS: LUXURY GRADIENTS */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                {/* CONTENT BUNDLE */}
                <div className="absolute inset-0 p-10 flex flex-col justify-between items-start">
                  {/* Top Badge (Hidden initially) */}
                  <div className="w-full flex justify-end">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <FiArrowUpRight className="text-white text-xl" />
                    </div>
                  </div>

                  {/* Title & Underline */}
                  <div className="w-full space-y-4">
                    <h3 className="text-white text-3xl font-black uppercase tracking-tighter drop-shadow-lg">
                      {sub.name}
                    </h3>
                    <div className="h-[2px] w-8 bg-white/40 group-hover:w-full group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-700 rounded-full" />
                    
                    {/* Collection Tag */}
                    <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                      Signature Series
                    </p>
                  </div>
                </div>

                {/* INNER DECORATIVE BORDER */}
                <div className="absolute inset-6 border border-white/5 rounded-[2.5rem] pointer-events-none group-hover:border-white/10 transition-colors duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySubcategoryGrid;