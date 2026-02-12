import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiMaximize2 } from "react-icons/fi";

// Data structure for fashion categories with enhanced visuals and interactions

const categories = [
  {
    title: "Women's Ethnic",
    highlight: "Heritage Luxe",
    discount: "UP TO 60% OFF",
    link: "/products?category=women&sub=ethnic",
    bg: "bg-[#FFF1F2]", // Rose tint
    shadow: "group-hover:shadow-rose-200",
    mainImage: "https://i.pinimg.com/1200x/57/e1/00/57e10012267063c71391a29b57b05765.jpg",
    minis: [
      "https://i.pinimg.com/736x/b2/31/83/b231839cbae841164056c92d0bdb6035.jpg",
      "https://i.pinimg.com/736x/f6/de/c9/f6dec954628d8e67470adea09cb20d68.jpg",
    ],
  },
  {
    title: "Men's Streetwear",
    highlight: "Urban Utility",
    discount: "UP TO 45% OFF",
    link: "/products?category=men&sub=streetwear",
    bg: "bg-[#F0F9FF]", // Sky tint
    shadow: "group-hover:shadow-blue-200",
    mainImage: "https://i.pinimg.com/736x/84/ee/aa/84eeaaeb62cc924425a413dfa2eb8d80.jpg",
    minis: [
      "https://i.pinimg.com/736x/46/53/7b/46537b94daee45a0c445553eaba4969e.jpg",
      "https://i.pinimg.com/736x/4c/92/85/4c9285328feb2026d1ea920714e3a095.jpg",
    ],
  },
  {
    title: "Junior Fashion",
    highlight: "Playful Comfort",
    discount: "FLAT 50% OFF",
    link: "/products?category=kids",
    bg: "bg-[#F5F3FF]", // Violet tint
    shadow: "group-hover:shadow-purple-200",
    mainImage: "https://i.pinimg.com/736x/53/d3/c6/53d3c6dc945a8e3a6ae80eaf9dd074b3.jpg",
    minis: [
      "https://i.pinimg.com/1200x/f4/30/9d/f4309d7342a0f613863f963b404c0358.jpg",
      "https://i.pinimg.com/1200x/a5/30/07/a53007cc1ebdaa2500959c3ce5fa22a4.jpg",
    ],
  },
];


// FashionPromoCategories component with enhanced design, animations, and interactivity

const FashionPromoCategories = () => {
  return (
    <section className="pt-0 pb-18 overflow-hidden ">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <p className="text-[10px] font-black tracking-[0.5em] text-rose-600 uppercase mb-4">
              Premium Selections
            </p>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-gray-900">
              Lifestyle <span className="italic font-extralight text-gray-300">Curations</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-500">
                For Everyone
              </span>
            </h2>
          </motion.div>

          <Link
            to="/all-products"
            className="group relative overflow-hidden flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] bg-gray-950 text-white px-10 py-5 rounded-full hover:bg-rose-600 transition-colors duration-500"
          >
            <span className="relative z-10">View All Drops</span>
            <FiArrowRight className="relative z-10 text-lg group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14">
          {categories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ 
                delay: idx * 0.1, 
                duration: 1, 
                type: "spring", 
                stiffness: 50 
              }}
              className="group relative h-[650px]"
            >
              <Link to={cat.link} className="block h-full">
                <div
                  className={`relative h-full w-full rounded-[3.5rem] ${cat.bg} p-8 md:p-10 flex flex-col
                  transition-all duration-700 ease-out
                  group-hover:shadow-[0_80px_100px_-30px] ${cat.shadow}
                  border border-white/60`}
                >
                  
                  {/* TEXT TOP SECTION */}
                  <div className="z-20">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[9px] font-black tracking-[0.4em] text-gray-500/80 uppercase mb-2">
                          {cat.highlight}
                        </p>
                        <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900 leading-none">
                          {cat.title}
                        </h3>
                      </div>

                      <motion.div 
                        whileHover={{ rotate: 90 }}
                        className="w-11 h-11 rounded-full border border-gray-300/50 flex items-center justify-center bg-white/20 backdrop-blur-sm group-hover:bg-white transition-all duration-500"
                      >
                        <FiMaximize2 className="text-gray-900" />
                      </motion.div>
                    </div>

                    <div className="inline-flex items-center gap-2 mt-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-white/50">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      <span className="text-[10px] font-black text-gray-900 uppercase">
                        {cat.discount}
                      </span>
                    </div>
                  </div>

                  {/* MAIN IMAGE FRAME */}
                  <div className="relative flex-1 mt-8 rounded-[2.5rem] overflow-hidden border-[10px] border-white shadow-2xl group-hover:border-white/80 transition-all duration-700">
                    <motion.img
                      src={cat.mainImage}
                      alt={cat.title}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.12 }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* FLOATING MINI CARDS */}
                  <div className="absolute right-[-12px] top-[35%] flex flex-col gap-5 z-30">
                    {cat.minis.map((img, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: 20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.5 + (i * 0.2) }}
                        whileHover={{ scale: 1.15, x: -8, rotate: i % 2 === 0 ? 2 : -2 }}
                        className="w-22 h-28 md:w-24 md:h-32 rounded-[1.4rem] bg-white p-1 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)] border border-white"
                      >
                        <img
                          src={img}
                          alt="mini"
                          className="w-full h-full object-cover rounded-[1.1rem]"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* CTA BUTTON */}
                  <div className="mt-8 relative overflow-hidden h-14">
                    <div className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]
                    bg-gray-950 text-white shadow-xl
                    translate-y-full group-hover:translate-y-0
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    flex justify-center items-center gap-3">
                      Shop {cat.title.split(' ')[0]} <FiShoppingBag className="text-base" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-[10px] font-black tracking-widest uppercase">Explore More</span>
                    </div>
                  </div>

                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionPromoCategories;