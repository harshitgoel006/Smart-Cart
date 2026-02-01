import { motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12">
      
      {/* PREVIOUS */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`h-10 w-10 flex items-center justify-center rounded-full border transition
          ${
            currentPage === 1
              ? "text-zinc-300 border-zinc-200 cursor-not-allowed"
              : "hover:bg-black hover:text-white"
          }`}
      >
        <FiChevronLeft />
      </button>

      {/* PAGE NUMBERS */}
      {pages.map((page) => (
        <motion.button
          key={page}
          whileHover={{ scale: 1.05 }}
          onClick={() => onPageChange(page)}
          className={`h-10 w-10 rounded-full text-sm font-bold transition
            ${
              page === currentPage
                ? "bg-black text-white"
                : "border border-zinc-200 hover:bg-zinc-100"
            }`}
        >
          {page}
        </motion.button>
      ))}

      {/* NEXT */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`h-10 w-10 flex items-center justify-center rounded-full border transition
          ${
            currentPage === totalPages
              ? "text-zinc-300 border-zinc-200 cursor-not-allowed"
              : "hover:bg-black hover:text-white"
          }`}
      >
        <FiChevronRight />
      </button>
    </div>
  );
};

export default Pagination;