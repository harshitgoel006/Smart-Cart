import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const categories = [
  {
    name: "Topwear",
    slug: "topwear",
    tag: "Tees, Shirts & Polos",
    image:
      "https://i.pinimg.com/1200x/49/47/d7/4947d770629f8232c1d48360ed2a48c9.jpg", // kids topwear
  },
  {
    name: "Bottomwear",
    slug: "bottomwear",
    tag: "Jeans, Shorts & Cargos",
    image:
      "https://i.pinimg.com/1200x/5c/72/99/5c7299b788bb2179e523321acb58ad6a.jpg", // kids jeans
  },
  {
    name: "Footwear",
    slug: "footwear",
    tag: "Sneakers, Crocs & Sandals",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?q=80&w=900&auto=format&fit=crop", // kids shoes
  },
  {
    name: "Infant Wear",
    slug: "infant",
    tag: "Onesies & Baby Sets",
    image:
      "https://i.pinimg.com/1200x/06/68/7c/06687cdd062e1e3f78bd0b636890d833.jpg", // infant wear
  },
  {
    name: "Ethnic Wear",
    slug: "ethnic",
    tag: "Kurtas & Festive Frocks",
    image:
      "https://i.pinimg.com/736x/22/4a/44/224a44b65601f3b56df70bd72c034346.jpg", // kids ethnic
  },
  {
    name: "Sleep Wear",
    slug: "sleepwear",
    tag: "Comfy Pyjamas & Robes",
    image:
      "https://i.pinimg.com/736x/53/26/2e/53262e1af122f74f0f1c962743a54f17.jpg", // kids sleepwear
  },
];

const KidsCategories = () => {
  return (
    <section className="relative py-20 bg-[#fdfdfd] overflow-hidden">
      
      {/* LIGHT AMBIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, 20, 0] }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute -top-[15%] -left-[10%] w-[45%] h-[45%] bg-puple-200/30 rounded-full blur-[140px]" 
        />
        <motion.div 
          animate={{ x: [0, -30, 0], y: [0, -30, 0] }}
          transition={{ duration: 18, repeat: Infinity }}
          className="absolute top-[25%] -right-[10%] w-[40%] h-[40%] bg-pink-200/25 rounded-full blur-[140px]" 
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
              Curated for Little Ones
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
              KIDS' <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-red-400">
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
              Playful fits for everyday joy. Designed for the little adventurers.
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
                to={`/products?category=kids&sub=${cat.slug}`}
                className="
                  relative block h-[260px] md:h-[300px] overflow-hidden rounded-[2.5rem]
                  bg-white transition-all duration-700
                  shadow-[0_15px_40px_-15px_rgba(0,0,0,0.12)]
                  hover:shadow-[0_30px_70px_-20px_rgba(249,115,22,0.3)]
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
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-puple-300 mb-1">
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
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-gradient-to-r from-purple-500 to-pink-400 group-hover:w-full transition-all duration-700" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default KidsCategories;