import React from "react";
import { motion } from "framer-motion";
import { FiTruck, FiRotateCcw, FiShield, FiStar } from "react-icons/fi";

// Data for the trust badges, including icons, titles, descriptions, and colors for gradients and glows.

const badges = [
  {
    icon: <FiTruck />,
    title: "Fast Delivery",
    desc: "Get your orders delivered quickly, right to your doorstep.",
    color: "from-blue-600 to-cyan-500",
    glow: "shadow-blue-500/20",
  },
  {
    icon: <FiRotateCcw />,
    title: "Easy Returns",
    desc: "Hassle-free returns within 7 days.",
    color: "from-pink-600 to-rose-500",
    glow: "shadow-rose-500/20",
  },
  {
    icon: <FiShield />,
    title: "Secure Payments",
    desc: "100% secure checkout with trusted payment gateways.",
    color: "from-purple-600 to-indigo-500",
    glow: "shadow-purple-500/20",
  },
  {
    icon: <FiStar />,
    title: "Trusted by Thousands",
    desc: "Loved by customers across India.",
    color: "from-amber-500 to-orange-500",
    glow: "shadow-orange-500/20",
  },
];

// TrustBadges component that renders a section with a header and a grid of trust badges, each with animations and hover effects for an engaging user experience.

const TrustBadges = () => {
  return (
    <section className="relative py-24 bg-white overflow-hidden">

      {/* Soft Ambient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-100 blur-[140px] rounded-full opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-100 blur-[140px] rounded-full opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6 border-b border-zinc-100 pb-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-[10px] p-1 font-bold tracking-[0.4em] uppercase text-zinc-400 mb-3">
              Built on reliability
            </p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-none">
              Our{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-light">
                Promise.
              </span>
            </h2>
          </motion.div>

          <p className="text-zinc-400 font-medium text-sm max-w-xs md:text-right">
            Designed to deliver trust, speed, and a seamless shopping experience.
          </p>
        </div>

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.12,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -6 }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="relative h-full bg-[#f9f9fb] rounded-[2.5rem] p-10 border border-zinc-100 hover:border-zinc-200 transition-all duration-500 hover:bg-white hover:shadow-[0_30px_60px_-20px_rgba(0,0,0,0.1)] overflow-hidden">

                {/* Icon */}
                <div className="mb-8 relative">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl shadow-lg ${item.glow}
                    group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    {item.icon}
                  </div>

                  {/* Soft Aura */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-2xl opacity-10 group-hover:opacity-25 transition-opacity`}
                  />
                </div>

                {/* Text */}
                <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tight mb-3">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Bottom Accent */}
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-zinc-200 to-transparent group-hover:via-purple-500 transition-all duration-700" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

