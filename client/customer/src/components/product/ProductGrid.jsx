import { motion } from "framer-motion";
import ProductCard from "./ProductCard";

const ProductGrid = ({ products = [] }) => {
  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center">
        <span className="text-xs font-black tracking-[0.5em] text-gray-300 uppercase">Archive Empty</span>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
    >
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;