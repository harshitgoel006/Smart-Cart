import React from "react";
import { FiChevronDown } from "react-icons/fi";

const SORT_OPTIONS = [
  { value: "latest", label: "Latest Arrivals" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "discount", label: "Best Discount" },
];

const ProductSort = ({ value, onChange }) => {
  return (
    <div className="relative w-full md:w-[260px]">
      
      {/* Label */}
      <span className="absolute -top-2 left-4 bg-[#fafafa] px-2 text-[10px] font-black tracking-widest uppercase text-zinc-400">
        Sort By
      </span>

      {/* Select */}
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-white border border-zinc-200 rounded-2xl
          px-5 py-3 text-sm font-semibold text-zinc-900
          focus:outline-none focus:ring-4 focus:ring-purple-100
          hover:border-zinc-300 transition-all"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Icon */}
        <FiChevronDown
          className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
          size={18}
        />
      </div>
    </div>
  );
};

export default ProductSort;