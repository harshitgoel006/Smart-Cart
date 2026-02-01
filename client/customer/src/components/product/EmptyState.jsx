import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full flex flex-col items-center justify-center py-24 text-center"
    >
      {/* ICON */}
      <div className="h-16 w-16 rounded-full bg-zinc-100 flex items-center justify-center mb-6">
        <FiSearch className="text-2xl text-zinc-400" />
      </div>

      {/* TITLE */}
      <h3 className="text-xl font-black text-zinc-900 mb-2">
        No products found
      </h3>

      {/* DESCRIPTION */}
      <p className="text-sm text-zinc-500 max-w-md">
        We couldn’t find any products matching your filters or search.
        Try adjusting filters or searching with a different keyword.
      </p>
    </motion.div>
  );
};

export default EmptyState;