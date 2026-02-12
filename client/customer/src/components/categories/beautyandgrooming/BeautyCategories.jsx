import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";


// High-quality, royalty-free images sourced from Unsplash and Pinterest to perfectly complement the beauty and grooming theme. Each image is carefully selected to evoke a sense of luxury, care, and transformation, enhancing the visual appeal of the categories while maintaining a cohesive aesthetic with

const categories = [
  {
    name: "Skincare",
    slug: "skincare",
    tag: "Serums, Sunscreens & Glow",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=900&auto=format&fit=crop", 
  },
  {
    name: "Makeup",
    slug: "makeup",
    tag: "Lipsticks, Mascara & Essentials",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=900&auto=format&fit=crop", 
  },
  {
    name: "Hair Care",
    slug: "haircare",
    tag: "Shampoos, Oils & Serums",
    image:
      "https://i.pinimg.com/736x/60/fe/4a/60fe4a9f6b431e0d1698c59cbfb1c868.jpg", 
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    tag: "Luxury Scents & Perfumes",
    image:
      "https://i.pinimg.com/736x/54/e3/c7/54e3c7710e921b35589fe1c172b0b6a3.jpg", 
  },
  {
    name: "Men's Grooming",
    slug: "mens-grooming",
    tag: "Trimmers, Beards & Care",
    image:
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=900&auto=format&fit=crop", 
  },
  {
    name: "Bath & Body",
    slug: "bath-body",
    tag: "Lotions, Scrubs & Hygiene",
    image:
      "https://i.pinimg.com/1200x/0e/3d/b7/0e3db7437cfdee435fffc286adcb4d39.jpg", 
  },
];


// This component presents a visually stunning and engaging section for the "Beauty & Grooming" categories. It features a dynamic header with a gradient-highlighted title, a curated selection of categories displayed in an elegant grid layout, and subtle animated background elements that enhance the overall aesthetic without overpowering the content. Each category card includes a high-quality image, a descriptive tag, and an interactive hover effect that invites users to explore further. The design maintains a cohesive and luxurious feel, perfectly aligning with the theme of beauty and grooming.
const BeautyCategories = () => {
  return (
    <section className="relative py-20 bg-[#fdfdfd] overflow-hidden">
      
      {/* LIGHT AMBIENT BACKGROUND (Original Men's Palette preserved) */}
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
              Curated Selection
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
              BEAUTY & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 uppercase">
                Grooming
              </span>
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="max-w-xs text-sm font-bold text-gray-400 uppercase tracking-widest leading-relaxed"
            >
              Simple Care. Stunning Results.
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
                to={`/products?category=beauty&sub=${cat.slug}`}
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

                {/* ACCENT LINE (Original Purple/Pink) */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BeautyCategories;