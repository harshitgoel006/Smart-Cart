import { whySmartCart } from "../../../content/home/whySmartCart";
import { motion } from "framer-motion";

const stats = [
  {
    value: "AI",
    desc: "Personalized product discovery powered by intelligent recommendations.",
  },

  {
    value: "Secure",
    desc: "Protected transactions and trusted checkout experience.",
    offset: true,
  },

  {
    value: "Instant",
    desc: "Find the right products faster with smart search technology.",
  },

  {
    value: "24/7",
    desc: "Dedicated support designed around your shopping journey.",
    offset: true,
  },
];

const WhySmartCart = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-32 top-0 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(80px)",
          opacity: 0.07,
        }}
      />

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-20 flex flex-col md:flex-row md:justify-between gap-10"
      >
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <div
              className="h-[2px] w-12 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              className="text-[9.5px] font-semibold tracking-[0.3em] uppercase"
              style={{ color: "#7c3aed" }}
            >
              Why SmartCart
            </span>
          </div>

          <h2
            className="leading-[1.05] font-medium"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2.4rem,5vw,3.6rem)",
              color: "#1e1b4b",
            }}
          >
            Shopping{" "}
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
              Reimagined
            </em>
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-5">
          <div className="w-[380px]">
            <p
              className="max-w-sm text-sm leading-relaxed font-light"
              style={{
                color: "#94a3b8",
                borderLeft: "1px solid rgba(167,139,250,0.25)",
                paddingLeft: "1.25rem",
              }}
            >
              Experience smarter discovery, trusted payments, fast delivery and
              support designed around you.
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Body ── */}
      <div className="grid lg:grid-cols-2 gap-16 items-center">

        {/* ── Left: Feature cards ── */}
        <div className="flex flex-col gap-3">
          {whySmartCart.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative flex items-start gap-5 overflow-hidden"
                style={{
                  padding: "1.25rem 1.4rem",
                  borderRadius: "22px",
                  border: "1px solid rgba(167,139,250,0.12)",
                  background: "linear-gradient(160deg,#ffffff 0%,#faf7ff 100%)",
                  boxShadow: "0 2px 12px rgba(0,0,0,0.02)",
                  transition:
                    "transform 0.45s cubic-bezier(0.22,1,0.36,1), border-color 0.35s ease, box-shadow 0.45s ease",
                  cursor: "default",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateX(4px)";
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
                  e.currentTarget.style.boxShadow = "0 16px 40px rgba(124,58,237,0.1)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.12)";
                  e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.02)";
                }}
              >
                {/* Left accent bar — slides down on hover */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] origin-top scale-y-0 transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100 pointer-events-none"
                  style={{
                    borderRadius: "3px 0 0 3px",
                    background: "linear-gradient(180deg,#7c3aed,#ec4899)",
                  }}
                />

                {/* Icon */}
                <div
                  className="flex items-center justify-center flex-shrink-0 transition-all duration-[350ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 "
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "16px",
                    background: "linear-gradient(135deg,#7c3aed,#d946ef)",
                    color: "#fff",
                    boxShadow: "0 6px 20px rgba(124,58,237,0.3)",
                    transition:
                      "transform 0.35s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.35s ease",
                  }}
                >
                  <Icon size={22} />
                </div>

                {/* Text */}
                <div>
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "#1e1b4b",
                      marginBottom: "5px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "#94a3b8",
                      fontSize: "13px",
                      lineHeight: 1.8,
                      fontWeight: 300,
                    }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Right: Stats grid ── */}
        <div className="relative min-h-[480px] flex items-center justify-center">

          {/* Ambient glow */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none"
            style={{
              width: "430px",
              height: "430px",
              borderRadius: "50%",
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.15),rgba(236,72,153,0.1))",
              filter: "blur(110px)",
            }}
          />

          <div className="relative grid grid-cols-2 gap-4 w-full max-w-[480px]">
            {stats.map((stat, i) => (
              <div
                key={i}
                className="group relative overflow-hidden cursor-default"
                style={{
                  padding: "1.6rem",
                  borderRadius: "24px",
                  background: "linear-gradient(160deg,#ffffff 0%,#faf7ff 100%)",
                  border: "1px solid rgba(167,139,250,0.14)",
                  boxShadow: "0 8px 30px rgba(124,58,237,0.07)",
                  marginTop: stat.offset ? "36px" : "0",
                  minHeight: "190px",
                  transition:
                    "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.4s ease",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 24px 50px rgba(124,58,237,0.15)";
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.38)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = "";
                  e.currentTarget.style.boxShadow = "0 8px 30px rgba(124,58,237,0.07)";
                  e.currentTarget.style.borderColor = "rgba(167,139,250,0.14)";
                }}
              >
                {/* Top accent line on hover */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                  style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
                />

                {/* Number */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.4rem",
                    fontWeight: 600,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                    background:
                      "linear-gradient(135deg,#4c1d95,#7c3aed,#c026d3)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {stat.value}
                </div>

                {/* Description */}
                <p
                  style={{
                    marginTop: "9px",
                    fontSize: "13.5px",
                    color: "#94a3b8",
                    lineHeight: 1.8,
                    fontWeight: 300,
                  }}
                >
                  
                  {stat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySmartCart;