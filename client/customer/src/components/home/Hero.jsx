// import React, { useState, useEffect } from "react";
// import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";

// const slides = [
//   {
//     id: 1,
//     tag: "SMART SHOPPING",
//     title: "Shop smarter, faster",
//     subtitle: "with SmartCart",
//     description:
//       "Groceries, fashion, electronics & more — everything you need delivered at lightning speed.",
//     cta: "Start Shopping",
//     link: "/products",
//     image:
//       "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=1465&auto=format&fit=crop",
//     color: "from-purple-600 to-fuchsia-600",
//   },
//   {
//     id: 2,
//     tag: "MEGA DEALS",
//     title: "Season Sale is Live",
//     subtitle: "Up to 60% OFF",
//     description:
//       "Discover exclusive deals across fashion, home & lifestyle before stocks run out.",
//     cta: "View Deals",
//     link: "/products",
//     image:
//       "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600&auto=format&fit=crop",
//     color: "from-pink-600 to-rose-500",
//   },
//   {
//     id: 3,
//     tag: "DAILY ESSENTIALS",
//     title: "Fresh groceries",
//     subtitle: "Delivered daily",
//     description:
//       "Handpicked fruits, vegetables & daily essentials delivered fresh to your doorstep.",
//     cta: "Order Groceries",
//     link: "/categories/groceries",
//     image:
//       "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop",
//     color: "from-green-600 to-emerald-500",
//   },
// ];

// const Hero = () => {
//   const [current, setCurrent] = useState(0);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//     }, 5000);
//     return () => clearInterval(timer);
//   }, []);

//   const nextSlide = () =>
//     setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
//   const prevSlide = () =>
//     setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

//   return (
//     <section className="relative mt-10 h-[560px] w-full overflow-hidden shadow-2xl">
//       <AnimatePresence mode="wait">
//         <motion.div
//           key={current}
//           initial={{ opacity: 0, x: 60 }}
//           animate={{ opacity: 1, x: 0 }}
//           exit={{ opacity: 0, x: -60 }}
//           transition={{ duration: 0.6, ease: "easeOut" }}
//           className="relative h-full w-full"
//         >
//           {/* Background */}
//           <img
//             src={slides[current].image}
//             alt="SmartCart Banner"
//             className="absolute inset-0 h-full w-full object-cover"
//           />
//           <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

//           {/* Content */}
//           <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-12">
//             <div className="max-w-2xl text-white">
//               <span
//                 className={`inline-block mb-4 rounded-full bg-gradient-to-r ${slides[current].color}
//                 px-4 py-1 text-xs font-bold tracking-widest uppercase shadow-lg`}
//               >
//                 {slides[current].tag}
//               </span>

//               <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
//                 {slides[current].title}
//               </h1>
//               <h2 className="mt-2 text-3xl md:text-5xl font-bold text-purple-400">
//                 {slides[current].subtitle}
//               </h2>

//               <p className="mt-6 text-gray-200 text-lg max-w-lg">
//                 {slides[current].description}
//               </p>

//               <div className="mt-8 flex flex-wrap items-center gap-6">
//                 <button
//                   onClick={() => navigate(slides[current].link)}
//                   className={`px-8 py-4 rounded-xl bg-gradient-to-r ${slides[current].color}
//                   font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition`}
//                 >
//                   {slides[current].cta}
//                 </button>

//                 <button
//                   onClick={() => navigate("/categories")}
//                   className="px-8 py-4 rounded-xl border border-white/40 text-white
//                   hover:bg-white/10 transition"
//                 >
//                   Browse Categories
//                 </button>

//                 {slides[current].id === 2 && (
//                   <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
//                     <FiClock className="text-pink-400 animate-pulse" />
//                     <span className="font-mono text-sm font-bold">
//                       Ends in 05:14:50
//                     </span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </AnimatePresence>

//       {/* Arrows */}
//       <button
//         onClick={prevSlide}
//         className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full
//         bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition hidden md:block"
//       >
//         <FiChevronLeft size={24} />
//       </button>
//       <button
//         onClick={nextSlide}
//         className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full
//         bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition hidden md:block"
//       >
//         <FiChevronRight size={24} />
//       </button>

//       {/* Dots */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrent(index)}
//             className={`h-2 rounded-full transition-all ${
//               current === index ? "w-8 bg-purple-500" : "w-2 bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </section>
//   );
// };

// export default Hero;


import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiClock } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  // Safety guard
  if (!slides || slides.length === 0) return null;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () =>
    setCurrent((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );

  const prevSlide = () =>
    setCurrent((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  const activeSlide = slides[current];

  return (
    <section className="relative mt-10 h-[560px] w-full overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative h-full w-full"
        >
          {/* Background */}
          <img
            src={activeSlide.image}
            alt="SmartCart Banner"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

          {/* Content */}
          <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-6 lg:px-12">
            <div className="max-w-2xl text-white">
              <span
                className={`inline-block mb-4 rounded-full bg-gradient-to-r ${activeSlide.color}
                px-4 py-1 text-xs font-bold tracking-widest uppercase shadow-lg`}
              >
                {activeSlide.tag}
              </span>

              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
                {activeSlide.title}
              </h1>

              <h2 className="mt-2 text-3xl md:text-5xl font-bold text-purple-400">
                {activeSlide.subtitle}
              </h2>

              <p className="mt-6 text-gray-200 text-lg max-w-lg">
                {activeSlide.description}
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-6">
                <button
                  onClick={() => navigate(activeSlide.link)}
                  className={`px-8 py-4 rounded-xl bg-gradient-to-r ${activeSlide.color}
                  font-semibold shadow-xl hover:scale-105 hover:shadow-2xl transition`}
                >
                  {activeSlide.cta}
                </button>

                <button
                  onClick={() => navigate("/categories")}
                  className="px-8 py-4 rounded-xl border border-white/40 text-white
                  hover:bg-white/10 transition"
                >
                  Browse Categories
                </button>

                {/* Optional Countdown */}
                {activeSlide.hasCountdown && (
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <FiClock className="text-pink-400 animate-pulse" />
                    <span className="font-mono text-sm font-bold">
                      Ends Soon
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full
        bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition hidden md:block"
      >
        <FiChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full
        bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition hidden md:block"
      >
        <FiChevronRight size={24} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? "w-8 bg-purple-500"
                : "w-2 bg-white/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;
