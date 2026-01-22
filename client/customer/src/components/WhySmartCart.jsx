import { motion } from "framer-motion";
import { FiZap, FiShield, FiTrendingUp, FiSmile } from "react-icons/fi";

const features = [
  {
    icon: <FiZap />,
    title: "Instant Gratification",
    desc: "Experience lightning-fast browsing and a checkout process that stays ahead of your pace.",
    color: "bg-indigo-500",
    glow: "shadow-indigo-500/40",
    badge: "Performance"
  },
  {
    icon: <FiShield />,
    title: "Fortified Security",
    desc: "Your data is locked behind multi-layer encryption. Shop with 100% peace of mind.",
    color: "bg-rose-500",
    glow: "shadow-rose-500/40",
    badge: "Protection"
  },
  {
    icon: <FiTrendingUp />,
    title: "AI-First Curation",
    desc: "No more scrolling. Our AI predicts your needs and delivers personalized styles daily.",
    color: "bg-amber-500",
    glow: "shadow-amber-500/40",
    badge: "Intelligence"
  },
  {
    icon: <FiSmile />,
    title: "Human Support",
    desc: "Technology is great, but our real-world experts are available 24/7 to help you out.",
    color: "bg-emerald-500",
    glow: "shadow-emerald-500/40",
    badge: "Service"
  },
];

const WhySmartCart = () => {
  return (
    <section className="relative py-32 overflow-hidden bg-[#fafafa]">
      
      {/* 🌌 Animated Background Aura */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(139,92,246,0.03)_0%,_transparent_70%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* REINVENTED HEADER */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-28 gap-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <span className="text-[10px] font-black tracking-[0.6em] text-gray-400 uppercase mb-4 block">
              Redefining Commerce
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-[0.85]">
              BEYOND THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
                ORDINARY.
              </span>
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="max-w-xs md:text-right"
          >
            <p className="text-gray-500 font-bold text-lg leading-tight">
              We didn't just build a store; we engineered a new way to experience lifestyle.
            </p>
          </motion.div>
        </div>

        {/* FEATURE CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: i * 0.1, 
                duration: 0.8,
                type: "spring",
                bounce: 0.4
              }}
              viewport={{ once: true }}
              className="group relative h-full"
            >
              {/* Main Card Wrapper */}
              <div className="relative h-full bg-white rounded-[3.5rem] p-10 
                            border border-gray-100 transition-all duration-700
                            hover:shadow-[0_40px_100px_-30px_rgba(0,0,0,0.12)]
                            hover:border-purple-200 flex flex-col items-center text-center">
                
                {/* Floating Badge */}
                <span className="absolute top-8 right-10 text-[9px] font-black uppercase tracking-widest text-gray-300 group-hover:text-purple-500 transition-colors">
                  {item.badge}
                </span>

                {/* ICON AURA: The focus point */}
                <div className="relative mb-12">
                   <div className={`absolute inset-0 ${item.color} blur-[30px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 scale-150`} />
                   <div className={`relative w-24 h-24 rounded-[2.5rem] ${item.color} shadow-2xl ${item.glow} 
                                   flex items-center justify-center text-white text-4xl
                                   transform group-hover:-rotate-12 group-hover:scale-110 transition-all duration-700 ease-out`}>
                     {item.icon}
                   </div>
                </div>

                {/* Content */}
                <h3 className="text-2xl font-black text-gray-900 mb-5 tracking-tighter">
                  {item.title}
                </h3>
                <p className="text-gray-500 font-medium leading-relaxed mb-6">
                  {item.desc}
                </p>

                {/* Bottom Interactive Element */}
                <div className="mt-auto">
                    <div className="h-1.5 w-8 bg-gray-100 rounded-full group-hover:w-20 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-700" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhySmartCart;