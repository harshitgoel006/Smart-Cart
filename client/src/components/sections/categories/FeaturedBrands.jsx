import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FeaturedBrands = ({ title = "Brands We Love", brands = [] }) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* ---------- Header ---------- */}
      <div className="mb-10">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="h-[2px] w-10 rounded-full"
            style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
          />
          <span
            style={{
              fontSize: "10px",
              letterSpacing: ".3em",
              color: "#7c3aed",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            Featured
          </span>
        </div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem,4vw,3.5rem)",
            color: "#1e1b4b",
            lineHeight: 1.05,
          }}
        >
          {title}
        </h2>
      </div>

      {/* ---------- Cards ---------- */}
      <div className="relative">
        {/* Right edge fade mask */}
        <div
          className="absolute top-0 right-0 h-full w-16 z-[5] pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to left,#fff,transparent)" }}
        />

        <div className="flex gap-[1.1rem] overflow-x-auto pb-4 scrollbar-hide">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              to={`/products?category=${brand.parentSlug}&brand=${brand.slug}`}
              className="group relative flex-shrink-0 block overflow-hidden"
              style={{
                width: "175px",
                borderRadius: "26px",
                background: "#fff",
                boxShadow: "0 8px 24px rgba(15,23,42,.06)",
                border: "1px solid rgba(167,139,250,0.1)",
                transition:
                  "transform 0.45s cubic-bezier(0.22,1,0.36,1), box-shadow 0.45s ease, border-color 0.4s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-7px)";
                e.currentTarget.style.boxShadow = "0 26px 55px rgba(124,58,237,0.2)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(15,23,42,.06)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.1)";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2.5px] z-[3] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
              />

              {/* Image */}
              <div className="relative overflow-hidden h-[185px]">
                <img
                  src={brand.image}
                  alt={brand.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark overlay on hover */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                  style={{ background: "linear-gradient(to top,rgba(15,23,42,0.18),transparent 55%)" }}
                />

                {/* Purple-pink wash */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(124,58,237,0.12) 0%,transparent 55%,rgba(236,72,153,0.08) 100%)",
                  }}
                />

                {/* Optional badge — top-left, slides down on hover */}
                {brand.badge && (
                  <span
                    className="absolute top-2.5 left-2.5 z-[3] font-bold uppercase text-white opacity-0 -translate-y-1 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
                    style={{
                      fontSize: "8px",
                      letterSpacing: "0.18em",
                      background: "rgba(0,0,0,0.28)",
                      backdropFilter: "blur(6px)",
                      borderRadius: "100px",
                      padding: "3px 9px",
                    }}
                  >
                    {brand.badge}
                  </span>
                )}
              </div>

              {/* Brand name */}
              <div className="px-4 py-4">
                <h3
                  className="transition-colors duration-300"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "1.42rem",
                    color: "#1e1b4b",
                    textAlign: "center",
                    marginBottom: "5px",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#6d28d9"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#1e1b4b"; }}
                >
                  {brand.name}
                </h3>

                {/* Explore — fades up on hover */}
                <div
                  className="flex items-center justify-center gap-1.5 opacity-0 translate-y-0.5 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
                  style={{
                    fontSize: "9.5px",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "#a855f7",
                    fontWeight: 600,
                  }}
                >
                  Explore
                  <ArrowRight
                    size={11}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedBrands;