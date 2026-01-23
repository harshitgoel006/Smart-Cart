import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

const slides = [
  {
    id: 1,
    tag: "SmartCart Men • 2026",
    title1: "SMART STYLE.",
    title2: "BUILT FOR YOU.",
    desc: "Discover premium menswear, footwear & essentials curated with SmartCart intelligence.",
    bgImage:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=1600&auto=format&fit=crop",
    accent: "from-purple-500 to-pink-500",
  },
  {
    id: 2,
    tag: "Office to Everyday",
    title1: "WORK READY.",
    title2: "WEEKEND EASY.",
    desc: "Formals, smart-casuals & daily wear — designed for comfort and confidence.",
    bgImage:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1600&auto=format&fit=crop",
    accent: "from-blue-500 to-cyan-500",
  },
  {
    id: 3,
    tag: "Powered by SmartCart AI",
    title1: "STYLE THAT",
    title2: "UNDERSTANDS YOU.",
    desc: "AI-powered recommendations that match your taste, size & lifestyle.",
    bgImage:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1600&auto=format&fit=crop",
    accent: "from-amber-500 to-orange-500",
  },
];

const MenHero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () =>
    setCurrent((p) => (p === slides.length - 1 ? 0 : p + 1));
  const prevSlide = () =>
    setCurrent((p) => (p === 0 ? slides.length - 1 : p - 1));

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
            alt="Men Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
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
                  to="/products?category=men"
                  className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-purple-500/50 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Shop Collection</span>
                  <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/try-ai"
                  className="group flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs hover:text-purple-400 transition-colors"
                >
                  Explore AI Lab
                  <div className="h-[2px] w-8 bg-white/30 group-hover:w-16 group-hover:bg-purple-500 transition-all duration-500" />
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

      <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-900/10 to-transparent pointer-events-none" />
    </section>
  );
};

export default MenHero;
