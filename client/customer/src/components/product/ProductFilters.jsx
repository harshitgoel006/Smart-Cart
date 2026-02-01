import React from "react";
import { FiChevronDown } from "react-icons/fi";

const CATEGORY_MAP = {
  men: ["T-Shirts", "Shirts", "Pants", "Hoodies"],
  women: ["Dresses", "Tops", "Ethnic", "Bottoms"],
  fashion: ["Trending", "New Arrivals"],
  electronics: ["Mobiles", "Laptops", "Accessories"],
  beauty: ["Skincare", "Makeup", "Haircare"],
  "home-living": ["Furniture", "Decor", "Kitchen"],
  grocery: ["Fruits", "Vegetables", "Daily Needs"],
  sports: ["Gym", "Outdoor", "Footwear"],
  kids: ["Boys", "Girls", "Toys"],
  accessories: ["Bags", "Watches", "Jewelry"],
  gifts: ["Birthday", "Anniversary"],
};

const RATINGS = [4, 3, 2, 1];

const ProductFilters = ({ selected, onChange }) => {
  const { category, subCategory, minPrice, maxPrice, rating } = selected;

  return (
    <div className="bg-white rounded-3xl border border-zinc-100 p-6 space-y-10 shadow-sm">

      {/* CATEGORY */}
      <div>
        <h4 className="text-sm font-black uppercase tracking-widest mb-4">
          Category
        </h4>

        <div className="space-y-2">
          {Object.keys(CATEGORY_MAP).map((cat) => (
            <button
              key={cat}
              onClick={() => onChange("category", cat)}
              className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  category === cat
                    ? "bg-black text-white"
                    : "hover:bg-zinc-100"
                }`}
            >
              {cat.replace("-", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* SUB CATEGORY */}
      {category && (
        <div>
          <h4 className="text-sm font-black uppercase tracking-widest mb-4">
            Sub Category
          </h4>

          <div className="space-y-2">
            {CATEGORY_MAP[category]?.map((sub) => (
              <button
                key={sub}
                onClick={() => onChange("sub", sub)}
                className={`w-full text-left px-4 py-2 rounded-xl text-sm font-medium transition
                  ${
                    subCategory === sub
                      ? "bg-zinc-900 text-white"
                      : "hover:bg-zinc-100"
                  }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* PRICE */}
      <div>
        <h4 className="text-sm font-black uppercase tracking-widest mb-4">
          Price
        </h4>

        <div className="flex gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice || ""}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice || ""}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="w-full rounded-xl border px-4 py-2 text-sm"
          />
        </div>
      </div>

      {/* RATING */}
      <div>
        <h4 className="text-sm font-black uppercase tracking-widest mb-4">
          Rating
        </h4>

        <div className="space-y-2">
          {RATINGS.map((r) => (
            <button
              key={r}
              onClick={() => onChange("rating", r)}
              className={`w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm transition
                ${
                  rating === r
                    ? "bg-black text-white"
                    : "hover:bg-zinc-100"
                }`}
            >
              {r}+ Stars
              <FiChevronDown className="opacity-40" />
            </button>
          ))}
        </div>
      </div>

      {/* CLEAR */}
      <button
        onClick={() => {
          onChange("category", null);
          onChange("sub", null);
          onChange("minPrice", null);
          onChange("maxPrice", null);
          onChange("rating", null);
        }}
        className="w-full py-3 rounded-xl border text-sm font-bold hover:bg-zinc-100 transition"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilters;