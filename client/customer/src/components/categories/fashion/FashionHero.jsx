import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// This is a static array of slides for the hero section. In a real application, this could be fetched from an API or CMS.

const slides = [
  {
    id: 1,
    tag: "Women • Couture 2026",
    title1: "ELEVATED STYLE.",
    title2: "DEFINED BY YOU.",
    desc: "Experience luxury ethnic wear and essential basics curated with SmartCart AI intelligence.",
    bgImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=2000&auto=format&fit=crop",
    accent: "from-rose-400 to-purple-500",
    link: "/products?category=women"
  },
  {
    id: 2,
    tag: "Men • Urban Edit",
    title1: "MODERN EDGE.",
    title2: "CLASSIC SOUL.",
    desc: "From sharp tailored suits to premium streetwear — redefine your wardrobe with modern silhouettes.",
    bgImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
    accent: "from-blue-500 to-indigo-400",
    link: "/products?category=men"
  },
  {
    id: 3,
    tag: "Kids • Playful Vibes",
    title1: "FUTURE FASHION.",
    title2: "PURE COMFORT.",
    desc: "Durable, stylish, and comfortable collections designed for the next generation of trendsetters.",
    bgImage: "https://i.pinimg.com/1200x/d9/af/d1/d9afd1aaaba610014af5820816164747.jpg",
    accent: "from-yellow-400 to-orange-500",
    link: "/products?category=kids"
  },
];

// The FashionHero component is a dynamic hero section for the fashion category, featuring an auto-rotating slideshow with smooth transitions and interactive controls.

const FashionHero = () => {
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
    <section className="relative h-[90vh] w-full mt-12 overflow-hidden bg-black shadow-2xl">
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
            alt="Fashion Collection"
            className="h-full w-full object-cover"
          />
          {/* Enhanced Gradients for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
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
              <span className="inline-block mb-6 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-[10px] font-black tracking-[0.4em] uppercase text-white shadow-2xl">
                {slides[current].tag}
              </span>

              <h1 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white uppercase italic">
                {slides[current].title1}
                <br />
                <span
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${slides[current].accent}`}
                >
                  {slides[current].title2}
                </span>
              </h1>

              <p className="mt-6 text-lg text-gray-300/90 max-w-xl font-medium leading-relaxed italic">
                {slides[current].desc}
              </p>

              <div className="mt-12 flex items-center gap-10">
                <Link
                  to={slides[current].link}
                  className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
                >
                  <span className="relative z-10 group-hover:text-white transition-colors duration-300">Shop Collection</span>
                  <FiArrowRight className="relative z-10 group-hover:translate-x-2 group-hover:text-white transition-all" />
                  <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
                </Link>

                <Link
                  to="/try-ai"
                  className="group flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs hover:text-white transition-colors"
                >
                  Explore AI Lab
                  <div className="h-[2px] w-8 bg-white/30 group-hover:w-16 group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-indigo-500 transition-all duration-500" />
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-12 left-0 w-full px-8 md:px-16 z-20 flex items-center justify-between">
        <div className="flex gap-4">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-700 ${
                i === current
                  ? "w-20 bg-white shadow-[0_0_15px_rgba(255,255,255,0.8)]"
                  : "w-6 bg-white/20 hover:bg-white/40"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-4 p-2 rounded-full bg-black/40 backdrop-blur-2xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
          <button
            onClick={prevSlide}
            className="p-4 rounded-full text-white hover:bg-white hover:text-black transition-all"
          >
            <FiChevronLeft size={22} />
          </button>
          <button
            onClick={nextSlide}
            className="p-4 rounded-full text-white hover:bg-white hover:text-black transition-all"
          >
            <FiChevronRight size={22} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FashionHero;