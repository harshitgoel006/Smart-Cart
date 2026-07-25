import { SearchX } from "lucide-react";

const EmptyState = () => {
  return (
    <div
      className="flex flex-col items-center justify-center text-center"
      style={{
        padding: "4rem 2rem",
        borderRadius: "16px",
        border: "0.5px dashed rgba(139,92,246,0.3)",
        background: "linear-gradient(160deg,#faf7ff,#fff)",
      }}
    >
      {/* Icon in gradient circle */}
      <div
        className="flex items-center justify-center mb-6"
        style={{
          width: "72px",
          height: "72px",
          borderRadius: "50%",
          background: "linear-gradient(135deg,rgba(124,58,237,0.1),rgba(236,72,153,0.08))",
          border: "1px solid rgba(139,92,246,0.18)",
        }}
      >
        <SearchX size={32} style={{ color: "#a855f7" }} />
      </div>

      <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#1e1b4b", marginBottom: "0.6rem" }}>
        No products found
      </h2>

      <p style={{ maxWidth: "22rem", color: "#64748b", fontSize: "13.5px", lineHeight: 1.75, marginBottom: "1.8rem" }}>
        We couldn't find any products matching your selected filters.
        Try changing your filters or clearing them to explore more.
      </p>

      <button
        className="inline-flex items-center gap-2 font-medium text-white relative overflow-hidden"
        style={{
          padding: "11px 24px",
          borderRadius: "100px",
          fontSize: "13px",
          border: "none",
          cursor: "pointer",
          background: "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
          boxShadow: "0 6px 20px rgba(109,40,217,0.3)",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 28px rgba(109,40,217,0.42)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 20px rgba(109,40,217,0.3)"; }}
      >
        Clear filters
      </button>
    </div>
  );
};

export default EmptyState;