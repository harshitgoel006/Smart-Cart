import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiTarget, FiAward } from "react-icons/fi";
import { getTopBrandsByCategory } from "../../features/products/productService";

const CategoryTopBrands = ({ category }) => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      if (!category?.slug) return;
      // Fetching top 5 for a clean "Elite" row
      const data = await getTopBrandsByCategory(category.slug, 5);
      setBrands(data);
    };

    loadBrands();
  }, [category]);

  if (!brands.length) return null;

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      
      {/* ROYAL AMBIANCE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute -top-20 -left-20 h-[600px] w-[600px] rounded-full bg-purple-100/40 blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, 30, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full bg-orange-100/30 blur-[120px]" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-10">
        
        {/* LUXURY HEADER: Synced with your Category Style */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-24 gap-12">
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 text-purple-600"
            >
              <FiAward className="animate-bounce" />
              <span className="text-[10px] font-black tracking-[0.6em] uppercase">Premier Selection</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-black text-zinc-900 tracking-tighter leading-[0.85]"
            >
              Leading <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 italic font-serif lowercase tracking-normal">
                {category?.name} Houses.
              </span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-zinc-400 font-medium max-w-[320px] text-sm leading-relaxed border-l-2 border-purple-100 pl-8 mb-4"
          >
            A curated directory of master artisans and heritage labels defining the future of {category?.name}.
          </motion.p>
        </div>

        {/* BRANDS GRID: The Elite Layout */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 80, 
                damping: 20 
              }}
              viewport={{ once: true }}
            >
              <Link
                to={`/products?category=${category.slug}&brand=${brand.slug}`}
                className="group relative flex flex-col items-center justify-center h-56 rounded-[3.5rem] bg-zinc-50/50 border border-zinc-100 transition-all duration-700 hover:bg-white hover:shadow-[0_45px_90px_-20px_rgba(147,51,234,0.2)] overflow-hidden transform-gpu hover:-translate-y-2"
              >
                {/* BRAND NAME / LOGO LOGIC */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                    {brand.logo ? (
                      <img
                        src={brand.logo}
                        alt={brand.name}
                        className="h-14 italic font-serif lowercase w-auto object-contain grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                      />
                    ) : (
                      <span className="text-xl font-black text-zinc-300 group-hover:text-zinc-900 transition-colors tracking-tighter uppercase">
                        {brand.name}
                      </span>
                    )}
                </div>

                {/* Subtle Text Reveal - Bottom */}
                <div className="absolute bottom-8 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2">
                  <span className="text-[9px] font-black tracking-[0.3em] text-purple-600 uppercase">View Brand</span>
                  <FiArrowRight size={14} className="text-purple-600" />
                </div>

                {/* Glass Glow Backdrop */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* FULL DIRECTORY CTA: Royal Dark Mode Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 relative group overflow-hidden rounded-[4rem] bg-zinc-950 p-[1px]"
        >
          <div className="relative z-10 bg-zinc-950 rounded-[3.9rem] p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-12 border border-white/10">
            <div className="space-y-6 text-center md:text-left">
              <h3 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-none">
                The Global <br />
                <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Archive</span>
              </h3>
              <p className="text-zinc-500 max-w-md text-lg font-medium">
                Seeking a specific name? Explore our complete roster of world-class {category?.name} partners.
              </p>
            </div>

            <Link
              to="/brands"
              className="group/btn relative px-14 py-7 rounded-full overflow-hidden transition-all shadow-2xl active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 transition-transform duration-500 group-hover/btn:scale-110" />
              <span className="relative z-10 text-white font-black tracking-[0.2em] text-[11px] uppercase flex items-center gap-4">
                Explore All Partners <FiArrowRight className="group-hover/btn:translate-x-3 transition-transform duration-500" />
              </span>
            </Link>
          </div>

          {/* Decorative Mesh */}
          <div className="absolute -top-1/2 -left-1/2 h-[200%] w-[200%] bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.1)_0%,transparent_50%)] animate-pulse" />
        </motion.div>

      </div>
    </section>
  );
};

export default CategoryTopBrands;