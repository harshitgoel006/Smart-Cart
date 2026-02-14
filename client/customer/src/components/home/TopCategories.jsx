import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiArrowUpRight } from "react-icons/fi";
import { getTopLevelCategories } from "../../features/categories/categoryService";

const TopCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      
      try {
        const data = await getTopLevelCategories();
        // Forcefully taking only the first 8 items
        if (data && Array.isArray(data)) {
          setCategories(data.slice(0, 8));
        }
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };
    loadCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 70, damping: 15 } 
    }
  };

  return (
    <section className="relative py-32 bg-[#fafafa] overflow-hidden">
      {/* Background Royal Accents */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-48 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-purple-100/30 blur-[120px]" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-pink-100/20 blur-[100px]" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-6">
        
        {/* HEADER SECTION - ROYAL LOOK */}
        <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[11px] font-black tracking-[0.5em] uppercase text-purple-500 mb-4 block">
              Curated Selection
            </span>
            <h2 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase">
              Elite <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-tight">
                Dimensions.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link
  to="/categories"
  className="group flex items-center gap-6"
>
  {/* Gradient Text */}
  <span className="text-[11px] font-black tracking-[0.4em] uppercase bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent transition-opacity group-hover:opacity-80">
    Explore All Spheres
  </span>

  {/* Gradient Icon Box */}
  <div className="relative h-16 w-16 flex items-center justify-center overflow-hidden rounded-2xl shadow-[0_10px_30px_-10px_rgba(147,51,234,0.3)] transition-all duration-500 group-hover:scale-110">
    {/* Background Gradient Layer */}
    <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 transition-transform duration-500 group-hover:rotate-90" />
    
    {/* Arrow Icon */}
    <FiArrowRight className="relative z-10 text-white text-xl group-hover:translate-x-1 transition-transform" />
    
    {/* Glass Shine Effect */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
  </div>
</Link>
          </motion.div>
        </div>

        {/* CATEGORIES GRID - BENTO INSPIRED */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {categories.map((cat) => (
            <motion.div key={cat.slug} variants={itemVariants}>
              <Link
                to={`/categories/${cat.slug}`}
                className="group relative block aspect-[3/4] overflow-hidden rounded-[3rem] bg-white transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                           hover:shadow-[0_40px_80px_-15px_rgba(147,51,234,0.25)] hover:-translate-y-4"
              >
                {/* Image Zoom & Fade */}
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />
                </div>

                {/* Royal Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />
                
                {/* Hover Accent Color (Glass) */}
                <div className="absolute inset-0 bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-between z-10">
                  <div className="flex justify-end translate-y-[-20px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl">
                      <FiArrowUpRight className="text-white text-xl" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[9px] font-black tracking-[0.2em] text-white uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      View Sphere
                    </span>
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
                      {cat.name}
                    </h3>
                    <div className="h-[2px] w-0 bg-gradient-to-r from-purple-500 to-pink-500 group-hover:w-full transition-all duration-700 ease-in-out" />
                  </div>
                </div>

                {/* Inner Border Glow */}
                <div className="absolute inset-4 border border-white/5 rounded-[2.2rem] group-hover:border-white/20 transition-all duration-700 pointer-events-none" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default TopCategories;