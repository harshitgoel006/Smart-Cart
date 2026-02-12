import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";


// This is the GiftsTrendingCategories component showcasing trending gift categories with a modern design, smooth animations, and enhanced user experience

const trending = [
  {
    title: "Gift Hampers",
    link: "/products?category=gifts&sub=hampers",
    image: "https://i.pinimg.com/1200x/48/c9/3a/48c93abee05b73bcc3424302f5748681.jpg",
  },
  {
    title: "Personalized",
    link: "/products?category=gifts&sub=personalized",
    image: "https://i.pinimg.com/1200x/1b/fd/3a/1bfd3a0e396d0e9dd10e563e850ecad4.jpg",
  },
  {
    title: "Scented Candles",
    link: "/products?category=gifts&sub=candles",
    image: "https://i.pinimg.com/1200x/70/94/31/709431e53dcddbc8dfa434edb176a47c.jpg",
  },
  {
    title: "Perfume Sets",
    link: "/products?category=gifts&sub=perfumes",
    image: "https://i.pinimg.com/736x/64/ce/2b/64ce2bd1e482452bb956e84661cc5611.jpg",
  },
  {
    title: "Chocolates",
    link: "/products?category=gifts&sub=chocolates",
    image: "https://i.pinimg.com/736x/f4/8f/37/f48f373c1268827d6a0ae3a15faa0364.jpg",
  },
  {
    title: "Photo Frames",
    link: "/products?category=gifts&sub=frames",
    image: "https://i.pinimg.com/736x/c6/62/b3/c662b31a72d5db283be0dfcc7b6fcada.jpg",
  },
  {
    title: "Plants",
    link: "/products?category=gifts&sub=plants",
    image: "https://i.pinimg.com/1200x/9d/6b/ec/9d6becfdb08dac3f2197361f9fc959d1.jpg",
  },
  {
    title: "Jewellery",
    link: "/products?category=gifts&sub=jewellery",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Stationery",
    link: "/products?category=gifts&sub=stationery",
    image: "https://i.pinimg.com/736x/1a/4a/4d/1a4a4d0be281b63295b729f0bf1c1fff.jpg",
  },
  {
    title: "Tech Gadgets",
    link: "/products?category=gifts&sub=tech",
    image: "https://i.pinimg.com/1200x/0b/95/aa/0b95aab03c00719fddcf9435e041050f.jpg",
  },
];

const GiftsTrendingCategories = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-gradient-to-b from-pink-100 via-purple-100/40 to-white">

      {/* MOTION GRADIENT BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[45%] h-[45%] bg-pink-200/50 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{ x: [0, -60, 0], y: [0, 50, 0] }}
          transition={{ duration: 26, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[45%] h-[45%] bg-purple-200/50 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-[1440px] mx-auto px-8 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col items-center mb-20 text-center space-y-4">
          <span className="text-[10px] font-black tracking-[0.5em] uppercase text-pink-600">
            Gift Inspiration Hub
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent">
              GIFTS
            </span>
          </h2>

          <div className="h-1 w-20 bg-gradient-to-r from-pink-600 to-purple-500 rounded-full" />
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
                    border border-pink-100
                    shadow-[0_20px_50px_-20px_rgba(236,72,153,0.35)]
                    group-hover:shadow-[0_50px_100px_-30px_rgba(168,85,247,0.45)]
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

                    <div className="h-10 w-10 rounded-full bg-white text-gray-950 flex items-center justify-center shadow-xl scale-0 group-hover:scale-100 transition-all duration-500 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-500 hover:text-white">
                      <FiArrowUpRight size={18} />
                    </div>
                  </div>

                  {/* BOTTOM ACCENT */}
                  <div className="absolute bottom-0 left-0 h-1.5 w-0 bg-gradient-to-r from-pink-600 to-purple-500 group-hover:w-full transition-all duration-700" />
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

export default GiftsTrendingCategories;