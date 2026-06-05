import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoryGridData } from "../../../content/home/categoryGridData";

// Bento grid layout logic: Premium & Asymmetrical
const bentoClass = (index) => {
  // Asymmetric layout logic for that "tercha-mercha" premium look
  const map = [
  "col-span-12 md:col-span-6",
  "col-span-12 md:col-span-6",

  "col-span-12 md:col-span-3",
  "col-span-12 md:col-span-5",
  "col-span-12 md:col-span-4",

  "col-span-12 md:col-span-3",
  "col-span-12 md:col-span-3",
  "col-span-12 md:col-span-6",

];
  return map[index] ?? "col-span-12 md:col-span-4";
};

const bentoHeight = (index) => (index < 2 ? "300px" : "220px");


const CategoryGrid = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-16 overflow-hidden ">
      {/* ── Header ── */}

      <div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-24 flex flex-col md:flex-row md:justify-between gap-10"
      >
        <div className="flex flex-col gap-5">
          {/* Eyebrow */}
          <div className="flex items-center gap-3">
            <div
              className="h-[2px] w-12 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="text-[9.5px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: "#7c3aed" }}
            >
              Top Categories
            </span>
          </div>

          {/* Title */}
          <h2
            className="leading-[1.05] font-medium"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
              color: "#1e1b4b",
            }}
          >
            Shop by{" "}
            <em
              className="not-italic"
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg,#6d28d9,#c026d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Category
            </em>
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
              Explore curated categories designed for every lifestyle, season
              and shopping need.
            </p>
          </div>
          <Link
            to="/categories"
            className="inline-flex items-center gap-2 font-medium "
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
      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-12 gap-5">
        {categoryGridData.map((category, index) => {
          
          const large = index<2

          return (
            <Link
              key={category.id}
              to={`/categories/${category.slug}`}
              className={`group relative block overflow-hidden ${bentoClass(index)}`}
              style={{
                height: bentoHeight(index),
                borderRadius: "32px",
                border: "1px solid rgba(167,139,250,0.1)",
                background: "#f8f6ff",
                textDecoration: "none",
                transition:
                  "transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform =
                  "translateY(-4px)";
                e.currentTarget.style.boxShadow =
                  "0 24px 60px rgba(124,58,237,0.2)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.1)";
              }}
            >
              {/* Top accent line slides in on hover */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] z-20 origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
              />

              {/* Image */}
              {/* <img
                src={category.image.url}
                alt={category.name}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-[1.08]"
              /> */}

              <img
                src={category.image.url}
                alt={category.name}
                className="h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-110"
              />

              {/* Dark gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(2,6,23,0.82) 0%,rgba(2,6,23,0.32) 45%,rgba(2,6,23,0.05) 100%)",
                }}
              />

              {/* Purple-pink wash on hover */}
              <div
                className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(124,58,237,0.12) 0%,transparent 50%,rgba(236,72,153,0.08) 100%)",
                }}
              />

              {/* Content */}
              <div
                className="absolute bottom-0 left-0 right-0 z-10 flex items-end justify-between gap-3 "
                style={{
                  paddingLeft: "2rem",
                  paddingRight: "1.5rem",
                  paddingBottom: "1.8rem",
                }}
              >
                {/* Text block */}
                <div className="flex flex-col gap-1.5 translate-y-1 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0">
                  {/* Category name */}
                  <h3
                    className="font-medium text-white leading-[0.95]"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: large ? "2.8rem" : "1.9rem",
                      letterSpacing: "-0.04em",
                      textShadow: "0 8px 30px rgba(0,0,0,0.35)",
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* Explore CTA — fades up on hover */}
                  <div
                    className="flex items-center gap-2 opacity-0 translate-y-1.5 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0"
                    style={{ transitionDelay: "0.05s" }}
                  >
                    <span
                      className="font-semibold uppercase"
                      style={{
                        fontSize: "9.5px",
                        letterSpacing: "0.16em",
                        color: "rgba(255,255,255,0.75)",
                      }}
                    >
                      Explore
                    </span>
                    <div
                      className="h-px"
                      style={{
                        width: "22px",
                        background: "rgba(255,255,255,0.6)",
                        transition: "width 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                      }}
                    />
                  </div>
                </div>

                {/* Arrow pill */}
                <div
                  className="flex-shrink-0 flex items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110"
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(10px)",
                    color: "#fff",
                    transition: "all .25s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform =
                      "translateX(4px) scale(1.08)";
                    e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                    e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.borderColor =
                      "rgba(255,255,255,0.15)";
                  }}
                >
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;
