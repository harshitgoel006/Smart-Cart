

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiMaximize2 } from "react-icons/fi";

// This is the MenPromoCategories component that displays promotional categories for men. It features a header with a title and a link to view all drops, followed by a grid of category cards. Each card includes a main image, category details, discount information, and floating mini cards for additional products. The component uses Tailwind CSS for styling and Framer Motion for animations to create an engaging user experience.

const categories = [
  {
    title: "Kurta Sets",
    highlight: "Ethnic Luxury",
    discount: "UP TO 60% OFF",
    link: "/products?category=men&sub=ethnic",
    bg: "bg-[#F3E8FF]", 
    shadow: "group-hover:shadow-purple-200",
    mainImage: "https://i.pinimg.com/736x/fd/06/17/fd0617d92b00b3629e2bbf5e6d92c34b.jpg",
    minis: [
      "https://i.pinimg.com/736x/11/76/88/11768892bf8c9a6c694e524610475593.jpg",
      "https://i.pinimg.com/1200x/77/e8/0f/77e80f235206dbb272e58e532a611a8e.jpg",
    ],
  },
  {
    title: "Pants & Trousers",
    highlight: "Tailored Fits",
    discount: "UP TO 45% OFF",
    link: "/products?category=men&sub=bottomwear",
    bg: "bg-[#E0F2FE]", 
    shadow: "group-hover:shadow-blue-200",
    mainImage: "https://i.pinimg.com/736x/46/53/7b/46537b94daee45a0c445553eaba4969e.jpg",
    minis: [
      "https://i.pinimg.com/1200x/6c/51/42/6c514220a4604921eac04b489de49d93.jpg",
      "https://i.pinimg.com/736x/0c/c1/ca/0cc1ca5173849eeaccd53e54535ddaba.jpg",
    ],
  },
  {
    title: "Signature Jackets",
    highlight: "Modern Utility",
    discount: "UP TO 50% OFF",
    link: "/products?category=men&sub=jackets",
    bg: "bg-[#F1F5F9]", 
    shadow: "group-hover:shadow-slate-300",
    mainImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=1000&auto=format&fit=crop",
    minis: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=900&auto=format&fit=crop",
    ],
  },
];

// This is the MenPromoCategories component that displays promotional categories for men. It features a header with a title and a link to view all drops, followed by a grid of category cards. Each card includes a main image, category details, discount information, and floating mini cards for additional products. The component uses Tailwind CSS for styling and Framer Motion for animations to create an engaging user experience.

const MenPromoCategories = () => {
  return (
    <section className="pt-0 pb-18 overflow-hidden ">

      

      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* HEADER SECTION - Reduced Font Size */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <p className="text-[10px] font-black tracking-[0.5em] text-indigo-600 uppercase mb-4">
              Premium Selections
            </p>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-gray-900">
              Men's <span className="italic font-extralight text-gray-300">Style</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">
                Collections
              </span>
            </h2>
          </motion.div>

          <Link
            to="/all-products"
            className="group relative overflow-hidden flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] bg-gray-950 text-white px-10 py-5 rounded-full hover:bg-indigo-600 transition-colors duration-500"
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
                    {/* Glass Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  </div>

                  {/* FLOATING MINI CARDS - Improved Shadows & Hover */}
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

                  {/* CTA BUTTON - Animated Reveal */}
                  <div className="mt-8 relative overflow-hidden h-14">
                    <div className="w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em]
                    bg-gray-950 text-white shadow-xl
                    translate-y-full group-hover:translate-y-0
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    flex justify-center items-center gap-3">
                      Explore {cat.title.split(' ')[0]} <FiShoppingBag className="text-base" />
                    </div>
                    {/* Ghost text for layout height stability */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-[10px] font-black tracking-widest uppercase">Tap to View</span>
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

export default MenPromoCategories;



