// import React from "react";
// import { motion } from "framer-motion";
// import { FiHeart, FiStar } from "react-icons/fi";
// import { Link } from "react-router-dom";

// const ProductGrid = ({ products }) => {
//   if (!products || products.length === 0) {
//     return (
//       <div className="text-center py-24 text-zinc-400 text-sm font-semibold">
//         No products found.
//       </div>
//     );
//   }

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//       {products.map((product, i) => (
//         <motion.div
//           key={product.id || i}
//           initial={{ opacity: 0, y: 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true }}
//           transition={{ delay: i * 0.03 }}
//           className="group"
//         >
//           <Link
//             to={`/product/${product.slug}`}
//             className="block bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.12)] transition-all duration-500"
//           >
//             {/* IMAGE */}
//             <div className="relative aspect-[3/4] overflow-hidden bg-zinc-100">
//               <img
//                 src={product.image}
//                 alt={product.name}
//                 className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
//               />

//               {/* Wishlist */}
//               <button className="absolute top-3 right-3 h-9 w-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center hover:bg-black hover:text-white transition">
//                 <FiHeart size={16} />
//               </button>

//               {/* Discount Badge */}
//               {product.discount > 0 && (
//                 <div className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded-full">
//                   {product.discount}% OFF
//                 </div>
//               )}
//             </div>

//             {/* CONTENT */}
//             <div className="p-4 space-y-2">
//               <h3 className="text-sm font-bold text-zinc-900 leading-tight line-clamp-2">
//                 {product.name}
//               </h3>

//               <p className="text-[11px] uppercase tracking-widest text-zinc-400">
//                 {product.brand}
//               </p>

//               {/* RATING */}
//               <div className="flex items-center gap-1 text-amber-500 text-xs">
//                 <FiStar />
//                 <span className="font-bold text-zinc-900">
//                   {product.rating || 4.5}
//                 </span>
//                 <span className="text-zinc-400">
//                   ({product.reviews || 120})
//                 </span>
//               </div>

//               {/* PRICE */}
//               <div className="flex items-center gap-2 pt-2">
//                 <span className="text-base font-black text-zinc-900">
//                   ₹{product.finalPrice}
//                 </span>

//                 {product.discount > 0 && (
//                   <span className="text-xs line-through text-zinc-400">
//                     ₹{product.price}
//                   </span>
//                 )}
//               </div>
//             </div>
//           </Link>
//         </motion.div>
//       ))}
//     </div>
//   );
// };

// export default ProductGrid;



import ProductCard from "./ProductCard";

const ProductGrid = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-24 text-zinc-400 text-sm font-semibold">
        No products found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product, i) => (
        <ProductCard
          key={product.id || i}
          product={product}
          index={i}
        />
      ))}
    </div>
  );
};

export default ProductGrid;