import { ArrowLeft, ArrowRight } from "lucide-react";

const Pagination = () => {
  const pages = [1, 2, 3, 4, 5];
  const activePage = 1;

  return (
    <div
      className="flex flex-col items-center justify-between gap-5 pt-6 sm:flex-row"
      style={{ borderTop: "0.5px solid rgba(167,139,250,0.15)", marginTop: "2rem" }}
    >
      {/* Previous */}
      <button
        className="inline-flex items-center gap-2 font-medium transition-all duration-200"
        style={{
          padding: "9px 18px",
          borderRadius: "100px",
          fontSize: "13px",
          border: "0.5px solid rgba(139,92,246,0.22)",
          background: "rgba(245,243,255,0.5)",
          color: "#64748b",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.color = "#7c3aed"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)"; e.currentTarget.style.color = "#64748b"; }}
      >
        <ArrowLeft size={14} /> Previous
      </button>

      {/* Page numbers */}
      <div className="flex items-center gap-1.5">
        {pages.map((page) => (
          <button
            key={page}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "var(--radius,8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "13px",
              fontWeight: 500,
              border: page === activePage ? "none" : "0.5px solid rgba(139,92,246,0.2)",
              background: page === activePage
                ? "linear-gradient(135deg,#7c3aed,#ec4899)"
                : "rgba(245,243,255,0.5)",
              color: page === activePage ? "#fff" : "#64748b",
              cursor: "pointer",
              transition: "all 0.2s ease",
              boxShadow: page === activePage ? "0 4px 14px rgba(124,58,237,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (page !== activePage) {
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.45)";
                e.currentTarget.style.color = "#7c3aed";
              }
            }}
            onMouseLeave={(e) => {
              if (page !== activePage) {
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
                e.currentTarget.style.color = "#64748b";
              }
            }}
          >
            {page}
          </button>
        ))}

        <span style={{ color: "#94a3b8", fontSize: "13px", padding: "0 4px" }}>…</span>

        <button
          style={{
            width: "36px", height: "36px", borderRadius: "var(--radius,8px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 500,
            border: "0.5px solid rgba(139,92,246,0.2)",
            background: "rgba(245,243,255,0.5)",
            color: "#64748b", cursor: "pointer", transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.45)"; e.currentTarget.style.color = "#7c3aed"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)"; e.currentTarget.style.color = "#64748b"; }}
        >
          18
        </button>
      </div>

      {/* Next */}
      <button
        className="inline-flex items-center gap-2 font-medium transition-all duration-200"
        style={{
          padding: "9px 18px",
          borderRadius: "100px",
          fontSize: "13px",
          border: "0.5px solid rgba(139,92,246,0.22)",
          background: "rgba(245,243,255,0.5)",
          color: "#64748b",
          cursor: "pointer",
          backdropFilter: "blur(4px)",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.color = "#7c3aed"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)"; e.currentTarget.style.color = "#64748b"; }}
      >
        Next <ArrowRight size={14} />
      </button>
    </div>
  );
};

export default Pagination;