import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiMaximize2 } from "react-icons/fi";

// DATA FOR THE CATEGORIES - CAN BE EXPANDED WITH MORE ENTRIES
const categories = [
  {
    title: "Flagship Phones",
    highlight: "Next-Gen Tech",
    discount: "UP TO 70% OFF",
    link: "/products?category=electronics&sub=smartphones",
    bg: "bg-[#E0F2FE]", // Soft Tech Blue
    shadow: "group-hover:shadow-blue-200",
    mainImage: "https://i.pinimg.com/1200x/2d/b6/4e/2db64eb929ceb1e37ce77331f2f841f8.jpg",
    minis: [
      "https://i.pinimg.com/1200x/09/96/7b/09967b0094781f8c0b45e6c6ad313a4d.jpg",
      "https://images.unsplash.com/photo-1573148195900-7845dcb9b127?q=80&w=400&auto=format&fit=crop",
    ],
  },
  {
    title: "Premium Audio",
    highlight: "Immersive Sound",
    discount: "UP TO 80% OFF",
    link: "/products?category=electronics&sub=audio",
    bg: "bg-[#F3E8FF]", // Soft Indigo/Purple
    shadow: "group-hover:shadow-purple-200",
    mainImage: "https://i.pinimg.com/1200x/ee/e1/a8/eee1a87fbe7955f8a1812359542302c5.jpg",
    minis: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
      "https://i.pinimg.com/736x/ca/87/74/ca877469a795ddfafbc24c6cbbd4c28a.jpg",
    ],
  },
  {
    title: "Pro Cameras",
    highlight: "Capture Reality",
    discount: "UP TO 50% OFF",
    link: "/products?category=electronics&sub=cameras",
    bg: "bg-[#F1F5F9]", // Slate Gray
    shadow: "group-hover:shadow-slate-300",
    mainImage: "https://i.pinimg.com/1200x/c8/17/8b/c8178bfbaabadfb18b0353b0d497c0c4.jpg",
    minis: [
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=400&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?q=80&w=400&auto=format&fit=crop",
    ],
  },
];

// The ElectronicsPromoCategories component renders a visually engaging section showcasing different subcategories of electronics. Each category is displayed as a card with an image, title, and tag. The cards have interactive hover effects that reveal additional details and a call-to-action button, encouraging users to explore the products within each category. The layout is responsive, ensuring a seamless experience across devices.
const ElectronicsPromoCategories = () => {
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
            <p className="text-[10px] font-black tracking-[0.5em] text-purple-600 uppercase mb-4">
              Innovation Selections
            </p>

            <h2 className="text-4xl md:text-5xl font-black leading-[1.1] tracking-tighter text-gray-900">
              Tech <span className="italic font-extralight text-gray-300">Elite</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-rose-500">
                Collections
              </span>
            </h2>
          </motion.div>

          <Link
            to="/all-products"
            className="group relative overflow-hidden flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] bg-gray-950 text-white px-10 py-5 rounded-full hover:bg-purple-600 transition-colors duration-500"
          >
            <span className="relative z-10">View All Gadgets</span>
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
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
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
                      Explore {cat.title.split(' ')[0]} <FiShoppingBag className="text-base" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-0 transition-opacity duration-300">
                      <span className="text-[10px] font-black tracking-widest uppercase">Inspect Tech</span>
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

export default ElectronicsPromoCategories;