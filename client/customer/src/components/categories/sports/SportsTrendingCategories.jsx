import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// Sample categories data for the Sports Trending Categories section - showcasing popular sports gear types with vibrant images and links for navigation. Each category includes a title, link for routing, and an image URL to visually represent the category. This data is used to dynamically render the trending categories grid in the SportsTrendingCategories component.

const trending = [
  {
    title: "Compression Wear",
    link: "/products?category=sports&sub=compression",
    image: "https://i.pinimg.com/1200x/ac/5a/c1/ac5ac1b4eb035ca0aef758f531138b65.jpg",
  },
  {
    title: "Running Shoes",
    link: "/products?category=sports&sub=footwear",
    image: "https://i.pinimg.com/736x/fa/8d/1b/fa8d1bf4303232c9596f31e325921cff.jpg",
  },
  {
    title: "Gym Shorts",
    link: "/products?category=sports&sub=shorts",
    image: "https://i.pinimg.com/736x/0c/86/99/0c869965a3c7e6c7ea792b8b7682488a.jpg",
  },
  {
    title: "Performance Hoodies",
    link: "/products?category=sports&sub=hoodies",
    image: "https://i.pinimg.com/1200x/bc/8f/81/bc8f819129aac15b0c86905338c7cc41.jpg",
  },
  {
    title: "Tech Tracksuits",
    link: "/products?category=sports&sub=tracksuits",
    image: "https://i.pinimg.com/1200x/49/da/74/49da74f3ecf6f844f5d3495a953b9354.jpg",
  },
  {
    title: "Sports Watches",
    link: "/products?category=sports&sub=accessories",
    image: "https://i.pinimg.com/1200x/15/da/6e/15da6ea6df93a6e272e7ccb7be50a702.jpg",
  },
  {
    title: "Weightlifting Gear",
    link: "/products?category=sports&sub=equipment",
    image: "https://i.pinimg.com/1200x/ff/42/3b/ff423b82d9b77188d6805ed310e59ebe.jpg",
  },
  {
    title: "Yoga & Mat",
    link: "/products?category=sports&sub=yoga",
    image: "https://i.pinimg.com/736x/25/16/79/251679abd4369686c3de1124a6ce1820.jpg",
  },
  {
    title: "Swimming Kits",
    link: "/products?category=sports&sub=swim",
    image: "https://i.pinimg.com/1200x/99/51/69/9951695c3e035a7e7c554867c811dabb.jpg",
  },
  {
    title: "Training Bags",
    link: "/products?category=sports&sub=bags",
    image: "https://i.pinimg.com/1200x/51/d2/cb/51d2cbb05fa2def2236b97ed2dc127e9.jpg",
  },
];

// The SportsTrendingCategories component renders a visually engaging section that highlights popular sports gear types. It features a dynamic grid layout where each category is represented by a vibrant image, overlaid with a descriptive tag and title. The component incorporates subtle animations for an interactive user experience, making it easy for customers to explore different sports categories and navigate to relevant product listings.
const SportsTrendingCategories = () => {
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
            Performance Radar
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              GEAR TYPES
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
                  <div className="absolute inset-0 p-6 flex flex-col justify-end items-center text-center">
                    <span className="text-white text-[10px] font-black tracking-[0.2em] uppercase mb-3 drop-shadow-md">
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

export default SportsTrendingCategories;