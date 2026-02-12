import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// DATA FOR THE CATEGORIES - CAN BE EXPANDED WITH MORE ENTRIES

const categories = [
  {
    name: "Smartphones",
    slug: "smartphones",
    tag: "Latest Gen & Flagships",
    image:
      "https://i.pinimg.com/736x/52/a3/ac/52a3ac8d66f5d853184a0c5b00ce0d33.jpg", 
  },
  {
    name: "Laptops",
    slug: "laptops",
    tag: "Workstations & Gaming",
    image:
      "https://i.pinimg.com/1200x/fe/f7/b3/fef7b3cbaeb59afc974ab04dd20741e6.jpg", 
  },
  {
    name: "Audio Devices",
    slug: "audio",
    tag: "Headphones & Speakers",
    image:
      "https://i.pinimg.com/1200x/52/ee/48/52ee488d7a97af2653be9b4f53f0aab6.jpg", 
  },
  {
    name: "Smartwatches",
    slug: "smartwatches",
    tag: "Fitness & Connectivity",
    image:
      "https://i.pinimg.com/1200x/e4/3a/79/e43a7962422ac1eaee2dbd4a4f23a6b5.jpg", 
  },
  {
    name: "Cameras",
    slug: "cameras",
    tag: "DSLR & Action Cams",
    image:
      "https://i.pinimg.com/736x/b2/61/13/b261131de5f2998908ff3859fba8301e.jpg", 
  },
  {
    name: "Smart TV",
    slug: "smart-tv",
    tag: "4K & Home Cinema",
    image:
      "https://i.pinimg.com/736x/20/bb/81/20bb8165c7cd5a5919f66737773783a4.jpg", 
  },
];

// The ElectronicsCategories component renders a visually engaging section showcasing different subcategories of electronics. Each category is displayed as a card with an image, title, and tag. The cards have interactive hover effects that reveal additional details and a call-to-action button, encouraging users to explore the products within each category. The layout is responsive, ensuring a seamless experience across devices.

const ElectronicsCategories = () => {
  return (
    <section className="relative py-20 bg-[#fdfdfd] overflow-hidden">
      
      {/* LIGHT AMBIENT BACKGROUND (TECH THEME) */}
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
              Future Ready
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
              TECH <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                ECOSYSTEM
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed"
            >
              Innovation at your fingertips. Discover the power of smart engineering.
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
                to={`/products?category=electronics&sub=${cat.slug}`}
                className="
                  relative block h-[260px] md:h-[300px] overflow-hidden rounded-[2.5rem]
                  bg-white transition-all duration-700
                  shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_30px_70px_-20px_rgba(37,99,235,0.3)]
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
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-blue-300 mb-1">
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

                {/* ACCENT LINE (BLUE THEME) */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ElectronicsCategories;