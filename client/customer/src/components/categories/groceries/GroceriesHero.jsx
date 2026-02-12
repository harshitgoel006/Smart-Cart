import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";


// Mock data for slides - In a real application, this would likely come from an API or CMS

const slides = [
  {
    id: 1,
    tag: "SmartCart Groceries • 2026",
    title1: "FARM FRESH.",
    title2: "DELIVERED FAST.",
    desc: "Experience the finest organic produce, daily essentials & pantry staples handpicked for your kitchen.",
    bgImage:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop",
    accent: "from-green-500 to-emerald-500",
  },
  {
    id: 2,
    tag: "Daily Essentials",
    title1: "PANTRY FULL.",
    title2: "STRESS ZERO.",
    desc: "From premium dairy to artisanal snacks — get everything you need for a healthy lifestyle.",
    bgImage:
      "https://i.pinimg.com/736x/24/5a/f9/245af9e2aa5bc721300563e0110d2f2f.jpg",
    accent: "from-lime-500 to-green-600",
  },
  {
    id: 3,
    tag: "Powered by SmartCart AI",
    title1: "NUTRITION THAT",
    title2: "SUITS YOUR GOALS.",
    desc: "AI-powered grocery lists that adapt to your diet, preferences & weekly consumption.",
    bgImage:
      "https://i.pinimg.com/1200x/7b/5b/ca/7b5bcade97b41d5739448e5f9723f03e.jpg",
    accent: "from-teal-500 to-emerald-400",
  },
];

// GroceriesHero Component - A visually captivating hero section for the groceries category, featuring a dynamic slideshow of vibrant images, compelling headlines, and clear calls-to-action to entice users to explore and shop for fresh produce and essentials.

const GroceriesHero = () => {
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
            alt="Groceries Collection"
            className="h-full w-full object-cover opacity-80"
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
                  to="/products?category=groceries"
                  className="group relative flex items-center gap-4 px-12 py-5 rounded-full bg-white text-black font-black uppercase tracking-widest text-xs overflow-hidden transition-all shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-purple-500/50 transform hover:-translate-y-1"
                >
                  <span className="relative z-10">Shop Fresh</span>
                  <FiArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>

                <Link
                  to="/try-ai"
                  className="group flex items-center gap-3 text-white font-black uppercase tracking-[0.2em] text-xs hover:text-purple-400 transition-colors"
                >
                  Auto-Restock AI
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

export default GroceriesHero;