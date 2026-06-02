import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { aiSlides } from "../../../content/home/aiSlides";

const SmartCartAI = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % aiSlides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + aiSlides.length) % aiSlides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      {/* Outer ambient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "500px",
          height: "200px",
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(90px)",
          opacity: 0.08,
        }}
      />

      <div
        className="relative overflow-hidden"
        style={{
          minHeight: "540px",
          borderRadius: "36px",
          background:"linear-gradient(145deg,#faf7ff 0%,#f5f0ff 45%,#fff5fb 100%)",
          border: "1px solid rgba(167,139,250,0.14)",
          boxShadow:"0 0 0 1px rgba(255,255,255,0.7) inset, 0 30px 80px rgba(124,58,237,0.1), 0 8px 30px rgba(236,72,153,0.06)",
        }}
      >
        {/* Decorative orbs */}
        <div
          aria-hidden="true"
          className="absolute -top-20 left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
          style={{
            width: "320px",
            height: "320px",
            background:"radial-gradient(circle,rgba(124,58,237,0.18) 0%,rgba(168,85,247,0.08) 50%,transparent 75%)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -right-16 rounded-full pointer-events-none"
          style={{
            width: "260px",
            height: "260px",
            background:
              "radial-gradient(circle,rgba(219,39,119,0.1) 0%,transparent 70%)",
          }}
        />

        {/* ── Slides ── */}
        {aiSlides.map((slide, index) => (
          <div
            key={slide.id}
            className="absolute inset-0"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              transform:
                currentSlide === index ? "translateX(0)" : "translateX(20px)",
              transition:
                "opacity 0.7s ease, transform 0.7s cubic-bezier(0.22,1,0.36,1)",
              pointerEvents: currentSlide === index ? "all" : "none",
            }}
          >
            <div
              className="grid h-full lg:grid-cols-2"
              style={{ minHeight: "540px" }}
            >
              {/* ── Left: Content ── */}
              <div
                className="relative z-10 flex flex-col justify-center py-14"
                style={{
                  paddingLeft: "5rem",
                  paddingRight: "3rem",
                }}
              >
                {/* Badge */}
                <span
                  className="mb-6 inline-flex w-fit items-center gap-2"
                  style={{
                    padding: "6px 16px",
                    borderRadius: "100px",
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "#6d28d9",
                    background: "rgba(109,40,217,0.08)",
                    border: "1px solid rgba(109,40,217,0.14)",
                    marginBottom: "1.5rem",
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 flex-shrink-0"
                    style={{
                      borderRadius: "1px",
                      transform: "rotate(45deg)",
                      background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                    }}
                  />
                  {slide.badge}
                </span>

                {/* Title */}
                <h2
                  className="leading-[1.05] tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(2.2rem,4vw,3.4rem)",
                    fontWeight: 500,
                    marginBottom: "1.1rem",
                    background:
                      "linear-gradient(140deg,#1e1b4b 0%,#5b21b6 35%,#a21caf 68%,#be185d 100%)",

                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                  dangerouslySetInnerHTML={{ __html: slide.title }}
                />

                {/* Description */}
                <p
                  className="max-w-md"
                  style={{
                    color: "#7c6fa0",
                    lineHeight: 1.85,
                    fontSize: "14px",
                    fontWeight: 300,
                    marginBottom: "1.5rem",
                  }}
                >
                  {slide.description}
                </p>

                {/* Feature pills */}
                <div className="mb-8 flex flex-wrap gap-2">
                  {slide.features.map((feature) => (
                    <span
                      key={feature}
                      className="transition-all duration-200"
                      style={{
                        padding: "6px 14px",
                        borderRadius: "100px",
                        fontSize: "11px",
                        fontWeight: 500,
                        color: "#4c1d95",
                        background: "rgba(255,255,255,0.9)",
                        border: "1px solid rgba(167,139,250,0.2)",
                        backdropFilter: "blur(12px)",
                        cursor: "default",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(237,233,254,0.9)";
                        e.currentTarget.style.borderColor =
                          "rgba(139,92,246,0.4)";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255,255,255,0.75)";
                        e.currentTarget.style.borderColor =
                          "rgba(167,139,250,0.2)";
                        e.currentTarget.style.transform = "";
                      }}
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                <br />

                {/* CTA */}
                <Link
                  to={slide.ctaLink}
                  className="relative inline-flex w-fit items-center gap-2 overflow-hidden font-semibold text-white"
                  style={{
                    padding: "13px 28px",
                    borderRadius: "100px",
                    fontSize: "12.5px",
                    letterSpacing: "0.05em",
                    background:
                      "linear-gradient(135deg,#6d28d9 0%,#7c3aed 35%,#a855f7 65%,#db2777 100%)",
                    boxShadow:
                      "0 6px 24px rgba(109,40,217,0.38),0 2px 8px rgba(219,39,119,0.18),inset 0 1px 0 rgba(255,255,255,0.2)",
                    textDecoration: "none",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 36px rgba(109,40,217,0.5),0 4px 14px rgba(219,39,119,0.28),inset 0 1px 0 rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(109,40,217,0.38),0 2px 8px rgba(219,39,119,0.18),inset 0 1px 0 rgba(255,255,255,0.2)";
                  }}
                >
                  <span
                    className="absolute inset-0 rounded-full pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(255,255,255,0.2),transparent 55%)",
                    }}
                  />
                  {slide.ctaText}
                  {slide.visualType === "recommendation-engine" ? (
                    <Sparkles size={14} />
                  ) : (
                    <MessageSquare size={14} />
                  )}
                </Link>
              </div>

              {/* ── Right: Visual ── */}
              <div className="relative hidden items-center justify-center lg:flex">
                {slide.visualType === "recommendation-engine" ? (
                  <div className="relative flex h-full w-full items-center justify-center">
                    {/* AI Orb */}
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="relative flex items-center justify-center"
                      style={{
                        width: "240px",
                        height: "240px",
                        borderRadius: "50%",
                        background: `
radial-gradient(circle at 30% 30%, rgba(255,255,255,0.28), transparent 35%),
linear-gradient(
135deg,
#5b21b6 0%,
#7c3aed 30%,
#9333ea 55%,
#c026d3 78%,
#ec4899 100%
)
`,
                        boxShadow: `
  0 0 0 1px rgba(255,255,255,0.18) inset,
  0 0 90px rgba(124,58,237,0.45),
  0 0 140px rgba(168,85,247,0.22),
  0 0 180px rgba(236,72,153,0.12)
  `,
                      }}
                    >
                      {/* Outer Ring 1 */}
                      <div
                        className="absolute"
                        style={{
                          width: "330px",
                          height: "330px",
                          borderRadius: "50%",
                          border: "1px solid rgba(168,85,247,0.18)",
                        }}
                      />

                      {/* Outer Ring 2 */}
                      <div
                        className="absolute"
                        style={{
                          width: "400px",
                          height: "400px",
                          borderRadius: "50%",
                          border: "1px solid rgba(168,85,247,0.10)",
                        }}
                      />
                      <div
                        className="flex flex-col items-center justify-center"
                        style={{
                          width: "165px",
                          height: "165px",
                          borderRadius: "50%",
                          background:
                            "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), rgba(255,255,255,0.06))",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(255,255,255,0.22)",
                          boxShadow: `
      inset 0 0 40px rgba(255,255,255,0.08),
      0 0 40px rgba(255,255,255,0.06)
    `,
                        }}
                      >
                        <span
                          style={{
                            color: "#fff",
                            fontSize: "12px",
                            fontWeight: 700,
                            letterSpacing: "0.35em",
                            textTransform: "uppercase",
                            opacity: 0.95,
                          }}
                        >
                          SMARTCART
                        </span>

                        <span
                          style={{
                            color: "#fff",
                            fontSize: "58px",
                            fontWeight: 600,
                            lineHeight: 1,
                            marginTop: "4px",
                          }}
                        >
                          AI
                        </span>

                        <span
                          style={{
                            color: "rgba(255,255,255,0.85)",
                            fontSize: "10px",
                            fontWeight: 600,
                            letterSpacing: "0.12em",
                            textTransform: "uppercase",
                            textAlign: "center",
                            marginTop: "6px",
                            lineHeight: 1.5,
                          }}
                        >
                          Intelligent
                          <br />
                          Match Engine
                        </span>
                      </div>
                      {/* Pulse rings */}
                      <div
                        className="absolute animate-ping"
                        style={{
                          inset: "-12px",
                          borderRadius: "50%",
                          border: "1px solid rgba(124,58,237,0.25)",
                        }}
                      />
                      <div
                        className="absolute animate-ping"
                        style={{
                          inset: "-28px",
                          borderRadius: "50%",
                          border: "1px solid rgba(124,58,237,0.12)",
                          animationDelay: "0.8s",
                        }}
                      />
                    </motion.div>

                    {/* Floating product cards */}
                    {[
                      {
                        label: "Sony WH-XM5",
                        match: 96,
                        pct: "96%",
                        pos: { top: "12%", left: "2%" },
                        delay: 0,
                        dur: 4,
                        image:
                          "https://i.pinimg.com/736x/e4/d9/16/e4d9160f6976ad2268dd38519ea79127.jpg",
                      },
                      {
                        label: "Apple Watch S9",
                        match: 94,
                        pct: "94%",
                        pos: { top: "14%", right: "1%" },
                        delay: 0,
                        dur: 5,
                        image:
                          "https://i.pinimg.com/736x/e8/9f/d4/e89fd4a025aea0ffcce91d0c71bf2dbc.jpg",
                      },
                      {
                        label: "Nike Air Max 270",
                        match: 91,
                        pct: "91%",
                        pos: { bottom: "10%", left: "8%" },
                        delay: 0,
                        dur: 6,
                        image:
                          "https://i.pinimg.com/736x/5c/bc/1a/5cbc1ab98b1d747a862e2d0d8f15d416.jpg",
                      },
                    ].map((item) => (
                      <motion.div
                        key={item.label}
                        className="absolute"
                        style={{ ...item.pos }}
                        animate={{
                          y: [
                            0,
                            -(item.dur === 4 ? 14 : item.dur === 5 ? 18 : 10),
                            0,
                          ],
                        }}
                        transition={{
                          duration: item.dur,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          className="group cursor-default transition-all duration-250"
                          style={{
                            minWidth: "210px",
                            padding: "16px 18px",
                            borderRadius: "24px",
                            background: "rgba(255,255,255,0.92)",
                            backdropFilter: "blur(16px)",
                            border: "1px solid rgba(255,255,255,0.6)",
                            boxShadow:
                              "0 20px 45px rgba(124,58,237,0.12), 0 4px 12px rgba(255,255,255,0.6) inset",
                            transition:
                              "transform 0.25s ease, box-shadow 0.25s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform =
                              "translateY(-4px) scale(1.03)";
                            e.currentTarget.style.boxShadow =
                              "0 16px 40px rgba(124,58,237,0.18)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "";
                            e.currentTarget.style.boxShadow =
                              "0 8px 32px rgba(124,58,237,0.1)";
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={item.image}
                              alt={item.label}
                              style={{
                                width: "54px",
                                height: "54px",
                                objectFit: "contain",
                              }}
                            />
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: "13px",
                                color: "#1e1b4b",
                                marginBottom: "4px",
                              }}
                            >
                              {item.label}
                            </div>
                          </div>

                          <div
                            style={{
                              fontSize: "11px",
                              fontWeight: 700,
                              letterSpacing: "0.04em",
                              background:
                                "linear-gradient(90deg,#7c3aed,#ec4899)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                              backgroundClip: "text",
                            }}
                          >
                            {item.pct} Match
                          </div>
                          {/* Mini progress bar */}
                          <div
                            style={{
                              marginTop: "7px",
                              height: "2px",
                              borderRadius: "2px",
                              width: item.pct,
                              background:
                                "linear-gradient(90deg,#7c3aed,#ec4899)",
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                    {[
                      {
                        label: "Gaming",
                        pos: { top: "4%", right: "33%" },
                        dur: 4,
                      },
                      {
                        label: "Fitness",
                        pos: { top: "40%", right: "2%" },
                        dur: 5,
                      },
                      {
                        label: "Audio",
                        pos: { left: "4%", top: "40%" },
                        dur: 4.5,
                      },
                      {
                        label: "Fashion",
                        pos: { left: "10%", bottom: "36%" },
                        dur: 5.5,
                      },
                      {
                        label: "Home",
                        pos: { right: "14%", bottom: "36%" },
                        dur: 4.8,
                      },
                      {
                        label: "Tech",
                        pos: { right: "28%", bottom: "10%" },
                        dur: 6,
                      },
                    ].map((chip) => (
                      <motion.div
                        key={chip.label}
                        className="absolute"
                        style={chip.pos}
                        animate={{
                          y: [0, -8, 0],
                        }}
                        transition={{
                          duration: chip.dur,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 18px",
                            borderRadius: "999px",
                            background: "rgba(255,255,255,0.88)",
                            border: "1px solid rgba(255,255,255,0.8)",
                            backdropFilter: "blur(18px)",
                            color: "#6d28d9",
                            fontSize: "13px",
                            fontWeight: 600,
                            boxShadow: "0 12px 30px rgba(124,58,237,0.08)",
                          }}
                        >
                          {chip.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="relative flex h-full w-full items-center justify-center px-6">
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      style={{
                        width: "100%",
                        maxWidth: "520px",
                        borderRadius: "36px",
                        padding: "20px",
                        background: "rgba(255,255,255,0.82)",
                        backdropFilter: "blur(18px)",
                        border: "1px solid rgba(255,255,255,0.65)",
                        boxShadow:
                          "0 25px 80px rgba(124,58,237,0.12), 0 8px 30px rgba(236,72,153,0.08)",
                      }}
                    >
                      {/* User Question */}
                      <div
                        style={{
                          marginLeft: "auto",
                          width: "82%",
                          padding: "10px 14px",
                          borderRadius: "20px 20px 6px 20px",
                          background: "linear-gradient(135deg,#6d28d9,#db2777)",
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: 500,
                          lineHeight: 1.5,
                          marginBottom: "18px",
                        }}
                      >
                        Best headphones under ₹5000 for gaming?
                      </div>

                      {/* AI Status */}
                      <div
                        className="flex items-center gap-2"
                        style={{
                          marginBottom: "16px",
                          color: "#6d28d9",
                          fontSize: "13px",
                          fontWeight: 600,
                        }}
                      >
                        <motion.span
                          animate={{
                            scale: [1, 1.4, 1],
                            opacity: [0.6, 1, 0.6],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                          }}
                          style={{
                            width: "8px",
                            height: "8px",
                            borderRadius: "50%",
                            background: "#7c3aed",
                            display: "block",
                          }}
                        />
                        SmartCart AI analyzing preferences...
                      </div>

                      {/* AI Reply */}
                      <div
                        style={{
                          padding: "12px 14px",
                          borderRadius: "20px",
                          background: "#f5f0ff",
                          color: "#3b1d6e",
                          fontSize: "14px",
                          lineHeight: 1.6,
                          border: "1px solid rgba(167,139,250,0.15)",
                          marginBottom: "20px",
                        }}
                      >
                        Found 3 highly-rated gaming headphones matching your
                        budget and preferences.
                      </div>

                      {/* Products */}
                      {[
                        {
                          name: "HyperX Cloud Core",
                          price: "₹4,499",
                          match: "97%",
                          image:
                            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100",
                        },
                        {
                          name: "Logitech G435",
                          price: "₹4,299",
                          match: "94%",
                          image:
                            "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=100",
                        },
                      ].map((product) => (
                        <div
                          key={product.name}
                          style={{
                            padding: "12px 14px",
                            borderRadius: "20px",
                            background: "#fff",
                            border: "1px solid rgba(167,139,250,0.15)",
                            marginBottom: "8px",
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={product.image}
                              alt={product.name}
                              style={{
                                width: "36px",
                                height: "36px",
                                objectFit: "cover",
                                borderRadius: "12px",
                              }}
                            />

                            <div>
                              <div
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: "#1e1b4b",
                                }}
                              >
                                {product.name}
                              </div>

                              <div
                                style={{
                                  fontSize: "12px",
                                  color: "#8b5cf6",
                                  marginTop: "2px",
                                }}
                              >
                                {product.price}
                              </div>
                            </div>

                            <div
                              style={{
                                marginLeft: "auto",
                                fontSize: "13px",
                                fontWeight: 700,
                                background:
                                  "linear-gradient(90deg,#7c3aed,#ec4899)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                              }}
                            >
                              {product.match} Match
                            </div>
                          </div>

                          <div
                            style={{
                              marginTop: "12px",
                              height: "3px",
                              borderRadius: "999px",
                              background: "#ede9fe",
                            }}
                          >
                            <div
                              style={{
                                width: product.match,
                                height: "100%",
                                borderRadius: "999px",
                                background:
                                  "linear-gradient(90deg,#7c3aed,#ec4899)",
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* ── Prev / Next Arrows ── */}
        <div className="absolute bottom-3 left-10 flex items-center gap-2 z-10">
          {[
            { fn: prevSlide, icon: <ArrowLeft size={15} />, label: "Previous" },
            { fn: nextSlide, icon: <ArrowRight size={15} />, label: "Next" },
          ].map(({ fn, icon, label }) => (
            <button
              key={label}
              onClick={fn}
              aria-label={label}
              className="flex items-center justify-center"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                border: "1px solid rgba(139,92,246,0.2)",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(8px)",
                color: "#7c3aed",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.34,1.56,0.64,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(237,233,254,0.95)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.7)";
                e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
                e.currentTarget.style.transform = "";
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = "scale(0.93)";
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = "scale(1.1)";
              }}
            >
              {icon}
            </button>
          ))}
        </div>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-8 right-8 flex items-center gap-1.5 z-10">
          {aiSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Slide ${index + 1}`}
              style={{
                height: "3px",
                borderRadius: "100px",
                border: "none",
                cursor: "pointer",
                padding: 0,
                width: currentSlide === index ? "28px" : "8px",
                opacity: currentSlide === index ? 1 : 0.4,
                background:
                  currentSlide === index
                    ? "linear-gradient(90deg,#7c3aed,#ec4899)"
                    : "#c4b5fd",
                transition:
                  "width 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SmartCartAI;
