import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { heroSlides } from "../../../content/home/heroSlides";

const DURATION = 20000;

const HomeHero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [phase, setPhase] = useState("idle"); // "idle" | "exit" | "enter"
  const [progress, setProgress] = useState(0);
  const [countdown, setCountdown] = useState(6);
  const timerRef = useRef(null);
  const progressRef = useRef(null);
  const elapsedRef = useRef(0);

  const startProgress = () => {
    clearInterval(progressRef.current);
    elapsedRef.current = 0;
    setProgress(0);
    setCountdown(Math.ceil(DURATION / 1000));
    progressRef.current = setInterval(() => {
      elapsedRef.current += 80;
      const pct = Math.min((elapsedRef.current / DURATION) * 100, 100);
      setProgress(pct);
      setCountdown(Math.max(0, Math.ceil((DURATION - elapsedRef.current) / 1000)));
      if (elapsedRef.current >= DURATION) clearInterval(progressRef.current);
    }, 80);
  };

  const goTo = useCallback((index) => {
    setPhase("exit");
    setTimeout(() => {
      setCurrentSlide(index);
      setPhase("enter");
      setTimeout(() => setPhase("idle"), 500);
    }, 200);
    startProgress();
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      goTo((index + 1) % heroSlides.length);
    }, DURATION);
  }, []);

  useEffect(() => {
    startProgress();
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => {
        const next = (prev + 1) % heroSlides.length;
        setPhase("exit");
        setTimeout(() => { setPhase("enter"); setTimeout(() => setPhase("idle"), 500); }, 200);
        startProgress();
        return next;
      });
    }, DURATION);
    return () => { clearInterval(timerRef.current); clearInterval(progressRef.current); };
  }, []);

  const slide = heroSlides[currentSlide];
  const slideNum = String(currentSlide + 1).padStart(2, "0");
  const totalNum = String(heroSlides.length).padStart(2, "0");

  const contentStyle = {
    opacity: phase === "exit" ? 0 : 1,
    transform: phase === "exit" ? "translateY(-12px)" : phase === "enter" ? "translateY(14px)" : "translateY(0)",
    transition: phase === "exit" ? "all 0.18s ease" : "all 0.52s cubic-bezier(0.22,0.61,0.36,1)",
  };

  const imgStyle = {
    opacity: phase === "exit" ? 0 : 1,
    transform: phase === "exit" ? "scale(1.04)" : phase === "enter" ? "scale(0.97)" : "scale(1)",
    transition: phase === "exit" ? "all 0.18s ease" : "all 0.65s cubic-bezier(0.22,0.61,0.36,1)",
  };

  return (
    <section className="relative w-full  mx-auto  px-6 pb-12">

      {/* Ambient glow behind card */}
      <div
        aria-hidden="true"
        className="absolute inset-x-16 top-6 bottom-4  pointer-events-none"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(60px)",
          opacity: 0.15,
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          
          background: "linear-gradient(145deg,#faf8ff 0%,#fff5fb 50%,#f8f0ff 100%)",
          border: "1px solid rgba(168,85,247,0.15)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.8) inset, 0 30px 80px rgba(124,58,237,0.12), 0 8px 30px rgba(236,72,153,0.08)",
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-20 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(192,132,252,0.25) 0%,rgba(249,168,212,0.1) 55%,transparent 75%)" }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-28 -left-16 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "radial-gradient(circle,rgba(167,139,250,0.18) 0%,rgba(236,72,153,0.07) 60%,transparent 80%)" }}
        />

        {/* Main grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "460px" }}>

          {/* ── Left: Content ── */}
          <div
            className="flex flex-col justify-center gap-6 px-12 py-14"
            style={contentStyle}
          >
            {/* Slide number + badge row */}
            <div className="flex items-center gap-3">
              
              <div style={{ width: 1, height: "1.1rem", background: "rgba(167,139,250,0.35)" }} />
              <span
                className="inline-flex items-center gap-2 px-4 py-1.5 text-[9.5px] font-semibold tracking-[0.32em] uppercase"
                style={{
                  borderRadius: "100px",
                  color: "#7c3aed",
                  background: "rgba(237,233,254,0.7)",
                  border: "1px solid rgba(167,139,250,0.3)",
                  backdropFilter: "blur(4px)",
                }}
              >
                <span
                  className="w-1.5 h-1.5 flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#a855f7,#ec4899)", borderRadius: "1px", transform: "rotate(45deg)" }}
                />
                {slide.badge}
              </span>
            </div>

            {/* Title */}
            <h1
              className="font-medium leading-[1.08] tracking-[-0.02em]"
              style={{
                fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                fontSize: "clamp(2.4rem, 3.8vw, 3.5rem)",
                background: "linear-gradient(140deg,#1e1b4b 0%,#5b21b6 35%,#a21caf 68%,#be185d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
              dangerouslySetInnerHTML={{ __html: slide.title }}
            />

            {/* Description */}
            <p
              className="leading-relaxed max-w-xs"
              style={{ fontSize: "13.5px", color: "#8b7ba8", fontWeight: 300, lineHeight: 1.8, letterSpacing: "0.01em" }}
            >
              {slide.description}
            </p>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap pt-1">
              <Link
                to={slide.primaryLink}
                className="relative overflow-hidden text-white font-medium"
                style={{
                  padding: "12px 30px",
                  borderRadius: "100px",
                  fontSize: "12.5px",
                  letterSpacing: "0.06em",
                  background: "linear-gradient(135deg,#6d28d9 0%,#7c3aed 30%,#a855f7 65%,#db2777 100%)",
                  boxShadow: "0 6px 24px rgba(109,40,217,0.4),0 2px 8px rgba(219,39,119,0.2),inset 0 1px 0 rgba(255,255,255,0.2)",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 10px 36px rgba(109,40,217,0.5),0 4px 14px rgba(219,39,119,0.3),inset 0 1px 0 rgba(255,255,255,0.2)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 6px 24px rgba(109,40,217,0.4),0 2px 8px rgba(219,39,119,0.2),inset 0 1px 0 rgba(255,255,255,0.2)"; }}
              >
                <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.2),transparent 55%)" }} />
                {slide.primaryCTA}
              </Link>

              <Link
                to={slide.secondaryLink}
                style={{
                  padding: "11px 26px",
                  borderRadius: "100px",
                  fontSize: "12.5px",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  color: "#7c3aed",
                  background: "rgba(245,243,255,0.5)",
                  border: "1px solid rgba(139,92,246,0.28)",
                  backdropFilter: "blur(6px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(237,233,254,0.88)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(245,243,255,0.5)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.28)"; e.currentTarget.style.transform = ""; }}
              >
                {slide.secondaryCTA}
              </Link>
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="relative overflow-hidden" >
            <img
              src={slide.image}
              alt={slide.title?.replace(/<[^>]+>/g, "")}
              className="w-full h-full object-cover"
              style={{ ...imgStyle, minHeight: "380px" }}
            />
            {/* Gradient overlays */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(250deg,rgba(109,40,217,0.18) 0%,rgba(139,92,246,0.08) 40%,transparent 65%), linear-gradient(to right,rgba(250,248,255,0.45) 0%,transparent 28%)",
              }}
            />
            {/* Subtle vertical line accent */}
            <div
              className="absolute top-[20%] right-0 w-px pointer-events-none"
              style={{ height: "60%", background: "linear-gradient(to bottom,transparent,rgba(216,180,254,0.4),transparent)" }}
            />
            
          </div>
        </div>

        {/* ── Bottom nav bar ── */}
        <div
  className="flex items-center gap-3 px-12 py-4"
  style={{ borderTop: "1px solid rgba(167,139,250,0.1)" }}
>
          {/* Dot indicators */}
          <div className="flex items-center gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  height: "2px",
                  borderRadius: "100px",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  width: i === currentSlide ? "32px" : "10px",
                  opacity: i === currentSlide ? 1 : 0.35,
                  background: i === currentSlide
                    ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                    : "#c4b5fd",
                  transition: "width 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
                }}
              />
            ))}
          </div>

          

          {/* Arrow buttons */}
          <div className="flex gap-2 ml-auto">
            {[
              { label: "Previous", icon: <ArrowLeft size={14} />, action: () => goTo((currentSlide - 1 + heroSlides.length) % heroSlides.length) },
              { label: "Next", icon: <ArrowRight size={14} />, action: () => goTo((currentSlide + 1) % heroSlides.length) },
            ].map(({ label, icon, action }) => (
              <button
                key={label}
                onClick={action}
                aria-label={label}
                style={{
                  width: "38px", height: "38px", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: "1px solid rgba(139,92,246,0.22)",
                  background: "rgba(250,245,255,0.6)",
                  color: "#7c3aed", cursor: "pointer",
                  backdropFilter: "blur(6px)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(237,233,254,0.9)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)"; e.currentTarget.style.transform = "scale(1.08)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(250,245,255,0.6)"; e.currentTarget.style.borderColor = "rgba(139,92,246,0.22)"; e.currentTarget.style.transform = ""; }}
                onMouseDown={e => { e.currentTarget.style.transform = "scale(0.94)"; }}
                onMouseUp={e => { e.currentTarget.style.transform = "scale(1.08)"; }}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* ── Progress bar ── */}
        
      </div>
    </section>
  );
};

export default HomeHero;