import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Bedsheets",
    link: "/products?category=home-living&sub=bedsheets",
    image: "https://i.pinimg.com/1200x/12/97/02/129702aca126e8ffe0f2aad9569139cb.jpg",
  },
  {
    title: "Curtains",
    link: "/products?category=home-living&sub=curtains",
    image: "https://i.pinimg.com/736x/e8/8d/99/e88d995a70d917f68a5fb82547a7e62a.jpg",
  },
  {
    title: "Wall Art",
    link: "/products?category=home-living&sub=wall-art",
    image: "https://i.pinimg.com/1200x/89/67/3d/89673d432cc359d101b4dfe995728634.jpg",
  },
  {
    title: "Lamps",
    link: "/products?category=home-living&sub=lamps",
    image: "https://i.pinimg.com/736x/fc/84/f1/fc84f18a5278ffc3c975cfdd1b63a9a0.jpg",
  },
  {
    title: "Bath Essentials",
    link: "/products?category=home-living&sub=bath",
    image: "https://i.pinimg.com/1200x/8f/cd/99/8fcd99de101ff409ac8f274aed7fa6dc.jpg",
  },
  {
    title: "Cushions",
    link: "/products?category=home-living&sub=cushions",
    image: "https://i.pinimg.com/1200x/a8/18/48/a818484930a7d3ca19a3a68e2b0a9cbb.jpg",
  },
  {
    title: "Dinnerware",
    link: "/products?category=home-living&sub=dinnerware",
    image: "https://i.pinimg.com/1200x/d3/75/22/d3752280f2f534e5d864fc6b87cbb411.jpg",
  },
  {
    title: "Storage Box",
    link: "/products?category=home-living&sub=storage",
    image: "https://i.pinimg.com/736x/fe/e1/93/fee1931f121d1d022226dae85be232ec.jpg",
  },
  {
    title: "Decor Items",
    link: "/products?category=home-living&sub=decor",
    image: "https://i.pinimg.com/736x/9a/16/9c/9a169cd89cbb9e9b144ea5261962dce1.jpg",
  },
  {
    title: "Outdoor",
    link: "/products?category=home-living&sub=outdoor",
    image: "https://i.pinimg.com/1200x/2b/d0/0d/2bd00de561bce37aa642ab8c69201747.jpg",
  },
];

const HomeLivingTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-emerald-100 via-teal-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND (EMERALD / TEAL PALETTE) */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[45%] h-[45%] bg-emerald-200/50 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] bg-teal-200/50 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-20 text-center space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-emerald-600">
            The Decor Radar
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              CATEGORIES
            </span>
          </h2>

          <div className="h-1 w-20 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full" />
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
                    border border-emerald-100
                    shadow-[0_20px_50px_-20px_rgba(16,185,129,0.35)]
                    group-hover:shadow-[0_50px_100px_-30px_rgba(20,184,166,0.45)]
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

                    <div className="h-10 w-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-emerald-600 hover:to-teal-500 hover:text-white">
                      <FiArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* BOTTOM ACCENT */}
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-emerald-600 to-teal-500 group-hover:w-full transition-all duration-700" />
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

export default HomeLivingTrendingCategories;