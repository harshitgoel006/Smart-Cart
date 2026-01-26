import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Silk Satin Gown",
    category: "Women",
    price: 4599,
    mrp: 5999,
    rating: 4.9,
    badge: "Trending",
    image: "https://i.pinimg.com/736x/91/b0/82/91b082adb6efd2fe4fd9d67747bdc123.jpg",
  },
  {
    id: 2,
    name: "Urban Oversized Tee",
    category: "Men",
    price: 1299,
    mrp: 1999,
    rating: 4.7,
    badge: "Hot",
    image: "https://i.pinimg.com/736x/3a/52/13/3a521386ff60a8f588dc4faafccb8da5.jpg",
  },
  {
    id: 3,
    name: "Denim Dungaree Set",
    category: "Kids",
    price: 1850,
    mrp: 2500,
    rating: 4.8,
    badge: "New Era",
    image: "https://i.pinimg.com/1200x/83/b7/ca/83b7ca9c6fdb076bb370bcb60b1ad243.jpg",
  },
  {
    id: 4,
    name: "Velvet Party Blazer",
    category: "Men",
    price: 6999,
    mrp: 8999,
    rating: 4.6,
    badge: "Limited",
    image: "https://i.pinimg.com/736x/b5/12/65/b51265ed6ca8cf5f500b637fe4912f42.jpg",
  },
];

const FashionNewArrivals = () => {
  const discount = (p, m) => Math.round(((m - p) / m) * 100);

  return (
    <section className="relative pt-16 pb-28 bg-gradient-to-b from-white via-rose-50/40 to-white overflow-hidden">

      {/* background glows */}
      <div className="absolute top-0 left-0 w-[35%] h-[35%] bg-rose-100/40 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-indigo-100/30 blur-[140px] rounded-full translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-rose-600" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-rose-600">
                The Style Edit
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-gray-900 leading-tight">
              LATEST{" "}
              <span className="inline-block bg-gradient-to-r from-rose-600 to-indigo-500 bg-clip-text text-transparent italic pb-3">
                Fashion Drops
              </span>
            </h2>
          </div>

          <Link
            to="/products"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-rose-600 border-b border-black/10 pb-2"
          >
            View Full Catalogue
            <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <motion.div
              key={p.id}
              whileHover={{ y: -15 }}
              className="group relative"
            >
              {/* IMAGE */}
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(244,63,94,0.35)]">

                <Link to={`/product/${p.id}`} className="block h-full">
                  <motion.img
                    src={p.image}
                    alt={p.name}
                    whileHover={{ scale: 1.15 }}
                    className="h-full w-full object-cover"
                  />
                </Link>

                {/* CATEGORY */}
                <Link
                  to={`/products?category=${p.category.toLowerCase()}`}
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[9px] font-black tracking-widest text-rose-600 px-3 py-1.5 rounded-full uppercase"
                >
                  {p.category}
                </Link>

                {/* DISCOUNT */}
                <div className="absolute top-6 right-6 bg-rose-600 text-white px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-black">
                    {discount(p.price, p.mrp)}% OFF
                  </span>
                </div>

                {/* ACTION ICONS */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    to="/wishlist"
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <FiHeart size={18} />
                  </Link>

                  <Link
                    to={`/product/${p.id}`}
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-rose-600 hover:text-white transition-colors"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>
              </div>

              {/* DETAILS */}
              <div className="pt-6 px-4 text-center">
                <Link
                  to={`/product/${p.id}`}
                  className="block text-xl font-black uppercase italic tracking-tighter hover:text-rose-600 mb-2"
                >
                  {p.name}
                </Link>

                <div className="flex justify-center gap-4 mb-6">
                  <div>
                    <span className="text-2xl font-black">₹{p.price}</span>
                    <div className="text-xs line-through text-gray-400">₹{p.mrp}</div>
                  </div>

                  <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded-lg">
                    <FaStar size={10} />
                    <span className="text-[10px] font-black">{p.rating}</span>
                  </div>
                </div>

                {/* ADD TO CART */}
                <button className="relative w-full group/btn h-14 overflow-hidden rounded-2xl bg-gray-900 transition-all active:scale-95">
                  <Link to="/cart">
                    <span className="relative z-10 flex items-center justify-center gap-3 text-white text-[11px] font-black uppercase tracking-widest">
                      <FiShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
                      Add to Bag
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-indigo-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)" />
                  </Link>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionNewArrivals;