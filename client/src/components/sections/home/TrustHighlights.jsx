import { trustHighlights } from "../../../content/home/trustHighlights";

const TrustHighlights = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-10">
        <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-32 top-0 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(80px)",
          opacity: 0.07,
        }}
      />

      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-24 top-0 h-32 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(90px)",
          opacity: 0.04,
        }}
      />

      {/* Cards */}
      <div className="relative grid md:grid-cols-3 gap-4">
        {trustHighlights.map((item, index) => {
          const Icon = item.icon;
          const num = String(index + 1).padStart(2, "0");

          return (
            <div
              key={index}
              className="group relative overflow-hidden"
              style={{
                padding: "2rem",
                borderRadius: "28px",
                background: "linear-gradient(160deg,#ffffff 0%,#faf7ff 100%)",
                border: "1px solid rgba(167,139,250,0.12)",
                boxShadow: "0 8px 30px rgba(124,58,237,0.05)",
                transition:
                  "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease, border-color 0.4s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.38)";
                e.currentTarget.style.boxShadow =
                  "0 28px 60px rgba(124,58,237,0.13)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.12)";
                e.currentTarget.style.boxShadow =
                  "0 8px 30px rgba(124,58,237,0.05)";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-[480ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                style={{ background: "linear-gradient(90deg,#7c3aed,#ec4899)" }}
              />

              {/* Shimmer wash */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[450ms] pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(124,58,237,0.05) 0%,transparent 55%,rgba(236,72,153,0.03) 100%)",
                }}
              />

              {/* Bottom-right corner orb — appears on hover */}
              <div
                className="absolute -bottom-10 -right-10 w-28 h-28 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle,rgba(167,139,250,0.14) 0%,transparent 70%)",
                }}
              />

              

              {/* Icon */}
              <div
                className="relative z-10 flex items-center justify-center transition-all duration-[380ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 "
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg,#7c3aed,#d946ef)",
                  color: "#fff",
                  marginBottom: "1.4rem",
                  boxShadow: "0 8px 22px rgba(124,58,237,0.28)",
                  transition:
                    "transform 0.38s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.38s ease",
                }}
              >
                <Icon size={24} />
              </div>

              {/* Title */}
              <h3
                className="relative z-10 transition-colors duration-300 group-hover:text-violet-900"
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#1e1b4b",
                  marginBottom: "9px",
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </h3>

              {/* Description */}
              <p
                className="relative z-10"
                style={{
                  color: "#94a3b8",
                  fontSize: "13.5px",
                  lineHeight: 1.82,
                  fontWeight: 300,
                }}
              >
                {item.description}
              </p>

              {/* Learn more CTA — slides up on hover */}
              <div
                className="relative z-10 flex items-center gap-2 opacity-0 translate-y-1.5 transition-all duration-[380ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:translate-y-0"
                style={{ marginTop: "1.3rem" }}
              >
                <span
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Learn more
                </span>
                <div
                  className="h-[1.5px] rounded-full group-hover:w-10 transition-all duration-[400ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                  style={{
                    width: "20px",
                    background: "linear-gradient(90deg,#a855f7,#ec4899)",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default TrustHighlights;