import ProductFilterSidebar from "../../components/sections/products/ProductFilterSidebar";
import ProductToolbar from "../../components/sections/products/ProductToolbar";
import ActiveFilters from "../../components/sections/products/ActiveFilters";
import ProductGrid from "../../components/sections/products/ProductGrid";
import Pagination from "../../components/sections/products/Pagination";
import { useSearchParams } from "react-router-dom";
import { productListingPageData } from "../../content/products/productListingPageData";

const ProductListingPage = () => {
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category") || "men";

  const pageData =
    productListingPageData[category] ?? productListingPageData.men;

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      {/* ── Breadcrumb ── */}
      <div
        className="mb-5 flex items-center gap-2"
        style={{ fontSize: "12px" }}
      >
        {pageData.breadcrumb.map((crumb, i, arr) => (
          <span key={crumb} className="flex items-center gap-2">
            <span
              style={{
                color: i === arr.length - 1 ? "#1e1b4b" : "#94a3b8",
                fontWeight: i === arr.length - 1 ? 500 : 300,
                cursor: i < arr.length - 1 ? "pointer" : "default",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => {
                if (i < arr.length - 1) {
                  e.currentTarget.style.color = "#7c3aed";
                }
              }}
              onMouseLeave={(e) => {
                if (i < arr.length - 1) {
                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              {crumb}
            </span>

            {i < arr.length - 1 && (
              <span
                style={{
                  color: "rgba(167,139,250,0.45)",
                  fontSize: "10px",
                }}
              >
                ›
              </span>
            )}
          </span>
        ))}
      </div>

      {/* ── Category Header ── */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div
            className="h-[2px] w-12 rounded-full"
            style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
          />
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#7c3aed",
            }}
          >
            Collection
          </span>
        </div>

        <div className="flex items-end justify-between gap-4">
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem,5vw,3.8rem)",
              fontWeight: 500,
              lineHeight: 1.02,
              letterSpacing: "-0.02em",
              background:
                "linear-gradient(140deg,#1e1b4b 0%,#5b21b6 40%,#a21caf 72%,#be185d 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {pageData.title}
          </h1>

          <span
            style={{
              fontSize: "12px",
              color: "#94a3b8",
              fontWeight: 300,
              letterSpacing: "0.04em",
              paddingBottom: "0.4rem",
              flexShrink: 0,
            }}
          >
            {pageData.productCount.toLocaleString()} products
          </span>
        </div>
      </div>

      {/* ── Sub-category chips ── */}
      <div className="mb-8 flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {pageData.chips.map((item, idx) => (
          <button
            key={item}
            style={{
              flexShrink: 0,
              padding: "7px 18px",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: idx === 0 ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.22s ease",
              border: idx === 0 ? "none" : "0.5px solid rgba(139,92,246,0.22)",
              background:
                idx === 0
                  ? "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)"
                  : "rgba(245,243,255,0.6)",
              color: idx === 0 ? "#fff" : "#64748b",
              boxShadow:
                idx === 0 ? "0 4px 14px rgba(124,58,237,0.28)" : "none",
              backdropFilter: idx !== 0 ? "blur(4px)" : "none",
            }}
            onMouseEnter={(e) => {
              if (idx !== 0) {
                e.currentTarget.style.background = "rgba(237,233,254,0.9)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                e.currentTarget.style.color = "#7c3aed";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (idx !== 0) {
                e.currentTarget.style.background = "rgba(245,243,255,0.6)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)";
                e.currentTarget.style.color = "#64748b";
                e.currentTarget.style.transform = "";
              }
            }}
          >
            {item}
          </button>
        ))}
      </div>

      {/* ── Main layout ── */}
      <div className="grid grid-cols-12 gap-7">
        {/* Sidebar */}
        <aside className="col-span-3">
          <div className="sticky top-24">
            <ProductFilterSidebar />
          </div>
        </aside>

        {/* Products */}
        <section className="col-span-9 flex flex-col gap-5">
          <ProductToolbar />

          <ActiveFilters />

          <ProductGrid />

          <Pagination />
        </section>
      </div>
    </main>
  );
};

export default ProductListingPage;
