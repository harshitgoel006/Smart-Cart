import { motion } from "framer-motion";

const trustItems = [
  "50K+ Products",
  "10 Categories",
  "100+ Brands",
  "AI Recommendations",
  "Secure Checkout",
  "24/7 Support",
  "Fast Delivery",
];

const CategoryTrustStrip = () => {
  return (
    <section
  className="relative overflow-hidden"
  style={{
    paddingTop: "3.5rem",
    paddingBottom: "3.5rem",
  }}
>

      {/* Top Border */}
      <div
        className="absolute top-0 left-0 w-full h-px"
        style={{
          background: "linear-gradient(to right,transparent,#8b5cf6,transparent)",
          opacity: 0.45,
        }}
      />

      {/* Bottom Border */}
      <div
        className="absolute bottom-0 left-0 w-full h-px"
        style={{
          background: "linear-gradient(to right,transparent,#d946ef,transparent)",
          opacity: 0.45,
        }}
      />

      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg,rgba(250,247,255,.75),rgba(255,255,255,.9))",
        }}
      />

      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at center,rgba(124,58,237,.1),transparent 70%)",
        }}
      />

      {/* Edge fade masks — marquee fades in/out at the section edges */}
      <div
        className="absolute top-0 left-0 h-full w-20 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to right,#fff,transparent)" }}
      />
      <div
        className="absolute top-0 right-0 h-full w-20 z-[5] pointer-events-none"
        style={{ background: "linear-gradient(to left,#fff,transparent)" }}
      />

      {/* Marquee */}
      <motion.div
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative flex whitespace-nowrap items-center"
        whileHover={{ transition: { duration: 0 } }}
      >
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex items-center gap-10 shrink-0"
          >
            {trustItems.map((item, idx) => (
              <div
                key={`${i}-${idx}`}
                className="group flex items-center gap-10 cursor-default"
              >
                <span
                  className="inline-block transition-all duration-300 group-hover:-translate-y-0.5"
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: ".25em",
                    color: "#6d28d9",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "#be185d"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "#6d28d9"; }}
                >
                  {item}
                </span>

                <div
                  className="flex-shrink-0 transition-all duration-[400ms]"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "999px",
                    background: "linear-gradient(135deg,#8b5cf6,#d946ef)",
                    boxShadow: "0 0 12px rgba(139,92,246,.35)",
                    transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.4)";
                    e.currentTarget.style.boxShadow = "0 0 20px rgba(217,70,239,0.55)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "0 0 12px rgba(139,92,246,.35)";
                  }}
                />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </section>
  );
};

export default CategoryTrustStrip;