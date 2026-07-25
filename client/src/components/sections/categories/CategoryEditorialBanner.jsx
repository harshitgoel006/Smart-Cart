import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const CategoryEditorialBanner = ({ editorial }) => {
  if (!editorial) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden"
        style={{
          borderRadius: "32px",
          minHeight: "520px",
          boxShadow:
            "0 20px 60px rgba(124,58,237,0.14), 0 6px 20px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.45s ease",
        }}
      >
        {/* ── Full-bleed background image ── */}
        <motion.img
          whileHover={{ scale: 1.04 }}
          transition={{ duration: 0.6 }}
          src={editorial.image}
          alt={editorial.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{ minHeight: "520px" }}
        />

        {/* ── 3-layer overlay system ── */}
        {/* Dark gradient — bottom to top for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top,rgba(10,5,30,0.88) 0%,rgba(10,5,30,0.55) 45%,rgba(10,5,30,0.18) 100%)",
          }}
        />
        {/* Brand colour wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(109,40,217,0.35) 0%,transparent 50%,rgba(219,39,119,0.2) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center,transparent 35%,rgba(5,2,20,0.5) 100%)",
          }}
        />

        {/* ── Top-right corner label ── */}
        <div
          className="absolute top-7 right-8 z-10 flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.42)" }}
        >
          <div style={{ height: "1px", width: "28px", background: "rgba(255,255,255,0.3)" }} />
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.28em",
              textTransform: "uppercase",
            }}
          >
            {editorial.tag}
          </span>
        </div>

        {/* ── Content overlaid on image — sits at bottom ── */}
        <div
          className="relative z-[3] flex items-end"
          style={{ minHeight: "520px", padding: "3.5rem" }}
        >
          <div className="grid w-full items-end gap-10 lg:grid-cols-[1.1fr_0.9fr]">

            {/* Left: editorial text */}
            <div>
              {/* Eyebrow */}
              <div className="mb-5 flex items-center gap-2.5">
                <div
                  style={{
                    height: "1.5px",
                    width: "36px",
                    borderRadius: "2px",
                    background: "linear-gradient(90deg,rgba(255,255,255,0.7),rgba(216,180,254,0.5))",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    width: "5px", height: "5px", borderRadius: "1px",
                    transform: "rotate(45deg)",
                    background: "linear-gradient(135deg,#c4b5fd,#f9a8d4)",
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.82)",
                  }}
                >
                  {editorial.tag}
                </span>
              </div>

              {/* Title */}
              <h2
                className="mb-5"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(2.7rem,4vw,4.5rem)",
                  fontWeight: 400,
                  lineHeight: 1.02,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  textShadow: "0 2px 30px rgba(0,0,0,0.2)",
                }}
                dangerouslySetInnerHTML={{ __html: editorial.title }}
              />

              {/* Description */}
              <p
                className="max-w-lg mb-7"
                style={{
                  fontSize: "14px",
                  color: "rgba(255,255,255,0.65)",
                  lineHeight: 1.85,
                  fontWeight: 300,
                }}
              >
                {editorial.description}
              </p>

              {/* Optional feature pills */}
              {editorial.features?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-7">
                  {editorial.features.map((feat) => (
                    <span
                      key={feat}
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 500,
                        color: "rgba(255,255,255,0.85)",
                        padding: "5px 13px",
                        borderRadius: "100px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid rgba(255,255,255,0.2)",
                        backdropFilter: "blur(8px)",
                        transition: "all 0.2s ease",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      {feat}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link
                to={editorial.buttonLink}
                className="group relative overflow-hidden inline-flex items-center gap-2.5 text-white font-semibold"
                style={{
                  padding: "13px 28px",
                  borderRadius: "100px",
                  fontSize: "12.5px",
                  letterSpacing: "0.06em",
                  background:
                    "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
                  boxShadow:
                    "0 8px 24px rgba(109,40,217,0.45),inset 0 1px 0 rgba(255,255,255,0.22)",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-3px)";
                  e.currentTarget.style.boxShadow =
                    "0 16px 40px rgba(109,40,217,0.55),inset 0 1px 0 rgba(255,255,255,0.22)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px rgba(109,40,217,0.45),inset 0 1px 0 rgba(255,255,255,0.22)";
                }}
              >
                <span
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg,rgba(255,255,255,0.2),transparent 55%)",
                  }}
                />
                {editorial.buttonText}
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Right: frosted glass stat chips */}
            {editorial.stats?.length > 0 && (
              <div className="hidden lg:flex flex-col gap-3 items-end">
                {editorial.stats.map((stat) => (
                  <div
                    key={stat.label}
                    style={{
                      padding: "1.1rem 1.4rem",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.1)",
                      backdropFilter: "blur(14px)",
                      border: "1px solid rgba(255,255,255,0.2)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                      minWidth: "155px",
                      transition: "all 0.3s ease",
                      cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.16)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.32)";
                      e.currentTarget.style.transform = "translateX(-4px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "2rem",
                        fontWeight: 500,
                        color: "#fff",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontSize: "9.5px",
                        fontWeight: 600,
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.6)",
                        marginTop: "3px",
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default CategoryEditorialBanner;