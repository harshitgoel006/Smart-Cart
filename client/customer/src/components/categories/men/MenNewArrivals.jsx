import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHeart, FiEye, FiShoppingCart, FiArrowRight } from "react-icons/fi";
import { FaStar } from "react-icons/fa";

// Sample product data with new high-quality images and more realistic details for the men's new arrivals section. Each product has a unique image, category, price, MRP, rating, and badge to enhance the visual appeal and provide a better user experience.

const products = [
  {
    id: 1,
    name: "Classic Blue Shirt",
    category: "Formals",
    price: 2699,
    mrp: 3200,
    rating: 4.8,
    badge: "Trending",
    // New high-quality image for first card
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Decent Black Loafers",
    category: "Footwear",
    price: 1500,
    mrp: 2000,
    rating: 4.9,
    badge: "Limited",
    image: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Beige Jacket",
    category: "Outerwear",
    price: 2850,
    mrp: 4500,
    rating: 4.7,
    badge: "New Era",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Olive Green Pants",
    category: "Bottomwear",
    price: 2999,
    mrp: 3999,
    rating: 4.6,
    badge: "Hot",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop",
  },
];


// This is the MenNewArrivals component that displays a section of new arrivals for men. It includes a header with a title and a link to view the entire collection, as well as a grid of product cards. Each card features an image, category badge, discount badge, action icons for wishlist and quick view, product details, and an "Add to Bag" button with a gradient hover effect. The component uses Tailwind CSS for styling and Framer Motion for animations to create an engaging user experience.

const MenNewArrivals = () => {
  const discount = (p, m) => Math.round(((m - p) / m) * 100);

  return (
    <section className="relative pt-16 pb-28 bg-gradient-to-b from-white via-purple-50/40 to-white overflow-hidden">

      {/* background */}
      <div className="absolute top-0 left-0 w-[35%] h-[35%] bg-purple-100/40 blur-[140px] rounded-full -translate-y-1/2 -translate-x-1/3" />
      <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-pink-100/30 blur-[140px] rounded-full translate-y-1/2 translate-x-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="mb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-8 h-[2px] bg-purple-600" />
              <span className="text-[11px] font-black tracking-[0.4em] uppercase text-purple-600">
                Fresh Drops
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-black tracking-tight uppercase text-gray-900 leading-tight">
              MEN’S{" "}
              <span className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent italic pb-3">
                New Arrivals
              </span>
            </h2>
          </div>

          <Link
            to="/products?category=men"
            className="group flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-purple-600 border-b border-black/10 pb-2"
          >
            View All Collection
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
              <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gray-50 border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_40px_80px_-20px_rgba(147,51,234,0.35)]">

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
                  to={`/products?category=men&type=${p.category.toLowerCase()}`}
                  className="absolute top-6 left-6 bg-white/90 backdrop-blur-md text-[9px] font-black tracking-widest text-purple-600 px-3 py-1.5 rounded-full uppercase"
                >
                  {p.category}
                </Link>

                {/* DISCOUNT */}
                <div className="absolute top-6 right-6 bg-pink-600 text-white px-3 py-1.5 rounded-full">
                  <span className="text-[10px] font-black">
                    {discount(p.price, p.mrp)}% OFF
                  </span>
                </div>

                {/* ACTION ICONS */}
                <div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <Link
                    to="/wishlist"
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-purple-600 hover:text-white"
                  >
                    <FiHeart size={18} />
                  </Link>

                  <Link
                    to={`/product/${p.id}`}
                    className="h-11 w-11 rounded-2xl bg-white flex items-center justify-center shadow-xl hover:bg-purple-600 hover:text-white"
                  >
                    <FiEye size={18} />
                  </Link>
                </div>
              </div>

              {/* DETAILS */}
              <div className="pt-6 px-4 text-center">
                <Link
                  to={`/product/${p.id}`}
                  className="block text-xl font-black uppercase italic tracking-tighter hover:text-purple-600 mb-2"
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
                    <Link
                  to="/cart"
                  
                >
                  <span className="relative z-10 flex items-center justify-center gap-3 text-white text-[11px] font-black uppercase tracking-widest">
                    <FiShoppingCart size={16} className="group-hover/btn:rotate-12 transition-transform" />
                    Add to Bag
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1)" />

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

export default MenNewArrivals;
