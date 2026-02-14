import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const OffersSlider = ({ offers = [] }) => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!offers.length) return;
    const timer = setInterval(() => {
      setActive((p) => (p + 1) % offers.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [offers]);

  if (!offers.length) return null;

  const next = () => setActive((p) => (p + 1) % offers.length);
  const prev = () => setActive((p) => (p === 0 ? offers.length - 1 : p - 1));

  return (
    // Height optimized: h-[480px] md:h-[600px] (Na bohot bada, na bohot chota)
    <section className="relative w-full h-[580px] md:h-[650px] overflow-hidden group bg-black mb-20">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="relative w-full h-full"
        >
          {/* BACKGROUND */}
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 6 }}
            className="absolute inset-0"
          >
            <img
              src={offers[active].image}
              alt={offers[active].title}
              className="w-full h-full object-cover"
            />
            {/* Dark overlays for better text pop */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent z-10" />
            <div className="absolute inset-0 bg-black/20 z-10" />
          </motion.div>

          {/* CONTENT AREA */}
          <div className="relative z-20 h-full max-w-7xl mx-auto px-10 flex items-center">
            <div className="max-w-2xl">
              {/* BADGE */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block mb-5 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
              >
                <span className="text-[10px] font-black tracking-[0.4em] uppercase text-white">
                  {offers[active].badge}
                </span>
              </motion.div>

              {/* TITLES - Optimized size for the new height */}
              <div className="space-y-1">
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase"
                >
                  {offers[active].title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="italic font-serif lowercase tracking-tight text-zinc-400">
                    {offers[active].title.split(' ').slice(-1)}
                  </span>
                </motion.h2>

                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl md:text-5xl font-black bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent italic tracking-tighter"
                >
                  {offers[active].subtitle}
                </motion.h3>
              </div>

              {/* DESC */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-6 text-base md:text-lg text-zinc-300 font-medium max-w-lg opacity-80"
              >
                {offers[active].desc}
              </motion.p>

              {/* BUTTONS */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="mt-10 flex items-center gap-6"
              >
                <Link
                  to={offers[active].link}
                  className="group relative px-10 py-4 bg-white text-black font-black rounded-xl overflow-hidden shadow-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                >
                  <span className="relative z-10 uppercase tracking-widest text-[11px]">{offers[active].cta}</span>
                  <FiArrowRight size={18} className="relative z-10 group-hover:translate-x-2 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  <span className="absolute inset-0 bg-white group-hover:opacity-0 transition-opacity duration-500" />
                </Link>

                <Link to="/offers" className="group flex items-center gap-3">
                   <span className="text-[11px] font-black tracking-widest uppercase text-white group-hover:text-purple-400 transition-colors">
                      VIEW ALL
                   </span>
                   <div className="w-8 h-[1px] bg-purple-500 group-hover:w-12 transition-all" />
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ARROWS */}
      <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 pointer-events-none z-30">
        <button onClick={prev} className="pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
          <FiChevronLeft size={24} />
        </button>
        <button onClick={next} className="pointer-events-auto w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-xl text-white flex items-center justify-center hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100">
          <FiChevronRight size={24} />
        </button>
      </div>

      {/* STATUS BARS */}
      <div className="absolute bottom-8 left-0 right-0 z-40">
        <div className="max-w-xs mx-auto flex gap-3 px-8">
          {offers.map((_, i) => (
            <div key={i} onClick={() => setActive(i)} className="relative h-[4px] flex-1 cursor-pointer bg-white/10 rounded-full overflow-hidden">
              {active === i && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              )}
              {active > i && <div className="absolute inset-0 bg-white/40" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSlider;