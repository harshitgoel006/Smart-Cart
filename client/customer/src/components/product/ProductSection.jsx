import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import ProductCard from "./ProductCard";

const ProductSection = ({ title, subtitle, products }) => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-purple-50/40 to-transparent pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-72 h-72 bg-pink-100/10 blur-[80px] rounded-full" />

      <div className="max-w-[1400px] mx-auto px-8 relative z-10">
        
        {/* REFINED HEADER SECTION */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
               <div className="h-[1px] w-8 bg-zinc-300" />
               <span className="text-[9px] font-black tracking-[0.5em] uppercase text-zinc-400">
                 Elite Selection
               </span>
            </div>
            
            {/* Font sizes reduced for a more sophisticated look */}
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight uppercase leading-[0.9] text-zinc-900">
              {title.split(' ')[0]} <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal">
                {title.split(' ').slice(1).join(' ') || "Collection."}
              </span>
            </h2>
            
            {subtitle && (
              <p className="max-w-xs text-gray-400 font-medium text-sm italic font-serif tracking-tight leading-relaxed">
                {subtitle}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Link to="/products" className="group flex items-center gap-5">
              <span className="text-[10px] font-black tracking-[0.3em] uppercase bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent group-hover:opacity-70 transition-opacity">
                Discover All
              </span>
              <div className="relative h-12 w-12 flex items-center justify-center overflow-hidden rounded-xl shadow-lg transition-all duration-500 group-hover:scale-110">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 group-hover:rotate-90 transition-transform duration-500 shadow-[0_0_20px_rgba(147,51,234,0.3)]" />
                <FiArrowRight className="relative z-10 text-white text-lg group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </motion.div>
        </div>

        {/* GRID LAYOUT - Using gap-8 for a tighter grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products && products.slice(0, 8).map((product, idx) => (
            <ProductCard key={product._id || product.id} product={product} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductSection;