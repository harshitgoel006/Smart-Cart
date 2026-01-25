import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const offers = [
  {
    id: 1,
    badge: "SMART DEAL",
    title: "Premium Tech Deals",
    subtitle: "UP TO 50% OFF",
    desc: "Top-rated headphones, smartwatches & accessories at unbeatable prices.",
    cta: "Shop Electronics",
    link: "/categories/electronics",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 2,
    badge: "SEASON SALE",
    title: "Fashion Fest",
    subtitle: "MIN 40% OFF",
    desc: "Trending outfits, summer essentials & new arrivals curated for you.",
    cta: "Explore Fashion",
    link: "/categories/fashion",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
  },
  {
    id: 3,
    badge: "DAILY ESSENTIALS",
    title: "Home & Kitchen",
    subtitle: "SMART SAVINGS",
    desc: "Upgrade your home with modern appliances and daily-use essentials.",
    cta: "View Deals",
    link: "/categories/home-living",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2000&auto=format&fit=crop",
  },
];

const OffersSlider = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % offers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const next = () => setActive((p) => (p + 1) % offers.length);
  const prev = () => setActive((p) => (p === 0 ? offers.length - 1 : p - 1));

  return (
    <section className="relative w-full h-[550px] md:h-[680px] overflow-hidden group bg-black">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full"
        >
          {/* BACKGROUND WITH DEPTH EFFECT */}
          <motion.div
            initial={{ scale: 1.15, filter: "blur(4px)" }}
            animate={{ scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 8, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <img
              src={offers[active].image}
              alt={offers[active].title}
              className="w-full h-full object-cover"
            />
            {/* MULTI-LAYER OVERLAY FOR BETTER TEXT READABILITY */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
            {/* INNER GLOW/SHADOW */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.5)]" />
          </motion.div>

          {/* CONTENT AREA */}
          <div className="relative h-full max-w-7xl mx-auto px-8 flex items-center">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-white max-w-2xl"
            >
              <motion.span 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[11px] font-black tracking-[0.3em] uppercase shadow-xl"
              >
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                {offers[active].badge}
              </motion.span>

              <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-4">
                {offers[active].title}
              </h2>

              <h3 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 drop-shadow-sm">
                {offers[active].subtitle}
              </h3>

              <p className="mt-8 text-lg md:text-xl text-gray-300 leading-relaxed font-medium max-w-lg opacity-90">
                {offers[active].desc}
              </p>

              <div className="mt-12 flex items-center gap-8">
                <Link
                  to={offers[active].link}
                  className="group/btn relative px-12 py-5 bg-white text-gray-900 font-black rounded-2xl overflow-hidden transition-all transform hover:scale-105 shadow-[0_20px_50px_rgba(255,255,255,0.15)] flex items-center gap-3"
                >
                  <span className="relative z-10">{offers[active].cta}</span>
                  <FiArrowRight className="relative z-10 group-hover/btn:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                </Link>

                <Link to="/offers" className="hidden md:block text-sm font-bold tracking-widest uppercase border-b-2 border-purple-500 pb-1 hover:text-purple-400 transition-colors">
                  View All Events
                </Link>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* LUXURY NAVIGATION (Glass Arrows) */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-8 pointer-events-none">
        <button
          onClick={prev}
          className="pointer-events-auto w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 -translate-x-10 group-hover:translate-x-0 shadow-2xl"
        >
          <FiChevronLeft size={28} />
        </button>
        <button
          onClick={next}
          className="pointer-events-auto w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center hover:bg-white/20 hover:bg-white/20 transition-all opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 shadow-2xl"
        >
          <FiChevronRight size={28} />
        </button>
      </div>

      {/* IMPROVED PROGRESS INDICATOR (Instagram Style Segments) */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-4 px-6 py-3 bg-black/20 backdrop-blur-lg rounded-3xl border border-white/5">
        {offers.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="relative h-[6px] w-16 md:w-24 bg-white/10 rounded-full overflow-hidden group/item"
          >
            {/* Base Background Hover */}
            <div className="absolute inset-0 bg-white/10 group-hover/item:bg-white/20 transition-colors" />
            
            {/* Active Loading Fill */}
            {active === i && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]"
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 6, ease: "linear" }}
              />
            )}

            {/* Past Finished Segments */}
            {active > i && (
              <div className="absolute inset-0 bg-purple-500/50" />
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default OffersSlider;
