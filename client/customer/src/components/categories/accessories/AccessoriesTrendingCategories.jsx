import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

const trending = [
  {
    title: "Watches",
    link: "/products?category=accessories&sub=watches",
    image: "https://i.pinimg.com/1200x/6a/b9/28/6ab928fe41d1c71a1e8db5f0782b1e8c.jpg",
  },
  {
    title: "Wallets",
    link: "/products?category=accessories&sub=wallets",
    image: "https://i.pinimg.com/736x/d8/bc/13/d8bc13cfccb53b29a9f31575d1404a30.jpg",
  },
  {
    title: "Bags",
    link: "/products?category=accessories&sub=bags",
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Belts",
    link: "/products?category=accessories&sub=belts",
    image: "https://i.pinimg.com/736x/67/d6/2b/67d62b4623b974d6cea4702aa6c91b9b.jpg",
  },
  {
    title: "Jewellery",
    link: "/products?category=accessories&sub=jewellery",
    image: "https://i.pinimg.com/736x/05/5d/a7/055da7fa3252cc8bfed876fe83b9a3cf.jpg",
  },
  {
    title: "Sunglasses",
    link: "/products?category=accessories&sub=sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=800&auto=format&fit=crop",
  },
  {
    title: "Caps",
    link: "/products?category=accessories&sub=caps",
    image: "https://i.pinimg.com/736x/51/bd/d2/51bdd237933358630bcf673a51a19523.jpg",
  },
  {
    title: "Hairwear",
    link: "/products?category=accessories&sub=hairwear",
    image: "https://i.pinimg.com/736x/f6/df/5c/f6df5c8aadccb96ea39968328cd22730.jpg",
  },
  {
    title: "Travel",
    link: "/products?category=accessories&sub=travel",
    image: "https://i.pinimg.com/1200x/42/e0/27/42e0272801d88e94bef3d16e803246c3.jpg",
  },
  {
    title: "Perfumes",
    link: "/products?category=accessories&sub=fragrance",
    image: "https://i.pinimg.com/736x/5a/0d/58/5a0d58ede6ba9b441c205bd7dc8cef09.jpg",
  },
];

const AccessoriesTrendingCategories = () => {
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
            Luxe Edit
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              ACCESSORIES
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

export default AccessoriesTrendingCategories;