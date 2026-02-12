import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";

// Slide data for the Beauty Hero section
const slides = [
  {
    id: 1,
    tag: "SmartCart Beauty • Glow Edition",
    title1: "GLOW YOUR",
    title2: "OWN WAY.",
    desc: "Skincare, Haircare, Self-Care—All in One Swipe. Discover the science of radiant skin.",
    bgImage:
      "https://i.pinimg.com/1200x/8a/ee/d1/8aeed1502be1ccd441f46b50becea01b.jpg",
    accent: "from-teal-400 to-emerald-500",
  },
  {
    id: 2,
    tag: "The Fragrance House",
    title1: "SCENTS THAT",
    title2: "DEFINE YOU.",
    desc: "Premium fragrances curated to leave a lasting impression, from day to night.",
    bgImage:
      "https://i.pinimg.com/736x/3b/06/4e/3b064e2edd67eb76351d036e6fb4fad7.jpg",
    accent: "from-rose-400 to-pink-600",
  },
  {
    id: 3,
    tag: "Powered by AI Neural Stylist",
    title1: "LOOKS THAT",
    title2: "TURN HEADS.",
    desc: "Our AI analyzes global trends to curate your perfect grooming routine and makeup palette.",
    bgImage:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1600&auto=format&fit=crop",
    accent: "from-amber-400 to-orange-500",
  },
];


// BeautyHero component with enhanced animations and styling
const BeautyHero = () => {
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
            alt="Beauty Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
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
                  to="/products?category=beauty"
                  className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-emerald-500/50 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Explore Beauty</span>
                  <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/try-ai"
                  className="group flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs hover:text-emerald-400 transition-colors"
                >
                  Try AI Stylist
                  <div className="h-[2px] w-8 bg-white/30 group-hover:w-16 group-hover:bg-emerald-500 transition-all duration-500" />
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
    </section>
  );
};

export default BeautyHero;