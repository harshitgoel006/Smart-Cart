import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowUpRight } from "react-icons/fi";

// Sample categories data for the Women Trending Categories section - showcasing popular women's fashion categories with vibrant images and links for navigation. Each category includes a title, link for routing, and an image URL to visually represent the category. This data is used to dynamically render the trending categories grid in the WomenTrendingCategories component.

const trending = [
  {
    title: "Lehengas",
    link: "/products?category=women&sub=lehengas",
    image: "https://i.pinimg.com/736x/5d/21/be/5d21be91a00d123d5235ce284b829462.jpg",
  },
  {
    title: "Co-ord Sets",
    link: "/products?category=women&sub=coords",
    image: "https://images.unsplash.com/photo-1618244972963-dbee1a7edc95?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "Western Wear",
    link: "/products?category=women&sub=western",
    image: "https://i.pinimg.com/1200x/08/be/9f/08be9f2d28b00941cb916bd735e6efb5.jpg",
  },
  {
    title: "Designer Sarees",
    link: "/products?category=women&sub=sarees",
    image: "https://i.pinimg.com/736x/b2/31/83/b231839cbae841164056c92d0bdb6035.jpg",
  },
  {
    title: "Premium Heels",
    link: "/products?category=women&sub=heels",
    image: "https://i.pinimg.com/736x/a2/d4/e9/a2d4e99578f2f63eca4122cd919e3e07.jpg",
  },
  {
    title: "Ethnic Suits",
    link: "/products?category=women&sub=suits",
    image: "https://i.pinimg.com/1200x/58/ab/ba/58abba8994c5a36e5c3dc2afb531ae42.jpg",
  },
  {
    title: "Mini Dresses",
    link: "/products?category=women&sub=dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    title: "T-Shirts",
    link: "/products?category=women&sub=t-shirts",
    image: "https://i.pinimg.com/1200x/b6/ef/4c/b6ef4c8808d56f70acad7587581707e0.jpg",
  },
  {
    title: "Handbags",
    link: "/products?category=women&sub=bags",
    image: "https://i.pinimg.com/1200x/61/5c/db/615cdb9f9b4fa65ab22d4acbe15ce82c.jpg",
  },
  {
    title: "Gym Wear",
    link: "/products?category=women&sub=gym",
    image: "https://i.pinimg.com/1200x/c1/92/69/c19269a67700c580513527bbabac033a.jpg",
  },
];

// The WomenTrendingCategories component renders a visually engaging section that highlights popular women fashion categories. It features a dynamic grid layout where each category is represented by a vibrant image, overlaid with a descriptive tag and title. The component incorporates subtle animations for an interactive user experience, making it easy for customers to explore different categories and navigate to relevant product listings. The use of framer-motion adds smooth animations to enhance the overall user experience, while the design elements such as gradient text and hover effects create a modern and stylish aesthetic that appeals to fashion-conscious customers. 


const WomenTrendingCategories = () => {
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
            The Style Radar
          </span>

          <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-gray-950 leading-none">
            TRENDING <br />
            <span className="italic font-light bg-gradient-to-r from-pink-600 to-purple-500 bg-clip-text text-transparent">
              CATEGORIES
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
                    <span className="text-white text-[10px] font-black tracking-[0.3em] uppercase mb-3 drop-shadow-md text-center">
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

export default WomenTrendingCategories;