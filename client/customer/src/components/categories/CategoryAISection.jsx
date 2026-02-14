import { categoryAISlides } from "../../data/categories/categoryAISlides";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import { FiCpu, FiZap, FiChevronRight, FiShield, FiArrowLeft, FiArrowRight } from "react-icons/fi";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const CategoryAISection = ({ category }) => {

  const slides = categoryAISlides[category?.slug] || [];

  if (!slides.length) return null;

  return (
    <section className="relative w-full py-20 mb-15 overflow-hidden transform-gpu">
  
      <div className="w-full relative group rounded-none shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)]">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          effect="fade"
          fadeEffect={{ crossFade: true }}
          slidesPerView={1}
          loop
          speed={1200} // Slightly faster for snappier feel
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ 
            clickable: true,
            renderBullet: (index, className) => `<span class="${className}"></span>`
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          className="acc-ai-swiper h-[550px] md:h-[750px] w-full"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="relative h-full w-full flex items-center transform-gpu">

                {/* IMAGE LAYER */}
                <div className="absolute inset-0 overflow-hidden">
                  <motion.img
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover object-center transform-gpu"
                  />
                  {/* Vignette & Gradients for Readability */}
                  <div className="absolute inset-0 shadow-[inset_0_0_180px_rgba(0,0,0,0.8)] z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
                </div>

                {/* CONTENT LAYER */}
                <div className="relative z-20 w-full px-12 md:px-32">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-2xl"
                  >
                    {/* Badge Style Sync */}
                    <div className="flex items-center gap-3 mb-10 bg-white/5 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-white/10 w-fit shadow-2xl">
                      <div className="h-2 w-2 rounded-full bg-purple-500 animate-pulse shadow-[0_0_12px_#a855f7]" />
                      <span className="text-[10px] uppercase tracking-[0.5em] text-white/90 font-black">
                        Neural Core Active
                      </span>
                    </div>

                    {/* Elite Typography Sync */}
                    <h2 className="text-5xl md:text-7xl font-black text-white leading-[0.85] tracking-[-0.04em] uppercase mb-6">
                      {slide.title}
                      <br />
                      <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal px-2">
                        {slide.highlight}.
                      </span>
                    </h2>

                    <p className="mt-6 text-zinc-400 text-sm md:text-lg leading-relaxed max-w-md font-medium tracking-tight opacity-80">
                      {slide.desc}
                    </p>

                    {/* Button Styling Sync */}
                    <div className="mt-12 flex items-center gap-10">
                      <Link
                        to="/try-ai"
                        className="
                          group relative px-14 py-6 
                          bg-white text-black font-black uppercase tracking-[0.25em] text-[11px] 
                          rounded-full overflow-hidden transition-all duration-700
                          hover:shadow-[0_20px_40px_rgba(168,85,247,0.3)]
                          border-2 border-transparent hover:border-white/20
                        "
                      >
                        <span className="relative z-10 flex items-center gap-3 group-hover:text-white transition-colors duration-500">
                          Launch Lab <FiZap className="fill-current text-orange-500" />
                        </span>
                        <div className="absolute inset-0 bg-[#0a0a0a] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]" />
                      </Link>

                      <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-all text-[11px] font-black uppercase tracking-[0.3em] group">
                        System Specs <FiChevronRight className="group-hover:translate-x-2 transition-transform text-purple-500" />
                      </button>
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NAVIGATION BUTTONS SYNC */}
        <div className="absolute bottom-16 right-16 z-30 flex gap-5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-6 group-hover:translate-y-0">
          <button className="custom-prev w-16 h-16 rounded-full bg-black/40 backdrop-blur-3xl border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-3xl">
            <FiArrowLeft size={24} />
          </button>
          <button className="custom-next w-16 h-16 rounded-full bg-black/40 backdrop-blur-3xl border border-white/5 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all shadow-3xl">
            <FiArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* CUSTOM PAGINATION SYNC */}
      <style jsx global>{`
        .acc-ai-swiper .swiper-pagination {
          bottom: 60px !important;
          left: 60px !important;
          width: auto !important;
          display: flex !important;
          gap: 15px;
        }
        .acc-ai-swiper .swiper-pagination-bullet {
          background: rgba(255,255,255,0.1) !important;
          width: 50px;
          height: 3px;
          border-radius: 0;
          transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          opacity: 1;
        }
        .acc-ai-swiper .swiper-pagination-bullet-active {
          background: linear-gradient(90deg, #a855f7, #ec4899) !important;
          width: 100px;
          box-shadow: 0 0 30px rgba(168,85,247,0.6);
        }
      `}</style>
    </section>
  );
};

export default CategoryAISection;