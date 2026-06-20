import { useEffect, useState, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { categoriesHeroSlides } from "../../../content/categories/categoriesHeroSlides";

const DURATION = 10000;

const CategoriesHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState("idle");
  const [progress, setProgress] = useState(0);
  const progressRef = useRef(null);
  const elapsedRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);

  const startProgress = () => {
    clearInterval(progressRef.current);
    elapsedRef.current = 0;
    setProgress(0);
    progressRef.current = setInterval(() => {
      elapsedRef.current += 80;
      setProgress(Math.min((elapsedRef.current / DURATION) * 100, 100));
      if (elapsedRef.current >= DURATION) clearInterval(progressRef.current);
    }, 80);
  };

  useEffect(() => {
    startProgress();
    const nextSlide = () => {
      setPhase("exit");

      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % categoriesHeroSlides.length);

        setPhase("enter");

        setTimeout(() => {
          setPhase("idle");
        }, 600);
      }, 300);
    };
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => {
      clearInterval(interval);
      clearInterval(progressRef.current);
    };
  }, []);

  const slide = categoriesHeroSlides[currentSlide];
  const slideNum = String(currentSlide + 1).padStart(2, "0");
  const totalNum = String(categoriesHeroSlides.length).padStart(2, "0");

  const contentStyle = {
    opacity: phase === "exit" ? 0 : 1,

    transform:
      phase === "exit"
        ? "translateY(-24px)"
        : phase === "enter"
          ? "translateY(24px)"
          : "translateY(0)",

    transition: "all 700ms cubic-bezier(0.22,1,0.36,1)",
  };

 

  return (
    <section className="relative mx-auto max-w-7xl px-6 pt-10">
      <div className="relative overflow-hidden" style={{ minHeight: "540px" }}>
        {/* Background Image */}
        <img
          key={currentSlide}
          src={slide.image.url}
          alt={slide.title}
          className="absolute inset-0 h-full w-full object-cover"
          style={{
            animation: "heroZoom 5s ease-out forwards",
          }}
        />

        {/* ── 3-layer overlay system ── */}
        {/* Dark gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom,rgba(10,5,30,0.2) 0%,rgba(10,5,30,0.72) 100%)",
          }}
        />
        {/* Purple-pink colour wash */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg,rgba(109,40,217,0.32) 0%,transparent 50%,rgba(219,39,119,0.18) 100%)",
          }}
        />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center,transparent 35%,rgba(5,2,20,0.45) 100%)",
          }}
        />

        {/* ── Top-left corner label ── */}
        <div
          className="absolute top-8 left-10 z-10 flex items-center gap-2"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          <div
            style={{
              height: "1px",
              width: "32px",
              background: "rgba(255,255,255,0.35)",
            }}
          />
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            Category Spotlight
          </span>
          
        </div>

        {/* ── Centre content ── */}
        <div
          className="relative z-10 flex h-[540px] flex-col items-center justify-center text-center px-8"
          style={contentStyle}
        >
          {/* Eyebrow — symmetrical with gem dots */}
          <div className="flex items-center gap-3 mb-7">
            <div
              style={{
                height: "1.5px",
                width: "36px",
                borderRadius: "2px",
                background:
                  "linear-gradient(90deg,rgba(255,255,255,0.7),rgba(216,180,254,0.5))",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "1px",
                transform: "rotate(45deg)",
                background: "linear-gradient(135deg,#c4b5fd,#f9a8d4)",
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: "9.5px",
                fontWeight: 700,
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.82)",
              }}
            >
              Category Spotlight
            </span>
            <br />
            <br />
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "1px",
                transform: "rotate(45deg)",
                background: "linear-gradient(135deg,#c4b5fd,#f9a8d4)",
                flexShrink: 0,
              }}
            />
            <div
              style={{
                height: "1.5px",
                width: "36px",
                borderRadius: "2px",
                background:
                  "linear-gradient(270deg,rgba(255,255,255,0.7),rgba(216,180,254,0.5))",
                flexShrink: 0,
              }}
            />
          </div>

          {/* Title */}
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem,6vw,5rem)",
              fontWeight: 400,
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "#ffffff",
              maxWidth: "720px",
              textShadow: "0 2px 40px rgba(0,0,0,0.25)",
              marginBottom: "1.6rem",
            }}
            dangerouslySetInnerHTML={{ __html: slide.title }}
          />

          {/* Subtitle */}
          <p
            style={{
              maxWidth: "600px",
              color: "rgba(255,255,255,0.78)",
              fontSize: "16px",
              lineHeight: 1.9,
              fontWeight: 300,
              letterSpacing: "0.01em",
              marginBottom: "2.5rem",
            }}
          >
            {slide.subtitle}
          </p>

          {/* CTA */}
          <Link
            to={`/categories/${slide.categorySlug}`}
            className="group relative overflow-hidden inline-flex items-center gap-2"
            style={{
              padding: "13px 28px",
              borderRadius: "100px",
              fontSize: "12.5px",
              fontWeight: 500,
              letterSpacing: "0.06em",
              color: "#fff",
              background: isHovered
                ? "linear-gradient(135deg,#8b5cf6,#db2777)"
                : "linear-gradient(135deg,#7c3aed,#c026d3)",
              backdropFilter: "blur(12px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
              transition: "transform 0.3s ease, box-shadow 0.3s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              setIsHovered(true);
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow =
                "0 12px 35px rgba(168,85,247,.45)";
            }}
            onMouseLeave={(e) => {
              setIsHovered(false);
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.2)";
            }}
          >
            <span
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background:
                  "linear-gradient(135deg,rgba(255,255,255,0.12),transparent 55%)",
              }}
            />
            {slide.ctaText}
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </Link>
        </div>

        {/* ── Bottom dot indicators ── */}
        <div
  className="absolute left-1/2 -translate-x-1/2 z-20 flex items-center gap-2"
  style={{
    bottom: "26px",
    padding: "8px 12px",
    borderRadius: "999px",
    backdropFilter: "blur(14px)",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  }}
>
          {categoriesHeroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setPhase("exit");

                setTimeout(() => {
                  setCurrentSlide(index);

                  setPhase("enter");

                  setTimeout(() => {
                    setPhase("idle");
                  }, 600);
                }, 300);

                startProgress();
              }}
              aria-label={`Slide ${index + 1}`}
              style={{
                height: "3px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                padding: 0,
                width: index === currentSlide ? "32px" : "10px",
                background:
                  index === currentSlide
                    ? "linear-gradient(90deg,#c4b5fd,#f9a8d4)"
                    : "rgba(255,255,255,0.38)",
                transition:
                  "width 0.4s cubic-bezier(0.34,1.56,0.64,1), background 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesHero;
