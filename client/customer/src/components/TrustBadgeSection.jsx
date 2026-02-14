import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiRefreshCw, FiHeart, FiCheckCircle } from "react-icons/fi";

const BadgeCard = ({ icon, title, delay, themeColor }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Modernized Colors
  const isPink = themeColor === "pink";
  const iconBg = isPink ? "bg-pink-50" : "bg-purple-50";
  const iconColor = isPink ? "text-pink-500" : "text-purple-600";
  const glowColor = isPink ? "bg-pink-400/20" : "bg-purple-400/20";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer"
    >
      {/* Outer Glow Effect */}
      <div className={`absolute -inset-4 rounded-[3.5rem] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 ${glowColor}`} />
      
      {/* Main Glass Card */}
      <div className="relative w-72 h-80 bg-white/70 backdrop-blur-md border border-white/40 rounded-[3.5rem] flex flex-col items-center justify-center p-10 transition-all duration-500 shadow-[0_15px_40px_rgba(0,0,0,0.02)] group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.08)] group-hover:bg-white/90">
        
        {/* Floating Icon Container */}
        <motion.div 
          style={{ translateZ: 60 }}
          className={`w-28 h-28 rounded-[2.5rem] ${iconBg} flex items-center justify-center mb-8 relative shadow-inner`}
        >
          {/* Decorative Rotating Border */}
          <div className={`absolute inset-[-8px] rounded-[3rem] border border-dashed ${isPink ? 'border-pink-200' : 'border-purple-200'} animate-[spin_15s_linear_infinite] opacity-60`} />
          
          <div className={`text-4xl ${iconColor} transition-all duration-700 group-hover:scale-110 group-hover:rotate-[360deg]`}>
            {icon}
          </div>
        </motion.div>

        {/* Typography - Matching the Royal Style */}
        <motion.div style={{ translateZ: 40 }} className="text-center">
          <h3 className="text-zinc-900 font-black tracking-[0.02em] text-xl uppercase leading-none">
            {title}
          </h3>
          <p className="text-zinc-400 text-[10px] font-bold tracking-[0.2em] uppercase mt-3">
            Premium Service
          </p>
        </motion.div>

        {/* Dynamic Interactive Bar */}
        <div className="absolute bottom-10 w-12 h-1 bg-zinc-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 0.3 }}
            className={`w-full h-full ${isPink ? 'bg-pink-500' : 'bg-purple-600'} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`}
          />
        </div>
      </div>
    </motion.div>
  );
};

const TrustBadgeSection = () => {
  const badges = [
    { icon: <FiRefreshCw />, title: "Easy Exchange", color: "purple" },
    { icon: <FiHeart />, title: "100% Handpicked", color: "pink" },
    { icon: <FiCheckCircle />, title: "Assured Quality", color: "purple" },
  ];

  return (
    <section className="w-full py-32 bg-white flex flex-col items-center justify-center overflow-hidden border-t border-zinc-50">
      <div className="flex flex-wrap justify-center gap-16 px-8">
        {badges.map((badge, idx) => (
          <BadgeCard 
            key={idx} 
            icon={badge.icon} 
            title={badge.title} 
            themeColor={badge.color} 
            delay={idx * 0.15} 
          />
        ))}
      </div>
    </section>
  );
};

export default TrustBadgeSection;