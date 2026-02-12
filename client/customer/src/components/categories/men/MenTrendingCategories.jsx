
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// This is the MenTrendingCategories component that displays trending categories for men. It features a header with a title and a link to view all categories, followed by a grid of category cards. Each card includes an image, category name, and a hover effect that reveals a "View Store" icon. The component uses Tailwind CSS for styling and Framer Motion for animations to create an engaging user experience.

const trending = [
  {
    title: "T-Shirts",
    link: "/products?category=men&sub=tshirts",
    image: "https://i.pinimg.com/1200x/87/8b/51/878b514cbf74837c2cb5c0fb598b96d2.jpg",
  },
  {
    title: "Shirts",
    link: "/products?category=men&sub=shirts",
    image: "https://i.pinimg.com/736x/17/ec/e0/17ece08130b1c3f72ec8d73e8bb97bd8.jpg",
  },
  {
    title: "Pants",
    link: "/products?category=men&sub=pants",
    image: "https://i.pinimg.com/1200x/80/28/e4/8028e4627b84d16f84581f0bc379e0ad.jpg",
  },
  {
    title: "Hoodies",
    link: "/products?category=men&sub=hoodies",
    image: "https://i.pinimg.com/1200x/05/01/c8/0501c8efd52bda19b729247bcaee987b.jpg",
  },
  {
    title: "Overcoats",
    link: "/products?category=men&sub=overcoats",
    image: "https://i.pinimg.com/736x/da/09/f7/da09f751ceca476b80aadc63090637e5.jpg",
  },
  {
    title: "Shoes",
    link: "/products?category=men&sub=shoes",
    image: "https://i.pinimg.com/1200x/50/7c/11/507c11dd5cae613163d93dc9ceb82305.jpg",
  },
  {
    title: "Kurta",
    link: "/products?category=men&sub=kurta",
    image: "https://i.pinimg.com/736x/fd/1c/4f/fd1c4fa5b789bdcf930494e47e17b79a.jpg",
  },
  {
    title: "Sherwanis",
    link: "/products?category=men&sub=sherwani",
    image: "https://i.pinimg.com/1200x/90/c2/53/90c253609dd4970f8b2f95f8ea566253.jpg",
  },
  {
    title: "Suits",
    link: "/products?category=men&sub=suits",
    image: "https://i.pinimg.com/736x/68/57/cf/6857cfe09ac733044062402556e84109.jpg",
  },
  {
    title: "Cargos",
    link: "/products?category=men&sub=cargos",
    image: "https://i.pinimg.com/736x/42/9c/e8/429ce897ccbaa3efc122d47ab18eebe5.jpg",
  },
];

const MenTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND (PURPLE / PINK PALETTE) */}
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
              CATEGORIES
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
                    <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-3 drop-shadow-md">
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

export default MenTrendingCategories;
