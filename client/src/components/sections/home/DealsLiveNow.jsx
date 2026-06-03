import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { useRef, useState } from "react";

import "swiper/css";
import "swiper/css/navigation";

import DealCard from "../../common/DealCard";
import { dealsProducts } from "../../../content/home/dealsProducts";

const DealsLiveNow = () => {
  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  return (
    <section className="relative mx-auto max-w-7xl px-6 py-20 overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-32 top-0 h-40 rounded-full"
        style={{
          background: "linear-gradient(135deg,#7c3aed,#a855f7,#ec4899)",
          filter: "blur(80px)",
          opacity: 0.07,
        }}
      />
      {/* Header */}

      <div className="flex items-end justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div
              className="h-[2px] w-10 rounded-full"
              style={{
                background: "linear-gradient(90deg,#7c3aed,#d946ef)",
              }}
            />

            <div className="flex items-center gap-2">
              <span
                style={{
                  fontSize: "9.5px",
                  letterSpacing: "0.3em",
                  color: "#7c3aed",
                  fontWeight: 700,
                  textTransform: "uppercase",
                }}
              >
                Limited Time Offers
              </span>
              

              <span
                className="animate-pulse"
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: "#ec4899",
                  boxShadow: "0 0 12px #ec4899",
                  display: "inline-block",
                }}
              />
            </div>
          </div>

          <div className="h-1"></div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "clamp(2rem,4vw,3rem)",
              color: "#1e1b4b",
            }}
          >
            Deals{" "}
            <span
              style={{
                background: "linear-gradient(135deg,#6d28d9,#d946ef)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Live
            </span>{" "}
            Now
          </h2>
        </div>

        <div className="flex flex-col items-start md:items-end gap-5">
          <div className="w-[340px] border-l border-violet-100 pl-6">
            <p
              className="max-w-sm text-sm leading-relaxed font-light"
              style={{
                color: "#94a3b8",
                borderLeft: "1px solid rgba(167,139,250,0.25)",
                paddingLeft: "1.25rem",
              }}
            >
              Exclusive discounts on products customers love most. Grab them
              before they're gone.
            </p>
          </div>
          <Link
            to="/products?sale=true"
            className="inline-flex items-center gap-2 font-medium"
            style={{
              fontSize: "12px",
              letterSpacing: "0.05em",
              color: "#7c3aed",
              padding: "9px 20px",
              borderRadius: "100px",
              border: "1px solid rgba(139,92,246,0.28)",
              background: "rgba(245,243,255,0.5)",
              backdropFilter: "blur(6px)",
              transition: "all .25s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(237,233,254,0.95)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(245,243,255,0.5)";
            }}
          >
            View All
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Carousel */}

      <Swiper
        className="deals-swiper overflow-visible"
        modules={[Autoplay]}
        spaceBetween={20}
        loop
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setSwiperInstance(swiper);
        }}
        onMouseEnter={() => swiperRef.current?.autoplay.stop()}
        onMouseLeave={() => swiperRef.current?.autoplay.start()}
        breakpoints={{
          0: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1280: {
            slidesPerView: 4,
          },
        }}
      >
        {dealsProducts.map((product) => (
          <SwiperSlide key={product._id}>
            <DealCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => swiperInstance?.slidePrev()}
          className="deals-prev flex items-center justify-center"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid rgba(139,92,246,0.2)",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            color: "#7c3aed",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(237,233,254,0.95)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.7)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
            e.currentTarget.style.transform = "";
          }}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          onClick={() => swiperInstance?.slideNext()}
          className="deals-next flex items-center justify-center"
          style={{
            width: "42px",
            height: "42px",
            borderRadius: "50%",
            border: "1px solid rgba(139,92,246,0.2)",
            background: "rgba(255,255,255,0.7)",
            backdropFilter: "blur(8px)",
            color: "#7c3aed",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(237,233,254,0.95)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.5)";
            e.currentTarget.style.transform = "scale(1.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.7)";
            e.currentTarget.style.borderColor = "rgba(139,92,246,0.2)";
            e.currentTarget.style.transform = "";
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default DealsLiveNow;
