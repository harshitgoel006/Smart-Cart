import { Heart, ShoppingCart, Star } from "lucide-react";
import { Link } from "react-router-dom";

const DealCard = ({ product }) => {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group relative overflow-hidden"
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-14px)";
        e.currentTarget.style.boxShadow =
          "0 32px 80px rgba(124,58,237,0.22), 0 0 30px rgba(167,139,250,0.15)";
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "0 10px 35px rgba(124,58,237,0.08)";
        e.currentTarget.style.borderColor = "rgba(167,139,250,0.15)";
      }}
      style={{
        borderRadius: "28px",
        background: "linear-gradient(180deg,#ffffff 0%,#fdfcff 100%)",
        border: "1px solid rgba(167,139,250,0.15)",
        boxShadow:
          "0 10px 35px rgba(124,58,237,0.08), 0 0 0 rgba(124,58,237,0)",
        transition: "all .6s cubic-bezier(.22,1,.36,1)",
        textDecoration: "none",
        display: "block",
        cursor:"pointer"
      }}
    >
      {/* Discount Badge */}

      <div
        className="absolute left-4 top-4 z-10"
        style={{
          padding: "6px 15px",
          borderRadius: "999px",
          fontSize: "10.5px",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: "#fff",
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          border: "1px solid rgba(255,255,255,0.15)",
          boxShadow: "0 8px 20px rgba(124,58,237,0.25)",
          backdropFilter: "blur(14px)",
          textTransform: "uppercase",
        }}
      >
        -{product.discountPercentage}% OFF
      </div>

      {/* Wishlist */}

      <button
        className="absolute right-4 top-4 z-10 flex items-center justify-center"
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#f43f5e";
          e.currentTarget.style.transform = "scale(1.12) rotate(-8deg)";
          e.currentTarget.style.boxShadow = "0 14px 30px rgba(244,63,94,.25)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#1e1b4b";
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow = "";
        }}
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255,255,255,0.5)",
          color: "#1e1b4b",
          cursor: "pointer",
          transition: "all .25s ease",
        }}
      >
        <Heart
          size={16}
          style={{
            transition: "all .25s ease",
          }}
        />
      </button>

      {/* Image */}

      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: "250px",
          padding: "0",
          background: "linear-gradient(180deg,#faf7ff 0%,#f5f0ff 100%)",
          borderBottom: "1px solid rgba(167,139,250,0.08)",
        }}
      >
        <img
          src={product.coverImage?.url}
          alt={product.name}
          className="h-full w-full object-cover transition-all duration-[2200ms] ease-out group-hover:scale-[1.12] group-hover:-translate-y-2"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(30,27,75,0.15), transparent 45%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background:
              "linear-gradient(135deg,rgba(124,58,237,0.08),transparent 50%,rgba(236,72,153,0.08))",
          }}
        />
      </div>

      {/* Content */}

      <div
        style={{
          padding: "1.1rem 1.25rem 1.25rem",
        }}
      >
        <p
          style={{
            color: "#7c3aed",
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            marginBottom: "4px",
          }}
        >
          {product.brand}
        </p>

        <h3
          style={{
            color: "#1e1b4b",
            fontWeight: 600,
            fontSize: "15px",
            minHeight: "56px",
            transition: "color .3s ease",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {product.name}
        </h3>

        {/* Rating */}

        <div className="flex items-center gap-2 mt-3 mb-1">
          <Star size={14} fill="#facc15" stroke="#facc15" />

          <span
            style={{
              fontSize: "12px",
              color: "#64748b",
            }}
          >
            {product.ratings}
          </span>
          <span
            style={{
              fontSize: "11px",
              color: "#94a3b8",
            }}
          >
            Top Rated
          </span>
        </div>

        {/* Price */}

        <div
          className="mt-4"
          style={{
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              fontSize: "20px",
              letterSpacing: "-0.02em",
              fontWeight: 700,
              color: "#1e1b4b",
            }}
          >
            ₹{product.finalPrice.toLocaleString()}
          </div>

          <div
            className="flex items-center gap-2 mt-1"
            style={{
              fontSize: "12px",
            }}
          >
            <span
              style={{
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

        {/* Cart */}

        <button
          onClick={(e) => e.preventDefault()}
          className="group/cart relative mt-5 w-full overflow-hidden font-semibold text-white"
          style={{
            borderRadius: "16px",
            padding: "12px",
            fontSize: "13px",
            letterSpacing: "0.03em",
            border: "none",
            cursor: "pointer",
            background:
              "linear-gradient(135deg,#6d28d9 0%,#8b5cf6 45%,#ec4899 100%)",
            boxShadow: "0 6px 20px rgba(124,58,237,0.25)",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              "0 22px 45px rgba(124,58,237,0.35)";
            e.currentTarget.style.transform = "translateY(-4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 6px 20px rgba(124,58,237,0.25)";
            e.currentTarget.style.transform = "";
          }}
        >
          <span
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(135deg,rgba(255,255,255,0.18),transparent 55%)",
              borderRadius: "14px",
            }}
          />

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
            className="transition-transform duration-300 group-hover/cart:translate-x-1"
          />

          <span>Add to Cart</span>
        </button>
      </div>
    </Link>
  );
};

export default DealCard;
