import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  {
    name: "Topwear",
    slug: "topwear",
    tag: "T-Shirts, Shirts & Hoodies",
    image:
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=900&auto=format&fit=crop", // men topwear
  },
  {
    name: "Bottomwear",
    slug: "bottomwear",
    tag: "Jeans, Chinos & Cargos",
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=900&auto=format&fit=crop", // men jeans
  },
  {
    name: "Footwear",
    slug: "footwear",
    tag: "Sneakers, Boots & Loafers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=900&auto=format&fit=crop", // men shoes
  },
  {
    name: "Accessories",
    slug: "accessories",
    tag: "Watches & Essentials",
    image:
      "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=900&auto=format&fit=crop", // men watch
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic",
    tag: "Kurtas & Festive Wear",
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=900&auto=format&fit=crop", // men ethnic
  },
  {
    name: "Formal Wear",
    slug: "formal",
    tag: "Suits & Blazers",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=900&auto=format&fit=crop", // men formal
  },
];

// const MenCategories = () => {
//   return (
//     <section className="relative py-28 bg-[#fdfdfd] overflow-hidden">
      
//       {/* ANIMATED AMBIENT BACKGROUND */}
//       <div className="absolute inset-0 pointer-events-none">
//         <motion.div 
//           animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
//           transition={{ duration: 20, repeat: Infinity }}
//           className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-purple-100/40 rounded-full blur-[120px]" 
//         />
//         <motion.div 
//           animate={{ x: [0, -40, 0], y: [0, -50, 0] }}
//           transition={{ duration: 15, repeat: Infinity }}
//           className="absolute top-[20%] -right-[10%] w-[35%] h-[50%] bg-pink-100/30 rounded-full blur-[100px]" 
//         />
//       </div>

//       <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        
//         {/* HEADER SECTION */}
//         <div className="mb-20 space-y-4">
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             whileInView={{ opacity: 1, x: 0 }}
//             viewport={{ once: true }}
//             className="flex items-center gap-4"
//           >
//             <span className="h-[2px] w-12 bg-gray-900" />
//             <span className="text-xs font-black tracking-[0.4em] uppercase text-gray-400">Curated Categories</span>
//           </motion.div>
          
//           <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
//             <motion.h2
//               initial={{ opacity: 0, y: 30 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.8 }}
//               viewport={{ once: true }}
//               className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.8]"
//             >
//               MEN'S <br />
//               <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">COLLECTION</span>
//             </motion.h2>
            
//             <motion.p 
//               initial={{ opacity: 0 }}
//               whileInView={{ opacity: 1 }}
//               transition={{ delay: 0.4 }}
//               viewport={{ once: true }}
//               className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose"
//             >
//               Beyond fashion. A statement of intent. Discover your signature look.
//             </motion.p>
//           </div>
//         </div>

//         {/* MASONRY-INSPIRED GRID */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {categories.map((cat, i) => (
//             <motion.div
//               key={cat.slug}
//               initial={{ opacity: 0, y: 50 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               transition={{ 
//                 type: "spring", 
//                 stiffness: 100, 
//                 delay: i * 0.1,
//                 duration: 0.8 
//               }}
//               viewport={{ once: true }}
//               whileHover={{ y: -15 }}
//               className="group"
//             >
//               <Link
//                 to={`/products?category=men&sub=${cat.slug}`}
//                 className="relative block aspect-[4/5] overflow-hidden rounded-[3rem] bg-gray-50 transition-all duration-700 shadow-[0_0_0_1px_rgba(0,0,0,0.05)] group-hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.2)]"
//               >
//                 {/* IMAGE WITH PARALLAX-ISH ZOOM */}
//                 <motion.img
//                   src={cat.image}
//                   alt={cat.name}
//                   whileHover={{ scale: 1.15 }}
//                   transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
//                   className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
//                 />

//                 {/* DYNAMIC GRADIENT OVERLAY */}
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

//                 {/* CARD CONTENT */}
//                 <div className="absolute inset-0 p-10 flex flex-col justify-end overflow-hidden">
//                   <motion.div 
//                     initial={{ y: 20, opacity: 0 }}
//                     whileInView={{ y: 0, opacity: 1 }}
//                     className="space-y-3"
//                   >
//                     <span className="inline-block text-[10px] font-black tracking-[0.3em] uppercase text-purple-400 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
//                       {cat.tag}
//                     </span>
                    
//                     <div className="flex items-end justify-between translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75">
//                       <h3 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
//                         {cat.name}
//                       </h3>
                      
//                       {/* FLOATING ACTION ICON */}
//                       <div className="h-14 w-14 rounded-full bg-white text-black flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-all duration-500 shadow-2xl scale-0 group-hover:scale-100">
//                         <FiArrowUpRight size={28} />
//                       </div>
//                     </div>
//                   </motion.div>
//                 </div>

//                 {/* DECORATIVE LINE */}
//                 <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// };

const MenCategories = () => {
  return (
    <section className="relative py-20 bg-[#fdfdfd] overflow-hidden">
      
      {/* LIGHT AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] bg-purple-300/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[25%] -right-[10%] w-[40%] h-[40%] bg-pink-300/25 rounded-full blur-[140px]" 
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">
        
        {/* HEADER */}
        <div className="mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-4"
          >
            <span className="h-[2px] w-12 bg-gray-900" />
            <span className="text-xs font-black tracking-[0.4em] uppercase text-gray-400">
              Curated Categories
            </span>
          </motion.div>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black tracking-tighter text-gray-900 leading-[0.9]"
            >
              MEN'S <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                COLLECTION
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed"
            >
              Beyond fashion. A statement of intent.
            </motion.p>
          </div>
        </div>

        {/* COMPACT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.7 }}
              viewport={{ once: true }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <Link
                to={`/products?category=men&sub=${cat.slug}`}
                className="
                  relative block h-[260px] md:h-[300px] overflow-hidden rounded-[2.5rem]
                  bg-white transition-all duration-700
                  shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_30px_70px_-20px_rgba(147,51,234,0.3)]
                "
              >
                {/* IMAGE */}
                <motion.img
                  src={cat.image}
                  alt={cat.name}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 1.1, ease: [0.33, 1, 0.68, 1] }}
                  className="h-full w-full object-cover grayscale-[15%] group-hover:grayscale-0"
                />

                {/* SOFT OVERLAY */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-75 group-hover:opacity-90 transition-opacity" />

                {/* CONTENT */}
                <div className="absolute inset-0 p-7 flex flex-col justify-end">
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-purple-300 mb-1">
                    {cat.tag}
                  </span>

                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">
                      {cat.name}
                    </h3>

                    <div className="
                      h-10 w-10 rounded-full bg-white text-black
                      flex items-center justify-center
                      shadow-xl scale-0 group-hover:scale-100
                      transition-all duration-500
                    ">
                      <FiArrowUpRight size={20} />
                    </div>
                  </div>
                </div>

                {/* ACCENT LINE */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenCategories;

