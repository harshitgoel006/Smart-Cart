import { FiStar, FiShoppingCart, FiHeart, FiEye } from "react-icons/fi";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";


const products = [
  {
    id: 1,
    name: "Wireless Headphones Pro",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
    price: 2999,
    mrp: 3999,
    rating: 4.6,
    badge: "Featured",
  },
  {
    id: 2,
    name: "Smart Watch Series 7",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop",
    price: 4999,
    mrp: 6999,
    rating: 4.4,
    badge: "Trending",
  },
  {
    id: 3,
    name: "Park Avenue Luxury Perfume",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=600&auto=format&fit=crop",
    price: 1599,
    mrp: 2499,
    rating: 4.8,
    badge: "Limited",
  },
  {
    id: 4,
    name: "Running Shoes Neon",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
    price: 3299,
    mrp: 4599,
    rating: 4.7,
    badge: "Hot",
  },
  {
    id: 5,
    name: "Mom Fit Jeans",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop",
    price: 1800,
    mrp: 2800,
    rating: 4.5,
    badge: "Best Seller",
  },
  {
    id: 6,
    name: "Gold Jewellery Set",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600&auto=format&fit=crop",
    price: 12500,
    mrp: 18000,
    rating: 4.9,
    badge: "Premium",
  },
  {
    id: 7,
    name: "boAt Airdopes 181 Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=600&auto=format&fit=crop",
    price: 1099,
    mrp: 2999,
    rating: 4.3,
    badge: "Deal",
  },
  {
    id: 8,
    name: "Organic Grocery Combo Pack",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=600&auto=format&fit=crop",
    price: 899,
    mrp: 1299,
    rating: 4.6,
    badge: "Daily Use",
  },
];

const FeaturedProducts = () => {
  const calculateDiscount = (price, mrp) =>
    Math.round(((mrp - price) / mrp) * 100);

  return (
    <section className="pt-10 py-24  bg-gradient-to-b from-purple-50/60 via-white to-pink-50/60
  overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-4xl font-black text-gray-900 tracking-tight"
            >
              Trending{" "}
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                Now
              </span>
            </motion.h2>
            <p className="mt-2 text-gray-500 font-medium">
              Handpicked items loved by SmartCart users
            </p>
          </div>

          <Link
            to="/products"
            className="group inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition"
          >
            View All
            <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, idx) => (
            <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -12 }} 
            transition={{ delay: idx * 0.08, duration: 0.4 }}
            viewport={{ once: true }}
            className="group bg-white rounded-[2rem] border border-gray-100 p-3 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(147,51,234,0.3)] hover:border-purple-200/50"
>
              {/* IMAGE */}
              <div className="relative aspect-square overflow-hidden rounded-[1.5rem] bg-gray-50">
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>

                {/* DISCOUNT */}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                  <span className="text-[10px] font-black text-pink-600">
                    {calculateDiscount(product.price, product.mrp)}% OFF
                  </span>
                </div>

                {/* ACTION ICONS */}
                <div className="absolute top-3 left-3 flex flex-col gap-2 translate-x-[-50px] group-hover:translate-x-0 transition-transform duration-500">
                  <Link
                    to="/wishlist"
                    className="p-3 rounded-xl bg-white shadow-xl hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <FiHeart size={18} />
                  </Link>
                  <Link
                    to={`/product/${product.id}`}
                    className="p-3 rounded-xl bg-white shadow-xl hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>

                {/* BADGE */}
                <div className="absolute bottom-3 left-3">
                  <span className="bg-purple-600/90 text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-lg uppercase">
                    {product.badge}
                  </span>
                </div>
              </div>

              {/* INFO */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <Link
                    to={`/product/${product.id}`}
                    className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-purple-600 transition-colors"
                  >
                    {product.name}
                  </Link>

                  <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                    <FiStar className="text-yellow-500 fill-yellow-500" size={12} />
                    <span className="text-xs font-bold text-yellow-700">
                      {product.rating}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-2 mb-5">
                  <span className="text-2xl font-black text-gray-900">
                    ₹{product.price.toLocaleString()}
                  </span>
                  <span className="text-sm line-through text-gray-400">
                    ₹{product.mrp.toLocaleString()}
                  </span>
                </div>

                {/* ACTION BUTTON */}
                <button className="relative w-full overflow-hidden group/btn bg-gray-900 text-white font-bold py-4 rounded-2xl transition-all active:scale-95">
                  <div className="relative z-10 flex items-center justify-center gap-2">
                    <FiShoppingCart className="group-hover/btn:animate-bounce" />
                    <span>Add to Cart</span>
                  </div>
                  {/* Button Background Slide Effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
