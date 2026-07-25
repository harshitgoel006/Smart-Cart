import { X } from "lucide-react";

const activeFilters = [
  "Nike",
  "₹2,000 - ₹5,000",
  "4★ & Above",
  "In Stock",
];

const ActiveFilters = () => {
  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {activeFilters.map((filter) => (
        <button
          key={filter}
          className="group inline-flex items-center gap-1.5 font-medium transition-all duration-200"
          style={{
            fontSize: "12px",
            padding: "4px 12px",
            borderRadius: "100px",
            background: "rgba(237,233,254,0.8)",
            border: "0.5px solid rgba(139,92,246,0.28)",
            color: "#6d28d9",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(237,233,254,1)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(237,233,254,0.8)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)";
          }}
        >
          {filter}
          <X
            size={13}
            className="transition-transform duration-200 group-hover:rotate-90"
          />
        </button>
      ))}

      <button
        className="ml-1 transition-colors duration-200"
        style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", background: "none", border: "none", cursor: "pointer" }}
        onMouseEnter={(e) => { e.currentTarget.style.color = "#dc2626"; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; }}
      >
        Clear all
      </button>
    </div>
  );
};

export default ActiveFilters;