import { Link } from "react-router-dom";
import { Heart, ArrowRight, Star } from "lucide-react";
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

        <div>
          <div className="mb-3 flex items-center gap-3">
            <div className="h-[2px] w-10 rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500" />

            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-violet-600">
              {tag}
            </span>
          </div>

          <h2 className="font-serif text-5xl text-indigo-950">
            {title}
          </h2>
        </div>

        <div className="max-w-sm">

          <p className="text-sm leading-6 text-slate-500">
            {description}
          </p>

          <Link
            to={viewAllLink}
            className="group mt-4 inline-flex items-center gap-2 text-sm font-semibold text-violet-600 transition-colors hover:text-fuchsia-600"
          >
            View All

            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

        </div>

      </div>

      {/* ---------- Products ---------- */}

      <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">

        {products.map((product) => (

          <motion.div
            key={product._id}
            whileHover={{ y: -8 }}
            transition={{ duration: 0.25 }}
            className="w-[260px] flex-shrink-0"
          >

            <Link
              to={`/products/${product.slug}`}
              className="group block overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow hover:shadow-xl"
            >

              {/* Image */}

              <div className="relative h-[320px] overflow-hidden">

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Wishlist */}

                <button
                  className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 backdrop-blur"
                >
                  <Heart
                    size={18}
                    className="text-slate-500 transition-colors group-hover:text-red-500"
                  />
                </button>

                {/* Discount */}

                <span className="absolute left-4 top-4 rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                  -{product.discountPercentage}%
                </span>

              </div>

              {/* Content */}

              <div className="space-y-3 p-5">

                <p className="text-xs font-semibold uppercase tracking-widest text-violet-600">
                  {product.brand}
                </p>

                <h3 className="line-clamp-2 text-lg font-semibold text-slate-900">
                  {product.name}
                </h3>

                <div className="flex items-center gap-2 text-sm">

                  <Star
                    size={15}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-medium">
                    {product.ratings}
                  </span>

                  <span className="text-slate-400">
                    ({product.reviewCount})
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <span className="text-xl font-bold text-slate-900">
                    ₹{product.finalPrice.toLocaleString()}
                  </span>

                  <span className="text-sm text-slate-400 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>

                </div>

              </div>

            </Link>

          </motion.div>

        ))}

      </div>

    </section>
  );
};

export default ProductCarouselSection;