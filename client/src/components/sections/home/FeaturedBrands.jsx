import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { brandsData } from "../../../content/home/brandsData";

const FeaturedBrands = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">

      {/* ── Header ── */}
      <div className="relative mb-16 flex flex-col md:flex-row md:justify-between gap-10">

        {/* Left */}
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="h-[2px] w-12 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="text-[9.5px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: "#7c3aed" }}
            >
              Featured Brands
            </span>
          </div>

          <h2
            className="leading-[1.05] font-medium"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem,5vw,3.6rem)",
              color: "#1e1b4b",
            }}
          >
            Brands You{" "}
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
              Love
            </em>
          </h2>
        </div>

        {/* Right */}
        <div className="flex flex-col items-start md:items-end gap-5">
          <div className="w-[340px]">
            <p
              className="max-w-sm text-sm leading-relaxed font-light"
              style={{
                color: "#94a3b8",
                borderLeft: "1px solid rgba(167,139,250,0.25)",
                paddingLeft: "1.25rem",
              }}
            >
              Discover products from the world's most trusted and loved brands.
            </p>
          </div>

          <Link
            to="/products"
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
              transition: "all 0.25s ease",
              textDecoration: "none",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(237,233,254,0.9)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(245,243,255,0.5)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)";
              e.currentTarget.style.transform = "";
            }}
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      <br />

      {/* ── Brands Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {brandsData.map((brand, index) => (
          <Link
            key={brand.id}
            to={`/products?brand=${brand.slug}`}
            className="group relative block overflow-hidden"
            style={{
              height: "148px",
              borderRadius: "24px",
              background: "linear-gradient(180deg,#ffffff 0%,#faf7ff 100%)",
              border: "1px solid rgba(167,139,250,0.15)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
              textDecoration: "none",
              transition:
                "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 20px 50px rgba(124,58,237,0.14)";
              e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.03)";
              e.currentTarget.style.borderColor = "rgba(167,139,250,0.15)";
            }}
          >
            {/* Top accent line */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
              style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
            />

            {/* Shimmer wash */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg,rgba(124,58,237,0.06) 0%,transparent 55%,rgba(236,72,153,0.04) 100%)",
              }}
            />

            {/* Glow orb behind logo */}
            <div
              className="absolute opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
              style={{
                width: "80px", height: "80px",
                top: "50%", left: "50%",
                transform: "translate(-50%,-60%)",
                borderRadius: "50%",
                background: "radial-gradient(circle,rgba(167,139,250,0.2) 0%,transparent 70%)",
              }}
            />

            {/* Logo */}
            <div
              className="relative z-10 flex items-center justify-center"
              style={{ height: "44px", marginBottom: "10px" }}
            >
              {brand.logo ? (
                <img
                  src={brand.logo}
                  alt={brand.name}
                  style={{
                    maxWidth: "90px",
                    maxHeight: "32px",
                    objectFit: "contain",
                    filter: "grayscale(100%) opacity(0.7)",
                    transition: "all 0.35s ease",
                  }}
                  className="group-hover:grayscale-0"
                  onMouseEnter={e => { e.currentTarget.style.filter = "grayscale(0%) opacity(1)"; }}
                  onMouseLeave={e => { e.currentTarget.style.filter = "grayscale(100%) opacity(0.7)"; }}
                />
              ) : (
                <span
                  style={{
                    fontSize: "26px",
                    fontWeight: 700,
                    background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {brand.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Brand name */}
            <span
              className="relative z-10 font-semibold transition-colors duration-300 group-hover:text-violet-800"
              style={{
                fontSize: "14px",
                color: "#1e1b4b",
                letterSpacing: "-0.02em",
              }}
            >
              {brand.name}
            </span>

            {/* Explore — slides up on hover */}
            <div
              className="relative z-10 flex items-center gap-1.5 opacity-0 translate-y-1.5 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0 mt-1.5"
            >
              <span
                style={{
                  fontSize: "9.5px",
                  fontWeight: 600,
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Explore
              </span>
              <ArrowRight
                size={11}
                color="#7c3aed"
                style={{ transition: "transform 0.25s ease" }}
                className="group-hover:translate-x-0.5"
              />
            </div>

            {/* Item count */}
            {brand.itemCount && (
              <span
                className="absolute bottom-2.5 right-3 font-medium transition-colors duration-300 group-hover:text-violet-400"
                style={{
                  fontSize: "10px",
                  color: "rgba(124,58,237,0.28)",
                  letterSpacing: "0.06em",
                }}
              >
                {brand.itemCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedBrands;