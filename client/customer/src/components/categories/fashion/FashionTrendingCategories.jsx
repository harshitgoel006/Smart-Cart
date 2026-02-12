import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";


// This component showcases the top trending fashion categories with a modern design, smooth animations, and interactive elements to engage users and drive clicks. Each category is presented as a stylish card with a high-quality image, title, and a subtle hover effect that reveals a call-to-action icon. The background features a dynamic gradient animation to add visual interest without overwhelming the content.

const trending = [
  {
    title: "Oversized Tees",
    link: "/products?category=men&sub=tshirts",
    image: "https://i.pinimg.com/1200x/59/5b/6c/595b6c3a5e118e5e50f5a706b9ce6612.jpg",
  },
  {
    title: "Summer Dresses",
    link: "/products?category=women&sub=dresses",
    image: "https://i.pinimg.com/736x/3b/7d/47/3b7d473724f11adfac303731a738d3eb.jpg",
  },
  {
    title: "Denim Jackets",
    link: "/products?category=unisex&sub=jackets",
    image: "https://i.pinimg.com/736x/42/9b/ab/429bab02a1c300a7f9a7506d62d985a8.jpg",
  },
  {
    title: "Junior Kicks",
    link: "/products?category=kids&sub=shoes",
    image: "https://i.pinimg.com/736x/1f/9d/f1/1f9df119e8fe3f3c4eba4422b203339c.jpg",
  },
  {
    title: "Power Suits",
    link: "/products?category=women&sub=suits",
    image: "https://i.pinimg.com/1200x/ef/48/6e/ef486ef2bf1b2fc60be88f2e4d7ae1ba.jpg",
  },
  {
    title: "Premium Shoes",
    link: "/products?category=men&sub=shoes",
    image: "https://i.pinimg.com/1200x/24/9f/90/249f903e48002b52eac14e4d5623a563.jpg",
  },
  {
    title: "Floral Kurtas",
    link: "/products?category=women&sub=kurta",
    image: "https://i.pinimg.com/736x/76/64/11/766411a1a5fb415fe01b0b2a527a3e98.jpg",
  },
  {
    title: "Street Hoodies",
    link: "/products?category=men&sub=hoodies",
    image: "https://i.pinimg.com/1200x/46/11/67/4611672a4ac6eb39db8bd3245bd0ffc5.jpg",
  },
  {
    title: "Kids Ethnic",
    link: "/products?category=kids&sub=ethnic",
    image: "https://i.pinimg.com/736x/db/5a/49/db5a490f57e9421a6b5c6b8183ce2622.jpg",
  },
  {
    title: "Cargo Pants",
    link: "/products?category=men&sub=cargos",
    image: "https://i.pinimg.com/1200x/bb/95/cf/bb95cf78d360ea0a96ab5b011e4b6d95.jpg",
  },
];

// This is the FashionTrendingCategories component that renders the trending fashion categories in a visually appealing grid layout with animations and interactive elements to enhance user engagement. Each category card features a high-quality image, title, and a hover effect that reveals a call-to-action icon, encouraging users to explore the products within that category. The background includes a dynamic gradient animation to add visual interest without overwhelming the content.

const FashionTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[45%] h-[45%] bg-purple-200/50 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] bg-pink-200/50 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-20 text-center space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-purple-600">
            The Style Radar
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              FOR EVERYONE
            </span>
          </h2>

          <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full" />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {trending.map((item, i) => (
            <motion.div
              key={item.title}
              whileHover={{ y: -12 }}
              className="group relative"
            >
              <Link to={item.link}>
                <div
                  className="
                    relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden bg-white
                    border border-purple-100
                    shadow-[0_20px_50px_-20px_rgba(168,85,247,0.35)]
                    group-hover:shadow-[0_50px_100px_-30px_rgba(236,72,153,0.45)]
                    transition-all duration-700
                  "
                >
                  {/* IMAGE */}
                  <motion.img
                    src={item.image}
                    alt={item.title}
                    className="h-full w-full object-cover grayscale-[10%] group-hover:grayscale-0"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

                  {/* CONTENT */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end items-center">
                    <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-3 drop-shadow-md text-center">
                      {item.title}
                    </span>

                    <div className="h-10 w-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-500 hover:text-white">
                      <FiArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* BOTTOM ACCENT */}
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-purple-600 to-pink-500 group-hover:w-full transition-all duration-700" />
                </div>

                {/* GHOST INDEX */}
                <div className="absolute -z-10 -bottom-2 -left-2 text-6xl font-black text-gray-100/80 opacity-0 group-hover:opacity-100 transition-all duration-500 select-none">
                  {i < 9 ? `0${i + 1}` : i + 1}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FashionTrendingCategories;