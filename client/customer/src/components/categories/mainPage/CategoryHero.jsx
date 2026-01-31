import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    tag: "SmartCart Universe • 2026",
    title1: "FASHION &",
    title2: "LIFESTYLE. ",
    desc: "Vast collections from global brands. Explore the latest trends in Men's, Women's and Kids' fashion all in one place.",
    bgImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000&auto=format&fit=crop",
    accent: "from-purple-400 to-pink-500",
    link: "/categories/fashion"
  },
  {
    id: 2,
    tag: "Future Tech • Now Available",
    title1: "ELITE",
    title2: "ELECTRONICS. ",
    desc: "From AI-powered gadgets to high-performance computing. Upgrade your lifestyle with our premium electronics category.",
    bgImage: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2000&auto=format&fit=crop",
    accent: "from-blue-400 to-cyan-500",
    link: "/categories/electronics"
  },
  {
    id: 3,
    tag: "Modern Spaces • Home Decor",
    title1: "HOME &",
    title2: "ESSENTIALS.  ",
    desc: "Turn your house into a home. Discover curated furniture, decor, and daily essentials for every modern living space.",
    bgImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1600&auto=format&fit=crop",
    accent: "from-orange-400 to-yellow-500",
    link: "/categories/home-living"
  },
];

const CategoryHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const prevSlide = () => setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

  return (
    <section className="relative h-[85vh] w-full mt-10 overflow-hidden bg-black shadow-2xl">
      {/* Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <motion.img
            initial={{ scale: 1.15 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "easeOut" }}
            src={slides[current].bgImage}
            alt="Category Showcase"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 h-full w-full max-w-[1440px] mx-auto px-8 md:px-16 flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.7, ease: "circOut" }}
            >
              <span className="inline-block mb-6 px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black tracking-[0.3em] uppercase text-white shadow-2xl">
                {slides[current].tag}
              </span>

              <h1 className="text-5xl md:text-8xl font-black leading-[0.85] tracking-tighter text-white uppercase italic">
                {slides[current].title1}
                <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[current].accent}`}
                >
                  {slides[current].title2}
                </span>
              </h1>

              <p className="mt-8 text-lg text-gray-300/90 max-w-xl font-medium leading-relaxed italic">
                {slides[current].desc}
              </p>

              <div className="mt-12 flex items-center gap-10">
                <Link
                  to={slides[current].link}
                  className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Explore Category</span>
                  <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].accent} opacity-0 group-hover:opacity-100 transition-opacity`} />
                </Link>

                <div className="hidden md:flex items-center gap-3 text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">
                  Scroll to See All
                  <div className="h-[1px] w-12 bg-white/20" />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 w-full px-8 md:px-16 z-20 flex items-center justify-between">
        <div className="flex gap-4">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-700 ${
                i === current
                  ? "w-20 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  : "w-6 bg-white/20"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 p-2 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <button onClick={prevSlide} className="p-4 rounded-full text-white hover:bg-white hover:text-black transition-all">
            <FiChevronLeft size={22} />
          </button>
          <button onClick={nextSlide} className="p-4 rounded-full text-white hover:bg-white hover:text-black transition-all">
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategoryHero;