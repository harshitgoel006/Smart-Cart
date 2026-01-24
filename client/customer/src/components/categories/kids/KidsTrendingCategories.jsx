import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Graphic Tees",
    link: "/products?category=kids&sub=tshirts",
    image: "https://i.pinimg.com/1200x/9c/0c/d5/9c0cd51452dd9dbc07958edd2858d01b.jpg",
  },
  {
    title: "Co-ord Sets",
    link: "/products?category=kids&sub=coords",
    image: "https://i.pinimg.com/736x/a9/e7/81/a9e7811c3fd964fe8ac0f868cc2ea469.jpg",
  },
  {
    title: "Cargos",
    link: "/products?category=kids&sub=bottomwear",
    image: "https://i.pinimg.com/1200x/12/28/62/122862a81cd75cf18bf0327d8dbaf39a.jpg",
  },
  {
    title: "Sneakers",
    link: "/products?category=kids&sub=shoes",
    image: "https://i.pinimg.com/1200x/3a/fb/4a/3afb4a6ebb563f9dc191cabbbaf4d097.jpg",
  },
  {
    title: "Jumpsuits",
    link: "/products?category=kids&sub=jumpsuits",
    image: "https://i.pinimg.com/1200x/3b/14/58/3b14580278cd599bf2330e3f978aac75.jpg",
  },
  {
    title: "Tops",
    link: "/products?category=kids&sub=tops",
    image: "https://i.pinimg.com/736x/07/5a/dc/075adcaf149d306a2f82737fce590f91.jpg",
  },
  {
    title: "Sandals",
    link: "/products?category=kids&sub=sandals",
    image: "https://i.pinimg.com/1200x/69/4c/f7/694cf7d60f07ff7ac6c9270f46659eb9.jpg",
  },
  {
    title: "Ethnic Wear",
    link: "/products?category=kids&sub=ethnic",
    image: "https://i.pinimg.com/1200x/dc/9b/3e/dc9b3e5b18609d5d2941a8a9bb92ccf3.jpg",
  },
  {
    title: "Sleepwear",
    link: "/products?category=kids&sub=sleepwear",
    image: "https://i.pinimg.com/1200x/83/43/59/834359e36f1fe16197d890253477e0a0.jpg",
  },
  {
    title: "Baby Sets",
    link: "/products?category=kids&sub=infant",
    image: "https://i.pinimg.com/1200x/ef/0d/2a/ef0d2a2dc2c8b82929833e68131c4e17.jpg",
  },
];

const KidsTrendingCategories = () => {
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
            Kids Style Radar
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

export default KidsTrendingCategories;