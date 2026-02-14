


import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getFeaturedBrands } from "../../features/brands/brandService";
import { FiArrowRight, FiTarget } from "react-icons/fi";

const TopBrands = () => {
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const loadBrands = async () => {
      const data = await getFeaturedBrands();
      setBrands(data);
    };
    loadBrands();
  }, []);

  if (!brands.length) return null;

  return (
    <section className="relative py-15 bg-white overflow-hidden">
      
      {/* ROYAL AMBIANCE BACKGROUND */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -left-20 h-[500px] w-[500px] rounded-full bg-purple-100/50 blur-[120px]" 
        />
        <div className="absolute top-1/2 right-0 h-[400px] w-[400px] rounded-full bg-orange-50/60 blur-[100px]" />
      </div>

      <div className="max-w-[1440px] mx-auto px-10">
        
        {/* LUXURY HEADER */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <div className="space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-purple-600"
            >
              <FiTarget className="animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase">Elite Partnerships</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter leading-[0.8]"
            >
              Global <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 italic font-serif lowercase tracking-normal">Heritage Brands.</span>
            </motion.h2>
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-zinc-400 font-medium max-w-[280px] text-sm leading-relaxed border-l border-zinc-100 pl-6 mb-2"
          >
            Curated excellence from the world's most prestigious houses, delivered to your doorstep.
          </motion.p>
        </div>

        {/* BRANDS GRID - With Royal Hover & Stagger */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/brands/${brand.slug}`}
                className="group relative flex flex-col items-center justify-center h-48 rounded-[3rem] bg-zinc-50/50 border border-zinc-100 transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(147,51,234,0.15)] overflow-hidden"
              >
                {/* Brand Logo */}
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="h-12 w-auto object-contain grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 z-10"
                />

                {/* Subtle Text Reveal */}
                <div className="absolute bottom-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-center gap-2">
                  <span className="text-[10px] font-black tracking-widest text-purple-600 uppercase">Enter Store</span>
                  <FiArrowRight size={12} className="text-purple-600" />
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ROYAL CALL TO ACTION CAROUSEL-FEEL */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 relative group overflow-hidden rounded-[4rem] bg-zinc-900 p-1 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')]"
        >
          <div className="relative z-10 bg-zinc-900 rounded-[3.8rem] p-12 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 border border-white/5">
            <div className="space-y-4">
              <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter">
                The Full <span className="italic font-serif text-purple-400">Directory</span>
              </h3>
              <p className="text-zinc-400 max-w-md text-lg">
                Can't find your brand? Explore our full catalog of 500+ premium global partners.
              </p>
            </div>

            <Link
              to="/brands"
              className="group/btn relative px-12 py-6 rounded-full overflow-hidden transition-all shadow-2xl"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 transition-transform group-hover/btn:scale-105" />
              <span className="relative z-10 text-white font-black tracking-widest text-xs uppercase flex items-center gap-3">
                Browse All Brands <FiArrowRight className="group-hover/btn:translate-x-2 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Background Decorative Element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-full w-full bg-gradient-to-r from-purple-500/10 to-transparent blur-3xl" />
        </motion.div>

      </div>
    </section>
  );
};

export default TopBrands;



