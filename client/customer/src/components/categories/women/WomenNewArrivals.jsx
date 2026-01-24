import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// Products based on WOMEN.pdf NEW ARRIVALS section
const products = [
  {
    id: 1,
    name: "Beige Organza Saree",
    category: "Ethnic Wear",
    price: 2850,
    mrp: 4500,
    rating: 4.9,
    badge: "Trending",
    image: "https://i.pinimg.com/736x/a3/db/31/a3db318b11ebaaf4098c5e7e05ffe0f5.jpg", // High quality organza saree
  },
  {
    id: 2,
    name: "Blue Co-ord Set",
    category: "Co-ord Sets",
    price: 2599,
    mrp: 3200,
    rating: 4.8,
    badge: "Limited",
    image: "https://i.pinimg.com/736x/67/a4/3e/67a43e52134d112945b07706da149cc6.jpg", // Blue women co-ord
  },
  {
    id: 3,
    name: "Heeled Sandals",
    category: "Footwear",
    price: 2850,
    mrp: 3500,
    rating: 4.7,
    badge: "Must Have",
    image: "https://i.pinimg.com/736x/4e/b9/f9/4eb9f9b6a98969672a6d32bcd0008488.jpg", // Elegant heels
  },
  {
    id: 4,
    name: "Green Satin Shirt",
    category: "Western Wear",
    price: 2999,
    mrp: 3999,
    rating: 4.6,
    badge: "Hot",
    image: "https://i.pinimg.com/1200x/eb/06/4f/eb064f8ffabe4569b2b1de9bedb82690.jpg", // Green satin shirt
  },
];

const WomenNewArrivals = () => {
  const discount = (p, m) => Math.round(((m - p) / m) * 100);

  return (
    <section className="relative pt-16 pb-28 bg-gradient-to-b from-white via-pink-50/30 to-white overflow-hidden">

      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[35%] h-[35%] bg-purple-100/40 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-pink-100/30 blur-[140px] rounded-full translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-pink-500" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-pink-500">
                Fresh Drops
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-gray-900 leading-tight">
              WOMEN’S{" "}
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent italic pb-3">
                New Arrivals
              </span>
            </h2>
          </div>

          <Link
            to="/products?category=women"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-pink-600 border-b border-black/10 pb-2"
          >
            Explore All
            <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -15 }}
              className="group relative"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(236,72,153,0.3)]">

                <Link to={`/product/${p.id}`} className="block h-full">
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 1.1, ease: [0.33, 1, 0.68, 1] }}
                    className="h-full w-full object-cover object-top"
                  />
                </Link>

                {/* CATEGORY TAG */}
                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[9px] font-black tracking-widest text-pink-600 px-3 py-1.5 rounded-full uppercase">
                  {p.category}
                </div>

                {/* DISCOUNT BADGE */}
                <div className="absolute top-6 right-6 bg-gray-900 text-white px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-black">
                    {discount(p.price, p.mrp)}% OFF
                  </span>
                </div>

                {/* QUICK ACTIONS */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-pink-500 hover:text-white transition-colors">
                    <FiHeart size={18} />
                  </button>
                  <Link
                    to={`/product/${p.id}`}
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-purple-600 hover:text-white transition-colors"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>
              </div>

              {/* DETAILS */}
              <div className="pt-6 px-4 text-center">
                <Link
                  to={`/product/${p.id}`}
                  className="block text-lg font-black uppercase italic tracking-tighter hover:text-pink-600 mb-2 truncate"
                >
                  {p.name}
                </Link>

                <div className="flex justify-center items-center gap-4 mb-5">
                  <div className="flex flex-col items-center">
                    <span className="text-2xl font-black text-gray-900">₹{p.price}</span>
                    <span className="text-[10px] line-through text-gray-400">₹{p.mrp}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded-lg">
                    <FaStar size={10} />
                    <span className="text-[10px] font-black">{p.rating}</span>
                  </div>
                </div>

                {/* ADD TO CART BUTTON */}
                <button className="relative w-full group/btn h-14 overflow-hidden rounded-2xl bg-gray-900 transition-all active:scale-95">
                  <span className="relative z-10 flex items-center justify-center gap-3 text-white text-[11px] font-black uppercase tracking-widest">
                    <FiShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    Add to Bag
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WomenNewArrivals;