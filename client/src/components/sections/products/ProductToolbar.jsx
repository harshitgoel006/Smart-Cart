import { SlidersHorizontal, Grid2X2, List } from "lucide-react";
import { productSortOptions } from "../../../content/products/productSortOptions";

const ProductToolbar = () => {
  return (
    <div
      className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      style={{
        background: "linear-gradient(160deg,#faf7ff,#fff)",
        border: "0.5px solid rgba(167,139,250,0.15)",
        borderRadius: "14px",
        padding: "0.9rem 1.1rem",
      }}
    >
      {/* Count */}
      <p style={{ fontSize: "13px", color: "#64748b" }}>
        Showing{" "}
        <span style={{ fontWeight: 600, color: "#1e1b4b" }}>1–24</span>
        {" "}of{" "}
        <span style={{ fontWeight: 600, color: "#1e1b4b" }}>2,384</span>
        {" "}products
      </p>

      {/* Right controls */}
      <div className="flex flex-wrap items-center gap-3">

        {/* Sort */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} style={{ color: "#7c3aed" }} />
          <select
            style={{
              border: "0.5px solid rgba(139,92,246,0.25)",
              background: "rgba(245,243,255,0.6)",
              color: "#1e1b4b",
              borderRadius: "100px",
              padding: "5px 12px",
              fontSize: "12.5px",
              outline: "none",
              cursor: "pointer",
            }}
          >
            {productSortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* View toggle */}
        <div
          className="flex overflow-hidden"
          style={{ borderRadius: "var(--radius,8px)", border: "0.5px solid rgba(139,92,246,0.22)" }}
        >
          {[
            { Icon: Grid2X2, label: "Grid view", active: true },
            { Icon: List, label: "List view", active: false },
          ].map(({ Icon, label, active }) => (
            <button
              key={label}
              aria-label={label}
              style={{
                padding: "7px",
                border: "none",
                cursor: "pointer",
                background: active
                  ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                  : "rgba(245,243,255,0.5)",
                color: active ? "#fff" : "#94a3b8",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductToolbar;