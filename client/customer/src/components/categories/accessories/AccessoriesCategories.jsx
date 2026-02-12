import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";


// the categories and their details for the accessories section

const categories = [
  {
    name: "Bags",
    slug: "bags",
    tag: "Totes, Slings & Clutches",
    image:
      "https://i.pinimg.com/736x/53/74/a9/5374a900ea5aadf62dc69fef6af867ef.jpg", // Elegant handbag
  },
  {
    name: "Jewellery",
    slug: "jewellery",
    tag: "Necklaces, Rings & Earrings",
    image:
      "https://i.pinimg.com/736x/03/db/c0/03dbc0514eaa6080f9e617f2f06956d4.jpg", // Diamond/Gold jewellery
  },
  {
    name: "Sunglasses",
    slug: "sunglasses",
    tag: "Aviators, Wayfarers & More",
    image:
      "https://i.pinimg.com/736x/fc/6b/c3/fc6bc3ff7682bbffa9e73d83f2c42459.jpg", // Premium sunglasses
  },
  {
    name: "Watches",
    slug: "watches",
    tag: "Luxury & Smart Wearables",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=900&auto=format&fit=crop", // Luxury watch
  },
  {
    name: "Belts & Wallets",
    slug: "belts-wallets",
    tag: "Leather Essentials",
    image:
      "https://i.pinimg.com/736x/d4/e0/32/d4e032a79c50383c1114c468a3e9128a.jpg", // Leather wallet/belt
  },
  {
    name: "Hairwear",
    slug: "hairwear",
    tag: "Clips, Bands & Stylers",
    image:
      "https://i.pinimg.com/736x/d1/c9/e6/d1c9e6282087c2f3cfd5e573619d29fa.jpg", // Hair accessories
  },
];


// the main component for the accessories categories section, showcasing the different subcategories with a stylish and interactive design

const AccessoriesCategories = () => {
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
              The Final Touches
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
              FASHION <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                ACCESSORIES
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed"
            >
              From Chic to Edgy - All Finds the Perfect Fit.
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
                to={`/products?category=accessories&sub=${cat.slug}`}
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

export default AccessoriesCategories;