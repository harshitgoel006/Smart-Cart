import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const CategoryHero = ({ heroData, slug }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!heroData?.images?.length) return;

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % heroData.images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [heroData]);

  if (!heroData) return null;

  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top right, rgba(124,58,237,.1), transparent 38%)",
        }}
      />
      {/* Secondary glow — bottom-left */}
      <div
        aria-hidden="true"
        className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle,rgba(217,70,239,0.08),transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-20">
        <div
          className="grid items-center gap-10 lg:grid-cols-[1fr_0.95fr]"
          style={{ minHeight: "560px" }}
        >
          {/* ── Left Content ── */}
          <div className="relative z-10">
            {/* Badge */}
            <div className="mb-8 flex items-center gap-2.5">
              <div
                className="h-[2px] w-12 rounded-full flex-shrink-0"
                style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
              />
              <span
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "1px",
                  transform: "rotate(45deg)",
                  background: "linear-gradient(135deg,#a855f7,#ec4899)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: ".28em",
                  textTransform: "uppercase",
                  color: "#7c3aed",
                }}
              >
                {heroData.badge}
              </span>
            </div>

            {/* Title — gradient serif */}
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(3.2rem,6vw,5.5rem)",
                fontWeight: 400,
                lineHeight: 0.96,
                letterSpacing: "-0.02em",
                maxWidth: "650px",
                background:
                  "linear-gradient(140deg,#1e1b4b 0%,#5b21b6 40%,#a21caf 75%,#be185d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                marginBottom: "1.8rem",
              }}
            >
              {heroData.title}
            </h1>

            {/* Subtitle */}
            <p
              style={{
                maxWidth: "560px",
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.9,
                fontWeight: 300,
                marginBottom: "2.5rem",
              }}
            >
              {heroData.subtitle}
            </p>

            {/* CTA */}
            <Link
              to={`/products?category=${slug}`}
              className="group relative overflow-hidden inline-flex items-center gap-2.5"
              style={{
                padding: "14px 26px",
                borderRadius: "100px",
                background:
                  "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
                color: "#fff",
                fontSize: "12.5px",
                fontWeight: 600,
                letterSpacing: ".07em",
                textTransform: "uppercase",
                boxShadow:
                  "0 12px 30px rgba(124,58,237,.25),inset 0 1px 0 rgba(255,255,255,0.2)",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow =
                  "0 18px 42px rgba(124,58,237,0.35),inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow =
                  "0 12px 30px rgba(124,58,237,.25),inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
            >
              <span
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(255,255,255,0.2),transparent 55%)",
                }}
              />
              {heroData.cta}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>

            {/* Trust mini-stats row */}
            {heroData.trustStats && (
              <div
                className="flex items-center gap-3.5"
                style={{ marginTop: "2.2rem" }}
              >
                {heroData.trustStats.map((stat, i) => (
                  <div key={stat.label} className="flex items-center gap-3.5">
                    <div className="flex flex-col gap-0.5">
                      <span
                        style={{
                          fontFamily: "'Cormorant Garamond', serif",
                          fontSize: "1.4rem",
                          fontWeight: 500,
                          color: "#1e1b4b",
                          lineHeight: 1,
                        }}
                      >
                        {stat.value}
                      </span>
                      <span
                        style={{
                          fontSize: "10px",
                          color: "#94a3b8",
                          fontWeight: 300,
                          letterSpacing: "0.03em",
                        }}
                      >
                        {stat.label}
                      </span>
                    </div>
                    {i < heroData.trustStats.length - 1 && (
                      <div
                        style={{
                          width: "1px",
                          height: "28px",
                          background:
                            "linear-gradient(to bottom,transparent,rgba(167,139,250,0.3),transparent)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Right Image ── */}
          <div className="relative">
            <div
              className="relative overflow-hidden"
              style={{
                height: "560px",
                borderRadius: "32px",
                boxShadow: "0 25px 70px rgba(15,23,42,.14)",
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[3px] z-[3]"
                style={{
                  background: "linear-gradient(90deg,#7c3aed,#a855f7,#ec4899)",
                }}
              />

              {/* Images */}
              {heroData.images.map((image, index) => (
                <img
                  key={image}
                  src={image}
                  alt={heroData.title}
                  className="absolute inset-0 h-full w-full object-cover transition-all duration-[1800ms]"
                  style={{
                    opacity: activeImage === index ? 1 : 0,
                    transform:
                      activeImage === index ? "scale(1)" : "scale(1.05)",
                  }}
                />
              ))}

              {/* Dark overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top,rgba(15,23,42,.2),transparent)",
                }}
              />
              {/* Colour wash overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(109,40,217,0.1) 0%,transparent 50%,rgba(219,39,119,0.06) 100%)",
                }}
              />

              {/* Image dot indicators — bottom-left */}
              <div
                className="absolute z-[3] flex gap-1.5"
                style={{ bottom: "1.4rem", left: "1.4rem" }}
              >
                {heroData.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    aria-label={`Image ${index + 1}`}
                    style={{
                      height: "3px",
                      borderRadius: "100px",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                      width: activeImage === index ? "24px" : "8px",
                      background:
                        activeImage === index
                          ? "linear-gradient(90deg,#fff,#f3e8ff)"
                          : "rgba(255,255,255,0.5)",
                      transition:
                        "width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Floating Counter */}
            <div
              className="absolute bottom-6 right-6 flex items-center gap-2"
              style={{
                padding: "9px 16px",
                borderRadius: "999px",
                backdropFilter: "blur(18px)",
                background: "rgba(255,255,255,.78)",
                border: "1px solid rgba(255,255,255,.5)",
                boxShadow: "0 8px 24px rgba(124,58,237,0.1)",
              }}
            >
              <div
                style={{
                  width: "5px",
                  height: "5px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: "12px",
                  color: "#1e1b4b",
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {String(activeImage + 1).padStart(2, "0")} /{" "}
                {String(heroData.images.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;
