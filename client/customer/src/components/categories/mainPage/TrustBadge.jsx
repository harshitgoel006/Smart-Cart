import React from "react";
import { motion } from "framer-motion";
import { FiTruck, FiRotateCcw, FiShield, FiStar } from "react-icons/fi";

const badges = [
  {
    icon: <FiTruck />,
    title: "Fast Delivery",
    desc: "Lightning fast logistics right to your doorstep.",
    color: "from-blue-600 to-cyan-500",
    glow: "group-hover:shadow-blue-500/30",
  },
  {
    icon: <FiRotateCcw />,
    title: "Easy Returns",
    desc: "Hassle-free 7-day return policy, no questions asked.",
    color: "from-pink-600 to-rose-500",
    glow: "group-hover:shadow-rose-500/30",
  },
  {
    icon: <FiShield />,
    title: "Secure Payments",
    desc: "Military-grade encryption for all your transactions.",
    color: "from-purple-600 to-indigo-500",
    glow: "group-hover:shadow-purple-500/30",
  },
  {
    icon: <FiStar />,
    title: "Elite Trusted",
    desc: "Join thousands of shoppers who trust SmartCart.",
    color: "from-amber-500 to-orange-500",
    glow: "group-hover:shadow-orange-500/30",
  },
];

const TrustBadges = () => {
  return (
    <section className="relative py-32 bg-white overflow-hidden transform-gpu">
      
      {/* ELITE AMBIENT GLOWS */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-purple-50/50 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-pink-50/50 blur-[140px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="h-[1px] w-10 bg-zinc-200" />
              <span className="text-[10px] font-black tracking-[0.5em] uppercase text-zinc-400">
                The SmartCart Edge
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black tracking-[-0.04em] uppercase leading-none text-zinc-900">
              OUR{" "}
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal px-2">
                promise.
              </span>
            </h2>
          </motion.div>

          <motion.p 
             initial={{ opacity: 0 }}
             whileInView={{ opacity: 1 }}
             viewport={{ once: true }}
             className="text-zinc-400 font-bold text-sm max-w-[280px] md:text-right uppercase tracking-tighter leading-tight"
          >
            Redefining reliability with every single click.
          </motion.p>
        </div>

        {/* BADGES GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {badges.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.08, // Optimized fast stagger
                duration: 0.5,
                ease: "easeOut",
              }}
              className="group relative transform-gpu"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="relative h-full bg-zinc-50/50 border border-zinc-100 rounded-[3.5rem] p-10 transition-all duration-700 hover:bg-white hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)]">
                
                {/* ICON WITH DYNAMIC SHADOW */}
                <div className="mb-10 relative inline-block">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-2xl shadow-xl transition-all duration-700 group-hover:scale-110 group-hover:-rotate-6 ${item.glow}`}>
                    {item.icon}
                  </div>
                  
                  {/* Subtle Aura behind icon */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                </div>

                {/* TEXT CONTENT */}
                <h3 className="text-xl font-black text-zinc-900 uppercase tracking-tighter mb-4 group-hover:text-purple-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-zinc-500 text-sm font-medium leading-[1.6] tracking-tight">
                  {item.desc}
                </p>

                {/* INTERACTIVE PROGRESS BAR (Bottom) */}
                <div className="absolute bottom-10 left-10 right-10 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
                   <div className={`h-full w-0 group-hover:w-full bg-gradient-to-r ${item.color} transition-all duration-1000 ease-in-out`} />
                </div>

                {/* GLASSY DECORATION */}
                <div className="absolute top-6 right-8 text-[10px] font-black text-zinc-100 uppercase tracking-[0.2em] group-hover:text-zinc-200 transition-colors">
                    0{i+1}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;