import { motion } from "framer-motion";
import { FiArrowRight, FiZap, FiTrendingUp, FiBox } from "react-icons/fi";
import { Link } from "react-router-dom";
import { aiRecommendationsData as recommendations } from "../../data/home/aiRecommendationsData";



const AIRecommendations = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-purple-100/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-32 w-[500px] h-[500px] bg-orange-100/30 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-[1px] w-10 bg-purple-200" />
              <span className="text-[10px] font-black tracking-[0.4em] uppercase text-purple-600">
                SmartCart AI
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black text-zinc-900 leading-[0.9] tracking-tighter uppercase">
              Shopping that <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent italic font-serif lowercase tracking-normal">
                Understands You.
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-xs text-sm text-zinc-400 font-medium leading-relaxed italic font-serif"
          >
            Our AI learns your preferences and delivers smarter, faster and more
            relevant product discovery tailored to your lifestyle.
          </motion.p>
        </div>

        {/* --- RECOMMENDATION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendations.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative h-[480px] rounded-[2.5rem] overflow-hidden bg-zinc-950 shadow-2xl"
            >
              {/* IMAGE OVERLAY LAYER */}
              <div className="absolute inset-0">
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-50 group-hover:scale-110 group-hover:opacity-30 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black" />
              </div>

              {/* CARD CONTENT */}
              <div className="relative h-full p-10 flex flex-col justify-end z-20">
                {/* Mechanical Icon Box */}
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient}
                  flex items-center justify-center text-white text-2xl mb-6 shadow-[0_0_20px_rgba(168,85,247,0.4)]
                  group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500`}
                >
                  {item.icon}
                </div>

                <h3 className="text-3xl font-black text-white mb-3 tracking-tighter uppercase">
                  {item.title}
                </h3>

                <p className="text-zinc-400 text-sm leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 font-medium">
                  {item.desc}
                </p>

                <Link
                  to={item.link}
                  className="inline-flex items-center gap-4 text-white font-black tracking-[0.2em] text-[10px] uppercase group/link"
                >
                  <span className="relative">
                    Explore Dimensions
                    <span className="absolute left-0 -bottom-1 h-[1px] w-0 bg-gradient-to-r from-purple-500 to-orange-500 group-hover:w-full transition-all duration-500" />
                  </span>
                  <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover/link:bg-white group-hover/link:text-black group-hover/link:border-white transition-all duration-500">
                    <FiArrowRight size={16} />
                  </div>
                </Link>
              </div>

              {/* INTERACTIVE BORDER GLOW */}
              <div className="absolute inset-0 rounded-[2.5rem] border border-white/0 group-hover:border-white/10 transition-colors duration-500 pointer-events-none" />
              
              {/* Inner Gradient Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/0 via-white/5 to-orange-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;