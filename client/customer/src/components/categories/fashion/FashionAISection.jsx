import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FiCpu, FiZap, FiChevronRight, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "AI Style Intelligence",
    highlight: "Your Digital Mirror",
    desc: "Experience precision-tailored recommendations that analyze your silhouette and evolve with your unique fashion aesthetic.",
    image: "https://i.pinimg.com/736x/8f/e5/58/8fe558839bc3a7b669b3448528198128.jpg",
    accent: "from-rose-400 to-indigo-500",
  },
  {
    id: 2,
    title: "The Neural Runway",
    highlight: "Beyond Boundaries",
    desc: "From couture to streetwear, our AI engines ensure every piece fits your lifestyle and body type with mathematical perfection.",
    image: "https://i.pinimg.com/1200x/09/8a/60/098a60501b7b8142257536e27e858327.jpg",
    accent: "from-fuchsia-400 to-purple-600",
  },
];

const FashionAISection = () => {
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
          className="fashion-ai-swiper h-[500px] md:h-[700px] w-full"
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
                    className="h-full w-full object-cover object-center"
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
                      <div className="h-2 w-2 rounded-full bg-rose-400 animate-pulse shadow-[0_0_10px_#fb7185]" />
                      <span className="text-[10px] uppercase tracking-[0.4em] text-white/80 font-bold">
                        AI Fashion Protocol
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
                          hover:shadow-[0_15px_30px_rgba(255,255,255,0.2)]
                          border-2 border-transparent hover:border-white
                        "
                      >
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                          Launch AI Lab <FiZap className="fill-current" />
                        </span>
                        {/* Smooth Liquid Fill Hover */}
                        <div className="absolute inset-0 bg-black translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                      </Link>

                      <button className="flex items-center gap-2 text-white/40 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group">
                        Vision Specs <FiChevronRight className="group-hover:translate-x-2 transition-transform" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* MODERN NAVIGATION BUTTONS */}
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
        .fashion-ai-swiper .swiper-pagination {
          bottom: 50px !important;
          left: 50px !important;
          width: auto !important;
          display: flex !important;
          gap: 12px;
        }
        .fashion-ai-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.15) !important;
          width: 45px;
          height: 2px;
          border-radius: 0;
          transition: all 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 1;
        }
        .fashion-ai-swiper .swiper-pagination-bullet-active {
          background: white !important;
          width: 80px;
          box-shadow: 0 0 20px rgba(255,255,255,0.5);
        }
      `}</style>
    </section>
  );
};

export default FashionAISection;