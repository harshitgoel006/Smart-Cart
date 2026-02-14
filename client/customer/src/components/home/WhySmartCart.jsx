
import { motion } from "framer-motion";
import { FiZap, FiShield, FiTrendingUp, FiSmile, FiArrowUpRight } from "react-icons/fi";
import { whySmartCartData } from "../../data/home/whySmartCartData";

const iconMap = {
  zap: FiZap,
  shield: FiShield,
  trending: FiTrendingUp,
  smile: FiSmile,
};

const WhySmartCart = () => {
  return (
    <section className="relative py-36 overflow-hidden bg-[#ffffff] mt-0">
      
      {/* ROYAL DECORATIVE ELEMENTS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-zinc-200 to-transparent" />
        <div className="absolute -top-[10%] -right-[5%] w-[30%] h-[40%] bg-pink-50/50 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -left-[5%] w-[30%] h-[40%] bg-purple-50/50 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">

        {/* LUXURY HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-32 gap-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="h-2 w-2 rounded-full bg-purple-600 animate-ping" />
              <span className="text-[10px] font-black tracking-[0.5em] text-zinc-400 uppercase">
                The SmartCart Edge
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-zinc-900 tracking-[-0.05em] leading-[0.85]">
              BEYOND THE <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 italic font-serif lowercase tracking-normal px-2">
                Ordinary experience.
              </span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-xs border-l-2 border-zinc-900 pl-8 py-2"
          >
            <p className="text-zinc-500 font-bold max-w-[280px] leading-tight tracking-tight uppercase">
              We engineered a new <span className="text-zinc-900">Lifestyle DNA</span> for the modern world.
            </p>
          </motion.div>
        </div>

        {/* FEATURE GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {whySmartCartData.map((item, i) => {
            const Icon = iconMap[item.icon];

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  delay: i * 0.1,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1]
                }}
                viewport={{ once: true }}
                className="group relative"
              >
                {/* THE LAMINATED CARD */}
                <div className="relative h-full bg-zinc-50/50 rounded-[3rem] p-12 border border-zinc-100 transition-all duration-700 hover:bg-white hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.08)] flex flex-col items-start overflow-hidden">
                  
                  {/* LAMINATION SHEEN EFFECT */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none">
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/60 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </div>

                  {/* TOP BADGE */}
                  <div className="w-full flex justify-between items-start mb-12">
                    <div className={`p-4 rounded-2xl ${item.color} ${item.glow} text-white shadow-xl transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-700`}>
                      {Icon && <Icon size={24} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-300 group-hover:text-purple-600 transition-colors">
                      {item.badge}
                    </span>
                  </div>

                  {/* CONTENT */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-black text-zinc-900 mb-4 tracking-tighter uppercase">
                      {item.title}
                    </h3>
                    <p className="text-zinc-500 font-medium leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>

                  {/* INTERACTIVE LINK ELEMENT */}
                  <div className="mt-10 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <span className="text-[10px] font-black text-purple-600 uppercase tracking-widest">Learn More</span>
                    <FiArrowUpRight className="text-purple-600" />
                  </div>

                  {/* ACCENT GLOW HOVER */}
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${item.color} blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity duration-700`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhySmartCart;