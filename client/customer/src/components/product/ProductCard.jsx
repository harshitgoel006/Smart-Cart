import { FiStar, FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProductCard = ({ product, idx }) => {
  const calculateDiscount = (price, mrp) => Math.round(((mrp - price) / mrp) * 100);
  
  // Uniform Pricing logic
  const currentPrice = product.price || product.finalPrice;
  const originalPrice = product.mrp || product.price;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: idx * 0.05, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="group bg-white rounded-[2rem] p-3 border border-gray-100 hover:border-purple-200 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(147,51,234,0.12)] relative flex flex-col h-full"
    >
      {/* IMAGE SECTION - FIXED HEIGHT & ASPECT */}
      <div className="relative aspect-square w-full overflow-hidden rounded-[1.5rem] bg-[#F9FAFB] flex-shrink-0">
        <Link to={`/product/${product.id || product.slug}`} className="block h-full w-full">
          <motion.img
            src={product.image || product.images?.[0]?.url}
            alt={product.name}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full object-cover object-center"
          />
        </Link>

        {/* TOP OVERLAYS */}
        <div className="absolute top-3 inset-x-3 flex justify-between items-start pointer-events-none">
          <span className="bg-white/95 backdrop-blur-md text-pink-600 text-[9px] font-black px-2.5 py-1 rounded-lg shadow-sm uppercase tracking-tighter pointer-events-auto">
            {calculateDiscount(currentPrice, originalPrice)}% OFF
          </span>
          
          <div className="flex flex-col gap-1.5 translate-x-10 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500 pointer-events-auto">
            <button className="h-9 w-9 rounded-xl bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all">
              <FiHeart size={16} />
            </button>
            <button className="h-9 w-9 rounded-xl bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-500 hover:text-white transition-all">
              <FiEye size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* INFO SECTION - FLEX GROW ensures content alignment */}
      <div className="mt-4 px-1 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-1 bg-orange-50 px-2 py-0.5 rounded-md">
            <FiStar className="text-orange-500 fill-orange-500" size={10} />
            <span className="text-[10px] font-black text-orange-700">{product.rating || product.ratings || "4.5"}</span>
          </div>
          <span className="text-[9px] font-black tracking-[0.2em] text-zinc-400 uppercase truncate">
            {product.badge || "Premium"}
          </span>
        </div>

        <Link
          to={`/product/${product.id || product.slug}`}
          className="block font-bold text-gray-900 text-base tracking-tight leading-tight hover:text-purple-600 transition-colors uppercase line-clamp-2 min-h-[2.5rem]"
        >
          {product.name}
        </Link>

        {/* BOTTOM ACTION AREA */}
        <div className="mt-auto pt-4 flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <span className="text-xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent italic">
              ₹{currentPrice.toLocaleString()}
            </span>
            <span className="text-[10px] font-bold text-gray-400 line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          </div>

          {/* ADD TO CART - COMPACT MECHANICAL BUTTON */}
          <button className="group/btn relative h-11 w-11 overflow-hidden rounded-xl transition-all duration-500 hover:w-[100px] shadow-lg shadow-purple-500/10">
  
  {/* 1. Base Gradient Layer (Always there, but evolves on hover) */}
  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 transition-all duration-500" />

  {/* 2. Overlay to manage the "Black to Gradient" transition if you still want a dark start, 
      OR remove this div if you want it ALWAYS gradient */}
  <div className="absolute inset-0 bg-zinc-900 group-hover:opacity-0 transition-opacity duration-500" />

  {/* 3. Content Layer */}
  <div className="absolute inset-0 flex items-center justify-center gap-2 text-white px-3 z-10">
    <FiShoppingCart size={18} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
    <span className="hidden group-hover/btn:block text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
      ADD
    </span>
  </div>

  {/* 4. Glow effect on hover */}
  <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
</button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;