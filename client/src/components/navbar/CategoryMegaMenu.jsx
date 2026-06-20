import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { categoryMegaMenu } from "../../constants/categoryMegaMenu";

const CategoryMegaMenu = () => {
  const [activeCategory, setActiveCategory] = useState(categoryMegaMenu[0]);

  return (
    <div
      className="absolute left-1/2 top-full z-50 mt-4 -translate-x-1/2 overflow-hidden"
      style={{
        width: "1100px",
        borderRadius: "28px",
        background: "#fff",
        border: "1px solid rgba(167,139,250,0.14)",
        boxShadow: "0 30px 80px rgba(15,23,42,0.12), 0 10px 30px rgba(124,58,237,0.1)",
      }}
    >
      <div className="grid grid-cols-[240px_1fr] min-h-[520px]">

        {/* ── Left Categories ── */}
        <div
          style={{
            borderRight: "1px solid rgba(167,139,250,0.12)",
            background: "linear-gradient(180deg,#faf7ff 0%,#ffffff 100%)",
          }}
        >
          {/* Eyebrow */}
          <div className="flex items-center gap-2 p-5 pb-3">
            <div
              className="h-[2px] w-[18px] rounded-full flex-shrink-0"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              style={{
                fontSize: "10px",
                letterSpacing: ".22em",
                textTransform: "uppercase",
                color: "#7c3aed",
                fontWeight: 700,
              }}
            >
              Categories
            </span>
          </div>

          {/* Category list */}
          <div className="flex flex-col px-3 pb-3 gap-0.5">
            {categoryMegaMenu.map((category) => {
              const isActive = activeCategory.slug === category.slug;

              return (
                <button
                  key={category.slug}
                  onMouseEnter={() => setActiveCategory(category)}
                  className="relative flex items-center justify-between text-left overflow-hidden"
                  style={{
                    padding: "13px 16px",
                    borderRadius: "14px",
                    background: isActive
                      ? "linear-gradient(135deg,#f5f3ff,#fdf2fb)"
                      : "transparent",
                    color: isActive ? "#6d28d9" : "#334155",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "13.5px",
                    transition: "background 0.25s ease, color 0.25s ease, transform 0.2s ease",
                  }}
                  onMouseOver={(e) => { if (!isActive) e.currentTarget.style.transform = "translateX(2px)"; }}
                  onMouseOut={(e) => { e.currentTarget.style.transform = ""; }}
                >
                  {/* Left accent bar — grows on active */}
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-[3px]"
                    style={{
                      width: "3px",
                      height: isActive ? "60%" : "0%",
                      background: "linear-gradient(180deg,#7c3aed,#ec4899)",
                      transition: "height 0.3s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />

                  <span className="relative z-10">{category.label}</span>

                  <ArrowRight
                    size={13}
                    className="relative z-10 transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? "translateX(0)" : "translateX(-4px)",
                    }}
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right Content ── */}
        <div className="flex flex-col justify-between p-8">
          <div>
            {/* Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <span
                  style={{
                    fontSize: "10px",
                    letterSpacing: ".22em",
                    textTransform: "uppercase",
                    color: "#7c3aed",
                    fontWeight: 700,
                  }}
                >
                  Explore
                </span>

                <h3
                  style={{
                    marginTop: "9px",
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.3rem",
                    color: "#1e1b4b",
                    lineHeight: 1,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {activeCategory.label}
                </h3>
              </div>

              <Link
                to={`/categories/${activeCategory.slug}`}
                className="inline-flex items-center gap-1.5"
                style={{
                  color: "#7c3aed",
                  fontSize: "12.5px",
                  fontWeight: 600,
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: "1px solid rgba(139,92,246,0.22)",
                  background: "rgba(245,243,255,0.5)",
                  transition: "all 0.25s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(237,233,254,0.9)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(245,243,255,0.5)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)";
                  e.currentTarget.style.transform = "";
                }}
              >
                View All
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* Groups */}
            <div className="grid grid-cols-3 gap-x-10 gap-y-9">
              {activeCategory.groups.map((group) => (
                <div key={group.title}>
                  <Link
                    to={`/products?category=${activeCategory.slug}&subcategory=${group.title}`}
                    className="inline-flex items-center gap-1.5"
                    style={{
                      display: "flex",
                      marginBottom: "11px",
                      color: "#1e1b4b",
                      fontSize: "14.5px",
                      fontWeight: 700,
                      textDecoration: "none",
                    }}
                  >
                    <span
                      style={{
                        width: "4px", height: "4px", borderRadius: "1px",
                        transform: "rotate(45deg)",
                        background: "linear-gradient(135deg,#a855f7,#ec4899)",
                        flexShrink: 0,
                      }}
                    />
                    {group.title}
                  </Link>

                  <div className="flex flex-col gap-2">
                    {group.items.map((item) => (
                      <Link
                        key={item}
                        to={`/products?category=${activeCategory.slug}&subcategory=${group.title}&child=${item}`}
                        className="relative w-fit"
                        style={{
                          color: "#64748b",
                          fontSize: "13px",
                          transition: "color 0.2s ease, transform 0.2s ease",
                          textDecoration: "none",
                          padding: "1px 0",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = "#6d28d9";
                          e.currentTarget.style.transform = "translateX(3px)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = "#64748b";
                          e.currentTarget.style.transform = "";
                        }}
                      >
                        {item}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Bottom CTA ── */}
          <div
            className="flex items-center justify-between"
            style={{
              marginTop: "36px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(167,139,250,0.12)",
            }}
          >
            <Link
              to={`/categories/${activeCategory.slug}`}
              className="relative overflow-hidden inline-flex items-center gap-2 text-white"
              style={{
                fontWeight: 600,
                fontSize: "13px",
                padding: "10px 22px",
                borderRadius: "100px",
                background: "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
                boxShadow: "0 6px 20px rgba(109,40,217,0.32)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 28px rgba(109,40,217,0.42)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 6px 20px rgba(109,40,217,0.32)";
              }}
            >
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.18),transparent 55%)" }}
              />
              Explore {activeCategory.label}
              <ArrowRight size={15} />
            </Link>

            <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: 300 }}>
              Free shipping on orders above ₹999
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryMegaMenu;