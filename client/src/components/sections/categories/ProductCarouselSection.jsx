import { Link } from "react-router-dom";
import { Heart, ArrowRight, Star, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";

const ProductCarouselSection = ({
  tag,
  title,
  description,
  products = [],
  viewAllLink = "#",
}) => {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">

      {/* ---------- Header ---------- */}
      <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">

        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div
              className="h-[2px] w-9 rounded-full"
              style={{ background: "linear-gradient(90deg,#7c3aed,#d946ef)" }}
            />
            <span
              style={{
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "#7c3aed",
              }}
            >
              {tag}
            </span>
          </div>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              fontWeight: 500,
              color: "#1e1b4b",
              lineHeight: 1.05,
            }}
          >
            {title}
          </h2>
        </div>

        <div className="max-w-sm flex flex-col items-start md:items-end gap-3">
          <p
            style={{
              fontSize: "13px",
              color: "#64748b",
              lineHeight: 1.8,
              fontWeight: 300,
            }}
          >
            {description}
          </p>

          <Link
            to={viewAllLink}
            className="inline-flex items-center gap-1.5 font-medium"
            style={{
              fontSize: "12px",
              letterSpacing: "0.04em",
              color: "#7c3aed",
              border: "1px solid rgba(139,92,246,0.25)",
              borderRadius: "100px",
              padding: "7px 16px",
              background: "rgba(245,243,255,0.5)",
              transition: "all 0.22s ease",
              textDecoration: "none",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(237,233,254,0.9)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.55)";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(245,243,255,0.5)";
              e.currentTarget.style.borderColor = "rgba(139,92,246,0.25)";
              e.currentTarget.style.transform = "";
            }}
          >
            View All
            <ArrowRight
              size={13}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      {/* ---------- Products ---------- */}
      <div className="relative">
        {/* Right edge fade mask */}
        <div
          className="absolute top-0 right-0 h-full w-16 z-[5] pointer-events-none hidden md:block"
          style={{ background: "linear-gradient(to left,#fff,transparent)" }}
        />

        <div className="flex gap-[1.1rem] overflow-x-auto pb-4 scrollbar-hide">
          {products.map((product) => (
            <motion.div
              key={product._id}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.25 }}
              className="w-[258px] flex-shrink-0"
            >
              <Link
                to={`/products/${product.slug}`}
                className="group relative block overflow-hidden"
                style={{
                  borderRadius: "26px",
                  background: "#fff",
                  border: "1px solid rgba(167,139,250,0.1)",
                  boxShadow: "0 6px 22px rgba(0,0,0,0.05)",
                  transition:
                    "box-shadow 0.45s ease, border-color 0.4s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 28px 60px rgba(124,58,237,0.18)";
                  e.currentTarget.style.borderColor =
                    "rgba(167,139,250,0.32)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 22px rgba(0,0,0,0.05)";
                  e.currentTarget.style.borderColor =
                    "rgba(167,139,250,0.1)";
                }}
              >
                {/* Top accent line */}
                <div
                  className="absolute top-0 left-0 right-0 h-[2.5px] z-[3] origin-left scale-x-0 transition-transform duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 pointer-events-none"
                  style={{ background: "linear-gradient(90deg,#7c3aed,#a855f7,#ec4899)" }}
                />

                {/* Image */}
                <div className="relative h-[300px] overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                  />

                  {/* Dark overlay */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100"
                    style={{ background: "linear-gradient(to top,rgba(15,23,42,0.14),transparent 55%)" }}
                  />

                  {/* Purple-pink shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg,rgba(124,58,237,0.1) 0%,transparent 50%,rgba(236,72,153,0.07) 100%)",
                    }}
                  />

                  {/* Wishlist */}
                  <button
                    className="absolute right-3 top-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full transition-all duration-[250ms] ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                    style={{
                      background: "rgba(255,255,255,0.85)",
                      backdropFilter: "blur(8px)",
                      border: "1px solid rgba(255,255,255,0.6)",
                    }}
                    onClick={(e) => e.preventDefault()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#fff";
                      e.currentTarget.style.transform = "scale(1.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <Heart
                      size={15}
                      className="text-slate-400 transition-colors group-hover:text-rose-500"
                    />
                  </button>

                  {/* Discount badge */}
                  <span
                    className="absolute left-3 top-3 z-[3] font-bold text-white"
                    style={{
                      fontSize: "10px",
                      padding: "4px 12px",
                      borderRadius: "100px",
                      background: "linear-gradient(135deg,#7c3aed,#ec4899)",
                      boxShadow: "0 4px 12px rgba(124,58,237,0.35)",
                    }}
                  >
                    -{product.discountPercentage}%
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-col gap-2 p-5">
                  {/* Brand */}
                  <p
                    style={{
                      fontSize: "9.5px",
                      fontWeight: 700,
                      letterSpacing: "0.25em",
                      textTransform: "uppercase",
                      color: "#7c3aed",
                    }}
                  >
                    {product.brand}
                  </p>

                  {/* Name */}
                  <h3
                    className="line-clamp-2"
                    style={{
                      fontSize: "15px",
                      fontWeight: 500,
                      color: "#1e1b4b",
                      lineHeight: 1.35,
                      minHeight: "40px",
                    }}
                  >
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5">
                    <Star size={13} className="fill-yellow-400 text-yellow-400" />
                    <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e1b4b" }}>
                      {product.ratings}
                    </span>
                    <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                      ({product.reviewCount})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-2">
                    <span style={{ fontSize: "21px", fontWeight: 700, color: "#1e1b4b", letterSpacing: "-0.02em" }}>
                      ₹{product.finalPrice.toLocaleString()}
                    </span>
                    <span style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through" }}>
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <span
                      style={{
                        fontSize: "10.5px",
                        fontWeight: 600,
                        color: "#059669",
                        background: "rgba(5,150,105,0.08)",
                        padding: "2px 7px",
                        borderRadius: "100px",
                      }}
                    >
                      {product.discountPercentage}% OFF
                    </span>
                  </div>

                  {/* Add to Cart CTA */}
                  <button
                    className="relative overflow-hidden flex items-center justify-center gap-2 w-full text-white font-semibold"
                    style={{
                      marginTop: "2px",
                      borderRadius: "14px",
                      padding: "10px",
                      fontSize: "12px",
                      letterSpacing: "0.05em",
                      border: "none",
                      cursor: "pointer",
                      background:
                        "linear-gradient(135deg,#6d28d9,#7c3aed,#a855f7,#db2777)",
                      boxShadow: "0 5px 18px rgba(124,58,237,0.22)",
                      transition: "box-shadow 0.3s ease, transform 0.2s ease",
                    }}
                    onClick={(e) => e.preventDefault()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "0 10px 30px rgba(124,58,237,0.38)";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "0 5px 18px rgba(124,58,237,0.22)";
                      e.currentTarget.style.transform = "";
                    }}
                  >
                    <span
                      className="absolute inset-0 rounded-[14px] pointer-events-none"
                      style={{ background: "linear-gradient(135deg,rgba(255,255,255,0.18),transparent 55%)" }}
                    />
                    <ShoppingCart size={13} />
                    Add to Cart
                  </button>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCarouselSection;