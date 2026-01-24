import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Face Wash",
    link: "/products?category=beauty&sub=facewash",
    image: "https://i.pinimg.com/736x/9b/ec/27/9bec275415282991cafa101a91658f1f.jpg",
  },
  {
    title: "Lipsticks",
    link: "/products?category=beauty&sub=lipsticks",
    image: "https://i.pinimg.com/1200x/f5/5e/48/f55e481f1acba726ec4afd3a1d3cb67a.jpg",
  },
  {
    title: "Shampoos",
    link: "/products?category=beauty&sub=shampoos",
    image: "https://i.pinimg.com/1200x/5f/8b/49/5f8b499f73d3322a0aa854db5ddc9752.jpg",
  },
  {
    title: "Moisturizers",
    link: "/products?category=beauty&sub=moisturizers",
    image: "https://i.pinimg.com/1200x/65/33/03/65330366e9d2ee118d7acd6a933e0293.jpg",
  },
  {
    title: "Trimmers",
    link: "/products?category=beauty&sub=trimmers",
    image: "https://i.pinimg.com/736x/96/ee/9f/96ee9ff080087d1b984a1f9df9e65498.jpg",
  },
  {
    title: "Fragrances",
    link: "/products?category=beauty&sub=fragrances",
    image: "https://i.pinimg.com/736x/54/08/7e/54087e5eb3e464a56a6dc8af76332965.jpg",
  },
  {
    title: "Face Serums",
    link: "/products?category=beauty&sub=serums",
    image: "https://i.pinimg.com/736x/1a/7c/ac/1a7cac1d4a42fe64b64d11fe4d93c05e.jpg",
  },
  {
    title: "Hair Oils",
    link: "/products?category=beauty&sub=hairoils",
    image: "https://i.pinimg.com/736x/0a/01/f6/0a01f6225ce3c4f8425a6f2c26dee756.jpg",
  },
  {
    title: "Makeup Essentials",
    link: "/products?category=beauty&sub=makeup",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Grooming Tools",
    link: "/products?category=beauty&sub=tools",
    image: "https://i.pinimg.com/736x/cb/e6/d9/cbe6d9e45cc5ec1a989b697dad6a129a.jpg",
  },
];

const BeautyTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND (Original Palette) */}
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
            The Beauty Radar
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

export default BeautyTrendingCategories;