import { ChevronDown } from "lucide-react";
import { productFiltersData } from "../../../content/products/productFiltersData";

const ProductFilterSidebar = () => {
  return (
    <div
      style={{
        background: "var(--surface-2,#fff)",
        border: "0.5px solid rgba(167,139,250,0.15)",
        borderRadius: "16px",
        padding: "1.2rem",
      }}
    >
      {/* Heading */}
      <div
        className="flex items-center justify-between mb-5 pb-4"
        style={{ borderBottom: "0.5px solid rgba(167,139,250,0.12)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="h-[2px] w-8 rounded-full flex-shrink-0"
            style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
          />
          <h2 style={{ fontSize: "14px", fontWeight: 600, color: "#1e1b4b", letterSpacing: "-0.01em" }}>
            Filters
          </h2>
        </div>
        <button
          style={{ fontSize: "11px", fontWeight: 600, color: "#7c3aed", background: "none", border: "none", cursor: "pointer", letterSpacing: "0.04em" }}
        >
          Clear all
        </button>
      </div>

      {/* Sections */}
      <div className="flex flex-col">
        {productFiltersData.map((section, idx) => (
          <div
            key={section.title}
            className="py-4"
            style={{
              borderBottom: idx < productFiltersData.length - 1 ? "0.5px solid rgba(167,139,250,0.1)" : "none",
            }}
          >
            {/* Section header */}
            <button className="flex w-full items-center justify-between mb-3">
              <h3
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  color: "#7c3aed",
                }}
              >
                {section.title}
              </h3>
              <ChevronDown size={14} style={{ color: "#94a3b8" }} />
            </button>

            {/* Options */}
            <div className="flex flex-col gap-2.5">
              {section.options.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-center gap-2.5 group"
                >
                  <input
                    type={section.type}
                    name={section.id}
                    className="h-3.5 w-3.5 rounded flex-shrink-0"
                    style={{ accentColor: "#7c3aed" }}
                  />
                  <span
                    className="transition-colors duration-200 group-hover:text-violet-700"
                    style={{ fontSize: "13px", color: "#64748b" }}
                  >
                    {option}
                  </span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductFilterSidebar;