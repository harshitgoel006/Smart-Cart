import { ArrowRight, Instagram, Linkedin, Github, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "../../constants/footerData";

const Footer = () => {
  return (
    <footer
      className="relative mt-20 overflow-hidden"
      style={{
        background: "linear-gradient(170deg,#faf7ff 0%,#f5f0ff 50%,#fff5fb 100%)",
        borderTop: "1px solid rgba(167,139,250,0.14)",
      }}
    >
      {/* Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
        style={{
          width: "500px", height: "200px",
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-20">

        {/* ── Top CTA strip ── */}
        <div
          className="grid lg:grid-cols-[1.2fr_0.8fr] gap-12 items-center"
          style={{
            paddingBottom: "3.5rem",
            borderBottom: "1px solid rgba(167,139,250,0.14)",
            marginBottom: "3.5rem",
          }}
        >
          {/* Left */}
          <div>
            {/* Brand name — gradient serif */}
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.8rem,5vw,3.8rem)",
                fontWeight: 500,
                lineHeight: 1,
                background: "linear-gradient(140deg,#1e1b4b 0%,#5b21b6 40%,#a21caf 70%,#be185d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              SmartCart
            </h2>

            <p
              style={{
                marginTop: "0.9rem",
                fontSize: "1.05rem",
                color: "#475569",
                maxWidth: "620px",
                lineHeight: 1.9,
              }}
            >
              <strong style={{ color: "#312e81", fontWeight: 500 }}>
                Curated for modern shoppers.
              </strong>
              <br />
              Built for effortless discovery.
            </p>

            <p
              style={{
                marginTop: "0.7rem",
                maxWidth: "650px",
                color: "#94a3b8",
                lineHeight: 1.85,
                fontSize: "13.5px",
                fontWeight: 300,
              }}
            >
              Discover products smarter with intelligent recommendations, premium
              experiences and seamless shopping journeys.
            </p>

            <Link
              to="/products"
              className="relative overflow-hidden inline-flex items-center gap-2 text-white font-medium"
              style={{
                marginTop: "1.8rem",
                padding: "11px 24px",
                borderRadius: "100px",
                fontSize: "12.5px",
                letterSpacing: "0.06em",
                background: "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
                boxShadow: "0 6px 22px rgba(109,40,217,0.38),inset 0 1px 0 rgba(255,255,255,0.2)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                textDecoration: "none",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(109,40,217,0.5),inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 6px 22px rgba(109,40,217,0.38),inset 0 1px 0 rgba(255,255,255,0.2)";
              }}
            >
              <span className="absolute inset-0 rounded-full pointer-events-none" style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.18),transparent 55%)" }} />
              Explore Products
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right — stat chips */}
          <div className="flex flex-col items-start gap-5">
            {/* Badge */}
            <span
              className="inline-flex items-center gap-2"
              style={{
                padding: "5px 14px", borderRadius: "100px",
                fontSize: "9.5px", fontWeight: 700,
                letterSpacing: "0.28em", textTransform: "uppercase",
                color: "#6d28d9",
                background: "rgba(237,233,254,0.8)",
                border: "1px solid rgba(139,92,246,0.22)",
              }}
            >
              <span style={{ width: "5px", height: "5px", borderRadius: "1px", transform: "rotate(45deg)", background: "linear-gradient(135deg,#a855f7,#ec4899)", flexShrink: 0 }} />
              Trusted by thousands
            </span>

            {/* Stats row */}
            <div className="flex items-center gap-5">
              {[
                { num: "10M+", label: "Products viewed" },
                { num: "50K+", label: "Happy shoppers" },
                { num: "4.9★", label: "Avg rating" },
              ].map((s, i) => (
                <div key={s.num} className="flex items-center gap-5">
                  <div className="flex flex-col gap-0.5">
                    <span
                      style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "1.8rem", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.03em",
                        background: "linear-gradient(135deg,#4c1d95,#7c3aed,#c026d3)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                      }}
                    >
                      {s.num}
                    </span>
                    <span style={{ fontSize: "10.5px", color: "#94a3b8", fontWeight: 300, letterSpacing: "0.05em" }}>
                      {s.label}
                    </span>
                  </div>
                  {i < 2 && (
                    <div style={{ width: "1px", height: "36px", background: "linear-gradient(to bottom,transparent,rgba(167,139,250,0.3),transparent)", flexShrink: 0 }} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Links grid ── */}
        <div
          className="grid md:grid-cols-4 gap-12"
          style={{ paddingBottom: "3rem", borderBottom: "1px solid rgba(167,139,250,0.12)" }}
        >
          {/* Brand column */}
          <div>
            <h4
              className="flex items-center gap-2 mb-5"
              style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7c3aed" }}
            >
              <span style={{ width: "16px", height: "1.5px", borderRadius: "2px", background: "linear-gradient(90deg,#7c3aed,#d946ef)", flexShrink: 0 }} />
              SmartCart
            </h4>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, fontSize: "13px", fontWeight: 300 }}>
              Premium ecommerce experience powered by intelligent discovery.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4
              className="flex items-center gap-2 mb-5"
              style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7c3aed" }}
            >
              <span style={{ width: "16px", height: "1.5px", borderRadius: "2px", background: "linear-gradient(90deg,#7c3aed,#d946ef)", flexShrink: 0 }} />
              Shop
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="group relative text-sm font-light"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s ease, transform 0.2s ease", display: "block", padding: "2px 0" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#6d28d9"; e.currentTarget.style.transform = "translateX(3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = ""; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4
              className="flex items-center gap-2 mb-5"
              style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7c3aed" }}
            >
              <span style={{ width: "16px", height: "1.5px", borderRadius: "2px", background: "linear-gradient(90deg,#7c3aed,#d946ef)", flexShrink: 0 }} />
              Company
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm font-light"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s ease, transform 0.2s ease", display: "block", padding: "2px 0" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#6d28d9"; e.currentTarget.style.transform = "translateX(3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = ""; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}
          <div>
            <h4
              className="flex items-center gap-2 mb-5"
              style={{ fontSize: "9.5px", fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#7c3aed" }}
            >
              <span style={{ width: "16px", height: "1.5px", borderRadius: "2px", background: "linear-gradient(90deg,#7c3aed,#d946ef)", flexShrink: 0 }} />
              Support
            </h4>
            <div className="flex flex-col gap-2">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm font-light"
                  style={{ color: "#64748b", textDecoration: "none", transition: "color 0.2s ease, transform 0.2s ease", display: "block", padding: "2px 0" }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#6d28d9"; e.currentTarget.style.transform = "translateX(3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "#64748b"; e.currentTarget.style.transform = ""; }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ paddingTop: "1.8rem" }}
        >
          <p style={{ color: "#94a3b8", fontSize: "12px", fontWeight: 300, letterSpacing: "0.02em" }}>
            © 2026 SmartCart. All rights reserved.
          </p>

          {/* Made with love */}
          <div className="flex items-center gap-1.5" style={{ fontSize: "11.5px", color: "#94a3b8", fontWeight: 300 }}>
            <Heart
              size={13}
              style={{
                fill: "url(#heartGrad)",
                stroke: "url(#heartGrad)",
              }}
            />
            <svg width="0" height="0" style={{ position: "absolute" }}>
              <defs>
                <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
            Made with love in India
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            {[
              { label: "Instagram", icon: <Instagram size={14} />, href: "#" },
              { label: "LinkedIn", icon: <Linkedin size={14} />, href: "#" },
              { label: "GitHub", icon: <Github size={14} />, href: "#" },
            ].map(({ label, icon, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="flex items-center justify-center"
                style={{
                  width: "34px", height: "34px", borderRadius: "50%",
                  border: "1px solid rgba(139,92,246,0.2)",
                  background: "rgba(245,243,255,0.5)",
                  color: "#7c3aed",
                  textDecoration: "none",
                  transition: "all 0.22s cubic-bezier(0.34,1.56,0.64,1)",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(237,233,254,0.9)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
                  e.currentTarget.style.transform = "scale(1.12)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(245,243,255,0.5)";
                  e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
                  e.currentTarget.style.transform = "";
                }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;