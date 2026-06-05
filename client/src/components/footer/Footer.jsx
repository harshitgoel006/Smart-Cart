import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { footerLinks } from "../../constants/footerData";

const Footer = () => {
  return (
    <footer className="relative mt-20 overflow-hidden">

      {/* Ambient Glow */}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-24 top-0 h-40 rounded-full"
        style={{
          background:
            "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(100px)",
          opacity: 0.05,
        }}
      />

      <div className="mx-auto max-w-7xl px-6 py-24">

        {/* Top CTA */}

        <div
          style={{
            paddingBottom: "4rem",
            borderBottom: "1px solid rgba(167,139,250,0.15)",
          }}
        >
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(3rem,6vw,4.5rem)",
              color: "#1e1b4b",
              lineHeight: 1,
            }}
          >
            SmartCart
          </h2>

          <p
            style={{
              marginTop: "1.2rem",
              fontSize: "1.1rem",
              color: "#64748b",
              maxWidth: "620px",
              lineHeight: 1.9,
            }}
          >
            Curated for modern shoppers.
            <br />
            Built for effortless discovery.
          </p>

          <p
            style={{
              marginTop: "1rem",
              maxWidth: "650px",
              color: "#94a3b8",
              lineHeight: 1.8,
            }}
          >
            Discover products smarter with intelligent recommendations,
            premium experiences and seamless shopping journeys.
          </p>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 mt-8"
            style={{
              padding: "12px 22px",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg,#7c3aed,#d946ef)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Explore Products
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Links */}

        <div
          className="grid md:grid-cols-4 gap-12"
          style={{
            paddingTop: "4rem",
            paddingBottom: "4rem",
          }}
        >
          {/* Brand Column */}

          <div>
            <h4
              style={{
                fontSize: "13px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "#7c3aed",
                marginBottom: "1.5rem",
                fontWeight: 700,
              }}
            >
              SmartCart
            </h4>

            <p
              style={{
                color: "#94a3b8",
                lineHeight: 1.8,
                fontSize: "14px",
              }}
            >
              Premium ecommerce experience powered by intelligent discovery.
            </p>
          </div>

          {/* Shop */}

          <div>
            <h4 className="mb-5 font-semibold text-indigo-950">
              Shop
            </h4>

            <div className="flex flex-col gap-3">
              {footerLinks.shop.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm text-slate-500 hover:text-violet-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Company */}

          <div>
            <h4 className="mb-5 font-semibold text-indigo-950">
              Company
            </h4>

            <div className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm text-slate-500 hover:text-violet-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support */}

          <div>
            <h4 className="mb-5 font-semibold text-indigo-950">
              Support
            </h4>

            <div className="flex flex-col gap-3">
              {footerLinks.support.map((link) => (
                <Link
                  key={link.label}
                  to={link.path}
                  className="text-sm text-slate-500 hover:text-violet-700 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div
          className="flex flex-col md:flex-row items-center justify-between gap-5"
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(167,139,250,0.15)",
          }}
        >
          <p
            style={{
              color: "#94a3b8",
              fontSize: "13px",
            }}
          >
            © 2026 SmartCart. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <a href="#">Instagram</a>
            <a href="#">LinkedIn</a>
            <a href="#">GitHub</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;