import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { FiRefreshCw, FiHeart, FiCheckCircle } from "react-icons/fi";

const BadgeCard = ({ icon, title, delay, themeColor }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Dynamic Shadow based on theme color
  const shadowClass = themeColor === "pink" 
    ? "group-hover:shadow-[0_20px_50px_-10px_rgba(236,72,153,0.3)]" 
    : "group-hover:shadow-[0_20px_50px_-10px_rgba(139,92,246,0.3)]";

  const iconBg = themeColor === "pink" ? "bg-pink-50" : "bg-purple-50";
  const iconColor = themeColor === "pink" ? "text-pink-500" : "text-purple-500";
  const barColor = themeColor === "pink" ? "bg-pink-500" : "bg-purple-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className="relative group cursor-pointer"
    >
      {/* Outer Glow Layer */}
      <div className={`absolute -inset-1 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500 ${themeColor === 'pink' ? 'bg-pink-200/20' : 'bg-purple-200/20'}`} />
      
      <div className={`relative w-64 h-72 bg-white border border-gray-50 rounded-[3rem] flex flex-col items-center justify-center p-8 transition-all duration-500 shadow-[0_10px_30px_rgba(0,0,0,0.03)] ${shadowClass}`}>
        
        {/* Animated Icon Container */}
        <motion.div 
          style={{ translateZ: 50 }}
          className={`w-24 h-24 rounded-full ${iconBg} flex items-center justify-center mb-8 relative`}
        >
          <div className={`absolute inset-0 rounded-full border-2 border-dashed ${themeColor === 'pink' ? 'border-pink-200' : 'border-purple-200'} animate-[spin_20s_linear_infinite] opacity-40`} />
          
          <div className={`text-4xl ${iconColor} transition-all duration-500 group-hover:scale-110 group-hover:rotate-[360deg]`}>
            {icon}
          </div>
        </motion.div>

        {/* Text */}
        <motion.h3 
          style={{ translateZ: 40 }}
          className="text-gray-800 font-extrabold tracking-tight text-lg text-center"
        >
          {title}
        </motion.h3>

        {/* Dynamic Animated Bar */}
        <div className="absolute bottom-8 w-10 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className={`w-full h-full ${barColor} scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left`} />
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
    <section className="w-full py-25 bg-white flex flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-wrap justify-center gap-12 px-6">
        {badges.map((badge, idx) => (
          <BadgeCard 
            key={idx} 
            icon={badge.icon} 
            title={badge.title} 
            themeColor={badge.color} 
            delay={idx * 0.1} 
          />
        ))}
      </div>
    </section>
  );
};

export default TrustBadgeSection;