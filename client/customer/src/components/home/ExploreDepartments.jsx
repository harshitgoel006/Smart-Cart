import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiCommand } from "react-icons/fi";
import { getTopLevelCategories } from "../../features/categories/categoryService";
import { departmentLayoutConfig } from "../../data/home/departmentLayoutConfig";

const ExploreDepartments = () => {
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    const loadDepartments = async () => {
      const data = await getTopLevelCategories();
      const filtered = data.filter(item => departmentLayoutConfig[item.slug]);
      setDepartments(filtered);
    };
    loadDepartments();
  }, []);

  // ANIMATIONS
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.3 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.95, filter: "blur(4px)" },
    show: { 
      opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
      transition: { type: "spring", stiffness: 50, damping: 15 } 
    }
  };

  return (
    <section className="relative py-32 bg-[#ffffff] overflow-hidden">
      
      {/* DYNAMIC MOVING BACKGROUND GLOWS */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ 
            x: [0, 50, 0], 
            y: [0, 30, 0],
            scale: [1, 1.1, 1] 
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] right-[10%] w-[600px] h-[600px] bg-purple-200/30 blur-[150px] rounded-full" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0], 
            y: [0, 60, 0],
            scale: [1, 1.2, 1] 
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-10%] left-[5%] w-[600px] h-[600px] bg-orange-100/40 blur-[150px] rounded-full" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-10 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="mb-24 flex flex-col md:flex-row items-end justify-between border-b border-zinc-100 pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-12 bg-purple-600" />
              <span className="text-[11px] font-black tracking-[0.6em] uppercase text-purple-600">Premium Curations</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-tighter uppercase leading-[0.75] text-zinc-900">
              Style <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 italic font-serif lowercase tracking-tight">Vanguard.</span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="hidden md:block max-w-[300px] text-zinc-400 text-sm font-medium leading-relaxed italic border-l-2 border-zinc-100 pl-8 mb-4"
          >
            Redefining the digital shopping experience through architectural grids and curated aesthetics.
          </motion.div>
        </div>

        {/* BENTO GRID */}
        <motion.div 
  variants={containerVariants}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  // Column size 5 rakha hai symmetry ke liye
  className="grid grid-cols-1 md:grid-cols-5 gap-5 auto-rows-[200px]"
>
          {departments.map((item) => {
            const layout = departmentLayoutConfig[item.slug] || { gridSize: "md:col-span-2" };

            return (
              <motion.div
                key={item.slug}
                variants={cardVariants}
                whileHover={{ 
                  y: -15, 
                  rotateZ: 0.5,
                  transition: { type: "spring", stiffness: 200 } 
                }}
                className={`${layout.gridSize} relative group`}
              >
                {/* DYNAMIC SHADOW (Changes color based on config) */}
                <div className={`absolute inset-10 bg-gradient-to-br ${layout.accent || 'from-zinc-400/20'} to-transparent blur-3xl opacity-0 group-hover:opacity-60 transition-all duration-700 -z-10`} />

                <Link to={`/categories/${item.slug}`} className="block h-full w-full relative overflow-hidden rounded-[3.5rem] bg-white border border-zinc-100 transition-all duration-700 shadow-sm group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.1)]">
                  
                  {/* Persistent Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className={`absolute inset-0 bg-gradient-to-tr ${layout.accent} to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />

                  {/* Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                    <div className="flex justify-end">
                      <motion.div 
                        whileHover={{ rotate: 45 }}
                        className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500"
                      >
                        <FiArrowUpRight className="text-white text-2xl" />
                      </motion.div>
                    </div>
                    
                    <div className="overflow-hidden">
                      <motion.h3 
                        initial={{ y: 20 }}
                        whileInView={{ y: 0 }}
                        className="text-white text-3xl md:text-4xl font-black tracking-tighter uppercase"
                      >
                        {item.name}
                      </motion.h3>
                      <div className="mt-4 h-[2px] w-0 bg-gradient-to-r from-white via-white/50 to-transparent group-hover:w-full transition-all duration-1000" />
                    </div>
                  </div>

                  {/* Inner Glassy Stroke */}
                  <div className="absolute inset-6 border border-white/5 rounded-[2.5rem] pointer-events-none group-hover:border-white/20 transition-colors duration-700" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreDepartments;