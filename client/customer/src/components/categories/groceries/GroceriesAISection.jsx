import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FiCpu, FiZap, FiChevronRight, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

// Mock data for slides - In a real application, this would likely come from an API or CMS

const slides = [
  {
    id: 1,
    title: "AI Nutrition Link",
    highlight: "The Purest Choice",
    desc: "Precision-scanned groceries that match your dietary goals and health profile automatically.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2000&auto=format&fit=crop",
    accent: "from-green-400 to-emerald-500",
  },
  {
    id: 2,
    title: "Smart Pantry Lab",
    highlight: "Zero Waste Tech",
    desc: "Our neural engines track your consumption habits to ensure you never run out of essentials.",
    image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?q=80&w=2000&auto=format&fit=crop",
    accent: "from-lime-400 to-green-500",
  },
];


// GroceriesAISection Component - A dynamic, visually rich section showcasing AI-powered grocery features with a sleek Swiper carousel and interactive elements.

const GroceriesAISection = () => {
  return (
    <section className="relative w-full py-20 mb-15 overflow-hidden ">
  
      <div className=" w-full relative group
  rounded-none
  shadow-[0_15px_15px_rgba(0,0,0,0.12),0_15px_15px_rgba(0,0,0,0.08)]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          speed={1400}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="groceries-ai-swiper h-[500px] md:h-[700px] w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full flex items-center">

                {/* IMAGE WITH INNER SHADOW EFFECT */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.15 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 12, ease: "easeOut" }}
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover object-center opacity-90"
                  />
                  {/* Outer to Inner Shadow (Vignette) */}
                  <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.6)] z-10" />
                  {/* Left Side Dark Gradient for Text Clarity */}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/20 to-transparent z-10" />
                </div>

                {/* CONTENT */}
                <div className="relative z-20 w-full px-8 md:px-24">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-lg"
                  >
                    <div className="flex items-center gap-3 mb-8 bg-white/5 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 w-fit shadow-xl">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_10px_#4ade80]" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/80 font-bold">
                        AI Freshness Monitor
                      </span>
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase italic mb-4">
                      {slide.title}
                      <br />
                      <span className={`bg-gradient-to-r ${slide.accent} bg-clip-text text-transparent not-italic`}>
                        {slide.highlight}
                      </span>
                    </h2>

                    <p className="mt-4 text-gray-300 text-sm md:text-base leading-relaxed max-w-sm font-light opacity-70">
                      {slide.desc}
                    </p>

                    {/* BUTTON STYLING */}
                    <div className="mt-10 flex items-center gap-8">
                      <Link
                        to="/try-ai"
                        className="
                          group relative px-12 py-5 
                          bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] 
                          rounded-full overflow-hidden transition-all duration-500
                          hover:shadow-[0_15px_30px_rgba(74,222,128,0.2)]
                          border-2 border-transparent hover:border-white
                        "
                      >
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                          Try AI Dietitian <FiZap className="fill-current text-green-500 group-hover:text-white" />
                        </span>
                        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                      </Link>

                      <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group">
                        Pantry Specs <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NAVIGATION BUTTONS */}
        <div className="absolute bottom-12 right-12 z-30 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
          <button className="custom-prev w-14 h-14 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-2xl">
            <FiArrowLeft size={22} />
          </button>
          <button className="custom-next w-14 h-14 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-2xl">
            <FiArrowRight size={22} />
          </button>
        </div>
      </div>

      <style jsx global>{`
        .groceries-ai-swiper .swiper-pagination {
          bottom: 50px !important;
          left: 50px !important;
          width: auto !important;
          display: flex !important;
          gap: 12px;
        }
        .groceries-ai-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.15) !important;
          width: 45px;
          height: 2px;
          border-radius: 0;
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 1;
        }
        .groceries-ai-swiper .swiper-pagination-bullet-active {
          background: #4ade80 !important;
          width: 80px;
          box-shadow: 0 0 20px rgba(74,222,128,0.5);
        }
      `}</style>
    </section>
  );
};

export default GroceriesAISection;