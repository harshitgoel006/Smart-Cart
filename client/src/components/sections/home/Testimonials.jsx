import { motion } from "framer-motion";
import { testimonials } from "../../../content/home/testimonials";

const avatarGradients = [
  "linear-gradient(135deg,#6d28d9,#a855f7)",
  "linear-gradient(135deg,#be185d,#ec4899)",
  "linear-gradient(135deg,#5b21b6,#d946ef)",
];

const initials = (name) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("");

const StarRow = ({ count = 5, small = false }) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <div
        key={i}
        style={{
          width: small ? "12px" : "15px",
          height: small ? "12px" : "15px",
          borderRadius: "3px",
          background: "linear-gradient(135deg,#f59e0b,#fbbf24)",
          clipPath:
            "polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)",
          flexShrink: 0,
        }}
      />
    ))}
    <span
      style={{
        fontSize: small ? "10.5px" : "11.5px",
        fontWeight: 600,
        color: "#1e1b4b",
        marginLeft: "7px",
        letterSpacing: "0.02em",
      }}
    >
      {count}.0
    </span>
  </div>
);

const Testimonials = () => {
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-20 top-0 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(90px)",
          opacity: 0.06,
        }}
      />
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-16 flex flex-col md:flex-row md:justify-between gap-10"
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
              Customer Stories
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
            Loved by{" "}
            <em
              style={{
                fontStyle: "italic",
                fontWeight: 400,
                background: "linear-gradient(135deg,#6d28d9,#c026d3)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Thousands
            </em>
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-5">
          <p
            className="max-w-sm text-sm leading-relaxed font-light"
            style={{
              color: "#94a3b8",
              borderLeft: "1px solid rgba(167,139,250,0.25)",
              paddingLeft: "1.25rem",
            }}
          >
            Real experiences from real shoppers who found exactly what they were
            looking for — and more.
          </p>
        </div>
      </motion.div>

      <br />
      <br />

      {/* ── Cards Grid ── */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5"
      >
        {/* ── Featured Testimonial ── */}
        <div
          className="relative overflow-hidden flex flex-col justify-between"
          style={{
            minHeight: "420px",
            padding: "3rem",
            borderRadius: "36px",
            background: "linear-gradient(160deg,#ffffff 0%,#faf7ff 100%)",
            border: "1px solid rgba(167,139,250,0.15)",
            boxShadow: "0 25px 60px rgba(124,58,237,0.08)",
            transition:
              "transform 0.5s cubic-bezier(0.22,1,0.36,1), box-shadow 0.5s ease",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow =
              "0 40px 80px rgba(124,58,237,0.14)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "";
            e.currentTarget.style.boxShadow =
              "0 25px 60px rgba(124,58,237,0.08)";
          }}
        >
          {/* Top accent bar */}
          <div
            className="absolute top-0 left-0 right-0 h-[3px] pointer-events-none"
            style={{
              background: "linear-gradient(90deg,#7c3aed,#a855f7,#ec4899)",
              borderRadius: "36px 36px 0 0",
            }}
          />

          {/* Ambient orb */}
          <div
            aria-hidden="true"
            className="absolute -top-20 -right-16 pointer-events-none"
            style={{
              width: "260px",
              height: "260px",
              borderRadius: "50%",
              background:
                "radial-gradient(circle,rgba(124,58,237,0.16) 0%,rgba(236,72,153,0.1) 55%,transparent 80%)",
              filter: "blur(40px)",
            }}
          />

          {/* Big decorative quote */}
          <div
            aria-hidden="true"
            className="absolute pointer-events-none select-none"
            style={{
              top: "-6px",
              right: "28px",
              fontSize: "9rem",
              fontFamily: "'Cormorant Garamond', serif",
              color: "rgba(124,58,237,0.05)",
              lineHeight: 1,
            }}
          >
            "
          </div>

          {/* Stars + Review */}
          <div className="relative z-10">
            <div style={{ marginBottom: "1.6rem" }}>
              <StarRow count={testimonials[0].rating} />
            </div>

            <p
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.75rem",
                lineHeight: 1.65,
                color: "#312e81",
                fontWeight: 400,
                maxWidth: "90%",
              }}
            >
              {testimonials[0].review}
            </p>
          </div>

          {/* User */}
          <div
            className="relative z-10 flex items-center gap-4"
            style={{ marginTop: "3rem" }}
          >
            {/* Avatar */}
            <div
              className="flex items-center justify-center flex-shrink-0 font-bold text-white"
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "50%",
                fontSize: "18px",
                background: avatarGradients[0],
                boxShadow: "0 4px 16px rgba(124,58,237,0.3)",
              }}
            >
              {initials(testimonials[0].name)}
            </div>

            {/* Divider */}
            <div
              style={{
                width: "1px",
                height: "30px",
                background:
                  "linear-gradient(to bottom,transparent,rgba(167,139,250,0.3),transparent)",
                flexShrink: 0,
              }}
            />

            <div>
              <h4
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  color: "#1e1b4b",
                  letterSpacing: "-0.01em",
                }}
              >
                {testimonials[0].name}
              </h4>
              <p
                style={{
                  marginTop: "3px",
                  color: "#94a3b8",
                  fontSize: "12px",
                  fontWeight: 300,
                }}
              >
                {testimonials[0].role}
              </p>
              {/* Verified badge */}
              <div
                className="inline-flex items-center gap-1 font-semibold uppercase"
                style={{
                  marginTop: "5px",
                  fontSize: "9px",
                  letterSpacing: "0.1em",
                  color: "#7c3aed",
                }}
              >
                ✓ Verified Buyer
              </div>
            </div>
          </div>
        </div>

        {/* ── Side Testimonials ── */}
        <div className="flex flex-col gap-4">
          {testimonials.slice(1).map((item, i) => (
            <div
              key={item.id}
              className="group relative overflow-hidden flex flex-col justify-between flex-1"
              style={{
                padding: "1.6rem 1.8rem",
                borderRadius: "26px",
                background: "linear-gradient(160deg,#ffffff 0%,#faf7ff 100%)",
                border: "1px solid rgba(167,139,250,0.12)",
                boxShadow: "0 8px 28px rgba(124,58,237,0.05)",
                transition:
                  "transform 0.5s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease, box-shadow 0.5s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.38)";
                e.currentTarget.style.boxShadow =
                  "0 24px 55px rgba(124,58,237,0.13)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.borderColor = "rgba(167,139,250,0.12)";
                e.currentTarget.style.boxShadow =
                  "0 8px 28px rgba(124,58,237,0.05)";
              }}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 left-0 right-0 h-[2px] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                style={{
                  background: "linear-gradient(90deg,#7c3aed,#ec4899)",
                }}
              />

              {/* Shimmer wash */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(135deg,rgba(124,58,237,0.04) 0%,transparent 60%,rgba(236,72,153,0.03) 100%)",
                }}
              />

              {/* Stars */}
              <div style={{ marginBottom: "1rem" }}>
                <StarRow count={item.rating} small />
              </div>

              {/* Review */}
              <p
                className="relative z-10"
                style={{
                  color: "#475569",
                  fontSize: "13.5px",
                  lineHeight: 1.82,
                  fontWeight: 300,
                  flex: 1,
                  marginBottom: "1.4rem",
                }}
              >
                {item.review}
              </p>

              {/* User */}
              <div className="relative z-10 flex items-center gap-3">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center flex-shrink-0 font-bold text-white"
                  style={{
                    width: "38px",
                    height: "38px",
                    borderRadius: "50%",
                    fontSize: "13px",
                    background: avatarGradients[i + 1] ?? avatarGradients[0],
                    boxShadow: "0 3px 12px rgba(124,58,237,0.25)",
                  }}
                >
                  {initials(item.name)}
                </div>

                {/* Divider */}
                <div
                  style={{
                    width: "1px",
                    height: "26px",
                    background:
                      "linear-gradient(to bottom,transparent,rgba(167,139,250,0.3),transparent)",
                    flexShrink: 0,
                  }}
                />

                <div>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: 600,
                      color: "#1e1b4b",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.name}
                  </h4>
                  <p
                    style={{
                      marginTop: "2px",
                      fontSize: "11px",
                      color: "#94a3b8",
                      fontWeight: 300,
                    }}
                  >
                    {item.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default Testimonials;
