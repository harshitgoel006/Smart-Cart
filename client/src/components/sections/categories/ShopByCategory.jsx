import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const ShopByCategory = ({ title = "Shop By Category", categories = [] }) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* ── Header ── */}
      <div className="mb-12 flex items-end justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2.5 mb-12">
            <div
              className="h-[2px] w-9 rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="uppercase font-semibold"
              style={{
                fontSize: "10px",
                letterSpacing: ".3em",
                color: "#7c3aed",
              }}
            >
              Discover
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

        
      </div>

      <br /><br />

      {/* ── Categories ── */}
      <div className="relative">
        {/* Right edge fade mask */}
        <div
          className="absolute top-0 right-0 h-full w-16 z-[5] pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to left,#fff,transparent)" }}
        />

        <div className="flex gap-7 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products?category=${category.parentSlug}&subcategory=${category.slug}`}
              className="group flex-shrink-0"
              style={{ textDecoration: "none" }}
            >
              <div className="w-[185px]">

                {/* Image circle */}
                <div className="relative w-[155px] h-[155px] mx-auto">

                  {/* Gradient ring — appears on hover */}
                  <div
                    className="absolute -inset-[5px] rounded-full opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{
                      background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
                      zIndex: 0,
                    }}
                  />

                  {/* Circle image container */}
                  <div
                    className="relative overflow-hidden rounded-full transition-all duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
                    style={{
                      width: "155px",
                      height: "155px",
                      boxShadow: "0 8px 25px rgba(0,0,0,.08)",
                      background: "#f8f6ff",
                      border: "4px solid #fff",
                      zIndex: 1,
                    }}
                    className="relative overflow-hidden rounded-full transition-all duration-300 group-hover:-translate-y-1.5 group-hover:scale-[1.02] group-hover:shadow-[0_22px_50px_rgba(124,58,237,0.25)]"
                  >
                    <img
                      src={category.image}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.12]"
                    />

                    {/* Color wash on hover */}
                    <div
                      className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(135deg,rgba(124,58,237,0.15) 0%,transparent 55%,rgba(236,72,153,0.1) 100%)",
                      }}
                    />
                  </div>
                  
                  {/* Optional item-count badge — only renders if provided */}
                  {category.itemCount && (
                    <div
                      className="absolute z-[3] opacity-0 translate-y-1 transition-all duration-[350ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
                      style={{
                        bottom: "6px", right: "6px",
                        background: "rgba(255,255,255,0.9)",
                        backdropFilter: "blur(6px)",
                        borderRadius: "100px",
                        padding: "3px 9px",
                        fontSize: "9px",
                        fontWeight: 600,
                        color: "#7c3aed",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      }}
                    >
                      {category.itemCount}
                    </div>
                  )}
                </div>

                {/* Name */}
                <div className="mt-5 text-center">
                  <h3
                    className="transition-colors duration-300 group-hover:text-violet-800"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "1.55rem",
                      color: "#1e1b4b",
                      lineHeight: 1.1,
                    }}
                  >
                    {category.name}
                  </h3>

                  <div
                    className="mt-2 flex items-center justify-center gap-2 transition-opacity duration-300"
                    style={{
                      fontSize: "10.5px",
                      letterSpacing: ".12em",
                      textTransform: "uppercase",
                      color: "#7c3aed",
                      fontWeight: 600,
                    }}
                    className="mt-2 flex items-center justify-center gap-2 opacity-75 group-hover:opacity-100 transition-all duration-300" 
                  >
                    Explore
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByCategory;