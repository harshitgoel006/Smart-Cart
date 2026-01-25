import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Smartphones",
    link: "/products?category=electronics&sub=smartphones",
    image: "https://i.pinimg.com/736x/4e/a1/90/4ea1903732c676930013b06d260f86f2.jpg",
  },
  {
    title: "Laptops",
    link: "/products?category=electronics&sub=laptops",
    image: "https://i.pinimg.com/736x/29/f3/99/29f399aec2699d49113314f1e96d5063.jpg",
  },
  {
    title: "Smartwatches",
    link: "/products?category=electronics&sub=smartwatches",
    image: "https://i.pinimg.com/1200x/65/f5/ca/65f5ca9c8e2f28d19a7a172f964c128d.jpg",
  },
  {
    title: "Smart TVs",
    link: "/products?category=electronics&sub=tvs",
    image: "https://i.pinimg.com/736x/cd/2c/a5/cd2ca53bad0387a382bb0219da608c13.jpg",
  },
  {
    title: "Speakers",
    link: "/products?category=electronics&sub=speakers",
    image: "https://i.pinimg.com/736x/08/93/6d/08936d64e34104f56b2e18e82328c2fa.jpg",
  },
  {
    title: "Audio Devices",
    link: "/products?category=electronics&sub=audio",
    image: "https://i.pinimg.com/1200x/18/24/77/1824775d71c700a1784aafd76c1fdc2b.jpg",
  },
  {
    title: "Cameras",
    link: "/products?category=electronics&sub=cameras",
    image: "https://i.pinimg.com/1200x/80/fa/eb/80faeb090abb3b73bf239bad58922048.jpg",
  },
  {
    title: "Tablets",
    link: "/products?category=electronics&sub=tablets",
    image: "https://i.pinimg.com/736x/82/3f/b1/823fb1de11bc6de3d2fedd9f1de7a326.jpg",
  },
  {
    title: "Appliances",
    link: "/products?category=electronics&sub=appliances",
    image: "https://i.pinimg.com/736x/05/b1/db/05b1dbcdbc509233a6cc9a2ddf9e0e31.jpg",
  },
  {
    title: "Gaming",
    link: "/products?category=electronics&sub=gaming",
    image: "https://i.pinimg.com/736x/6e/50/5e/6e505e9810a568a6f06717e8d3cb6383.jpg",
  },
];

const ElectronicsTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND (BLUE / CYAN PALETTE) */}
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
            Tech Trends Hub
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

export default ElectronicsTrendingCategories;