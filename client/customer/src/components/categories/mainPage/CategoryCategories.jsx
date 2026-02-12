
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight, FiZap, FiShoppingBag } from "react-icons/fi";


// Sample departments data for the Explore Departments section

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.94 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: "spring", stiffness: 70, damping: 15 } 
  }
};

const departments = [
  { name: "Men", slug: "men", image: "https://i.pinimg.com/1200x/6b/2f/d8/6b2fd88b4065fc417cf1c7267d9c0892.jpg", gridSize: "md:col-span-1 md:row-span-2", accent: "from-purple-500/40" },
  { name: "Women", slug: "women", image: "https://i.pinimg.com/736x/d6/bc/ce/d6bcce4be1856a743ff29adca04d49ac.jpg", gridSize: "md:col-span-2 md:row-span-2", accent: "from-pink-500/40" },
  { name: "Electronics", slug: "electronics", image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=800", gridSize: "md:col-span-1 md:row-span-1", accent: "from-cyan-500/40" },
  { name: "Beauty", slug: "beauty", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800", gridSize: "md:col-span-1 md:row-span-1", accent: "from-rose-500/40" },
  { name: "Home", slug: "home-living", image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1600", gridSize: "md:col-span-2 md:row-span-1", accent: "from-orange-500/40" },
  { name: "Fashion", slug: "fashion", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600", gridSize: "md:col-span-2 md:row-span-1", accent: "from-blue-500/40" },
  { name: "Kids", slug: "kids", image: "https://i.pinimg.com/736x/d2/d4/d8/d2d4d838bdd4db2456576fdf18ee6154.jpg", gridSize: "md:col-span-1 md:row-span-1", accent: "from-yellow-500/40" },
  { name: "Sports", slug: "sports-gym", image: "https://i.pinimg.com/1200x/39/4a/85/394a8514c21be4c0fc80e3d2a9879019.jpg", gridSize: "md:col-span-1 md:row-span-1", accent: "from-green-500/40" },
  { name: "Grocery", slug: "groceries", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800", gridSize: "md:col-span-1 md:row-span-1", accent: "from-emerald-500/40" },
  { name: "Accessories", slug: "accessories", image: "https://i.pinimg.com/736x/c9/c1/6b/c9c16b1afd4fc3853baee9e602ed5f2e.jpg", gridSize: "md:col-span-1 md:row-span-1", accent: "from-amber-500/40" },
  { name: "Gifts", slug: "gifts", image: "https://i.pinimg.com/736x/ee/af/28/eeaf28115cb7c67b9357e9bb1669d143.jpg", gridSize: "md:col-span-1 md:row-span-1", accent: "from-fuchsia-500/40" },
  { name: "More", slug: "", image: "", gridSize: "md:col-span-1 md:row-span-1", comingSoon: true },
];

// Explore Departments Component - A visually stunning, interactive grid showcasing all major shopping categories with dynamic hover effects and a modern design to drive user engagement and conversions.

const ExploreDepartments = () => {
  return (
    <section className="relative py-28 bg-[#fdfdfd] overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-100/40 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-pink-100/40 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 relative z-10">
        
        {/* ENHANCED HEADER WITH GRADIENT */}
        <div className="mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            {/* <div className="p-2 bg-black rounded-lg">
              <FiShoppingBag className="text-white text-xs" />
            </div> */}
            <span className="p-2 text-[11px] font-black tracking-[0.5em] uppercase text-zinc-400">
              SmartCart Lifestyle Hub 
              <div className="h-[1px] w-12 text-zinc-400" />
            </span>
            
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black tracking-[ -0.04em] uppercase leading-[0.85]"
          >
            CHOOSE <br />
            <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-light tracking-tighter">
              DIMENSIONS.
            </span>
          </motion.h2>
        </div>

        {/* BENTO GRID WITH SPRING ANIMATIONS */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[240px]"
        >
          {departments.map((item, i) => (
            <motion.div
              key={i}
              variants={cardVariants}
              whileHover={{ y: -12, transition: { duration: 0.3 } }}
              className={`${item.gridSize} relative group`}
            >
              {item.comingSoon ? (
                <div className="h-full w-full rounded-[3rem] bg-white border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center p-6 text-center shadow-inner group-hover:border-purple-300 transition-colors duration-500">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-50 flex items-center justify-center mb-4 shadow-sm">
                    <FiZap className="text-purple-500 animate-bounce" size={24} />
                  </div>
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Next Drop <br/> Coming Soon</span>
                </div>
              ) : (
                <Link to={`/categories/${item.slug}`} className="block h-full w-full relative overflow-hidden rounded-[3rem] bg-white shadow-[0_15px_35px_-15px_rgba(0,0,0,0.1)] group-hover:shadow-[0_40px_60px_-20px_rgba(147,51,234,0.15)] transition-all duration-500">
                  
                  {/* High-Resolution Image Overlay */}
                  <motion.img
                    src={item.image}
                    alt={item.name}
                    className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                  />

                  {/* Multilayered Overlays */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                  {/* Visual Content */}
                  <div className="absolute inset-0 p-10 flex flex-col justify-between z-10">
                    <div className="flex justify-end translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 delay-100">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center shadow-2xl">
                        <FiArrowUpRight className="text-white text-xl" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-white text-3xl font-black tracking-tighter uppercase leading-none drop-shadow-2xl">
                        {item.name}
                      </h3>
                      <div className="h-[2px] w-0 bg-white group-hover:w-full transition-all duration-700 ease-in-out" />
                    </div>
                  </div>

                  {/* Glassy Inner Border */}
                  <div className="absolute inset-4 border border-white/10 rounded-[2.2rem] pointer-events-none" />
                </Link>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ExploreDepartments;