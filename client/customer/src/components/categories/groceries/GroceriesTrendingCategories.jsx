import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Vegetables",
    link: "/products?category=groceries&sub=vegetables",
    image: "https://i.pinimg.com/1200x/9a/32/51/9a3251e176544a068d5d6c9f46d51a8e.jpg",
  },
  {
    title: "Fruits",
    link: "/products?category=groceries&sub=fruits",
    image: "https://i.pinimg.com/736x/36/78/f1/3678f1eb815bd34ce44345db09fa6805.jpg",
  },
  {
    title: "Dairy & Eggs",
    link: "/products?category=groceries&sub=dairy",
    image: "https://i.pinimg.com/1200x/a2/97/ca/a297caaca573e1ea85623d3061c85a7e.jpg",
  },
  {
    title: "Snacks",
    link: "/products?category=groceries&sub=snacks",
    image: "https://i.pinimg.com/1200x/d7/ef/01/d7ef01dc3674b3e2eeb5617229058f9e.jpg",
  },
  {
    title: "Beverages",
    link: "/products?category=groceries&sub=beverages",
    image: "https://i.pinimg.com/1200x/6c/e2/c0/6ce2c03c68cec39bcdffa469ec376e78.jpg",
  },
  {
    title: "Bakery",
    link: "/products?category=groceries&sub=bakery",
    image: "https://i.pinimg.com/736x/9a/5a/9f/9a5a9fc7d616c50104b4d6b93e88ecfe.jpg",
  },
  {
    title: "Organic Oils",
    link: "/products?category=groceries&sub=oils",
    image: "https://i.pinimg.com/736x/2e/ac/93/2eac93201393e4fce87ad84b5d8ad985.jpg",
  },
  {
    title: "Dry Fruits",
    link: "/products?category=groceries&sub=dry-fruits",
    image: "https://i.pinimg.com/1200x/a6/d7/c4/a6d7c4ec25903e6dd6c276e741bd1bed.jpg",
  },
  {
    title: "Grains & Rice",
    link: "/products?category=groceries&sub=grains",
    image: "https://i.pinimg.com/1200x/31/b9/f3/31b9f30c491b94946d551d737cb3e35f.jpg",
  },
  {
    title: "Pet Care",
    link: "/products?category=groceries&sub=pet-care",
    image: "https://i.pinimg.com/1200x/78/ff/bd/78ffbd68f660fb1b055e85ec8f6cca89.jpg",
  },
];

const GroceriesTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-purple-100 via-pink-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND (GREEN / AMBER PALETTE) */}
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
            Freshness Radar
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
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    whileHover={{ scale: 1.12 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />

                  {/* OVERLAY */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

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

export default GroceriesTrendingCategories;