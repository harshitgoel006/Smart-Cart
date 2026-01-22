import { motion } from "framer-motion";
import { FiArrowUpRight, FiShield, FiZap } from "react-icons/fi";

const RazorpayPromo = () => {
  return (
    <section className="py-16 px-6 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative rounded-[3rem] bg-[#02042b] overflow-hidden min-h-[300px] flex items-center shadow-[0_40px_80px_-15px_rgba(51,102,255,0.3)]"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-indigo-600 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 w-full px-10 md:px-16 flex flex-col md:flex-row items-center justify-between gap-10 py-12">
          
          {/* Left Side: Brand & Content */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-6">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/8/89/Razorpay_logo.svg" 
                alt="Razorpay" 
                className="h-8 md:h-10 brightness-200"
              />
              <div className="h-6 w-[1px] bg-white/20 mx-2" />
              <span className="bg-blue-500/20 text-blue-400 px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase border border-blue-500/30">
                Official Partner
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4">
              GET INSTANT TRANSACTION <br />
              DONE WITH <span className="text-blue-400">RAZORPAY</span>
            </h2>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <FiShield className="text-blue-400" />
                <span className="text-white/80 text-sm font-medium">100% Secure Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                <FiZap className="text-yellow-400" />
                <span className="text-white/80 text-sm font-medium">Instant Refunds</span>
              </div>
            </div>
          </div>

          {/* Right Side: Cashback Offer Card */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="w-full md:w-[380px] bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2rem] shadow-2xl relative group"
          >
            <div className="absolute top-4 right-4 text-white/20 group-hover:text-white/40 transition-colors">
              <FiArrowUpRight size={40} />
            </div>
            
            <p className="text-blue-100 font-bold tracking-widest text-sm uppercase mb-2">Exclusive Offer</p>
            <h3 className="text-white text-4xl font-black mb-4">
              UP TO ₹200 <br />
              CASHBACK!!!
            </h3>
            <p className="text-blue-100/80 text-sm mb-8 leading-relaxed">
              On your first transaction via UPI or Net Banking. Valid on orders above ₹1499.
            </p>

            <button className="w-full py-4 bg-white text-blue-700 font-black rounded-xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-lg">
              GET OFFER NOW
            </button>
            
            {/* Subtle card glow */}
            <div className="absolute inset-0 rounded-[2rem] shadow-[inset_0_0_20px_rgba(255,255,255,0.2)] pointer-events-none" />
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
};

export default RazorpayPromo;



