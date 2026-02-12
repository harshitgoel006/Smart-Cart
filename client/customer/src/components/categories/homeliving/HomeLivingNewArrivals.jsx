import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";


// This is the HomeLivingNewArrivals component which showcases a curated selection of high-end home & living products with dynamic hover effects, discount highlights, and seamless navigation to product details and cart. Each product card features an image, category badge, discount badge, action icons for wishlist and quick view, and detailed information including name, price, rating, and an add to cart button. The design emphasizes a luxurious and modern aesthetic with smooth animations and vibrant colors to entice users to explore the new arrivals in the home & living category.

const products = [
  {
    id: 1,
    name: "Printed Bedsheets",
    category: "Bedroom",
    price: 1450,
    mrp: 2650,
    rating: 4.8,
    badge: "Trending",
    image: "https://i.pinimg.com/1200x/57/dc/74/57dc74a6f87ba2887e65a72422b7f98b.jpg",
  },
  {
    id: 2,
    name: "Cushion Pair of 4",
    category: "Decor",
    price: 1200,
    mrp: 2200,
    rating: 4.9,
    badge: "Limited",
    image: "https://i.pinimg.com/1200x/cc/a3/5f/cca35f1707350c2141d5f0df920b8956.jpg",
  },
  {
    id: 3,
    name: "Standing Lamp",
    category: "Lighting",
    price: 2999,
    mrp: 4500,
    rating: 4.7,
    badge: "New Era",
    image: "https://i.pinimg.com/1200x/db/8e/cf/db8ecfa96f992d71639bf4b8b03e0463.jpg",
  },
  {
    id: 4,
    name: "Planter Set of 3",
    category: "Outdoor",
    price: 1499,
    mrp: 2499,
    rating: 4.6,
    badge: "Hot",
    image: "https://i.pinimg.com/736x/fb/e9/92/fbe992eec95deb4dafba73485988ba02.jpg",
  },
];

const HomeLivingNewArrivals = () => {
  const discount = (p, m) => Math.round(((m - p) / m) * 100);

  return (
    <section className="relative pt-16 pb-28 bg-gradient-to-b from-white via-emerald-50/40 to-white overflow-hidden">

      {/* background */}
      <div className="absolute top-0 left-0 w-[35%] h-[35%] bg-emerald-100/40 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-teal-100/30 blur-[140px] rounded-full translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-emerald-600" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-emerald-600">
                Fresh Decor
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-gray-900 leading-tight">
              HOME{" "}
              <span className="inline-block bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent italic pb-3">
                New Arrivals
              </span>
            </h2>
          </div>

          <Link
            to="/products?category=home-living"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-emerald-600 border-b border-black/10 pb-2"
          >
            Explore All Essentials
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
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.35)]">

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
                  to={`/products?category=home-living&type=${p.category.toLowerCase()}`}
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[9px] font-black tracking-widest text-emerald-600 px-3 py-1.5 rounded-full uppercase"
                >
                  {p.category}
                </Link>

                {/* DISCOUNT */}
                <div className="absolute top-6 right-6 bg-orange-500 text-white px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-black">
                    {discount(p.price, p.mrp)}% OFF
                  </span>
                </div>

                {/* ACTION ICONS */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    to="/wishlist"
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-emerald-600 hover:text-white"
                  >
                    <FiHeart size={18} />
                  </Link>

                  <Link
                    to={`/product/${p.id}`}
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-emerald-600 hover:text-white"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>
              </div>

              {/* DETAILS */}
              <div className="pt-6 px-4 text-center">
                <Link
                  to={`/product/${p.id}`}
                  className="block text-xl font-black uppercase italic tracking-tighter hover:text-emerald-600 mb-2"
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
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)" />
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

export default HomeLivingNewArrivals;