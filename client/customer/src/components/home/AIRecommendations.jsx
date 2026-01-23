import { motion } from "framer-motion";
import { FiArrowRight, FiZap, FiTrendingUp, FiBox } from "react-icons/fi";
import { Link } from "react-router-dom";

const recommendations = [
  {
    id: 1,
    title: "Picked Just For You",
    desc: "Personalized recommendations based on your searches, clicks and purchases.",
    icon: <FiZap />,
    gradient: "from-purple-600 to-pink-500",
    bgImage: "https://images.unsplash.com/photo-1607082349566-1870e31f7d1c?q=80&w=1200&auto=format&fit=crop",
    link: "/recommendations/personalized",
  },
  {
    id: 2,
    title: "Trending Near You",
    desc: "Products that people around you are buying the most right now.",
    icon: <FiTrendingUp />,
    gradient: "from-blue-600 to-cyan-500",
    bgImage: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1200&auto=format&fit=crop",
    link: "/recommendations/trending",
  },
  {
    id: 3,
    title: "Smart Value Bundles",
    desc: "AI-curated product combinations that save money and time together.",
    icon: <FiBox />,
    gradient: "from-amber-500 to-orange-500",
    bgImage: "https://images.unsplash.com/photo-1585386959984-a41552231693?q=80&w=1200&auto=format&fit=crop",
    link: "/recommendations/bundles",
  },
];

const AIRecommendations = () => {
  return (
    <section className="relative py-32 overflow-hidden">
      
      {/* --- BACKGROUND GLOW EFFECTS --- */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 -left-32 w-[420px] h-[420px] bg-purple-400/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-1/4 -right-32 w-[480px] h-[480px] bg-pink-400/20 blur-[160px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl"
          >
            <span className="inline-block mb-4 text-sm font-black tracking-[0.35em] uppercase text-purple-600">
              SmartCart AI
            </span>

            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight tracking-tight">
              Shopping that <br />
              <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                Understands You
              </span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="max-w-sm text-lg text-gray-500 font-medium lg:text-right"
          >
            Our AI learns your preferences and delivers smarter, faster and more
            relevant product discovery.
          </motion.p>
        </div>

        {/* --- RECOMMENDATION CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {recommendations.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
              className="group relative h-[460px] rounded-[3rem] overflow-hidden bg-gray-900"
            >
              {/* IMAGE OVERLAY LAYER */}
              <div className="absolute inset-0">
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="w-full h-full object-cover opacity-45 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
              </div>

              {/* CARD CONTENT */}
              <div className="relative h-full p-10 flex flex-col justify-end">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient}
                  flex items-center justify-center text-white text-2xl mb-6 shadow-xl`}
                >
                  {item.icon}
                </div>

                <h3 className="text-3xl font-bold text-white mb-4">
                  {item.title}
                </h3>

                <p className="text-gray-300 leading-relaxed mb-8 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {item.desc}
                </p>

                <Link
                  to={item.link}
                  className="inline-flex items-center gap-4 text-white font-black tracking-widest text-xs uppercase"
                >
                  <span className="relative">
                    Explore
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-white group-hover:w-full transition-all duration-300" />
                  </span>
                  <span className="w-9 h-9 rounded-full border border-white/30 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all">
                    <FiArrowRight />
                  </span>
                </Link>
              </div>

              {/* INTERACTIVE BORDER GLOW */}
              <div className="absolute inset-0 rounded-[3rem] border border-white/0 group-hover:border-white/10 transition pointer-events-none" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AIRecommendations;