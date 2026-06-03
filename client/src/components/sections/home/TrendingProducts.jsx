import { ArrowRight } from "lucide-react";
import ProductCard from "../../common/ProductCard";
import { trendingProducts } from "../../../content/home/trendingProducts";
import { Link } from "react-router-dom";

const TrendingProducts = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      {/* Subtle ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-32 top-0 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(80px)",
          opacity: 0.07,
        }}
      />

      {/* ── Header ── */}
      <div className="relative mb-14 grid md:grid-cols-[1fr_auto_auto] items-end gap-10">
        <div className="flex flex-col gap-4">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div
              className="h-[2px] w-10 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="font-semibold uppercase"
              style={{
                fontSize: "9.5px",
                letterSpacing: "0.3em",
                color: "#7c3aed",
              }}
            >
              Trending Products
            </span>
          </div>
          <div className = "h-1"></div>

          {/* Title */}
          <h2
            className="font-medium leading-[1.05] tracking-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              color: "#1e1b4b",
            }}
          >
            Most{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg,#6d28d9,#c026d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Loved
            </em>{"  "}
            This Week
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-5">
          <div className="w-[340px] border-l border-violet-100 pl-6">
            <p
              className="max-w-sm text-sm leading-relaxed font-light"
              style={{
                color: "#94a3b8",
                borderLeft: "1px solid rgba(167,139,250,0.25)",
                paddingLeft: "1.25rem",
              }}
            >
              Discover the products customers can't stop talking about. Curated
              by trends, reviews and demand.
            </p>
          </div>
          <Link to="/products"
            className="inline-flex items-center gap-2 font-medium"
            style={{
              fontSize: "12px",
              letterSpacing: "0.05em",
              color: "#7c3aed",
              padding: "9px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(139,92,246,0.28)",
              background: "rgba(245,243,255,0.5)",
              backdropFilter: "blur(6px)",
              cursor: "pointer",
              transition: "all 0.25s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(237,233,254,0.9)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.querySelector(".vall-arrow").style.transform =
                "translateX(4px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(245,243,255,0.5)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)";
              e.currentTarget.style.transform = "";
              e.currentTarget.querySelector(".vall-arrow").style.transform = "";
            }}
          >
            View All
            <ArrowRight
              size={14}
              className="vall-arrow"
              style={{ transition: "transform 0.25s ease" }}
            />
          </Link>
        </div>
      </div>
      <br></br>
      <br></br>

      {/* ── Products Grid ── */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {trendingProducts.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default TrendingProducts;
