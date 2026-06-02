import { Heart, Star, ShoppingCart, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative block overflow-hidden bg-white"
      style={{
        borderRadius: "24px",
        border: "1px solid rgba(167,139,250,0.12)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
        transition:
          "transform 0.6s cubic-bezier(0.22,1,0.36,1), box-shadow 0.6s cubic-bezier(0.22,1,0.36,1), border-color 0.4s ease",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-12px)";
        e.currentTarget.style.boxShadow = "0 32px 80px rgba(124,58,237,0.24)";
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.12)";
      }}
    >
      {/* ── Image Section ── */}
      <div
        className="relative overflow-hidden"
        style={{ aspectRatio: "1/0.82", background: "#f8f7ff" }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(30,27,75,0.18), transparent 45%)",
          }}
        />

        {/* Badge */}
        {product.badges?.length > 0 && (
          <span
            className="absolute left-3 top-3 z-20 font-bold uppercase text-white"
            style={{
              fontSize: "8.5px",
              letterSpacing: "0.22em",
              padding: "4px 12px",
              borderRadius: "100px",
              background:
                "linear-gradient(135deg,rgba(124,58,237,0.9),rgba(219,39,119,0.85))",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
              backdropFilter: "blur(10px)",
            }}
          >
            {product.badges[0]}
          </span>
        )}

        {/* Wishlist */}
        <button
          className="absolute right-3 top-3 z-20 flex items-center justify-center text-white"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.22)",
            background: "rgba(255,255,255,0.12)",
            backdropFilter: "blur(10px)",
            cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onClick={(e) => e.preventDefault()}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#f43f5e";
            e.currentTarget.style.transform = "scale(1.15)";
            e.currentTarget.style.borderColor = "#fff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.12)";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.transform = "";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
          }}
        >
          <Heart size={15} />
        </button>

        {/* Product image */}
        <img
          src={product.coverImage.url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-[1800ms] ease-out group-hover:scale-110"
          style={{ display: "block" }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Purple-pink shimmer on hover */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,rgba(124,58,237,0.1) 0%,transparent 50%,rgba(219,39,119,0.07) 100%)",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div style={{ padding: "0.9rem 1.1rem 1rem" }}>
        {/* Brand */}
        <p
          className="font-bold uppercase"
          style={{
            fontSize: "9.5px",
            letterSpacing: "0.25em",
            color: "#7c3aed",
            marginBottom: "5px",
          }}
        >
          {product.brand}
        </p>

        {/* Name */}
        <h3
          className="line-clamp-2 font-medium leading-snug"
          style={{
            fontSize: "15px",
            color: "#1e1b4b",
            marginBottom: "10px",
            minHeight: "34px",
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div
          className="flex items-center gap-1.5"
          style={{ marginBottom: "12px" }}
        >
          <Star size={13} className="fill-yellow-400 text-yellow-400" />
          <span style={{ fontSize: "12px", fontWeight: 600, color: "#1e1b4b" }}>
            {product.ratings}
          </span>
          <span style={{ fontSize: "11px", color: "#94a3b8" }}>
            • {product.reviews?.toLocaleString()} Reviews
          </span>
        </div>

        {/* Price */}
        <div style={{ marginBottom: "10px" }}>
          <div
            style={{
              fontSize: "22px",
              fontWeight: 600,
              color: "#1e1b4b",
              letterSpacing: "-0.02em",
            }}
          >
            ₹{product.finalPrice.toLocaleString()}
          </div>
          <div
            className="flex items-center gap-1.5"
            style={{ marginTop: "3px" }}
          >
            <span
              style={{
                fontSize: "12px",
                color: "#94a3b8",
                textDecoration: "line-through",
              }}
            >
              ₹{product.price.toLocaleString()}
            </span>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 600,
                color: "#059669",
                background: "rgba(5,150,105,0.08)",
                padding: "2px 8px",
                borderRadius: "100px",
              }}
            >
              {product.discountPercentage}% OFF
            </span>
          </div>
        </div>

        {/* CTA */}
<button
  onClick={(e) => e.preventDefault()}
  className="group/cart relative w-full overflow-hidden font-semibold text-white"
  style={{
    borderRadius: "14px",
    padding: "11px",
    fontSize: "12px",
    letterSpacing: "0.05em",
    border: "none",
    cursor: "pointer",
    background:
      "linear-gradient(135deg,#6d28d9 0%,#7c3aed 35%,#a855f7 68%,#db2777 100%)",
    boxShadow: "0 6px 20px rgba(124,58,237,0.25)",
    transition: "all 0.3s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.boxShadow =
      "0 18px 40px rgba(124,58,237,0.45)";
    e.currentTarget.style.transform = "translateY(-3px)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.boxShadow =
      "0 6px 20px rgba(124,58,237,0.25)";
    e.currentTarget.style.transform = "";
  }}
  onMouseDown={(e) => {
    e.currentTarget.style.transform = "scale(0.98)";
  }}
  onMouseUp={(e) => {
    e.currentTarget.style.transform = "translateY(-3px)";
  }}
>
  {/* Gloss Layer */}
  <span
    className="absolute inset-0 pointer-events-none"
    style={{
      background:
        "linear-gradient(135deg,rgba(255,255,255,0.18),transparent 55%)",
      borderRadius: "14px",
    }}
  />

  {/* Moving Shimmer */}
  <span
    className="absolute inset-y-0 -left-[120%] w-[50%] pointer-events-none group-hover/cart:left-[140%]"
    style={{
      background:
        "linear-gradient(90deg,transparent,rgba(255,255,255,0.35),transparent)",
      transform: "skewX(-20deg)",
      transition: "left 0.8s ease",
    }}
  />

  <ShoppingCart
    size={15}
    className="transition-transform duration-300 group-hover/cart:-translate-y-[1px]"
  />

  <span>Add to Cart</span>
</button>
      </div>
    </Link>
  );
};

export default ProductCard;
