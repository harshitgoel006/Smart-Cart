import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { topCategories } from "../../../content/home/topCategories";
import { ArrowRight } from "lucide-react";

const TopCategories = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section className="relative w-full pt-24 pb-20 px-6 max-w-7xl mx-auto">
      {/* ── Header ── */}
      <motion.div
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
              Curated Selection
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
              A bespoke collection designed to elevate your everyday lifestyle
              with precision and elegance.
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
      </motion.div>
      <br></br>
      <br></br>

      {/* ── Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {topCategories.map((category, index) => {
          const num = String(index + 1).padStart(2, "0");
          return (
            <motion.div key={category.id} variants={itemVariants}>
              <Link
                to={`/category/${category.slug}`}
                className="group relative block overflow-hidden"
                style={{
                  aspectRatio: "4/3.5",
                  borderRadius: "28px",
                  background: "#fff",
                  border: "1px solid rgba(167,139,250,0.1)",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
                  transition:
                    "transform 0.7s cubic-bezier(0.22,1,0.36,1), box-shadow 0.7s cubic-bezier(0.22,1,0.36,1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 28px 70px rgba(124,58,237,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 8px 30px rgba(0,0,0,0.05)";
                }}
              >
                {/* Image */}
                <img
                  src={category.image.url}
                  alt={category.name}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-[1.07]"
                />

                {/* Dark gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Purple-pink shimmer on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(124,58,237,0.18) 0%,transparent 50%,rgba(219,39,119,0.12) 100%)",
                  }}
                />

                {/* Content */}
                <div
                  className="absolute bottom-0 left-0 w-full p-8 transform translate-y-1.5 transition-transform duration-500 group-hover:translate-y-0"
                  style={{
                    // Content ko thoda inner padding dena
                    paddingBottom: "2.5rem",
                    paddingLeft: "2rem",
                    paddingRight: "2rem",
                  }}
                >
                  {/* Tagline pill */}
                  <span
                    className="inline-flex items-center gap-1.5 mb-6 text-white font-semibold uppercase"
                    style={{
                      fontSize: "9px",
                      letterSpacing: "0.22em",
                      padding: "5px 14px",
                      borderRadius: "100px",
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.18)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background: "linear-gradient(135deg,#a855f7,#ec4899)",
                      }}
                    />
                    {category.tagline}
                  </span>

                  {/* Category name */}
                  <h3
                    className="font-medium text-white mb-6"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "2rem",
                      lineHeight: 1.1,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {category.name}
                  </h3>

                  {/* CTA row */}
                  <div className="flex items-center gap-3">
                    <span
                      className="font-semibold uppercase"
                      style={{
                        fontSize: "10px",
                        letterSpacing: "0.2em",
                        color: "rgba(255,255,255,0.9)",
                      }}
                    >
                      {category.ctaText}
                    </span>
                    {/* Expanding line */}
                    <div
                      className="h-px group-hover:w-16 transition-all duration-500"
                      style={{
                        width: "36px",
                        background:
                          "linear-gradient(90deg,rgba(255,255,255,0.85),transparent)",
                      }}
                    />
                  </div>
                </div>

                {/* Border glow on hover */}
                <div
                  className="absolute inset-0 pointer-events-none transition-all duration-500 group-hover:opacity-100 opacity-0"
                  style={{
                    borderRadius: "28px",
                    border: "1px solid rgba(167,139,250,0.45)",
                  }}
                />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default TopCategories;
