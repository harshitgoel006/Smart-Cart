import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiClock, FiArrowRight } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Hero = ({ slides = [] }) => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length) return null;

  const nextSlide = () => setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  const prevSlide = () => setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <section className="relative h-[650px] md:h-[620px] w-full overflow-hidden bg-black mt-5">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="relative h-full w-full"
        >
          {/* Zooming Background Image */}
          <motion.div
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, ease: "linear" }}
            className="absolute inset-0"
          >
            <img
              src={slides[current].image}
              alt="Banner"
              className="h-full w-full object-cover opacity-70"
            />
          </motion.div>

          {/* Luxury Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Content Wrapper */}
          <div className="relative z-20 mx-auto flex h-full max-w-7xl items-center px-8 lg:px-12">
            <div className="max-w-3xl">
              {/* Badge */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-8 flex items-center gap-3"
              >
                <span className="h-[1px] w-12 bg-purple-500" />
                <span className="text-[11px] font-black tracking-[0.4em] uppercase text-purple-400">
                  {slides[current].tag}
                </span>
              </motion.div>

              {/* Title with Mask Reveal */}
              <div className="overflow-hidden mb-2">
                <motion.h1
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
                  className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tighter text-white uppercase"
                >
                  {slides[current].title}
                </motion.h1>
              </div>

              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 }}
                className="text-3xl md:text-5xl font-serif italic text-gray-300 tracking-tight"
              >
                {slides[current].subtitle}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-8 max-w-lg text-lg leading-relaxed text-gray-400 font-medium"
              >
                {slides[current].description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-12 flex flex-wrap items-center gap-8"
              >
                <button
                  onClick={() => navigate(slides[current].link)}
                  className="group relative flex items-center gap-4 overflow-hidden rounded-full bg-white px-10 py-5 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-105"
                >
                  <span className="relative z-10">{slides[current].cta}</span>
                  <FiArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].color} translate-y-full transition-transform group-hover:translate-y-0`} />
                </button>

                <button
                  onClick={() => navigate("/categories")}
                  className="text-xs font-black uppercase tracking-[0.3em] text-white border-b-2 border-white/20 pb-2 hover:border-purple-500 transition-all"
                >
                  Discover More
                </button>

                {slides[current].id === 2 && (
                  <div className="flex items-center gap-3 rounded-2xl bg-white/5 backdrop-blur-2xl border border-white/10 px-6 py-3 shadow-2xl">
                    <FiClock className="text-pink-500 animate-ping" />
                    <span className="font-mono text-sm font-bold text-white uppercase tracking-tighter">
                      Limited Release
                    </span>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Modern Navigation Controls */}
      <div className="absolute bottom-12 right-12 z-30 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white transition-all hover:bg-white hover:text-black"
        >
          <FiChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl text-white transition-all hover:bg-white hover:text-black"
        >
          <FiChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Minimalist Progress Indicators */}
      <div className="absolute bottom-12 left-12 z-30 flex gap-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className="group relative h-1 w-16 overflow-hidden rounded-full bg-white/20 transition-all"
          >
            {current === index && (
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                transition={{ duration: 6, ease: "linear" }}
                className="absolute inset-0 bg-purple-500"
              />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default Hero;