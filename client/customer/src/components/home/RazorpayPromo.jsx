import { motion } from "framer-motion";
import { FiArrowUpRight, FiShield, FiZap, FiCheckCircle } from "react-icons/fi";

const iconMap = {
  shield: FiShield,
  zap: FiZap,
  check: FiCheckCircle,
};

const RazorpayPromo = ({ data }) => {
  if (!data) return null;

  const {
    brand,
    logo,
    partnerLabel,
    headingLine1,
    headingLine2,
    brandHighlight,
    features,
    offer,
  } = data;

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2, // Bache elements ek ke baad ek aayenge
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="relative rounded-[2.5rem] bg-zinc-950 border border-zinc-800/50 overflow-hidden min-h-[350px] flex items-center shadow-[0_40px_100px_-15px_rgba(147,51,234,0.15)]"
      >
        {/* BACKGROUND GLOWS - Adjusted to your palette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>

        <div className="relative z-10 w-full px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-12 py-12">
          
          {/* LEFT SIDE CONTENT */}
          <div className="flex-1 text-center md:text-left">
            <motion.div variants={itemVariants} className="flex items-center justify-center md:justify-start gap-4 mb-8">
              <img
                src={logo}
                alt={brand}
                className="h-7 md:h-9 object-contain brightness-0 invert opacity-90"
              />
              <div className="h-5 w-[1px] bg-zinc-700" />
              <span className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-400 px-4 py-1 rounded-full text-[10px] font-black tracking-[0.2em] uppercase border border-purple-500/20">
                {partnerLabel}
              </span>
            </motion.div>

            <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black text-white leading-[0.9] mb-6 uppercase tracking-tighter">
              {headingLine1} <br />
              <span className="text-zinc-500">{headingLine2}</span>{" "}
              <span className="bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent italic font-serif lowercase tracking-normal">
                {brandHighlight}
              </span>
            </motion.h2>

            <motion.div variants={itemVariants} className="flex flex-wrap justify-center md:justify-start gap-3 mt-8">
              {features.map((feature, index) => {
                const Icon = iconMap[feature.icon] || FiCheckCircle;
                return (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 px-4 py-2 rounded-xl hover:border-zinc-700 transition-colors"
                  >
                    <Icon className="text-pink-500" size={16} />
                    <span className="text-zinc-400 text-xs font-bold uppercase tracking-wider">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* RIGHT SIDE CASHBACK CARD */}
          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.8, x: 50 },
              visible: { opacity: 1, scale: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
            }}
            whileHover={{ y: -10 }}
            className="w-full md:w-[400px] relative group"
          >
            {/* Outer Glow behind card */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative bg-zinc-900 border border-zinc-800 p-10 rounded-[2.5rem] shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-6 text-zinc-800 group-hover:text-purple-500 transition-colors">
                <FiArrowUpRight size={60} />
              </div>

              <p className="text-purple-400 font-black tracking-[0.3em] text-[10px] uppercase mb-4">
                {offer.label}
              </p>

              <h3 className="text-white text-4xl font-black mb-4 leading-none tracking-tighter">
                UP TO ₹{offer.cashbackAmount} <br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent italic font-serif">CASHBACK</span>
              </h3>

              <p className="text-zinc-500 text-xs mb-10 leading-relaxed font-medium">
                On your first transaction via UPI or Net Banking. Valid on orders above ₹{offer.minOrder}.
              </p>

              <button className="relative w-full py-4 group/btn overflow-hidden rounded-xl bg-white text-black font-black text-xs uppercase tracking-widest transition-all">
                <span className="relative z-10 group-hover/btn:text-white transition-colors">
                    {offer.buttonText}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
              </button>
            </div>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default RazorpayPromo;



